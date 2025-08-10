import { vi } from 'vitest';

// Mock da Web Speech API
const mockSpeechSynthesis = {
    speaking: false,
    paused: false,
    pending: false,
    speak: vi.fn(),
    cancel: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    getVoices: vi.fn(() => [
        {
            name: 'Google português do Brasil',
            lang: 'pt-BR',
            voiceURI: 'Google português do Brasil',
            default: true,
            localService: false,
        },
        {
            name: 'Microsoft Daniel - Portuguese (Brazil)',
            lang: 'pt-BR',
            voiceURI: 'Microsoft Daniel - Portuguese (Brazil)',
            default: false,
            localService: true,
        },
    ]),
    onvoiceschanged: null as (() => void) | null,
};

const mockSpeechSynthesisUtterance = vi.fn().mockImplementation(() => ({
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
}));

// Adicionar ao objeto global
Object.defineProperty(window, 'speechSynthesis', {
    writable: true,
    value: mockSpeechSynthesis,
});

Object.defineProperty(window, 'SpeechSynthesisUtterance', {
    writable: true,
    value: mockSpeechSynthesisUtterance,
});

// Mock do DOM para elementos de teste
beforeEach(() => {
    document.body.innerHTML = '';

    // Criar elementos de teste padrão
    const testElements = [
        { id: 'test-title', content: 'Título de Teste' },
        { id: 'test-paragraph', content: 'Este é um parágrafo de teste para síntese de voz.' },
        { id: 'test-content', content: 'Conteúdo adicional para teste.' },
        { id: 'empty-element', content: '' },
    ];

    testElements.forEach(({ id, content }) => {
        const element = document.createElement('div');
        element.id = id;
        element.textContent = content;
        document.body.appendChild(element);
    });

    // Reset dos mocks
    vi.clearAllMocks();
    mockSpeechSynthesis.speaking = false;
    mockSpeechSynthesis.paused = false;
    mockSpeechSynthesis.pending = false;

    // Restaurar implementações padrão
    mockSpeechSynthesis.getVoices.mockReturnValue([
        {
            name: 'Google português do Brasil',
            lang: 'pt-BR',
            voiceURI: 'Google português do Brasil',
            default: true,
            localService: false,
        },
        {
            name: 'Microsoft Daniel - Portuguese (Brazil)',
            lang: 'pt-BR',
            voiceURI: 'Microsoft Daniel - Portuguese (Brazil)',
            default: false,
            localService: true,
        },
    ]);

    mockSpeechSynthesis.speak.mockImplementation(() => {});
    mockSpeechSynthesis.cancel.mockImplementation(() => {});
    mockSpeechSynthesis.pause.mockImplementation(() => {});
    mockSpeechSynthesis.resume.mockImplementation(() => {});
});

// Função helper para simular mudança de vozes
export const triggerVoicesChanged = () => {
    if (mockSpeechSynthesis.onvoiceschanged && typeof mockSpeechSynthesis.onvoiceschanged === 'function') {
        mockSpeechSynthesis.onvoiceschanged();
    }
};

// Função helper para simular fim de fala
export const triggerSpeechEnd = (utterance: any) => {
    if (utterance && utterance.onend) {
        utterance.onend();
    }
};

// Função helper para simular estados de fala
export const setSpeechState = (speaking: boolean, paused: boolean = false) => {
    mockSpeechSynthesis.speaking = speaking;
    mockSpeechSynthesis.paused = paused;
};

// Exportar mocks para uso nos testes
export { mockSpeechSynthesis, mockSpeechSynthesisUtterance };
