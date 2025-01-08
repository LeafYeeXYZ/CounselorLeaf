import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          'live2d': ['oh-my-live2d'],
          'antd': ['antd', '@ant-design/x', '@ant-design/icons'],
        },
      },
    },
  },
})
