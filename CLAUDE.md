# Project Contract — rails_template (TG Mini App scaffolder)

Этот репо — **шаблон**, по которому генерируются новые Rails 7 / Ruby 3 проекты под Telegram Mini App.
Он сам не запускается как Rails app. Запускается `bin/scaffold` или `rails new -m template.rb`.

## Build And Test
- Установка: ничего (Ruby 3.2+, Rails 7.1+, Postgres 13+, Docker — у пользователя)
- Сгенерировать тестовый проект: `bin/scaffold ~/works/test_tma --bot-token=test --app-name=Test`
- Smoke-тест шаблона: `bin/test_e2e.sh` (генерирует временный проект, гоняет миграции и rspec, удаляет)
- Lint самого шаблона: `bundle exec rubocop --config .rubocop.yml lib/templates/files lib/generators` (если установлен)

## Architecture Boundaries
- `template.rb` — оркестратор (Rails app template DSL: `gem`, `copy_file`, `directory`, `after_bundle`)
- `lib/templates/files/` — оверлей: пути 1-в-1 к Rails-приложению. Никакой логики тут нет, только готовые файлы.
- `lib/templates/erb/` — файлы, рендерящиеся через `template '...', '...'` с переменными (app_name, bot_token, …)
- `lib/generators/tma_resource/` — Rails-generator, **который попадает в сгенерированный app**. Не используется в самом шаблоне.
- `bin/scaffold` — обёртка над `rails new -m`, читает `--bot-token`/`--app-name` и в конце печатает next-steps.

Не клади бизнес-логику в `template.rb` — она должна быть только декларативной (что копировать, какие гемы добавить, что запустить в `after_bundle`).
Не клади Rails-зависимый код в `bin/scaffold` — он должен работать до того, как сгенерированный app существует.

## Coding Conventions
- В шаблонных файлах (`lib/templates/files/`) — используем те же правила, что и в продакшен Rails: `frozen_string_literal: true`, `ApplicationRecord`, `ActionController::API` для API-контроллеров.
- В `lib/generators/tma_resource/templates/` — ERB-теги `<%= %>` экранируются через двойной `<%%= %>` (Rails generator обрабатывает их в два прохода).
- ERB-views в `lib/templates/files/app/views/` копируются как есть и НЕ должны содержать `<%%`.
- Имена файлов: snake_case везде. CamelCase только в названиях констант/классов внутри файлов.

## Safety Rails

### NEVER
- Хардкодить `TG_BOT_TOKEN` ни в шаблоне, ни в сгенерированном app — только через ENV (lave-cashback это делал, мы это исправляем).
- Класть готовый `.env` в `lib/templates/files/` — только `.env.example`.
- Коммитить в main/master напрямую — git-guard блокирует.
- Удалять `lib/generators/tma_resource/templates/` файлы без проверки, что они не используются генератором (поищите по имени в `tma_resource_generator.rb`).

### ALWAYS
- Все правки — на feature branch (`feat/...`, `fix/...`, `chore/...`). Никогда не на main/master.
- При изменении публичного интерфейса `bin/scaffold` (флаги, ENV) — обновить `README.md` и пример в `CLAUDE.md`.

### Quality gate — обязателен перед КАЖДЫМ коммитом кода

Ни один код не коммитится, пока все четыре шага не зелёные. Это не рекомендация.
Применяется и к агентам/сабагентам: агент, который не прогнал гейт, работу не сдал.

```bash
# 1. Сгенерировать проект НЕ-интерактивно (stdin закрыт — так это увидит CI и агент)
bin/scaffold /tmp/gate_app --bot-token=test --app-name=GateApp < /dev/null
#    Ни одного вопроса "Overwrite ...? [Ynaqdhm]". Зависание = провал.

cd /tmp/gate_app
# 2. Тесты
bundle exec rspec                       # зелёный, БЕЗ pending-стабов от генератора
# 3. Линт
bundle exec rubocop                     # 0 offenses
# 4. Смоук: генератор + миграция + живые роуты
bin/rails g tma_resource Item "title body:text" < /dev/null && bin/rails db:migrate
bundle exec rspec && bundle exec rubocop
curl -sf localhost:3000/up              # после старта сервера; /admin и /tma → 200
```

