import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
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
    tsconfigPaths()
  ],
})
