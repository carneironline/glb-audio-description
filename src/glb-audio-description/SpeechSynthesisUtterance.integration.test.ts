import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { TextReader } from './SpeechSynthesisUtterance';
import type { TextReaderOptions } from './SpeechSynthesisUtterance';
import { mockSpeechSynthesis, triggerVoicesChanged, setSpeechState } from '../test/setup';

describe('TextReader - Integration Tests', () => {
    let textReader: TextReader;

    beforeEach(() => {
        textReader = new TextReader();
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.clearAllTimers();
    });

    describe('Complete User Workflows', () => {
        it('should handle data-containersToRead integration workflow', async () => {
            // Setup realistic HTML structure com data attribute
            const setupDataAttributeContent = () => {
                const page = document.createElement('div');
                page.innerHTML = `
                    <article class="news-article">
                        <header>
                            <h1 class="article-title">Breaking News: Technology Update</h1>
                            <p class="article-subtitle">New developments in web accessibility</p>
                            <div class="article-meta">Published today</div>
                        </header>
                        
                        <main class="article-content">
                            <p class="lead">This is the lead paragraph with key information.</p>
                            <p class="body-text">First paragraph of detailed content.</p>
                            <p class="body-text">Second paragraph with more details.</p>
                        </main>
                        
                        <!-- Component configuration via data attribute -->
                        <div 
                            class="glb-audio-description"
                            data-containersToRead='[".article-title", ".article-subtitle", ".lead", ".body-text"]'
                        ></div>
                    </article>
                `;
                document.body.appendChild(page);
            };
            setupDataAttributeContent();

            // User workflow: sistema lê configuração do HTML e inicia reprodução
            const callback = vi.fn();
            textReader.init(callback);
            triggerVoicesChanged();

            // Simular seletores extraídos do data attribute
            const configuredSelectors = ['.article-title', '.article-subtitle', '.lead', '.body-text'];
            textReader.readTextFromSelector(configuredSelectors);

            // Verificar que todos os elementos configurados são processados
            expect(mockSpeechSynthesis.speak).toHaveBeenCalled();

            // Simular estado de reprodução antes de pausar
            setSpeechState(true, false);

            // Simular interação do usuário com controles
            textReader.pause();
            expect(mockSpeechSynthesis.pause).toHaveBeenCalled();

            // Simular estado pausado antes de retomar
            setSpeechState(false, true);
            textReader.resume();
            expect(mockSpeechSynthesis.resume).toHaveBeenCalled();
        });

        it('should handle multiple components workflow', async () => {
            // Setup página com múltiplos componentes
            const setupMultipleComponents = () => {
                const page = document.createElement('div');
                page.innerHTML = `
                    <header class="page-header">
                        <h1 class="main-title">Site Title</h1>
                        <nav class="breadcrumb">Home > News > Article</nav>
                        <div 
                            class="glb-audio-description header-reader"
                            data-containersToRead='[".main-title", ".breadcrumb"]'
                        ></div>
                    </header>
                    
                    <main class="main-content">
                        <article>
                            <h2 class="article-headline">Article Headline</h2>
                            <div class="article-body">Article content here...</div>
                        </article>
                        <div 
                            class="glb-audio-description content-reader"
                            data-containersToRead='[".article-headline", ".article-body"]'
                        ></div>
                    </main>
                    
                    <aside class="sidebar">
                        <h3 class="sidebar-title">Related Articles</h3>
                        <ul class="related-list">
                            <li>Related article 1</li>
                            <li>Related article 2</li>
                        </ul>
                        <div 
                            class="glb-audio-description sidebar-reader"
                            data-containersToRead='[".sidebar-title", ".related-list"]'
                        ></div>
                    </aside>
                `;
                document.body.appendChild(page);
            };
            setupMultipleComponents();

            const callback = vi.fn();
            textReader.init(callback);
            triggerVoicesChanged();

            // Simular uso de diferentes configurações para diferentes seções
            const headerSelectors = ['.main-title', '.breadcrumb'];
            const contentSelectors = ['.article-headline', '.article-body'];
            const sidebarSelectors = ['.sidebar-title', '.related-list'];

            // Cada componente deve poder operar independentemente
            textReader.readTextFromSelector(headerSelectors);
            expect(mockSpeechSynthesis.speak).toHaveBeenCalled();

            textReader.stop();
            textReader.readTextFromSelector(contentSelectors);
            expect(mockSpeechSynthesis.speak).toHaveBeenCalled();

            textReader.stop();
            textReader.readTextFromSelector(sidebarSelectors);
            expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
        });

        it('should handle complete accessibility workflow', async () => {
            // 1. User creates reader with accessibility preferences
            const accessibilityOptions: TextReaderOptions = {
                lang: 'pt-BR',
                rate: 1.2,
                pitch: 1.0,
                volume: 1.0,
            };

            const reader = new TextReader(accessibilityOptions);

            // 2. Initialize and wait for voices
            const initPromise = new Promise<void>((resolve) => {
                reader.init(() => resolve());
            });
            triggerVoicesChanged();
            await initPromise;

            // 3. Setup page content for reading
            const setupContent = () => {
                const article = document.createElement('article');
                article.innerHTML = `
          <h1 id="main-title">Notícia Principal</h1>
          <p id="lead">Este é o lead da notícia com informações importantes.</p>
          <div id="content">
            <p>Primeiro parágrafo do conteúdo detalhado.</p>
            <p>Segundo parágrafo com mais informações.</p>
          </div>
          <footer id="article-footer">Publicado em 10 de agosto de 2025</footer>
        `;
                document.body.appendChild(article);
            };
            setupContent();

            // 4. User starts reading the article
            reader.readTextFromSelector(['#main-title', '#lead', '#content', '#article-footer']);

            // 5. User pauses to process information
            setSpeechState(true);
            reader.pause();
            expect(mockSpeechSynthesis.pause).toHaveBeenCalled();

            // 6. User resumes reading
            setSpeechState(true, true);
            reader.resume();
            expect(mockSpeechSynthesis.resume).toHaveBeenCalled();

            // 7. User decides to stop and re-read with different speed
            reader.stop();
            reader.setRate(1.2);
            reader.readTextFromSelector(['#lead']);

            expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
        });

        it('should handle e-learning content workflow', async () => {
            // Setup educational content
            const setupElearningContent = () => {
                const lesson = document.createElement('div');
                lesson.innerHTML = `
          <header id="lesson-title">Lição 1: Introdução ao TypeScript</header>
          <section id="objectives">
            <h2>Objetivos de Aprendizagem</h2>
            <ul>
              <li>Compreender os fundamentos do TypeScript</li>
              <li>Configurar um ambiente de desenvolvimento</li>
            </ul>
          </section>
          <section id="content-section">
            <h2>Conteúdo</h2>
            <p>TypeScript é uma linguagem de programação...</p>
          </section>
          <section id="exercise">
            <h2>Exercício Prático</h2>
            <p>Crie uma função que retorna a soma de dois números...</p>
          </section>
        `;
                document.body.appendChild(lesson);
            };
            setupElearningContent();

            // Student workflow
            const callback = vi.fn();
            textReader.init(callback);
            triggerVoicesChanged();

            // Read lesson title
            textReader.readTextFromSelector(['#lesson-title']);

            // Student wants to adjust settings for better learning
            textReader.setRate(0.9); // Slower for complex content
            textReader.setPitch(1.1); // Slightly higher pitch for attention

            // Read learning objectives
            textReader.readTextFromSelector(['#objectives']);

            // Read main content with pauses for note-taking
            textReader.readTextFromSelector(['#content-section']);

            // Quick review of exercise
            textReader.setRate(1.3); // Faster for review
            textReader.readTextFromSelector(['#exercise']);

            expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
        });

        it('should handle multi-language content workflow', async () => {
            // Setup multilingual content
            const setupMultilingualContent = () => {
                const content = document.createElement('div');
                content.innerHTML = `
          <div id="pt-content" lang="pt-BR">
            <h1>Conteúdo em Português</h1>
            <p>Este é um texto em português brasileiro.</p>
          </div>
          <div id="en-content" lang="en-US">
            <h1>Content in English</h1>
            <p>This is text in English.</p>
          </div>
        `;
                document.body.appendChild(content);
            };
            setupMultilingualContent();

            const callback = vi.fn();
            textReader.init(callback);
            triggerVoicesChanged();

            // Read Portuguese content
            textReader.setLang('pt-BR');
            textReader.setVoiceByName(); // Seleção automática
            textReader.readTextFromSelector(['#pt-content']);

            // Switch to English content
            textReader.setLang('en-US');
            textReader.readTextFromSelector(['#en-content']);

            expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
        });
    });

    describe('Real-world Scenarios', () => {
        it('should handle news article reading pattern', async () => {
            vi.useFakeTimers();

            // Setup news article structure
            const setupNewsArticle = () => {
                const article = document.createElement('article');
                article.innerHTML = `
          <header>
            <h1 id="headline">Manchete da Notícia Importante</h1>
            <p id="subheading">Subtítulo explicativo</p>
            <div id="metadata">Por João Silva, 10 de agosto de 2025</div>
          </header>
          <main>
            <p id="lead">Lead da notícia com informações essenciais...</p>
            <p id="para1">Primeiro parágrafo do desenvolvimento...</p>
            <p id="para2">Segundo parágrafo com mais detalhes...</p>
            <p id="para3">Terceiro parágrafo com conclusões...</p>
          </main>
        `;
                document.body.appendChild(article);
            };
            setupNewsArticle();

            const callback = vi.fn();
            textReader.init(callback);
            triggerVoicesChanged();

            // User wants to read full article
            const selectors = [
                '#headline',
                '#subheading',
                '#metadata',
                '#lead',
                '#para1',
                '#para2',
                '#para3',
            ];
            textReader.readTextFromSelector(selectors);

            // Simulate reading progression with natural pauses
            const mockUtterance = new (window as any).SpeechSynthesisUtterance();

            // Simulate each element being read
            for (let i = 0; i < selectors.length; i++) {
                if (mockUtterance.onend) {
                    mockUtterance.onend();
                }
                vi.advanceTimersByTime(500); // Default delay
            }

            expect(mockSpeechSynthesis.speak).toHaveBeenCalled();

            vi.useRealTimers();
        });

        it('should handle form reading and interaction pattern', async () => {
            // Setup form content
            const setupForm = () => {
                const form = document.createElement('form');
                form.innerHTML = `
          <fieldset>
            <legend id="form-title">Formulário de Contato</legend>
            <label id="name-label" for="name">Nome completo (obrigatório)</label>
            <input type="text" id="name" name="name" required>
            
            <label id="email-label" for="email">Email (obrigatório)</label>
            <input type="email" id="email" name="email" required>
            
            <label id="message-label" for="message">Mensagem</label>
            <textarea id="message" name="message"></textarea>
            
            <div id="submit-info">
              <p>Clique no botão abaixo para enviar o formulário</p>
              <button type="submit">Enviar</button>
            </div>
          </fieldset>
        `;
                document.body.appendChild(form);
            };
            setupForm();

            const callback = vi.fn();
            textReader.init(callback);
            triggerVoicesChanged();

            // User wants to understand form structure
            textReader.readTextFromSelector([
                '#form-title',
                '#name-label',
                '#email-label',
                '#message-label',
                '#submit-info',
            ]);

            expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
        });

        it('should handle table data reading pattern', async () => {
            // Setup data table
            const setupTable = () => {
                const table = document.createElement('div');
                table.innerHTML = `
          <table>
            <caption id="table-caption">Vendas por Trimestre</caption>
            <thead>
              <tr id="table-header">
                <th>Produto</th>
                <th>Q1 2025</th>
                <th>Q2 2025</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr id="row1">
                <td>Produto A</td>
                <td>150.000</td>
                <td>180.000</td>
                <td>330.000</td>
              </tr>
              <tr id="row2">
                <td>Produto B</td>
                <td>120.000</td>
                <td>140.000</td>
                <td>260.000</td>
              </tr>
            </tbody>
            <tfoot>
              <tr id="table-footer">
                <td>Total Geral</td>
                <td>270.000</td>
                <td>320.000</td>
                <td>590.000</td>
              </tr>
            </tfoot>
          </table>
        `;
                document.body.appendChild(table);
            };
            setupTable();

            const callback = vi.fn();
            textReader.init(callback);
            triggerVoicesChanged();

            // User wants to understand table structure and data
            textReader.readTextFromSelector([
                '#table-caption',
                '#table-header',
                '#row1',
                '#row2',
                '#table-footer',
            ]);

            expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
        });
    });

    describe('Error Recovery Scenarios', () => {
        it('should recover from speech synthesis interruptions', async () => {
            const callback = vi.fn();
            textReader.init(callback);
            triggerVoicesChanged();

            // Start reading
            textReader.readTextFromSelector(['#test-paragraph']);
            setSpeechState(true);

            // Simulate interruption (user gets phone call)
            textReader.stop();
            setSpeechState(false);

            // User returns and wants to continue
            textReader.play();

            expect(mockSpeechSynthesis.cancel).toHaveBeenCalled();
            expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
        });

        it('should handle browser tab switching scenario', async () => {
            const callback = vi.fn();
            textReader.init(callback);
            triggerVoicesChanged();

            // Start reading
            textReader.readTextFromSelector(['#test-paragraph']);
            setSpeechState(true);

            // Simulate tab becoming inactive (speech might pause automatically)
            setSpeechState(true, true);

            // User returns to tab and resumes
            textReader.resume();

            expect(mockSpeechSynthesis.resume).toHaveBeenCalled();
        });

        it('should handle network connectivity issues gracefully', async () => {
            // Simular voices loading failure em uma nova instância
            const newReader = new TextReader();

            // Temporariamente modificar o mock para esse teste específico
            const originalGetVoices = mockSpeechSynthesis.getVoices;
            mockSpeechSynthesis.getVoices.mockImplementation(() => {
                throw new Error('Network error');
            });

            const callback = vi.fn();

            expect(() => {
                newReader.init(callback);
                triggerVoicesChanged();
            }).not.toThrow();

            // Should still call callback even if voices fail to load
            expect(callback).toHaveBeenCalled();

            // Restaurar mock original
            mockSpeechSynthesis.getVoices = originalGetVoices;
        });
    });

    describe('Performance Under Load', () => {
        it('should handle continuous reading sessions', async () => {
            vi.useFakeTimers();

            const callback = vi.fn();
            textReader.init(callback);
            triggerVoicesChanged();

            // Simulate long reading session with many elements
            const manyElements = Array.from({ length: 50 }, (_, i) => {
                const element = document.createElement('p');
                element.id = `para-${i}`;
                element.textContent = `Parágrafo ${i + 1} com conteúdo de teste.`;
                document.body.appendChild(element);
                return `#para-${i}`;
            });

            textReader.readTextFromSelector(manyElements);

            // Simulate progression through all elements
            const mockUtterance = new (window as any).SpeechSynthesisUtterance();
            for (let i = 0; i < manyElements.length; i++) {
                if (mockUtterance.onend) {
                    mockUtterance.onend();
                }
                vi.advanceTimersByTime(500);
            }

            expect(mockSpeechSynthesis.speak).toHaveBeenCalled();

            vi.useRealTimers();
        });

        it('should handle rapid user interactions', async () => {
            const callback = vi.fn();
            textReader.init(callback);
            triggerVoicesChanged();

            // Simulate rapid user interactions
            textReader.readTextFromSelector(['#test-paragraph']);
            textReader.play();
            textReader.pause();
            textReader.resume();
            textReader.setRate(1.5);
            textReader.setVolume(0.8);
            textReader.pause();
            textReader.play();
            textReader.stop();

            // Should handle all interactions without breaking
            expect(true).toBe(true);
        });
    });

    describe('Accessibility Compliance', () => {
        it('should support screen reader compatibility patterns', async () => {
            // Setup ARIA-labeled content
            const setupAriaContent = () => {
                const content = document.createElement('div');
                content.innerHTML = `
          <div id="main-content" role="main" aria-label="Conteúdo principal">
            <h1 id="page-title">Título da Página</h1>
            <nav id="breadcrumb" aria-label="Navegação estrutural">
              <ol>
                <li><a href="/">Início</a></li>
                <li><a href="/categoria">Categoria</a></li>
                <li aria-current="page">Página Atual</li>
              </ol>
            </nav>
            <article id="article-content" aria-labelledby="page-title">
              <p>Conteúdo do artigo...</p>
            </article>
          </div>
        `;
                document.body.appendChild(content);
            };
            setupAriaContent();

            const callback = vi.fn();
            textReader.init(callback);
            triggerVoicesChanged();

            // Read content respecting ARIA structure
            textReader.readTextFromSelector(['#page-title', '#breadcrumb', '#article-content']);

            expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
        });

        it('should handle keyboard navigation simulation', async () => {
            const callback = vi.fn();
            textReader.init(callback);
            triggerVoicesChanged();

            // Simulate keyboard-driven reading
            textReader.readTextFromSelector(['#test-paragraph']);

            // Simulate spacebar pause
            setSpeechState(true);
            textReader.pause();

            // Simulate enter to resume
            setSpeechState(true, true);
            textReader.resume();

            // Simulate escape to stop
            textReader.stop();

            expect(mockSpeechSynthesis.pause).toHaveBeenCalled();
            expect(mockSpeechSynthesis.resume).toHaveBeenCalled();
            expect(mockSpeechSynthesis.cancel).toHaveBeenCalled();
        });
    });

    describe('Cross-browser Compatibility Scenarios', () => {
        it('should handle different voice availability patterns', async () => {
            // Test with Chrome-like voice setup
            mockSpeechSynthesis.getVoices.mockReturnValue([
                {
                    name: 'Google português do Brasil',
                    lang: 'pt-BR',
                    voiceURI: 'Google português do Brasil',
                    default: false,
                    localService: false,
                },
            ]);

            let callback = vi.fn();
            textReader.init(callback);
            triggerVoicesChanged();

            expect(callback).toHaveBeenCalled();

            // Test with Firefox-like voice setup
            mockSpeechSynthesis.getVoices.mockReturnValue([
                {
                    name: 'Microsoft Helena - Portuguese (Brazil)',
                    lang: 'pt-BR',
                    voiceURI: 'urn:moz-tts:sapi:Microsoft Helena - Portuguese (Brazil)?pt-BR',
                    default: true,
                    localService: true,
                },
            ]);

            callback = vi.fn();
            textReader.init(callback);
            triggerVoicesChanged();

            expect(callback).toHaveBeenCalled();
        });

        it('should handle delayed voice loading (Safari pattern)', async () => {
            // Initially no voices
            mockSpeechSynthesis.getVoices.mockReturnValue([]);

            const callback = vi.fn();
            textReader.init(callback);

            // Simulate delayed voice loading
            setTimeout(() => {
                mockSpeechSynthesis.getVoices.mockReturnValue([
                    {
                        name: 'Luciana',
                        lang: 'pt-BR',
                        voiceURI: 'com.apple.ttsbundle.Luciana-compact',
                        default: true,
                        localService: true,
                    },
                ]);
                triggerVoicesChanged();
            }, 1000);

            expect(callback).toHaveBeenCalled();
        });
    });
});
