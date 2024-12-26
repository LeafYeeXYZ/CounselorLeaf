import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022',
    outDir: 'dist-web',
    rollupOptions: {
      output: {
        manualChunks: {
          'live2d': ['oh-my-live2d'],
        },
      },
    },
  },
  publicDir: 'public-web',
})
