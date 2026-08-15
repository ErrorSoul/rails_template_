# rails_template — быстрый старт Telegram Mini App'а на Rails 7

Шаблон + скрипт для разворачивания нового Rails 7 / Ruby 3 проекта,
заточенного под Telegram Mini App: бэкенд (Rails API + админка) + фронт-shell под TWA.

## TL;DR

```bash
# создать новый TG Mini App в ~/works/my_app
~/works/rails_template/bin/scaffold ~/works/my_app --bot-token=123:ABC --app-name=MyApp

# то же самое, но без Telegram — просто Rails + Docker + админка
~/works/rails_template/bin/scaffold ~/works/my_app --preset=base --app-name=MyApp

cd ~/works/my_app
./run setup && ./run up  # либо bin/dev для локального запуска

# открыть HTTPS-туннель и привязать к боту
cloudflared tunnel --url http://localhost:3000
# в BotFather → @YourBot → Bot Settings → Menu Button → "Open My App" → https://<tunnel>.trycloudflare.com/tma
```

## Что внутри сгенерированного проекта

- **Auth** — `bcrypt` для админа (`Superuser`) + Telegram WebApp `initData` HMAC-верификация для пользователя (`User`). JWT в подписанной cookie. Без Devise.
- **Админка** — серверный ERB + Stimulus, layout с sidebar / topbar / table. Стили — токены из `~/works/design_system` (CSS-переменные, маппятся на `tg-theme-*`).
- **CRUD-генератор** — `bin/rails g tma_resource Foo "name slug:string"` создаёт модель, миграцию, admin-контроллер, ERB-views (index/show/new/edit), роут и пункт в admin sidebar.
- **TMA shell** — `/tma` отдаёт HTML с `telegram-web-app.js`, передаёт `initData` в `POST /api/v1/tma/auth`, кладёт юзера в JWT-cookie.
- **Фронтенд** — Vite 8 + React 19 + TypeScript + Tailwind v4, два энтрипоинта (`admin.tsx`, `tma.tsx`). Компоненты — вендоренный снапшот `~/works/design_system` в `app/frontend/ds/` (84 штуки + 83 теста), тесты гоняет Vitest.
- **Dev-стек** — `.dockerdev/` («Ruby on Whales» без гема `dip`) + обёртка `./run`, `Procfile.dev`, `.githooks/pre-commit`, RSpec + factory_bot + database_cleaner.

### `./run` — вход в dev-окружение

```bash
./run setup                  # bundle + yarn + db:prepare (dev и test), идемпотентно
./run up                     # поднять rails + vite + postgres
./run console                # Rails console          ./run psql [база]
./run rails db:migrate       # bin/rails <args>       ./run gen tma_resource Item "title"
./run test / ./run lint      # rspec / rubocop        ./run logs [сервис]
./run vitest                 # тесты фронтенда (ds/ + свои компоненты)
./run help                   # полный список (16 команд)
```

Наружу открыт **только `:3000`**. Postgres и dev-сервер Vite портов на хост не пробрасывают —
иначе несколько сгенерированных проектов дерутся за 5432 и 3036. В базу ходим через `./run psql`,
ассеты в dev отдаёт Rails через `ViteRuby::DevServerProxy`.

Имя compose-проекта берётся из имени папки репозитория и экспортируется скриптом, поэтому
**ходить надо через `./run`**, а не через `docker compose -f .dockerdev/compose.yml` напрямую —
иначе проекты поделят одни и те же volume'ы.

Продакшн-`Dockerfile`, который генерирует сам Rails 8.1, мы не трогаем: он про деплой,
`.dockerdev/` — про разработку.

## Что НЕ внутри (намеренно — чтобы быстро бутить)

Sentry, NewRelic, Sidekiq/delayed_job, Twilio/SendGrid, Service/Form Object паттерны,
state_machines, kaminari, searchlight, telegram-bot-ruby (incoming webhook + бот-команды).
Всё это можно добавить флагом `bin/scaffold --with sentry` или вручную после генерации.

