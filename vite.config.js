import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy /RRService/* requests to the real API during development to avoid CORS
    proxy: {
      '/RRService': {
        target: 'https://radar.Giftologygroup.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  base: '/dev/' // Set base path for hosting under /dev/
})