Уборка за собой обязательна: `dropdb gate_app_development gate_app_test && rm -rf /tmp/gate_app`.
Не оставлять базы и висящие `rails server` — следующий прогон об них спотыкается.

**Если гейт красный — чинить, а не объяснять.** «Эти offenses были до меня» не принимается:
базовый уровень — ноль, зафиксирован в `V2_PLAN.md §0.5-C`.

## Verification
- `bin/scaffold ~/tmp/x --bot-token=test --app-name=X` — должен пройти без ошибок до конца, в конце вывести next-steps.
- В `~/tmp/x`: `bundle exec rspec` — зелёный, `bin/rails db:migrate` — без ошибок, `bin/rails g tma_resource Foo "name"` — создаёт все ожидаемые файлы, ещё одна миграция проходит.
- Открыть `http://localhost:3000/admin` — отдаёт login форму. Логин `admin/admin123` — заходит, виден sidebar.
- Открыть `http://localhost:3000/tma` — отдаёт HTML с `telegram-web-app.js`. Без HTTPS-туннеля initData валидация естественно не пройдёт — это ожидаемо.

## Out-of-scope для v1 (зафиксировано после анализа cookware/lave/design_system + advisor review)
- Sentry, NewRelic, delayed_job, Sidekiq, Twilio, SendGrid
- Service Object / Form Object паттерны (есть в lave, не нужны для MVP)
- telegram-bot-ruby (incoming webhook + bot commands) — TG Mini App работает без бот-логики
- railsbytes-рецепты (Devise/Bootstrap/Pry слабее, чем то, что у нас уже портировано)
- ~~React SPA admin (lave/cookware так делают; для MVP проще ERB+Stimulus)~~ — **ОТМЕНЕНО
  2026-08-14.** Решение δ: React 19 + TS + Tailwind v4 и в админке, и в TMA. Обоснование и
  доказательства — `V2_PLAN.md`. ERB+Stimulus-админка и Svelte-TMA больше не актуальны.

Добавить эти куски можно через `bin/scaffold --with sentry` (флаги пока не реализованы).

## Compact Instructions
При `/compact` — приоритет:
0. **`V2_PLAN.md` — источник правды по архитектуре v2.** Его §0 (проверенные факты) не
   переоткрывать и не пересказывать своими словами — читать файл.
1. Решения архитектуры (раздел выше) и Out-of-scope — НЕ суммировать.
2. Какие файлы уже написаны и что они делают.
3. Статус прогона `bin/test_e2e.sh` или ручной генерации.
4. Открытые TODO: `V2_PLAN.md §4` + `# TODO` в файлах.
5. Фидбек пользователя (фиксированные решения, отказы).

Drop: листинги директорий, повторное чтение тех же файлов, stdout `bundle install`/`yarn install`.

## Handoff
Если сессия закрылась посреди работы — оставь `HANDOFF.md` с тем, что сделано, что не работает, какой следующий шаг.

## See also
- `.claude/rules/core.md`, `.claude/rules/release.md`, `.claude/rules/compact.md`
- `V2_PLAN.md` — архитектура v2, список гемов/npm, открытые вопросы, порядок работ
- `HANDOFF.md` — состояние репозитория и v1
- `~/works/design_system/app/src/` — **главный донор**: 84 React 19 + TS + Tailwind v4 компонента
  с тестами (`components/`, `utils/cn`, `tokens/index.css`). И админка, и ecommerce-TMA
- `~/works/lave-cashback` (master) — `lib/generators/genya/` (донор CRUD-генератора, версия
  свежее cookware) + `spec/generators/genya_generator_spec.rb` + `lave` (донор для `./run`) +
  `app/components/authenticator.rb` (уже портирован). Сборку webpacker 5 не копировать
- `~/works/cookware.me` — паттерн `vite_rails` + `vite-plugin-ruby` + `@vitejs/plugin-react`