## Источники паттернов

- `~/works/lave-cashback/` — Authenticator + JWT, Dockerfile/compose, .githooks
- `~/works/cookware.me/` — `lib/generators/genya/` (CRUD-генератор, переписан под ERB)
- `~/works/design_system/` — `tokens.css` + ERB-порты компонентов
- `github.com/ErrorSoul/rails_template_` (`first_example.rb`) — структура `template.rb` + `after_bundle` для RSpec/factory_bot

## MCP-обёртка — отказались (пока)

Изначально рассматривался MCP-сервер, чтобы дёргать scaffold из Claude Code как нативный tool.
После прогона end-to-end решено: **не нужен**.

- `bin/scaffold` уже вызывается из Claude через `Bash` одной командой — ровно тот же UX
- Нет state'а / streaming'а / multi-tool surface, который оправдывал бы MCP-обёртку
- Maintenance overhead (Node/Python процесс, `.mcp.json` config) не окупается

Если позже захочется MCP — это тонкий shim вокруг `bin/scaffold` (один tool `scaffold_rails_tma` со схемой
аргументов). Пока — Bash достаточно.

## Структура шаблона

```
rails_template/
├── template.rb                    # тонкий диспетчер: инпуты, source_paths, слои, финализация
├── bin/scaffold                   # обёртка: rails new + template.rb + next-steps
├── bin/sync_ds                    # дифф апстрима design_system против вендоренного снапшота
├── lib/templates/
│   ├── base.rb                    # слой base: гемы, копирование base/, after_bundle (БД, rspec, seed)
│   ├── tma.rb                     # слой tma: копирование tma/, патчи по base-файлам, миграция Users
│   ├── base/files/                # оверлей base (mirror Rails app), без Telegram
│   │   ├── app/components/        # Authenticator, JsonWebToken
│   │   ├── app/controllers/       # Application, Admin, Api::V1::Base, Api::V1::Admin::Base
│   │   ├── app/views/             # layouts/{application,auth,dashboard}, admin/, shared/
│   │   ├── app/assets/stylesheets/design_system/  # tokens.css + admin.css
│   │   ├── app/frontend/ds/       # снапшот design_system: 84 React-компонента + 83 теста,
│   │   │                          # utils/cn.ts, tokens/index.css, DS_VERSION (см. bin/sync_ds)
│   │   ├── lib/generators/tma_resource/           # CRUD-генератор (едет в новый app)
│   │   ├── .dockerdev/            # dev-образ, compose.yml, Aptfile, .psqlrc, .bashrc
│   │   ├── run                    # обёртка над docker compose (вместо dip)
│   │   └── .githooks/pre-commit
│   ├── base/erb/                  # .env.example.erb (рендерится через `template`)
│   ├── tma/files/                 # оверлей tma: TgAuth, TmaController, User, /tma-вьюха,
│   │                              # app/frontend/{entrypoints/tma.tsx,components/tma,styles}
│   ├── tma/erb/                   # tg_app.rb.erb
│   └── tma/snippets/              # куски, дописываемые в base-файлы (routes, футер логина)
```

Порядок применения: `template.rb` → `base.rb` → `tma.rb` (если preset=tma) → финализация
(git init + commit + next-steps). `source_paths` определяется **только** в `template.rb`:
`apply` — это `instance_eval` на том же генераторе, и второе определение переписало бы
первое задним числом, включая `after_bundle`-блоки.

## Verification

```bash
~/works/rails_template/bin/scaffold ~/works/test_tma --bot-token=test --app-name=Test
cd ~/works/test_tma
./run setup && ./run up
./run test                                    # rspec
./run vitest                                  # тесты фронтенда
curl -s http://localhost:3000/tma | head -3   # HTML с telegram-web-app.js
./run gen tma_resource Item "title body:text"
./run rails db:migrate
# открыть http://localhost:3000/admin/items
```
