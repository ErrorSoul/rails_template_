import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Алиасы `@/` и `~/` (оба → app/frontend) добавляет сам vite-plugin-ruby,
// прописывать их здесь не нужно. Всё остальное — sourceCodeDir, порт,
// выходной каталог — читается из config/vite.json.
//
// Конфиг тестов живёт отдельно, в vitest.config.ts: RubyPlugin переставляет
// root на app/frontend, и общий конфиг увёл бы пути тестов вместе с ним.
export default defineConfig({
  plugins: [RubyPlugin(), react(), tailwindcss()],
  server: {
    // Vite проверяет заголовок Host (защита от DNS-rebinding) и на незнакомый отвечает
    // 403 «Blocked request. This host is not allowed». В докере Rails ходит в dev-сервер
    // по имени compose-сервиса, поэтому без этой строки КАЖДЫЙ ассет отдаёт 403,
    // а страница приезжает с пустым React-корнем. Переименуешь сервис `vite`
    // в .dockerdev/compose.yml — поправь и здесь.
    allowedHosts: ['vite', 'localhost', '127.0.0.1'],
  },
})
