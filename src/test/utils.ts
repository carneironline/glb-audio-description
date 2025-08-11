import { vi } from 'vitest';
import { TextReader } from '../glb-audio-description/SpeechSynthesisUtterance';
import type { TextReaderOptions } from '../glb-audio-description/SpeechSynthesisUtterance';

/**
 * Utilitários para testes do TextReader
 */

export const createTestTextReader = (options?: TextReaderOptions): TextReader => {
    return new TextReader(options);
};

// Helper para criar elementos de teste com data-containersToRead
export const createTestElementWithDataAttr = (
    id: string,
    content: string,
    selectors: string[],
    tag: string = 'div'
): HTMLElement => {
    const element = document.createElement(tag);
    element.id = id;
    element.textContent = content;
    document.body.appendChild(element);

    // Criar componente de áudio descrição correspondente
    const audioComponent = document.createElement('div');
    audioComponent.className = 'glb-audio-description';
    audioComponent.setAttribute('data-containersToRead', JSON.stringify(selectors));
    document.body.appendChild(audioComponent);

    return element;
};

// Helper para criar componente de áudio descrição com configuração
export const createAudioDescriptionComponent = (
    selectors: string[],
    className: string = 'glb-audio-description'
): HTMLElement => {
    const component = document.createElement('div');
    component.className = className;
    component.setAttribute('data-containersToRead', JSON.stringify(selectors));
    document.body.appendChild(component);
    return component;
};

// Helper para criar cenário completo com múltiplos componentes
export const createMultiComponentScenario = (): void => {
    const container = document.createElement('div');
    container.innerHTML = `
        <!-- Header section -->
        <header>
            <h1 class="page-title">Main Page Title</h1>
            <nav class="breadcrumb">Home > Section > Page</nav>
            <div 
                class="glb-audio-description header-audio"
                data-containersToRead='[".page-title", ".breadcrumb"]'
            ></div>
        </header>

        <!-- Main content -->
        <main>
            <article>
                <h2 class="article-title">Article Title</h2>
                <p class="article-lead">Lead paragraph with important information.</p>
                <div class="article-content">
                    <p>First paragraph of content.</p>
                    <p>Second paragraph of content.</p>
                </div>
                <div 
                    class="glb-audio-description content-audio"
                    data-containersToRead='[".article-title", ".article-lead", ".article-content p"]'
                ></div>
            </article>
        </main>

        <!-- Sidebar -->
        <aside>
            <h3 class="sidebar-title">Related Content</h3>
            <ul class="related-links">
                <li><a href="#">Related Link 1</a></li>
                <li><a href="#">Related Link 2</a></li>
            </ul>
            <div 
                class="glb-audio-description sidebar-audio"
                data-containersToRead='[".sidebar-title", ".related-links"]'
            ></div>
        </aside>
    `;
    document.body.appendChild(container);
};

// Helper para testar parsing de data attributes
export const testDataAttributeParsing = (
    dataValue: string,
    expectedResult?: string[] | null
): { success: boolean; result?: string[]; error?: Error } => {
    try {
        const element = document.createElement('div');
        element.setAttribute('data-containersToRead', dataValue);

        const containers = element.dataset.containerstoread;
        if (!containers) {
            return { success: false, result: undefined };
        }

        const parsed = JSON.parse(containers);

        if (expectedResult) {
            const matches = JSON.stringify(parsed) === JSON.stringify(expectedResult);
            return { success: matches, result: parsed };
        }

        return { success: true, result: parsed };
    } catch (error) {
        return { success: false, error: error as Error };
    }
};

