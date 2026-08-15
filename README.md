# rails_template — быстрый старт Telegram Mini App'а на Rails 7

Шаблон + скрипт для разворачивания нового Rails 7 / Ruby 3 проекта,
заточенного под Telegram Mini App: бэкенд (Rails API + админка) + фронт-shell под TWA.

## TL;DR

```bash
# создать новый TG Mini App в ~/works/my_app
~/works/rails_template/bin/scaffold ~/works/my_app --bot-token=123:ABC --app-name=MyApp

cd ~/works/my_app
docker compose up        # либо bin/dev для локального запуска

# открыть HTTPS-туннель и привязать к боту
cloudflared tunnel --url http://localhost:3000
# в BotFather → @YourBot → Bot Settings → Menu Button → "Open My App" → https://<tunnel>.trycloudflare.com/tma
```

## Что внутри сгенерированного проекта

- **Auth** — `bcrypt` для админа (`Superuser`) + Telegram WebApp `initData` HMAC-верификация для пользователя (`User`). JWT в подписанной cookie. Без Devise.
- **Админка** — серверный ERB + Stimulus, layout с sidebar / topbar / table. Стили — токены из `~/works/design_system` (CSS-переменные, маппятся на `tg-theme-*`).
- **CRUD-генератор** — `bin/rails g tma_resource Foo "name slug:string"` создаёт модель, миграцию, admin-контроллер, ERB-views (index/show/new/edit), роут и пункт в admin sidebar.
- **TMA shell** — `/tma` отдаёт HTML с `telegram-web-app.js`, передаёт `initData` в `POST /api/v1/tma/auth`, кладёт юзера в JWT-cookie.
- **Dev-стек** — `Dockerfile` (multi-arch arm64/amd64), `docker-compose.yml` (web + worker + postgres), `Procfile.dev`, `.githooks/pre-commit`, RSpec + factory_bot + database_cleaner.

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
├── template.rb                    # Rails app template (вызывается через `rails new -m`)
├── bin/scaffold                   # обёртка: rails new + template.rb + next-steps
├── lib/templates/files/           # статические оверлей-файлы (mirror Rails app)
│   ├── app/components/            # Authenticator, JsonWebToken, TgAuth
│   ├── app/controllers/           # Application, TmaController, Api::V1::Base, Admin::Base
│   ├── app/views/                 # layouts/dashboard, components/_button|_input|_table|_sidebar
│   ├── app/assets/stylesheets/    # design_system/tokens.css + admin.css
│   ├── config/initializers/       # tg_app.rb (ENV-конфиг), cors.rb, admin_nav.rb
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── .githooks/pre-commit
└── lib/generators/tma_resource/   # CRUD-генератор (копируется в lib/generators/ нового app)
    ├── tma_resource_generator.rb
    └── templates/                 # *.erb для модели, контроллера, view'ов
```

## Verification

```bash
~/works/rails_template/bin/scaffold ~/works/test_tma --bot-token=test --app-name=Test
cd ~/works/test_tma
bundle exec rspec
docker compose up -d
curl -s http://localhost:3000/tma | head -3   # должен быть HTML с telegram-web-app.js
docker compose exec web bin/rails g tma_resource Item "title body:text"
docker compose exec web bin/rails db:migrate
# открыть http://localhost:3000/admin/items
```
