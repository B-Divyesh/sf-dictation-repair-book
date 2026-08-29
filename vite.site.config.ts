import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  root: 'site',
  publicDir: '../public',
  build: {
    outDir: '../dist/site',
    emptyOutDir: true,
    target: 'es2022',
    sourcemap: true,
    rollupOptions: {
      input: {
        index: resolve(process.cwd(), 'site/index.html'),
        demo: resolve(process.cwd(), 'site/demo/index.html'),
        notFound: resolve(process.cwd(), 'site/404.html'),
        privacy: resolve(process.cwd(), 'site/privacy/index.html'),
        terms: resolve(process.cwd(), 'site/terms/index.html')
      }
    }
  },
  server: { port: 4173, strictPort: true }
});
