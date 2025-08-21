export interface TextReaderOptions {
    lang?: string;
    rate?: number;
    pitch?: number;
    volume?: number;
}

export class TextReader {
    private utterance: SpeechSynthesisUtterance;
    private selectedVoice: SpeechSynthesisVoice | null = null;
    private voices: SpeechSynthesisVoice[] = [];
    private currentText: string = '';
    private options: TextReaderOptions;
    private delayMs: number = 100;

    constructor(options?: TextReaderOptions) {
        this.utterance = new SpeechSynthesisUtterance();
        this.options = {
            volume: 1,
            lang: 'pt-BR',
            rate: 1,
            ...options,
        };
    }

    private setOptions(options: TextReaderOptions): void {
        this.setVoiceByName();

        if (options.lang) {
            this.setLang(options.lang);
        }
        if (options.rate !== undefined) {
            this.setRate(options.rate);
        }
        if (options.pitch !== undefined) {
            this.setPitch(options.pitch);
        }
        if (options.volume !== undefined) {
            this.setVolume(options.volume);
        }
    }

    public init(callback: () => void): void {
        const loadVoices = () => {
            try {
                this.voices = speechSynthesis.getVoices() || [];

                if (!this.selectedVoice && this.voices.length > 0) {
                    this.selectedVoice = this.voices[0];
                    this.utterance.voice = this.selectedVoice;

                    if (this.options) {
                        this.setOptions(this.options);
                    }
                }
            } catch (error) {
                console.warn('Erro ao carregar vozes:', error);
                this.voices = [];
            }
        };

        speechSynthesis.onvoiceschanged = loadVoices;
        loadVoices();
        callback();
    }

    public listVoices(): SpeechSynthesisVoice[] {
        return this.voices;
    }

    public setVoiceByName(): void {
        const preferredNames = [
            'Google português do Brasil',
            'Microsoft Daniel - Portuguese (Brazil)',
            'Luciana (Portuguese - Brazil)',
        ];

        // Primeiro, tenta encontrar uma voz pelos nomes preferidos
        const preferredVoice =
            preferredNames
                .map((name) => this.voices.find((v) => v.name && v.name.includes(name)))
                .find(Boolean) || null;

        if (preferredVoice) {
            this.selectedVoice = preferredVoice;
            this.utterance.voice = preferredVoice;
        } else {
            const ptBrVoice = this.voices.find((v) => v.lang && v.lang.includes('BR'));

            if (ptBrVoice) {
                this.selectedVoice = ptBrVoice;
                this.utterance.voice = ptBrVoice;
            } else {
                console.warn('Nenhuma voz pt-BR encontrada.');
            }
        }
    }

    public setLang(lang: string): void {
        this.utterance.lang = lang;
    }

    public setRate(rate: number): void {
        this.utterance.rate = rate; // 0.1 a 10 (1 is default)
    }

    public setPitch(pitch: number): void {
        this.utterance.pitch = pitch; // 0 a 2 (1 is default)
    }

    public setVolume(volume: number): void {
        this.utterance.volume = volume; // 0 a 1 (1 is default)
    }

    public readTextFromSelector(selectors: string[]): void {
        try {
            const elements = selectors
                .map((selector) => {
                    try {
                        return document.querySelector(selector);
                    } catch (error) {
                        console.warn(`Seletor inválido: ${selector}`, error);
                        return null;
                    }
                })
                .filter(Boolean) as HTMLElement[];
            let index = 0;

            const speakNext = () => {
                if (index >= elements.length) return;

                const text = elements[index].textContent?.trim();
                if (!text) {
                    index++;
                    speakNext();
                    return;
                }

                this.utterance.onend = () => {
                    index++;
                    setTimeout(speakNext, this.delayMs);
                };

                this.currentText = text;
                this.speakText(this.currentText);
            };

            speakNext();
        } catch (error) {
            console.error('Erro ao processar seletores:', error);
        }
    }

    private speakText(text: string): void {
        try {
            if (!TextReader.isSupported()) {
                console.warn('Speech Synthesis não suportado');
                return;
            }

            if (speechSynthesis.speaking) {
                speechSynthesis.cancel();
            }

            this.utterance.text = text;
            speechSynthesis.speak(this.utterance);
        } catch (error) {
            console.error('Erro na síntese de fala:', error);
        }
    }

    public play(): void {
        if (!this.currentText) {
            console.warn('Nenhum texto carregado. Use readTextFromSelector() primeiro.');
            return;
        }

        this.speakText(this.currentText);
    }

    public pause(): void {
        if (speechSynthesis.speaking && !speechSynthesis.paused) {
            speechSynthesis.pause();
        }
    }

    public resume(): void {
        if (speechSynthesis.paused) {
            speechSynthesis.resume();
        }
    }

    public stop(): void {
        speechSynthesis.cancel();
    }

    public static isSupported(): boolean {
        return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
    }
}
