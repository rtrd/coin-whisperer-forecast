import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React core - highest priority
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react-vendor';
          }
          
          // Router - critical for navigation
          if (id.includes('react-router-dom')) {
            return 'router';
          }
          
          // React Query - data layer
          if (id.includes('@tanstack/react-query')) {
            return 'query';
          }
          
          // Core UI components - frequently used
          if (id.includes('@radix-ui/react-dialog') || 
              id.includes('@radix-ui/react-popover') || 
              id.includes('@radix-ui/react-tooltip') ||
              id.includes('@radix-ui/react-dropdown-menu')) {
            return 'ui-core';
          }
          
          // Form and input components
          if (id.includes('@radix-ui/react-select') || 
              id.includes('@radix-ui/react-checkbox') || 
              id.includes('@radix-ui/react-radio-group') ||
              id.includes('react-hook-form') ||
              id.includes('@hookform/resolvers')) {
            return 'ui-forms';
          }
          
          // Other UI components
          if (id.includes('@radix-ui/') || id.includes('node_modules/cmdk') || id.includes('node_modules/vaul')) {
            return 'ui-components';
          }
          
          // Charts and visualization - heavy, load separately
          if (id.includes('recharts') || id.includes('d3-')) {
            return 'charts';
          }
          
          // Helmet and SEO
          if (id.includes('react-helmet') || id.includes('helmet')) {
            return 'seo';
          }
          
          // Utils and styling helpers
          if (id.includes('clsx') || 
              id.includes('tailwind-merge') || 
              id.includes('class-variance-authority') || 
              id.includes('tailwindcss')) {
            return 'styling';
          }
          
          // Date and time utilities
          if (id.includes('date-fns')) {
            return 'date-utils';
          }
          
          // Performance and web vitals
          if (id.includes('web-vitals')) {
            return 'performance';
          }
          
          // Analytics and tracking
          if (id.includes('gtag') || id.includes('analytics')) {
            return 'analytics';
          }
          
          // Heavy third-party libs
          if (id.includes('node_modules/') && !id.includes('react')) {
            return 'vendor';
          }
        },
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
          return `js/[name]-[hash].js`;
        },
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'css/[name]-[hash].css';
          }
          return 'assets/[name]-[hash][extname]';
        }
      },
      external: (id) => {
        // Don't bundle these if they're not needed
        return false;
      }
    },
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    assetsInlineLimit: 4096
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      '@tanstack/react-query',
      'clsx',
      'tailwind-merge',
      'class-variance-authority',
      'react-helmet-async',
      'web-vitals',
      'lucide-react'
    ],
    exclude: ['@vite/client', '@vite/env'],
    force: true
  },
  esbuild: {
    target: 'esnext',
    platform: 'browser',
    treeShaking: true,
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true
  }
}));
