import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
    const isLib = mode === 'lib';

    if (isLib) {
        // Configuração para build de biblioteca
        return {
            build: {
                lib: {
                    entry: 'src/glb-audio-description/index.ts',
                    name: 'GlbAudioDescription',
                    fileName: 'index',
                    formats: ['es'],
                },
                rollupOptions: {
                    external: ['lucide'],
                    output: {
                        globals: {
                            lucide: 'Lucide',
                        },
                        assetFileNames: (assetInfo) => {
                            if (assetInfo.name?.endsWith('.css')) return 'style.css';
                            return assetInfo.name || '';
                        },
                    },
                },
                outDir: 'dist',
                emptyOutDir: true,
                copyPublicDir: false,
            },
            esbuild: {
                target: 'es2022',
            },
        };
    }

    // Configuração padrão para desenvolvimento
    return {
        build: {
            outDir: 'dist-demo',
        },
    };
});
