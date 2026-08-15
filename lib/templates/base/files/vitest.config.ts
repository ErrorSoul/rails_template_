import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'

// Без vite-plugin-ruby намеренно: он переставляет root на sourceCodeDir и base на
// /vite-dev/, после чего include-глобы и setupFiles резолвились бы от app/frontend,
// а не от корня проекта. Поэтому алиасы, которые обычно даёт плагин, прописаны руками.
const frontend = resolve(import.meta.dirname, 'app/frontend')

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '~/': `${frontend}/`,
      '@/': `${frontend}/`,
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./app/frontend/ds/test/setup.ts'],
    include: ['app/frontend/**/*.{test,spec}.{ts,tsx}'],
  },
})
