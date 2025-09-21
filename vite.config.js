import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/main.jsx'
            ],
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': '/resources/js/src',
        },
    },
    server: {
        host: 'localhost',
        port: 5173,
        hmr: {
            host: 'localhost',
            port: 5173,
        },
        cors: true,
        proxy: {
            // Proxy API requests to Laravel during development
            '/api': {
                target: 'http://localhost:8000',
                changeOrigin: true,
                secure: false,
            },
            '/sanctum': {
                target: 'http://localhost:8000',
                changeOrigin: true,
                secure: false,
            },
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    router: ['react-router-dom'],
                    bootstrap: ['bootstrap'],
                    axios: ['axios'],
                },
            },
        },
    },
});
