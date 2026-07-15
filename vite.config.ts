import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";
import { traeBadgePlugin } from 'vite-plugin-trae-solo-badge';
import legacy from "@vitejs/plugin-legacy";

// https://vite.dev/config/
export default defineConfig({
  base:'./',
  build: {
    sourcemap: 'hidden'
  },
  server: {
    port: 5174,
    strictPort: true,
    host: '0.0.0.0',
    watch: {
      usePolling: false,
      ignored: ['**/node_modules/**', '**/.pnpm-store/**', '**/dist/**', '**/api/**']
    }
  },
  plugins: [
    react({
      babel: {
        plugins: [
          'react-dev-locator',
        ],
      },
    }),
    traeBadgePlugin({
      variant: 'dark',
      position: 'bottom-right',
      prodOnly: true,
      clickable: true,
      clickUrl: 'https://www.trae.ai/solo?showJoin=1',
      autoTheme: true,
      autoThemeTarget: '#root'
    }), 
    tsconfigPaths(),
    legacy({
      targets: ["ie>=11"],
      additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
    }),
  ],
})
