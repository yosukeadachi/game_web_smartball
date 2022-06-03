import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/game_web_smartball/',
  server: {
    watch: {
      usePolling: true
    }
  },
  build: {
    assetsInlineLimit: 0,
    chunkSizeWarningLimit:2000,
    rollupOptions: {
      output:{
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      }
    }
  }
})
