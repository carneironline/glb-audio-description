/// <reference types="vitest/globals" />
/// <reference types="jsdom" />

// Extend global window with speech synthesis types for testing
declare global {
    interface Window {
        speechSynthesis: SpeechSynthesis;
        SpeechSynthesisUtterance: typeof SpeechSynthesisUtterance;
    }
}

// Custom matchers and test utilities
declare module 'vitest' {
    interface TestContext {
        textReader?: import('../glb-audio-description/SpeechSynthesisUtterance').TextReader;
    }
}

export {};
