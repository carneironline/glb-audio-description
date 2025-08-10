import { vi } from 'vitest';
import { TextReader } from '../glb-audio-description/SpeechSynthesisUtterance';
import type { TextReaderOptions } from '../glb-audio-description/SpeechSynthesisUtterance';

/**
 * Utilitários para testes do TextReader
 */

export const createTestTextReader = (options?: TextReaderOptions): TextReader => {
    return new TextReader(options);
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
