/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/test/setup.ts'],
        include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
        coverage: {
            reporter: ['text', 'json', 'html'],
            exclude: ['node_modules/', 'src/test/', '**/*.d.ts', '**/*.config.*', '**/coverage/**'],
        },
        testTimeout: 10000,
        hookTimeout: 10000,
    },
});
