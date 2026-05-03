import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'AI Travel Planner',
        short_name: 'AI-Travel',
        description: 'AI-powered travel planner that creates personalized itineraries',
        theme_color: '#3b82f6',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {}
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  // ========== ADD THIS BUILD SECTION ==========
  build: {
    // Increase chunk size limit to avoid warnings
    chunkSizeWarningLimit: 2000,
    
    // Configure rollup options
    rollupOptions: {
      // Suppress specific warnings during build
      onwarn(warning, warn) {
        // Ignore module directive warnings
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
        
        // Ignore deprecation warnings from third-party packages
        if (warning.message && warning.message.includes('deprecated')) return;
        
        // Ignore sourcemap warnings
        if (warning.message && warning.message.includes('sourcemap')) return;
        
        // Ignore node-domexception warnings
        if (warning.message && warning.message.includes('node-domexception')) return;
        
        // Ignore glob warnings
        if (warning.message && warning.message.includes('glob')) return;
        
        // Ignore chunk size warnings (we increased the limit above)
        if (warning.message && warning.message.includes('chunk size')) return;
        
        // Show all other warnings
        warn(warning);
      }
    },
    
    // Optimize chunk splitting (optional - reduces bundle size)
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries into separate chunks
          vendor: ['react', 'react-dom', 'react-router-dom'],
          firebase: ['firebase'],
          ui: ['sonner', 'lucide-react', '@react-google-maps/api'],
        }
      }
    }
  },
  // ========== END OF BUILD SECTION ==========
})