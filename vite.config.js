
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
      '/api/KEAP': {
        target: 'https://radar.giftologygroup.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => {
          // Remove /api/KEAP prefix and keep the rest
          return path.replace(/^\/api\/KEAP/, '/api/KEAP');
        },
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, res) => {
            console.log('Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Proxying request:', req.method, req.url, '->', proxyReq.path);
          });
        },
      },
    },
  },
  base: '/dev/' // Set base path for hosting under /dev/
})
