import { vi, beforeEach } from 'vitest';

// Mock do DOM
Object.defineProperty(window, 'speechSynthesis', {
    writable: true,
    value: {
        speak: vi.fn(),
        cancel: vi.fn(),
        pause: vi.fn(),
        resume: vi.fn(),
        getVoices: vi.fn(() => [
            {
                name: 'Google português do Brasil',
                lang: 'pt-BR',
                default: true,
                localService: true,
                voiceURI: 'Google português do Brasil',
            },
            {
                name: 'Microsoft Daniel - Portuguese (Brazil)',
                lang: 'pt-BR',
                default: false,
                localService: true,
                voiceURI: 'Microsoft Daniel - Portuguese (Brazil)',
            },
            {
                name: 'Luciana (Portuguese - Brazil)',
                lang: 'pt-BR',
                default: false,
                localService: true,
                voiceURI: 'Luciana (Portuguese - Brazil)',
            },
        ]),
        speaking: false,
        paused: false,
        onvoiceschanged: null,
    },
});

Object.defineProperty(window, 'SpeechSynthesisUtterance', {
    writable: true,
    value: vi.fn(() => ({
        text: '',
        lang: 'pt-BR',
        voice: null,
        volume: 1,
        rate: 1,
        pitch: 1,
        onstart: null,
        onend: null,
        onerror: null,
        onpause: null,
        onresume: null,
        onmark: null,
        onboundary: null,
    })),
});

// Setup básico do DOM está sendo feito pelo jsdom configurado no vitest.config.ts
// Apenas precisamos configurar os mocks específicos que não existem no jsdom

// Mock do console para evitar logs desnecessários nos testes
Object.defineProperty(global, 'console', {
    value: {
        ...console,
        warn: vi.fn(),
        error: vi.fn(),
        log: vi.fn(),
    },
});

// Exportar funções utilitárias para os testes
export const mockSpeechSynthesis = window.speechSynthesis;

export function triggerVoicesChanged() {
    if (mockSpeechSynthesis.onvoiceschanged) {
        mockSpeechSynthesis.onvoiceschanged(new Event('voiceschanged'));
    }
}

export function setSpeechState(speaking = false, paused = false) {
    (mockSpeechSynthesis as any).speaking = speaking;
    (mockSpeechSynthesis as any).paused = paused;
}

// Reset mocks before each test
beforeEach(() => {
    vi.clearAllMocks();
    setSpeechState(false, false);

    // Limpar o DOM antes de cada teste
    if (typeof document !== 'undefined' && document.body) {
        document.body.innerHTML = '';

        // Criar elementos de teste padrão
        const testElements = [
            { id: 'test-title', text: 'Test Title' },
            { id: 'test-paragraph', text: 'Test paragraph content' },
            { id: 'test-content', text: 'Test content for reading' },
            { id: 'empty-element', text: '' },
        ];

        testElements.forEach(({ id, text }) => {
            const element = document.createElement('div');
            element.id = id;
            element.textContent = text;
            document.body.appendChild(element);
        });
    }
});
