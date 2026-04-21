import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/',
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'aram.',
        short_name: 'aram.',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone',
        icons: [
          {
            src: '/src/assets/favicon.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/src/assets/favicon.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})