import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: "./postcss.config.js",
  },
  server: {
    port: 3006,
    open: true,
  },
  build: {
    outDir: "dist",
    sourcemap: false, // Production'da sourcemap kapalı (performans için)
    minify: "esbuild", // Esbuild kullan (hızlı ve etkili)
    // Terser kullanmak istersen: npm install -D terser
    // minify: "terser",
    // terserOptions: {
    //   compress: {
    //     drop_console: true,
    //     drop_debugger: true,
    //   },
    // },
    cssCodeSplit: true, // CSS'i ayrı dosyalara böl (code splitting)
    cssMinify: true, // CSS'i minify et
    // Tree shaking için
    target: "esnext",
    // Modern output
    modulePreload: {
      polyfill: true,
    },
    rollupOptions: {
      output: {
        // Code splitting - vendor ve app kodlarını ayır
        manualChunks: (id) => {
          // Node modules'ü vendor chunk'a ayır
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react';
            }
            if (id.includes('framer-motion')) {
              return 'vendor-animations';
            }
            if (id.includes('i18next') || id.includes('react-i18next')) {
              return 'vendor-i18n';
            }
            return 'vendor';
          }
        },
        // CSS dosyalarını optimize et
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'assets/css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
        // Entry chunk names
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',
      },
    },
    // Chunk size optimizasyonu
    chunkSizeWarningLimit: 1000,
    // Asset inline threshold (küçük dosyaları inline yap)
    assetsInlineLimit: 4096, // 4KB altındaki dosyalar inline
    // Report compressed size
    reportCompressedSize: false, // Build hızını artırır
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom", "framer-motion"],
  },
});
