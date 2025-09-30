import path from 'path';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    plugins: [react(), tailwindcss(), visualizer({ open: true })],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    base: isProduction ? '/' : '/', // Adjust if deploying under a subpath
    build: {
      target: 'esnext', // Modern browsers
      outDir: 'dist',
      sourcemap: !isProduction, // Enable in dev for debugging
      minify: 'esbuild',
      reportCompressedSize: false,
      emptyOutDir: true, // Clean dist before build
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
        },
      },
      esbuild: {
        drop: isProduction ? ['console', 'debugger'] : [],
      },
    },
    server: {
      port: 5173,
      strictPort: true,
      open: true,
    },
    optimizeDeps: {
      include: ['react', 'react-dom'], // Pre-bundle these deps
    },
  };
});
