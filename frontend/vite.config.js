import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    // Only compress in production
    ...(mode === 'production' ? [
      // Gzip compression
      viteCompression({
        algorithm: 'gzip',
        ext: '.gz',
        threshold: 10240, // Only compress files larger than 10kb
        deleteOriginFile: false,
      }),
      // Brotli compression (better than gzip)
      viteCompression({
        algorithm: 'brotliCompress',
        ext: '.br',
        threshold: 10240,
        deleteOriginFile: false,
      }),
    ] : []),
  ],

  build: {
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
    },

    // Optimize chunk size
    rollupOptions: {
      output: {
        // Manual chunks using function for rolldown-vite compatibility
        manualChunks(id) {
          // Vendor chunks for better caching
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor'
            }
            if (id.includes('firebase')) {
              return 'firebase-vendor'
            }
            // Other node_modules go to vendor chunk
            return 'vendor'
          }
        },
        // Optimize chunk file names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },

    // Chunk size warnings
    chunkSizeWarningLimit: 1000,

    // Enable CSS code splitting
    cssCodeSplit: true,

    // Source maps for debugging (disable in production for smaller size)
    sourcemap: false,

    // Optimize assets
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb
  },

  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },

  // Server configuration for development
  server: {
    port: 5173,
    strictPort: false,
    host: true,
  },
}))
