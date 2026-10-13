import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Any request starting with /api will be forwarded to the backend
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        // Strip the /api prefix before forwarding to backend
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
