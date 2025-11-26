import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
<<<<<<< HEAD
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
})
=======
  base: '/dev/' 
})
>>>>>>> e572cdf62a7bdc38f3a16128d22146777031016b
