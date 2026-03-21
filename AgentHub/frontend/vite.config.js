import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    port: process.env.PORT || 5173,
    host:true,
    allowedHosts: ['chic-enthusiasm-production-93d0.up.railway.app', 'all']
  }
})

/*
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist'   // ✅ make sure this is 'dist'
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',  // your backend port
        changeOrigin: true
      }
    }
  }
})
*/