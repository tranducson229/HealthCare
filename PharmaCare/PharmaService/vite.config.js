import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      // Cho phép test PWA khi chạy `npm run dev`
      devOptions: { enabled: true },
      includeAssets: [
        'favicon.svg',
        'favicon-32x32.png',
        'apple-touch-icon.png',
      ],
      manifest: {
        name: 'PharmaService - Quản lý nhà thuốc',
        short_name: 'PharmaService',
        description: 'Ứng dụng quản lý dịch vụ nhà thuốc PharmaCare',
        theme_color: '#0ca678',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        lang: 'vi',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff,woff2}'],
        // Cache runtime cho font-awesome CDN dùng trong index.html
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/cdnjs\.cloudflare\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'cdn-cache',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    // Thuốc đặc trị lỗi "Invalid hook call"
    dedupe: ['react', 'react-dom'],
    alias: {
      react: 'react',
      'react-dom': 'react-dom',
    },
  },
  // Tối ưu hóa để tránh lỗi Recharts
  optimizeDeps: {
    include: ['react', 'react-dom', 'recharts'],
  },
})
