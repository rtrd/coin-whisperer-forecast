import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 3000,
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
        // manualChunks: (id) => {
        //   // React core
        //   if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
        //     return 'react-vendor';
        //   }
        //   // Router
        //   if (id.includes('react-router-dom')) {
        //     return 'router';
        //   }
        //   // UI components
        //   if (id.includes('@radix-ui/') || id.includes('node_modules/cmdk') || id.includes('node_modules/vaul')) {
        //     return 'ui-components';
        //   }
        //   // Charts and visualization
        //   if (id.includes('recharts') || id.includes('d3-')) {
        //     return 'charts';
        //   }
        //   // Utils and helpers
        //   if (id.includes('clsx') || id.includes('tailwind-merge') || id.includes('class-variance-authority') || id.includes('date-fns')) {
        //     return 'utils';
        //   }
        //   // Query and data
        //   if (id.includes('@tanstack/react-query')) {
        //     return 'query';
        //   }
        //   // Heavy third-party libs
        //   if (id.includes('node_modules/') && !id.includes('react')) {
        //     return 'vendor';
        //   }
        // },
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
      'class-variance-authority'
    ],
    exclude: ['@vite/client', '@vite/env']
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
