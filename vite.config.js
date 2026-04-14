import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ⚠️  Change 'upi-qr-generator' to your exact GitHub repo name if different
export default defineConfig({
  plugins: [react()],
  base: '/UPIQRGenerator/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})
