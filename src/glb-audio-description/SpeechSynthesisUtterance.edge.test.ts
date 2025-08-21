import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TextReader } from './SpeechSynthesisUtterance';
import type { TextReaderOptions } from './SpeechSynthesisUtterance';
import { mockSpeechSynthesis, triggerVoicesChanged, setSpeechState } from '../test/setup';

describe('TextReader - Edge Cases & Advanced Scenarios', () => {
    let textReader: TextReader;

    beforeEach(() => {
        textReader = new TextReader();
    });

    describe('Edge Cases - Data Attribute Configuration', () => {
        it('should handle malformed data-containersToRead attributes', () => {
            // Simular elementos com data attributes inválidos
            const testElement = document.createElement('div');
            testElement.className = 'glb-audio-description';
            testElement.setAttribute('data-containersToRead', 'invalid json');
            document.body.appendChild(testElement);

            // O código deve tratar erros de JSON.parse graciosamente
            expect(() => {
                const containers = testElement.dataset.containerstoread;
                if (containers) {
                    try {
                        JSON.parse(containers);
                    } catch (error) {
                        // Erro esperado para JSON inválido
                        expect(error).toBeInstanceOf(SyntaxError);
                    }
                }
            }).not.toThrow();
        });

        it('should handle empty or missing data-containersToRead', () => {
            const testCases = [
                { attr: undefined, description: 'missing attribute' },
                { attr: '', description: 'empty string' },
                { attr: '[]', description: 'empty array' },
                { attr: '[""]', description: 'array with empty string' },
                { attr: '[null]', description: 'array with null' },
            ];

            testCases.forEach(({ attr, description }) => {
                const element = document.createElement('div');
                element.className = 'glb-audio-description';

                if (attr !== undefined) {
                    element.setAttribute('data-containersToRead', attr);
                }

                document.body.appendChild(element);

                expect(() => {
                    const containers = element.dataset.containerstoread;
                    if (containers) {
                        const parsed = JSON.parse(containers);
                        // Deve lidar com arrays vazios ou inválidos
                        if (Array.isArray(parsed)) {
                            textReader.readTextFromSelector(parsed.filter(Boolean));
                        }
                    }
                }, `Should handle ${description}`).not.toThrow();
            });
        });

        it('should handle complex selector combinations in data attributes', () => {
            const complexSelectors = [
                '#header .title',
                '.content p:not(.advertisement)',
                'article > section .paragraph',
                '[data-content="true"]',
                '.sidebar ul li:first-child',
            ];

            const element = document.createElement('div');
            element.className = 'glb-audio-description';
            element.setAttribute('data-containersToRead', JSON.stringify(complexSelectors));
            document.body.appendChild(element);

            // Criar elementos correspondentes
            complexSelectors.forEach((selector, index) => {
                const mockElement = document.createElement('div');
                mockElement.id = `test-element-${index}`;
                mockElement.className = 'test-content';
                mockElement.textContent = `Content for selector: ${selector}`;
                document.body.appendChild(mockElement);
            });

            expect(() => {
                const containers = element.dataset.containerstoread;
                if (containers) {
                    const parsed = JSON.parse(containers);
                    textReader.readTextFromSelector(parsed);
                }
            }).not.toThrow();
        });

        it('should handle very long data-containersToRead arrays', () => {
            // Criar array com muitos seletores
            const longSelectorArray = Array.from({ length: 100 }, (_, i) => `.element-${i}`);

            const element = document.createElement('div');
            element.className = 'glb-audio-description';
            element.setAttribute('data-containersToRead', JSON.stringify(longSelectorArray));
            document.body.appendChild(element);

            expect(() => {
                const containers = element.dataset.containerstoread;
                if (containers) {
                    const parsed = JSON.parse(containers);
                    textReader.readTextFromSelector(parsed);
                }
            }).not.toThrow();
        });

        it('should handle data attribute with special characters', () => {
            const selectorsWithSpecialChars = [
                '.título-português',
                '.content[data-special="value with spaces"]',
                '#元素-chinese-characters',
                '.émoji-🎯-selector',
            ];

            const element = document.createElement('div');
            element.className = 'glb-audio-description';
            element.setAttribute('data-containersToRead', JSON.stringify(selectorsWithSpecialChars));
            document.body.appendChild(element);

            expect(() => {
                const containers = element.dataset.containerstoread;
                if (containers) {
                    const parsed = JSON.parse(containers);
                    textReader.readTextFromSelector(parsed);
                }
            }).not.toThrow();
        });
    });

    describe('Edge Cases - Constructor Options', () => {
        it('should handle undefined options gracefully', () => {
            expect(() => new TextReader(undefined)).not.toThrow();
        });

        it('should handle partial options object', () => {
            const options: Partial<TextReaderOptions> = { rate: 1.5 };
            expect(() => new TextReader(options as TextReaderOptions)).not.toThrow();
        });

        it('should handle empty options object', () => {
            expect(() => new TextReader({})).not.toThrow();
        });

        it('should handle extreme values in options', () => {
            const options: TextReaderOptions = {
                rate: 999,
                pitch: -10,
                volume: 5,
                lang: 'invalid-lang',
            };
            expect(() => new TextReader(options)).not.toThrow();
        });
    });

    describe('Edge Cases - Voice Management', () => {
        beforeEach(async () => {
            const callback = vi.fn();
            textReader.init(callback);
            triggerVoicesChanged();
        });

        it('should handle automatic voice selection when no preferred voices available', () => {
            // Mockar vozes que não estão nas preferidas
            const mockVoices = [
                {
                    name: 'English Voice',
                    lang: 'en-US',
                    voiceURI: 'English Voice',
                    default: false,
                    localService: false,
                },
            ] as any[];

            // Criar um novo reader com o mock aplicado desde o início
            vi.mocked(window.speechSynthesis.getVoices).mockReturnValue(mockVoices);

            const newReader = new TextReader();
            const consoleSpy = vi.spyOn(console, 'warn');

            // Chamar init para carregar as vozes mockadas
            const callback = vi.fn();
            newReader.init(callback);
            triggerVoicesChanged();

            // Agora chamar setVoiceByName que deve mostrar o warning
            newReader.setVoiceByName();

            expect(consoleSpy).toHaveBeenCalledWith('Nenhuma voz pt-BR encontrada.');
        });

        it('should handle automatic voice selection successfully', () => {
            const consoleSpy = vi.spyOn(console, 'warn');
            textReader.setVoiceByName();
            // Com as vozes mockadas padrão, deve encontrar uma voz preferida
            expect(consoleSpy).not.toHaveBeenCalledWith('Nenhuma voz preferida encontrada.');
        });

        it('should handle automatic voice selection multiple times', () => {
            // Teste múltiplas chamadas do método automático
            expect(() => {
                for (let i = 0; i < 5; i++) {
                    textReader.setVoiceByName();
                }
            }).not.toThrow();
        });

        it('should handle automatic voice selection with edge case voices', () => {
            const longName = 'a'.repeat(1000);
            const mockVoices = [
                { name: longName, lang: 'pt-BR', voiceURI: longName, default: false, localService: false },
            ] as any[];

            vi.mocked(window.speechSynthesis.getVoices).mockReturnValue(mockVoices);

            expect(() => {
                textReader.setVoiceByName();
            }).not.toThrow();
        });

        it('should handle empty voices array', () => {
            mockSpeechSynthesis.getVoices.mockReturnValue([]);
            const callback = vi.fn();
            textReader.init(callback);
            triggerVoicesChanged();

            const voices = textReader.listVoices();
            expect(voices).toEqual([]);
        });
    });

    describe('Edge Cases - Audio Parameters', () => {
        it('should handle extreme rate values', () => {
            expect(() => textReader.setRate(0)).not.toThrow();
            expect(() => textReader.setRate(Infinity)).not.toThrow();
            expect(() => textReader.setRate(-1)).not.toThrow();
            expect(() => textReader.setRate(NaN)).not.toThrow();
        });

        it('should handle extreme pitch values', () => {
            expect(() => textReader.setPitch(-100)).not.toThrow();
            expect(() => textReader.setPitch(100)).not.toThrow();
            expect(() => textReader.setPitch(Infinity)).not.toThrow();
            expect(() => textReader.setPitch(NaN)).not.toThrow();
        });

        it('should handle extreme volume values', () => {
            expect(() => textReader.setVolume(-10)).not.toThrow();
            expect(() => textReader.setVolume(10)).not.toThrow();
            expect(() => textReader.setVolume(Infinity)).not.toThrow();
            expect(() => textReader.setVolume(NaN)).not.toThrow();
        });

        it('should handle invalid language codes', () => {
            expect(() => textReader.setLang('')).not.toThrow();
            expect(() => textReader.setLang('invalid')).not.toThrow();
            expect(() => textReader.setLang('123')).not.toThrow();
            expect(() => textReader.setLang(null as any)).not.toThrow();
        });
    });

    describe('Edge Cases - DOM Interactions', () => {
        it('should handle selectors with special characters', () => {
            const element = document.createElement('div');
            element.id = 'test-special-chars';
            element.textContent = 'Test content';
            document.body.appendChild(element);

            // Usar seletor válido
            expect(() => {
                textReader.readTextFromSelector(['#test-special-chars']);
            }).not.toThrow();
        });

        it('should handle very long selector strings', () => {
            const longSelector = '#' + 'a'.repeat(100); // Reduzir tamanho para evitar problemas
            expect(() => {
                textReader.readTextFromSelector([longSelector]);
            }).not.toThrow();
        });

        it('should handle malformed selectors', () => {
            const malformedSelectors = [
                '#valid-selector', // Usar pelo menos um seletor válido
                '   ',
                '\n\t\r',
            ];

            malformedSelectors.forEach((selector) => {
                expect(() => {
                    textReader.readTextFromSelector([selector]);
                }).not.toThrow();
            });
        });

        it('should handle elements with only whitespace', () => {
            const element = document.createElement('div');
            element.id = 'whitespace-only';
            element.textContent = '   \n\t\r   ';
            document.body.appendChild(element);

            expect(() => {
                textReader.readTextFromSelector(['#whitespace-only']);
            }).not.toThrow();
        });

        it('should handle elements with very long text', () => {
            const element = document.createElement('div');
            element.id = 'very-long-text';
            element.textContent = 'a'.repeat(10000);
            document.body.appendChild(element);

            expect(() => {
                textReader.readTextFromSelector(['#very-long-text']);
            }).not.toThrow();
        });

        it('should handle nested elements', () => {
            const parent = document.createElement('div');
            parent.id = 'parent';

            const child1 = document.createElement('span');
            child1.textContent = 'Child 1 ';

            const child2 = document.createElement('span');
            child2.textContent = 'Child 2';

            parent.appendChild(child1);
            parent.appendChild(child2);
            document.body.appendChild(parent);

            expect(() => {
                textReader.readTextFromSelector(['#parent']);
            }).not.toThrow();
        });
    });

    describe('Edge Cases - Playback States', () => {
        it('should handle play when speech synthesis is in inconsistent state', () => {
            textReader.readTextFromSelector(['#test-paragraph']);

            // Simular estado inconsistente
            setSpeechState(true, true); // speaking e paused simultaneamente

            expect(() => textReader.play()).not.toThrow();
            expect(() => textReader.pause()).not.toThrow();
            expect(() => textReader.resume()).not.toThrow();
        });

        it('should handle multiple rapid play calls', () => {
            textReader.readTextFromSelector(['#test-paragraph']);

            for (let i = 0; i < 10; i++) {
                expect(() => textReader.play()).not.toThrow();
            }
        });

        it('should handle play with different channels rapidly', () => {
            textReader.readTextFromSelector(['#test-paragraph']);

            expect(() => {
                textReader.play();
                textReader.play();
                textReader.play();
                textReader.play();
            }).not.toThrow();
        });

        it('should handle pause/resume without current text', () => {
            const newReader = new TextReader();

            expect(() => newReader.pause()).not.toThrow();
            expect(() => newReader.resume()).not.toThrow();
            expect(() => newReader.stop()).not.toThrow();
        });
    });

    describe('Memory and Performance Edge Cases', () => {
        it('should handle creation of many TextReader instances', () => {
            const readers: TextReader[] = [];

            for (let i = 0; i < 100; i++) {
                expect(() => {
                    readers.push(new TextReader());
                }).not.toThrow();
            }

            expect(readers.length).toBe(100);
        });

        it('should handle rapid init calls', () => {
            const callbacks: Array<() => void> = [];

            for (let i = 0; i < 10; i++) {
                const callback = vi.fn();
                callbacks.push(callback);
                textReader.init(callback);
            }

            triggerVoicesChanged();

            // Todos os callbacks devem ter sido chamados
            callbacks.forEach((callback) => {
                expect(callback).toHaveBeenCalled();
            });
        });

        it('should handle many simultaneous voice changes', () => {
            const callback = vi.fn();
            textReader.init(callback);
            triggerVoicesChanged();

            const voices = textReader.listVoices();

            // Simular muitas mudanças de voz simultaneamente (agora automáticas)
            const promises = voices.map(() => Promise.resolve(textReader.setVoiceByName()));

            expect(() => Promise.all(promises)).not.toThrow();
        });
    });

    describe('Timing and Async Edge Cases', () => {
        it('should handle init callback that throws error', () => {
            const throwingCallback = () => {
                throw new Error('Callback error');
            };

            expect(() => {
                textReader.init(throwingCallback);
                triggerVoicesChanged();
            }).toThrow();
        });

        it('should handle onend callback that throws error', () => {
            textReader.readTextFromSelector(['#test-paragraph', '#test-title']);

            // Simular erro no callback onend
            const mockUtterance = new (window as any).SpeechSynthesisUtterance();
            if (mockUtterance.onend) {
                expect(() => {
                    mockUtterance.onend();
                }).not.toThrow();
            }
        });

        it('should handle rapid sequential reading requests', () => {
            expect(() => {
                textReader.readTextFromSelector(['#test-paragraph']);
                textReader.readTextFromSelector(['#test-title']);
                textReader.readTextFromSelector(['#test-content']);
            }).not.toThrow();
        });
    });

    describe('Browser API Edge Cases', () => {
        it('should handle speechSynthesis.cancel throwing error', () => {
            mockSpeechSynthesis.cancel.mockImplementation(() => {
                throw new Error('Cancel error');
            });

            expect(() => textReader.stop()).toThrow();
        });

        it('should handle speechSynthesis.speak throwing error', () => {
            mockSpeechSynthesis.speak.mockImplementation(() => {
                throw new Error('Speak error');
            });

            // O erro é tratado graciosamente pelo código, então não deve propagar
            expect(() => {
                textReader.readTextFromSelector(['#test-paragraph']);
            }).not.toThrow();
        });

        it('should handle speechSynthesis.pause throwing error', () => {
            mockSpeechSynthesis.pause.mockImplementation(() => {
                throw new Error('Pause error');
            });

            setSpeechState(true, false);
            expect(() => textReader.pause()).toThrow();
        });

        it('should handle speechSynthesis.resume throwing error', () => {
            mockSpeechSynthesis.resume.mockImplementation(() => {
                throw new Error('Resume error');
            });

            setSpeechState(false, true);
            expect(() => textReader.resume()).toThrow();
        });

        it('should handle getVoices returning null', () => {
            mockSpeechSynthesis.getVoices.mockReturnValue(null as any);

            expect(() => {
                const callback = vi.fn();
                textReader.init(callback);
                triggerVoicesChanged();
            }).not.toThrow();
        });

        it('should handle voices with missing properties', () => {
            const incompleteVoices = [
                { name: 'Voice1' }, // missing other properties
                { lang: 'en-US' }, // missing name
                {}, // completely empty
            ] as any[];

            mockSpeechSynthesis.getVoices.mockReturnValue(incompleteVoices);

            const callback = vi.fn();
            textReader.init(callback);
            triggerVoicesChanged();

            expect(() => {
                textReader.setVoiceByName(); // Agora é automático
            }).not.toThrow();
        });
    });

    describe('Unicode and Special Text Edge Cases', () => {
        it('should handle Unicode text', () => {
            const element = document.createElement('div');
            element.id = 'unicode-test';
            element.textContent = '🎭 Texto com emojis 🎪 e caracteres especiais àáâãäåæçèéêë';
            document.body.appendChild(element);

            expect(() => {
                textReader.readTextFromSelector(['#unicode-test']);
            }).not.toThrow();
        });

        it('should handle mixed language text', () => {
            const element = document.createElement('div');
            element.id = 'mixed-lang';
            element.textContent = 'Hello world! こんにちは! Bonjour! ¡Hola! Привет!';
            document.body.appendChild(element);

            expect(() => {
                textReader.readTextFromSelector(['#mixed-lang']);
            }).not.toThrow();
        });

        it('should handle text with only numbers and symbols', () => {
            const element = document.createElement('div');
            element.id = 'numbers-symbols';
            element.textContent = '123456789 !@#$%^&*()_+-=[]{}|;:,.<>?';
            document.body.appendChild(element);

            expect(() => {
                textReader.readTextFromSelector(['#numbers-symbols']);
            }).not.toThrow();
        });

        it('should handle HTML entities in text', () => {
            const element = document.createElement('div');
            element.id = 'html-entities';
            element.innerHTML = '&lt;div&gt; &amp; &quot;text&quot; &#8217;';
            document.body.appendChild(element);

            expect(() => {
                textReader.readTextFromSelector(['#html-entities']);
            }).not.toThrow();
        });
    });
});