// Helper para simular configuração realística do O Globo
export const createGloboArticleScenario = (): void => {
    const container = document.createElement('div');
    container.innerHTML = `
        <article class="materia">
            <header class="materia-header">
                <h1 class="materia-titulo">Título da Matéria do O Globo</h1>
                <h2 class="materia-subtitulo">Subtítulo explicativo da matéria</h2>
                <div class="materia-meta">
                    <span class="autor">Por Jornalista</span>
                    <time class="data">10/08/2025</time>
                </div>
            </header>

            <div class="materia-corpo">
                <p class="materia-lead">Lead da matéria com as informações principais.</p>
                <div class="materia-texto">
                    <p>Primeiro parágrafo do texto da matéria.</p>
                    <p>Segundo parágrafo com desenvolvimento da notícia.</p>
                    <p>Terceiro parágrafo com conclusão.</p>
                </div>
            </div>

            <!-- Componente de áudio descrição configurado para O Globo -->
            <div 
                class="glb-audio-description"
                data-containersToRead='[".materia-titulo", ".materia-subtitulo", ".materia-lead", ".materia-texto p"]'
            ></div>
        </article>
    `;
    document.body.appendChild(container);
};

// Helper para validar seletores CSS
export const validateCSSSelectors = (selectors: string[]): boolean => {
    return selectors.every((selector) => {
        try {
            document.querySelector(selector);
            return true;
        } catch {
            return false;
        }
    });
};

// Helper para simular interação com componente
export const simulateComponentInteraction = async (
    componentClass: string = 'glb-audio-description'
): Promise<{
    component: HTMLElement | null;
    playButton: HTMLElement | null;
    stopButton: HTMLElement | null;
}> => {
    const component = document.querySelector(`.${componentClass}`) as HTMLElement;

    if (!component) {
        return { component: null, playButton: null, stopButton: null };
    }

    // Simular criação dos botões (como faria o main.ts)
    component.innerHTML = `
        <button class="glb-audio-description__button glb-audio-description__play">
            <i class="glb-audio-description__play-icon" data-lucide="play"></i>
            <i class="glb-audio-description__pause-icon" data-lucide="pause"></i>
        </button>
        <button class="glb-audio-description__button glb-audio-description__stop">
            <i class="glb-audio-description__stop-icon" data-lucide="square"></i>
        </button>
    `;

    const playButton = component.querySelector('.glb-audio-description__play') as HTMLElement;
    const stopButton = component.querySelector('.glb-audio-description__stop') as HTMLElement;

    return { component, playButton, stopButton };
};

// Helper para configurações de teste para data attributes
export const createDataAttributeTestConfig = (): {
    validConfigs: Array<{ selectors: string[]; description: string }>;
    invalidConfigs: Array<{ data: string; description: string }>;
} => {
    return {
        validConfigs: [
            {
                selectors: ['.title'],
                description: 'single selector',
            },
            {
                selectors: ['.title', '.subtitle', '.content'],
                description: 'multiple selectors',
            },
            {
                selectors: ['#main-title', '.article-body p', '.footer'],
                description: 'mixed ID and class selectors',
            },
            {
                selectors: ['.content[data-type="article"]', '.sidebar ul li'],
                description: 'complex selectors with attributes',
            },
        ],
        invalidConfigs: [
            {
                data: 'invalid json',
                description: 'invalid JSON string',
            },
            {
                data: '{"invalid": "object"}',
                description: 'object instead of array',
            },
            {
                data: '"string instead of array"',
                description: 'string instead of array',
            },
            {
                data: '[1, 2, 3]',
                description: 'array of numbers instead of strings',
            },
        ],
    };
};

// Helper para criar elementos DOM para teste
export const createTestElement = (id: string, content: string, tag: string = 'div'): HTMLElement => {
    const element = document.createElement(tag);
    element.id = id;
    element.textContent = content;
    document.body.appendChild(element);
    return element;
};

// Helper para criar múltiplos elementos de teste
export const createTestElements = (
    elements: Array<{ id: string; content: string; tag?: string }>
): HTMLElement[] => {
    return elements.map(({ id, content, tag = 'div' }) => createTestElement(id, content, tag));
};

// Helper para limpar DOM
export const cleanupDOM = (): void => {
    document.body.innerHTML = '';
};

// Helper para criar conteúdo de artigo de teste
export const createArticleContent = (): void => {
    const article = document.createElement('article');
    article.innerHTML = `
    <header>
      <h1 id="article-title">Título do Artigo</h1>
      <p id="article-subtitle">Subtítulo explicativo</p>
      <div id="article-meta">Por Autor, Data</div>
    </header>
    <main>
      <p id="article-lead">Lead do artigo com informações principais.</p>
      <p id="article-body-1">Primeiro parágrafo do conteúdo.</p>
      <p id="article-body-2">Segundo parágrafo do conteúdo.</p>
      <p id="article-conclusion">Conclusão do artigo.</p>
    </main>
  `;
    document.body.appendChild(article);
};

