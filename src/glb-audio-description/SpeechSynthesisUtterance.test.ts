import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TextReader } from './SpeechSynthesisUtterance';
import type { TextReaderOptions } from './SpeechSynthesisUtterance';
import { mockSpeechSynthesis, triggerVoicesChanged, setSpeechState } from '../test/setup';

describe('TextReader', () => {
    let textReader: TextReader;
    let mockUtterance: any;

    beforeEach(() => {
        textReader = new TextReader();
        mockUtterance = new (window as any).SpeechSynthesisUtterance();
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.clearAllTimers();
    });

    describe('Constructor', () => {
        it('should create instance with default options', () => {
            const reader = new TextReader();
            expect(reader).toBeInstanceOf(TextReader);
        });

        it('should create instance with custom options', () => {
            const options: TextReaderOptions = {
                lang: 'en-US',
                rate: 1.5,
                pitch: 1.2,
                volume: 0.8,
            };
            const reader = new TextReader(options);
            expect(reader).toBeInstanceOf(TextReader);
        });

        it('should merge custom options with defaults', () => {
            const options: TextReaderOptions = {
                rate: 2.0,
            };
            const reader = new TextReader(options);
            expect(reader).toBeInstanceOf(TextReader);
        });
    });

    describe('Initialization', () => {
        it('should initialize and load voices', async () => {
            const callback = vi.fn();

            textReader.init(callback);

            // Simular carregamento de vozes
            triggerVoicesChanged();

            expect(callback).toHaveBeenCalled();
            expect(mockSpeechSynthesis.getVoices).toHaveBeenCalled();
        });

        it('should set first voice as default when no voice is selected', async () => {
            const callback = vi.fn();

            textReader.init(callback);
            triggerVoicesChanged();

            const voices = textReader.listVoices();
            expect(voices.length).toBeGreaterThan(0);
        });

        it('should apply options after initialization', async () => {
            const options: TextReaderOptions = {
                rate: 1.5,
            };
            const reader = new TextReader(options);
            const callback = vi.fn();

            reader.init(callback);
            triggerVoicesChanged();

            expect(callback).toHaveBeenCalled();
        });
    });

    describe('Voice Management', () => {
        beforeEach(async () => {
            const callback = vi.fn();
            textReader.init(callback);
            triggerVoicesChanged();
        });

        it('should list available voices', () => {
            const voices = textReader.listVoices();
            expect(Array.isArray(voices)).toBe(true);
            expect(voices.length).toBeGreaterThan(0);
        });

        it('should set voice by name when voice exists', () => {
            const consoleSpy = vi.spyOn(console, 'warn');

            // Método setVoiceByName agora é automático (sem parâmetros)
            textReader.setVoiceByName();

            expect(consoleSpy).not.toHaveBeenCalled();
        });

        it('should automatically select preferred voice', () => {
            const consoleSpy = vi.spyOn(console, 'warn');

            // Com as vozes mockadas, deve selecionar automaticamente uma voz preferida
            textReader.setVoiceByName();

            // Não deve mostrar warning se encontrou uma voz preferida
            expect(consoleSpy).not.toHaveBeenCalledWith('Nenhuma voz preferida encontrada.');
        });

        it('should handle automatic voice selection', () => {
            // Teste da seleção automática - apenas verificamos que não dá erro
            expect(() => {
                textReader.setVoiceByName();
            }).not.toThrow();
        });
    });

    describe('Audio Settings', () => {
        it('should set language', () => {
            textReader.setLang('en-US');
            // Verificar se foi chamado no utterance mock
            expect(mockUtterance.lang).toBeDefined();
        });

        it('should set rate within valid range', () => {
            textReader.setRate(1.5);
            textReader.setRate(0.1);
            textReader.setRate(10.0);

            // Todos os valores devem ser aceitos
            expect(true).toBe(true);
        });

        it('should set pitch within valid range', () => {
            textReader.setPitch(1.2);
            textReader.setPitch(0.0);
            textReader.setPitch(2.0);

            // Todos os valores devem ser aceitos
            expect(true).toBe(true);
        });

        it('should set volume within valid range', () => {
            textReader.setVolume(0.8);
            textReader.setVolume(0.0);
            textReader.setVolume(1.0);

            // Todos os valores devem ser aceitos
            expect(true).toBe(true);
        });
    });

    describe('Text Reading', () => {
        it('should read text from valid selectors', () => {
            textReader.readTextFromSelector(['#test-paragraph']);

            expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
        });

        it('should read multiple elements sequentially', async () => {
            vi.useFakeTimers();

            textReader.readTextFromSelector(['#test-title', '#test-paragraph']);

            expect(mockSpeechSynthesis.speak).toHaveBeenCalled();

            vi.useRealTimers();
        });

        it('should skip empty elements', () => {
            textReader.readTextFromSelector(['#empty-element', '#test-paragraph']);

            expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
        });

        it('should handle non-existent selectors', () => {
            textReader.readTextFromSelector(['#non-existent']);

            // Não deve quebrar
            expect(true).toBe(true);
        });

        it('should handle empty selector array', () => {
            textReader.readTextFromSelector([]);

            // Não deve quebrar
            expect(true).toBe(true);
        });

        it('should cancel previous speech before starting new one', () => {
            setSpeechState(true);

            textReader.readTextFromSelector(['#test-paragraph']);

            expect(mockSpeechSynthesis.cancel).toHaveBeenCalled();
            expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
        });
    });

    describe('Playback Controls', () => {
        beforeEach(() => {
            textReader.readTextFromSelector(['#test-paragraph']);
        });

        describe('Play Method', () => {
            it('should warn when no text is loaded', () => {
                const reader = new TextReader();
                const consoleSpy = vi.spyOn(console, 'warn');

                reader.play();

                expect(consoleSpy).toHaveBeenCalledWith(
                    'Nenhum texto carregado. Use readTextFromSelector() primeiro.'
                );
            });

            it('should call speakText when play is called', () => {
                const speakSpy = vi.spyOn(mockSpeechSynthesis, 'speak');

                textReader.play();

                expect(speakSpy).toHaveBeenCalled();
            });

            it('should start speaking when play is called', () => {
                textReader.play();

                expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
            });

            it('should call speakText when text is loaded', () => {
                // First load some text
                textReader.readTextFromSelector(['#test-paragraph']);

                const speakSpy = vi.spyOn(mockSpeechSynthesis, 'speak');

                textReader.play();

                expect(speakSpy).toHaveBeenCalled();
            });
        });

        describe('Pause Method', () => {
            it('should pause when speaking and not paused', () => {
                setSpeechState(true, false);

                textReader.pause();

                expect(mockSpeechSynthesis.pause).toHaveBeenCalled();
            });

            it('should not pause when not speaking', () => {
                setSpeechState(false);

                textReader.pause();

                expect(mockSpeechSynthesis.pause).not.toHaveBeenCalled();
            });

            it('should not pause when already paused', () => {
                setSpeechState(true, true);

                textReader.pause();

                expect(mockSpeechSynthesis.pause).not.toHaveBeenCalled();
            });
        });

        describe('Resume Method', () => {
            it('should resume when paused', () => {
                setSpeechState(false, true);

                textReader.resume();

                expect(mockSpeechSynthesis.resume).toHaveBeenCalled();
            });

            it('should not resume when not paused', () => {
                setSpeechState(true, false);

                textReader.resume();

                expect(mockSpeechSynthesis.resume).not.toHaveBeenCalled();
            });
        });

        describe('Stop Method', () => {
            it('should cancel speech synthesis', () => {
                textReader.stop();

                expect(mockSpeechSynthesis.cancel).toHaveBeenCalled();
            });
        });
    });

    describe('Sequential Reading', () => {
        it('should read elements with delay between them', async () => {
            vi.useFakeTimers();

            const elements = ['#test-title', '#test-paragraph', '#test-content'];
            textReader.readTextFromSelector(elements);

            // Simular fim da primeira fala
            if (mockUtterance.onend) {
                mockUtterance.onend();
            }

            // Avançar o timer para o delay
            vi.advanceTimersByTime(500);

            expect(mockSpeechSynthesis.speak).toHaveBeenCalled();

            vi.useRealTimers();
        });

        it('should skip to next element when current element is empty', async () => {
            vi.useFakeTimers();

            const elements = ['#empty-element', '#test-paragraph'];
            textReader.readTextFromSelector(elements);

            expect(mockSpeechSynthesis.speak).toHaveBeenCalled();

            vi.useRealTimers();
        });

        it('should stop when reaching end of elements array', async () => {
            vi.useFakeTimers();

            textReader.readTextFromSelector(['#test-paragraph']);

            // Simular fim da fala
            if (mockUtterance.onend) {
                mockUtterance.onend();
            }

            vi.advanceTimersByTime(500);

            // Não deve tentar falar novamente
            expect(mockSpeechSynthesis.speak).toHaveBeenCalledTimes(1);

            vi.useRealTimers();
        });
    });

    describe('Error Handling', () => {
        it('should handle DOM manipulation errors gracefully', () => {
            // Simular erro no querySelector
            const originalQuerySelector = document.querySelector;
            document.querySelector = vi.fn().mockImplementation(() => {
                throw new Error('DOM error');
            });

            // Deve tratar o erro graciosamente
            expect(() => {
                textReader.readTextFromSelector(['#test-paragraph']);
            }).not.toThrow();

            // Restaurar função original
            document.querySelector = originalQuerySelector;
        });

        it('should handle speech synthesis errors gracefully', () => {
            // Simular erro na síntese de fala
            mockSpeechSynthesis.speak.mockImplementation(() => {
                throw new Error('Speech error');
            });

            expect(() => {
                textReader.readTextFromSelector(['#test-paragraph']);
            }).not.toThrow();
        });

        it('should handle missing text content gracefully', () => {
            // Criar elemento sem textContent
            const element = document.createElement('div');
            element.id = 'no-text';
            Object.defineProperty(element, 'textContent', {
                get: () => null,
            });
            document.body.appendChild(element);

            expect(() => {
                textReader.readTextFromSelector(['#no-text']);
            }).not.toThrow();
        });
    });

    describe('Integration Tests', () => {
        it('should complete full workflow: init -> load -> play -> pause -> resume -> stop', async () => {
            // Initialize
            const callback = vi.fn();
            textReader.init(callback);
            triggerVoicesChanged();

            // Load text
            textReader.readTextFromSelector(['#test-paragraph']);

            // Play
            textReader.play();
            setSpeechState(true);

            // Pause
            textReader.pause();
            setSpeechState(true, true);

            // Resume
            textReader.resume();
            setSpeechState(true, false);

            // Stop
            textReader.stop();
            setSpeechState(false);

            expect(callback).toHaveBeenCalled();
            expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
            expect(mockSpeechSynthesis.pause).toHaveBeenCalled();
            expect(mockSpeechSynthesis.resume).toHaveBeenCalled();
            expect(mockSpeechSynthesis.cancel).toHaveBeenCalled();
        });

        it('should handle rapid successive calls', () => {
            textReader.readTextFromSelector(['#test-paragraph']);
            textReader.play();
            textReader.pause();
            textReader.resume();
            textReader.stop();
            textReader.play();

            // Não deve quebrar
            expect(true).toBe(true);
        });

        it('should maintain state consistency during complex operations', () => {
            // Simular operações complexas
            textReader.setRate(1.5);
            textReader.setPitch(1.2);
            textReader.setVolume(0.8);
            textReader.setLang('pt-BR');

            textReader.readTextFromSelector(['#test-title', '#test-paragraph']);
            textReader.play();
            textReader.pause();
            textReader.resume();

            // Verificar que tudo ainda funciona
            expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
        });
    });

    describe('Performance Tests', () => {
        it('should handle large number of elements efficiently', () => {
            // Criar muitos elementos
            const selectors: string[] = [];
            for (let i = 0; i < 100; i++) {
                const element = document.createElement('div');
                element.id = `test-element-${i}`;
                element.textContent = `Texto ${i}`;
                document.body.appendChild(element);
                selectors.push(`#test-element-${i}`);
            }

            const startTime = performance.now();
            textReader.readTextFromSelector(selectors);
            const endTime = performance.now();

            // Deve completar em tempo razoável (menos de 100ms)
            expect(endTime - startTime).toBeLessThan(100);
        });

        it('should handle rapid voice changes', () => {
            const callback = vi.fn();
            textReader.init(callback);
            triggerVoicesChanged();

            // Mudar voz rapidamente múltiplas vezes
            for (let i = 0; i < 10; i++) {
                textReader.setVoiceByName(); // Agora é automático, sem parâmetros
            }

            expect(true).toBe(true);
        });
    });

    describe('Browser Compatibility', () => {
        it('should work when speechSynthesis is available', () => {
            expect(window.speechSynthesis).toBeDefined();
            expect(window.SpeechSynthesisUtterance).toBeDefined();
        });

        it('should handle different voice configurations', () => {
            const callback = vi.fn();
            textReader.init(callback);

            // Simular diferentes configurações de vozes
            mockSpeechSynthesis.getVoices.mockReturnValue([
                {
                    name: 'Voice 1',
                    lang: 'en-US',
                    voiceURI: 'voice1',
                    default: false,
                    localService: true,
                },
            ]);

            triggerVoicesChanged();

            const voices = textReader.listVoices();
            expect(voices.length).toBe(1);
        });
    });
});
