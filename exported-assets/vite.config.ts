# Vite Configuration

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Path resolution
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@/components': resolve(__dirname, 'src/components'),
      '@/pages': resolve(__dirname, 'src/pages'),
      '@/layouts': resolve(__dirname, 'src/layouts'),
      '@/contexts': resolve(__dirname, 'src/contexts'),
      '@/hooks': resolve(__dirname, 'src/hooks'),
      '@/utils': resolve(__dirname, 'src/utils'),
      '@/types': resolve(__dirname, 'src/types'),
      '@/assets': resolve(__dirname, 'src/assets'),
    },
  },

  // Development server configuration
  server: {
    host: true,
    port: 3000,
    open: true,
    cors: true,
  },

  // Build configuration
  build: {
    target: 'esnext',
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'vendor-react': ['react', 'react-dom'],
          'vendor-solana': [
            '@solana/wallet-adapter-react',
            '@solana/wallet-adapter-react-ui',
            '@solana/wallet-adapter-wallets',
            '@solana/web3.js'
          ],
          'vendor-routing': ['react-router-dom'],
          'vendor-ui': ['framer-motion', '@heroicons/react'],
          'vendor-utils': ['date-fns', 'clsx'],
          
          // App chunks
          'app-components': [
            './src/components/ui',
            './src/components/layout',
            './src/components/voice',
            './src/components/dashboard'
          ],
          'app-contexts': [
            './src/contexts/AppStateContext',
            './src/contexts/VoiceContext',
            './src/contexts/ThemeContext'
          ]
        }
      }
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },

  // Environment variables
  define: {
    __DEV__: process.env.NODE_ENV === 'development',
    __PROD__: process.env.NODE_ENV === 'production',
  },

  // CSS configuration
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      css: {
        charset: false,
      },
    },
  },

  // Optimization
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@solana/wallet-adapter-react',
      '@solana/wallet-adapter-react-ui',
      '@solana/web3.js',
      'framer-motion',
      '@heroicons/react/24/outline',
      '@heroicons/react/24/solid',
      'date-fns',
      'clsx'
    ],
    exclude: [
      '@solana/wallet-adapter-phantom',
      '@solana/wallet-adapter-solflare'
    ]
  },

  // Preview configuration
  preview: {
    port: 3000,
    strictPort: true,
    open: true,
  },

  // Performance configuration
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
})
```