// Helper para criar formulário de teste
export const createFormContent = (): void => {
    const form = document.createElement('form');
    form.innerHTML = `
    <fieldset>
      <legend id="form-legend">Formulário de Teste</legend>
      <label id="name-label">Nome: <input type="text" id="name-input"></label>
      <label id="email-label">Email: <input type="email" id="email-input"></label>
      <label id="message-label">Mensagem: <textarea id="message-input"></textarea></label>
      <button type="submit" id="submit-button">Enviar</button>
    </fieldset>
  `;
    document.body.appendChild(form);
};

// Helper para simular delay com fake timers
export const simulateDelay = async (ms: number): Promise<void> => {
    if (vi.isFakeTimers()) {
        vi.advanceTimersByTime(ms);
    } else {
        await new Promise((resolve) => setTimeout(resolve, ms));
    }
};

// Helper para simular sequência de fala completa
export const simulateSpeechSequence = async (
    textReader: TextReader,
    selectors: string[],
    delayBetween: number = 500
): Promise<void> => {
    textReader.readTextFromSelector(selectors);

    // Simular cada elemento sendo lido
    const mockUtterance = new (window as any).SpeechSynthesisUtterance();

    for (let i = 0; i < selectors.length; i++) {
        if (mockUtterance.onend) {
            mockUtterance.onend();
        }
        await simulateDelay(delayBetween);
    }
};

// Helper para verificar se elemento existe e tem conteúdo
export const hasValidContent = (selector: string): boolean => {
    const element = document.querySelector(selector);
    return element !== null && (element.textContent?.trim().length ?? 0) > 0;
};

// Helper para criar cenário de teste complexo
export const createComplexScenario = (): void => {
    const container = document.createElement('div');
    container.innerHTML = `
    <nav id="nav-menu">
      <ul>
        <li><a href="#section1">Seção 1</a></li>
        <li><a href="#section2">Seção 2</a></li>
        <li><a href="#section3">Seção 3</a></li>
      </ul>
    </nav>
    
    <main>
      <section id="section1">
        <h2>Primeira Seção</h2>
        <p>Conteúdo da primeira seção.</p>
        <div id="nested-content">
          <p>Conteúdo aninhado.</p>
          <span>Texto em span.</span>
        </div>
      </section>
      
      <section id="section2">
        <h2>Segunda Seção</h2>
        <table id="data-table">
          <caption>Tabela de Dados</caption>
          <tr><th>Coluna 1</th><th>Coluna 2</th></tr>
          <tr><td>Dado 1</td><td>Dado 2</td></tr>
        </table>
      </section>
      
      <section id="section3">
        <h2>Terceira Seção</h2>
        <blockquote id="quote">
          "Esta é uma citação importante para o contexto."
        </blockquote>
        <p id="empty-paragraph"></p>
        <p id="whitespace-paragraph">   </p>
      </section>
    </main>
    
    <aside id="sidebar">
      <h3>Conteúdo Relacionado</h3>
      <ul>
        <li>Link relacionado 1</li>
        <li>Link relacionado 2</li>
      </ul>
    </aside>
  `;
    document.body.appendChild(container);
};

// Helper para configurações de acessibilidade
export const createUserWorkflowConfig = (): TextReaderOptions => ({
    lang: 'pt-BR',
    rate: 1.2,
    pitch: 1,
    volume: 1,
});

// Helper para configurações de velocidade
export const createSpeedOptions = (): TextReaderOptions => ({
    lang: 'pt-BR',
    rate: 1.5,
    pitch: 1.0,
    volume: 0.9,
});

// Helper para aguardar inicialização
export const waitForInitialization = (textReader: TextReader): Promise<void> => {
    return new Promise((resolve) => {
        textReader.init(() => resolve());
    });
};

