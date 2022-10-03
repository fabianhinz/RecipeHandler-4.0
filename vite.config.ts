import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import svgrPlugin from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    USE_EMULATORS: JSON.stringify('---fix-me---'),
    VERSION: JSON.stringify('---fix-me---'),
  },
  build: {
    sourcemap: true,
  },
  plugins: [
    react(),
    svgrPlugin(),
    tsconfigPaths(),
    VitePWA({
      registerType: 'prompt',
      devOptions: {
        enabled: true,
      },
      manifest: {
        short_name: 'RH 4.0',
        name: 'RecipeHandler 4.0',
        icons: [
          {
            src: 'logo192.png',
            type: 'image/png',
            sizes: '192x192',
          },
          {
            src: 'logo512.png',
            type: 'image/png',
            sizes: '512x512',
          },
        ],
        start_url: '.',
        display: 'standalone',
        theme_color: '#FFFFFF',
        background_color: '#FAFAFA',
        orientation: 'any',
      },
    }),
  ],
})
