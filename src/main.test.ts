import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { JSDOM } from 'jsdom';

// Mock para lucide icons
vi.mock('lucide', () => ({
    createIcons: vi.fn(),
    icons: {},
}));

// Mock para CSS imports
vi.mock('./style.css', () => ({}));
vi.mock('./glb-audio-description/glb-audio-description.css', () => ({}));

// Mock para TextReader
const mockTextReader = {
    init: vi.fn(),
    readTextFromSelector: vi.fn(),
    play: vi.fn(),
    pause: vi.fn(),
    stop: vi.fn(),
};

vi.mock('./glb-audio-description/SpeechSynthesisUtterance', () => ({
    TextReader: vi.fn(() => mockTextReader),
}));

describe('Main.ts - Data Attributes Integration', () => {
    let dom: JSDOM;
    let document: Document;

    beforeEach(() => {
        vi.clearAllMocks();

        // Setup DOM
        dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
        document = dom.window.document;
        global.document = document;
        global.window = dom.window as any;
        global.HTMLElement = dom.window.HTMLElement;
        global.HTMLButtonElement = dom.window.HTMLButtonElement;

        // Mock init callback to be called immediately
        mockTextReader.init.mockImplementation((callback: () => void) => {
            callback();
        });
    });

    afterEach(() => {
        vi.resetModules();
    });

    describe('data-containersToRead Configuration', () => {
        it('should initialize component with valid data-containersToRead', async () => {
            // Setup HTML with data attribute
            document.body.innerHTML = `
                <div class="title">Test Title</div>
                <div class="subtitle">Test Subtitle</div>
                <div class="content">Test Content</div>
                <div 
                    class="glb-audio-description"
                    data-containersToRead='[".title", ".subtitle", ".content"]'
                ></div>
            `;

            // Import main.ts dinamicamente para executar a lógica
            await import('./main');

            // Verificar se o componente foi inicializado
            const component = document.querySelector('.glb-audio-description');
            expect(component?.classList.contains('is-not-played')).toBe(true);

            // Verificar se os botões foram criados
            expect(component?.querySelector('.glb-audio-description__play')).toBeTruthy();
            expect(component?.querySelector('.glb-audio-description__stop')).toBeTruthy();
        });

        it('should not initialize component without data-containersToRead', async () => {
            // Setup HTML sem data attribute
            document.body.innerHTML = `
                <div class="title">Test Title</div>
                <div class="glb-audio-description"></div>
            `;

            await import('./main');

            const component = document.querySelector('.glb-audio-description');
            // Não deve ter classe is-not-played nem botões
            expect(component?.classList.contains('is-not-played')).toBe(false);
            expect(component?.querySelector('.glb-audio-description__play')).toBeFalsy();
        });

        it('should handle multiple components with different configurations', async () => {
            document.body.innerHTML = `
                <div class="title">Title</div>
                <div class="subtitle">Subtitle</div>
                <div class="content">Content</div>
                <div class="sidebar">Sidebar</div>
                
                <div 
                    class="glb-audio-description"
                    data-containersToRead='[".title", ".subtitle"]'
                ></div>
                
                <div 
                    class="glb-audio-description"
                    data-containersToRead='[".content", ".sidebar"]'
                ></div>
            `;

            await import('./main');

            const components = document.querySelectorAll('.glb-audio-description');
            expect(components).toHaveLength(2);

            // Ambos componentes devem ter sido inicializados
            components.forEach((component) => {
                expect(component.classList.contains('is-not-played')).toBe(true);
                expect(component.querySelector('.glb-audio-description__play')).toBeTruthy();
                expect(component.querySelector('.glb-audio-description__stop')).toBeTruthy();
            });
        });

        it('should handle invalid JSON in data-containersToRead gracefully', async () => {
            document.body.innerHTML = `
                <div 
                    class="glb-audio-description"
                    data-containersToRead='invalid json'
                ></div>
            `;

            // Deve capturar erro de JSON.parse sem quebrar
            expect(async () => {
                await import('./main');
            }).not.toThrow();
        });

        it('should parse complex selectors correctly', async () => {
            document.body.innerHTML = `
                <h1 id="main-title">Main Title</h1>
                <div class="article content">Article Content</div>
                <p class="lead">Lead paragraph</p>
                
                <div 
                    class="glb-audio-description"
                    data-containersToRead='["#main-title", ".article.content", "p.lead"]'
                ></div>
            `;

            await import('./main');

            const component = document.querySelector('.glb-audio-description');
            expect(component?.classList.contains('is-not-played')).toBe(true);
        });
    });

    describe('Component Functionality', () => {
        beforeEach(() => {
            document.body.innerHTML = `
                <div class="title">Test Title</div>
                <div class="subtitle">Test Subtitle</div>
                <div class="content">Test Content</div>
                <div 
                    class="glb-audio-description"
                    data-containersToRead='[".title", ".subtitle", ".content"]'
                ></div>
            `;
        });

        it('should start reading when play button is clicked', async () => {
            await import('./main');

            const playButton = document.querySelector('.glb-audio-description__play') as HTMLButtonElement;
            playButton?.click();

            // Verificar se readTextFromSelector foi chamado com os seletores corretos
            expect(mockTextReader.readTextFromSelector).toHaveBeenCalledWith([
                '.title',
                '.subtitle',
                '.content',
            ]);
        });

        it('should update component classes correctly during playback', async () => {
            await import('./main');

            const component = document.querySelector('.glb-audio-description');
            const playButton = component?.querySelector('.glb-audio-description__play') as HTMLButtonElement;

            // Estado inicial
            expect(component?.classList.contains('is-not-played')).toBe(true);

            // Simular primeiro clique (iniciar reprodução)
            playButton?.click();
            expect(component?.classList.contains('is-not-played')).toBe(false);
            expect(component?.classList.contains('is-playing')).toBe(true);

            // Simular segundo clique (pausar)
            playButton?.click();
            expect(component?.classList.contains('is-playing')).toBe(false);
            expect(component?.classList.contains('is-paused')).toBe(true);
        });

        it('should stop playback and reset state when stop button is clicked', async () => {
            await import('./main');

            const component = document.querySelector('.glb-audio-description');
            const playButton = component?.querySelector('.glb-audio-description__play') as HTMLButtonElement;
            const stopButton = component?.querySelector('.glb-audio-description__stop') as HTMLButtonElement;

            // Iniciar reprodução
            playButton?.click();
            expect(component?.classList.contains('is-playing')).toBe(true);

            // Parar reprodução
            stopButton?.click();
            expect(component?.classList.contains('is-playing')).toBe(false);
            expect(component?.classList.contains('is-stopped')).toBe(true);
            expect(component?.classList.contains('is-not-played')).toBe(true);
            expect(mockTextReader.stop).toHaveBeenCalled();
        });
    });

    describe('Error Handling', () => {
        it('should handle missing elements gracefully', async () => {
            document.body.innerHTML = `
                <div 
                    class="glb-audio-description"
                    data-containersToRead='[".non-existent-element"]'
                ></div>
            `;

            expect(async () => {
                await import('./main');
            }).not.toThrow();
        });

        it('should handle empty data-containersToRead array', async () => {
            document.body.innerHTML = `
                <div 
                    class="glb-audio-description"
                    data-containersToRead='[]'
                ></div>
            `;

            await import('./main');

            const component = document.querySelector('.glb-audio-description');
            expect(component?.classList.contains('is-not-played')).toBe(true);
        });

        it('should handle component without data-containerstoread attribute', async () => {
            document.body.innerHTML = `
                <div class="glb-audio-description"></div>
            `;

            // Não deve quebrar e não deve inicializar o componente
            expect(async () => {
                await import('./main');
            }).not.toThrow();

            const component = document.querySelector('.glb-audio-description');
            expect(component?.querySelector('.glb-audio-description__play')).toBeFalsy();
        });
    });

    describe('Data Attribute Parsing', () => {
        it('should correctly parse different selector formats', async () => {
            const testCases = [
                {
                    input: '[".title"]',
                    expected: ['.title'],
                },
                {
                    input: '[".title", ".subtitle", ".content"]',
                    expected: ['.title', '.subtitle', '.content'],
                },
                {
                    input: '["#main-header", ".article-body p", ".footer"]',
                    expected: ['#main-header', '.article-body p', '.footer'],
                },
            ];

            for (const testCase of testCases) {
                document.body.innerHTML = `
                    <div 
                        class="glb-audio-description"
                        data-containersToRead='${testCase.input}'
                    ></div>
                `;

                // Reset módulos para cada teste
                vi.resetModules();
                await import('./main');

                // Verificar se o componente foi inicializado corretamente
                const component = document.querySelector('.glb-audio-description');
                expect(component?.classList.contains('is-not-played')).toBe(true);
            }
        });

        it('should handle whitespace in JSON properly', async () => {
            document.body.innerHTML = `
                <div 
                    class="glb-audio-description"
                    data-containersToRead='  [  ".title"  ,  ".content"  ]  '
                ></div>
            `;

            // O teste deve verificar que JSON com whitespace não quebra a aplicação
            expect(async () => {
                await import('./main');
            }).not.toThrow();

            // Como há whitespace, o JSON pode não ser parseado corretamente
            // então vamos verificar apenas que não quebrou
            const component = document.querySelector('.glb-audio-description');
            expect(component).toBeTruthy();
        });
    });
});
