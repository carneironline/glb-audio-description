import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['src/test/setup.ts'],
        include: ['src/glb-audio-description/**/*.test.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            include: ['src/glb-audio-description/**/*.ts'],
            exclude: ['node_modules/', 'src/test/', '**/*.test.ts', 'src/main.ts', 'dist/', 'src/style.css'],
        },
    },
});