// Helper para verificar estado do speech synthesis
export const getSpeechState = () => ({
    speaking: window.speechSynthesis.speaking,
    paused: window.speechSynthesis.paused,
    pending: window.speechSynthesis.pending,
});

// Helper para criar teste de performance
export const measurePerformance = async <T>(
    operation: () => T | Promise<T>,
    label: string = 'Operation'
): Promise<{ result: T; duration: number }> => {
    const start = performance.now();
    const result = await operation();
    const end = performance.now();
    const duration = end - start;

    console.log(`${label} took ${duration.toFixed(2)}ms`);

    return { result, duration };
};

// Helper para criar elementos com texto longo
export const createLongTextElement = (id: string, wordCount: number = 1000): HTMLElement => {
    const words = [
        'lorem',
        'ipsum',
        'dolor',
        'sit',
        'amet',
        'consectetur',
        'adipiscing',
        'elit',
        'sed',
        'do',
        'eiusmod',
        'tempor',
        'incididunt',
        'ut',
        'labore',
        'et',
        'dolore',
        'magna',
        'aliqua',
        'enim',
        'ad',
        'minim',
        'veniam',
        'quis',
        'nostrud',
    ];

    const text = Array.from({ length: wordCount }, (_, i) => words[i % words.length]).join(' ');

    return createTestElement(id, text);
};

// Helper para simular diferentes navegadores
export const mockBrowserVoices = (browser: 'chrome' | 'firefox' | 'safari' | 'edge') => {
    const mockSpeechSynthesis = window.speechSynthesis as any;

    switch (browser) {
        case 'chrome':
            mockSpeechSynthesis.getVoices.mockReturnValue([
                {
                    name: 'Google português do Brasil',
                    lang: 'pt-BR',
                    voiceURI: 'Google português do Brasil',
                    default: false,
                    localService: false,
                },
                {
                    name: 'Google US English',
                    lang: 'en-US',
                    voiceURI: 'Google US English',
                    default: false,
                    localService: false,
                },
            ]);
            break;

        case 'firefox':
            mockSpeechSynthesis.getVoices.mockReturnValue([
                {
                    name: 'Microsoft Helena - Portuguese (Brazil)',
                    lang: 'pt-BR',
                    voiceURI: 'urn:moz-tts:sapi:Microsoft Helena - Portuguese (Brazil)?pt-BR',
                    default: true,
                    localService: true,
                },
            ]);
            break;

        case 'safari':
            mockSpeechSynthesis.getVoices.mockReturnValue([
                {
                    name: 'Luciana',
                    lang: 'pt-BR',
                    voiceURI: 'com.apple.ttsbundle.Luciana-compact',
                    default: true,
                    localService: true,
                },
            ]);
            break;

        case 'edge':
            mockSpeechSynthesis.getVoices.mockReturnValue([
                {
                    name: 'Microsoft Daniel - Portuguese (Brazil)',
                    lang: 'pt-BR',
                    voiceURI: 'Microsoft Daniel - Portuguese (Brazil)',
                    default: false,
                    localService: true,
                },
            ]);
            break;
    }
};

// Helper para criar cenário de erro
export const createErrorScenario = (errorType: 'speak' | 'cancel' | 'pause' | 'resume' | 'getVoices') => {
    const mockSpeechSynthesis = window.speechSynthesis as any;

    const errorMessage = `Mock error in ${errorType}`;
    const throwError = () => {
        throw new Error(errorMessage);
    };

    switch (errorType) {
        case 'speak':
            mockSpeechSynthesis.speak.mockImplementation(throwError);
            break;
        case 'cancel':
            mockSpeechSynthesis.cancel.mockImplementation(throwError);
            break;
        case 'pause':
            mockSpeechSynthesis.pause.mockImplementation(throwError);
            break;
        case 'resume':
            mockSpeechSynthesis.resume.mockImplementation(throwError);
            break;
        case 'getVoices':
            mockSpeechSynthesis.getVoices.mockImplementation(throwError);
            break;
    }
};

// Export all utilities
export {
    // Re-export from setup for convenience
    triggerVoicesChanged,
    setSpeechState,
    mockSpeechSynthesis,
} from './setup';
