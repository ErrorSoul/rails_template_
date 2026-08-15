# V2 — план (δ: единый React-стек)

Дата: 2026-08-14. Ветка `feat/tg-mini-app-template`.
Составлено после разбора `~/works/lave-cashback`, `~/works/cookware.me`, `~/works/design_system`.

**Решение принято: δ — React везде, Svelte выкинут.** Закрывает открытый с мая вопрос α/β/γ
и отменяет майское решение «TMA = Svelte 5».

---

## 0. Проверенные факты (не переоткрывать)

### 0.1 Доноры: где что лежит

| Что | Вывод |
|---|---|
| `~/works/cashback` | **не существует**; донор — `~/works/lave-cashback` |
| `cookware: origin/resource_generator_with_react` | genya **идентичен** master (`git diff` пуст), ветка старше — не донор |
| `lave: feature/datatable-*` | тоже старше master: в диффе `genya_generator.rb −95`, `lave −281` (файлы есть на master, нет в ветке) |
| `~/works/docker-base` | корпоративный CI-монорепо (gemstash, GitLab CI, ES, rabbitmq, 5 фронтов) — **не донор** |

Актуальные версии генератора и `./run`-скрипта — на **`lave-cashback/master`**, не в ветках.

### 0.2 design_system — HANDOFF.md описывал его неверно

Не «Black Dashboard Pro + Paper Kit Pro на React». Эти папки — **визуальный референс**, не код.

| | |
|---|---|
| Стек | **React 19.2 + TypeScript 5.9 + Tailwind v4 + Vite 8 + Vitest** |
| Структура | atomic design: `app/src/components/{atoms,molecules,organisms}/<Name>/index.tsx` |
| Объём | **84 компонента, 83 теста, 860 KB** (30 atoms / 27 molecules / 23 organisms) |
| Стили | Tailwind v4 + CSS-переменные (`var(--gradient-primary)`), утилита `cn()` = clsx + tailwind-merge |
| Живость | **90 коммитов за 2026**, последний — март 2026 |
| Поставка | `"private": true`, без `exports`/dist → потребляется **копированием дерева** |
| Внешние зависимости | во всех 84 `index.tsx` внешний импорт ровно один — **`react`**. Остальное — относительные пути внутри дерева + `utils/cn` (clsx, tailwind-merge) |

### 0.3 Почему δ, а не γ/β/α

1. В `organisms` лежат **`ProductCard`, `ShoppingCart`, `PriceTag`, `Gallery`, `Carousel`**, в
   atoms/molecules — `SearchInput`, `Rating`, `OTPInput`, `EmptyState`, `StatsCard`.
   Это ecommerce-набор для TMA. Майское обоснование Svelte («доноры содержат admin-компоненты,
   но не ecommerce-TMA, поэтому React-реюз к TMA не применим») — **фактически ложно**.
2. Дерево почти без внешних зависимостей → копирование дёшево, δ механически прост.
3. Против β: копирование React→React **обратимо** (ре-синк диффом против живого апстрима).
   Переписывание React→Svelte — односторонняя трансформация, ре-синк невозможен навсегда.
4. Против γ (React admin + Svelte TMA): условие «стеки не должны встречаться» больше не нужно —
   встречаться нечему. Уходит спайк «два плагина в одной сборке», уходит второй набор idiom'ов.

Осознанная цена δ: Rails-проект принимает **React 19 + TypeScript + Tailwind v4**.
Половинчато взять design_system нельзя. Бандл react+react-dom ≈ 45 KB gz; если станет узко —
`preact/compat` алиасом, без правки компонентов.

### 0.4 DataTable — client-side only

`organisms/DataTable/index.tsx`: `totalPages = Math.ceil(sortedData.length / pageSize)`.
Props: `data`, `columns`, `pageSize`, `searchable`, `sortable` — **никакого `apiUrl`**.
Сортировка, поиск и пагинация считаются по переданному массиву.

То есть дыра, зафиксированная в `lave/docs/DATATABLE_AND_GENERATOR_PLAN.md` («в API-режиме
пагинация ✅, sort ❌, search ❌»), — это не недоделка порта, а отсутствие серверного режима
в оригинале. lave-порт server-mode **добавлял**; оригинал чище, но полностью клиентский.

### 0.5 Прогон v1 — 2026-08-15, Ruby 3.4.5 / Rails 8.1.3 / PostgreSQL 16

Шаг 1 плана выполнен. `bin/scaffold` **доходит до конца, exit 0**. Проверено на живом проекте:

| Проверка | Результат |
|---|---|
| `bin/scaffold` целиком | ✅ exit 0, `bundle install` разрешился под Rails 8.1 |
| `bin/rails g tma_resource Item "title body:text"` | ✅ без stdin, все файлы созданы |
| `bin/rails db:migrate` | ✅ |
| `bundle exec rspec` | ✅ зелёный — но **0 примеров** до генератора, 1 pending после |
| `/up` | ✅ 200 |
| `/admin` → логин `admin/admin123` | ✅ 302 → `/admin/superusers` 200, sidebar на месте |
| `/admin/items` (сгенерированный ресурс) | ✅ 200 |
| `/tma` | ✅ 200, содержит `telegram-web-app.js` |

За три месяца ничего не отвалилось. Но нашлось три вещи:

**A. Шаблон не переживает не-интерактивный запуск.** Rails 8.1 генерирует свои версии четырёх
файлов, и `directory`/`copy_file` без `force: true` останавливаются на вопросе:

```
conflict  app/helpers/application_helper.rb
conflict  Dockerfile
conflict  .rubocop.yml
conflict  .dockerignore
```

Прошло только из-за `yes |` в санити-скрипте. Без него `bin/scaffold` **зависает** — в CI, в
скрипте, у агента. Тот же класс бага, что `yes?` в genya (§1.3), но уже в самом `template.rb`.
Чинится `force: true`.

**B. Шаблон не генерирует ни одного теста.** `rspec` зелёный вхолостую: 0 примеров.
После `tma_resource` появляется ровно один pending-стаб — генератор, в отличие от genya,
не вписывает в спеку shoulda-матчеры. При переносе genya эту его способность сохранить.

**C. ⚠️ Утверждение «гема rubocop нет, линт не запускался ни разу» — НЕВЕРНО.**
Rails 8.1 везёт `rubocop-rails-omakase`, `bundle exec rubocop` работает (1.89.0).
Реальная проблема другая и хуже:
- наш `.rubocop.yml` **затирает** конфиг omakase и не делает `inherit_gem` — стиль Rails выброшен;
- `rubocop-rails` установлен, но в конфиге не подключён;
- `TargetRubyVersion: 3.2` при фактическом Ruby 3.4;
- **167 offenses на свежесгенерированном проекте.** То есть `./run lint` красный с первой минуты.

Чинится правкой `.rubocop.yml` (inherit_gem omakase + plugins + TargetRubyVersion), а не
добавлением гема.

---

## 1. Архитектура v2

### 1.1 Два слоя

`template.rb` расщепляется:
- **base** — Rails 8 + Docker + `./run` + auth + admin + rubocop, без Telegram
- **tma overlay** — накатывается поверх base

Так же генерируются и не-TMA проекты.

### 1.2 Единый фронтенд-стек

Один `package.json`, один `node_modules`, один плагин Vite. Два энтрипоинта — потому что
это два разных приложения, а не два стека:

```
app/frontend/
  entrypoints/
    admin.tsx          # React root, роуты админки
    tma.tsx            # React root, TMA
  components/
    ds/                # ← копия дерева design_system (atoms/molecules/organisms)
    admin/             # экраны админки
    tma/               # экраны TMA
  utils/cn.ts          # из design_system
  styles/
    tokens.css         # из design_system, framework-agnostic
    admin.css
    tma.css
package.json
vite.config.ts
tsconfig.json
```

### 1.3 Генератор: форк genya, эмитит TSX

**v1-генератор `tma_resource` эмитит ERB-вьюхи — это α-форма, он уходит.**

Судьба 7 файлов в `lib/templates/files/lib/generators/tma_resource/`: удаляются, но по контракту
`CLAUDE.md` («NEVER удалять `templates/` без проверки, что они не используются генератором»)
перед удалением каждое имя шаблона грепается в `tma_resource_generator.rb`.
`admin_controller.rb.erb` скорее всего переживёт — контроллер остаётся Rails-овским.

Форкать **lave/master**, не cookware:

| | cookware | lave |
|---|---|---|
| имя файла | `pluralize.capitalize` → `Pay_reports` | `pluralize.camelize` → `PayReports` ✅ |
| пустые атрибуты | падает | `return if attrs_names.empty?` |
| спека модели | падает без файла | `return unless File.exist?(...)` |
| `attrs_names` | пересчитывается | мемоизирован |
| `create_main_controller` | печатает «I will do it later» | удалён |

Вычистить при переносе:
- `insert_as_json` — пустой `# TODO`
- **`yes?("Would you like to run rake db:migrate?")` — интерактивный промпт повесит любой
  не-интерактивный scaffold и любой прогон агентом.** Заменить на флаг `--migrate` (default false)
- пути захардкожены под `app/frontend/` — параметризовать

**Важно:** от genya берётся *структура* (какие файлы, точки инжекта, именование, роут в
`admin_routes`), а *содержимое* шаблонов переписывается: было reactstrap + lave-DataTable,
станет TSX + `components/ds`. Шаблоны `.jsx.erb` → `.tsx.erb`.

Бонус: на lave/master лежит `spec/generators/genya_generator_spec.rb` (291 строка) — забирается вместе.

### 1.4 Сборка

`vite_rails` + `vite-plugin-ruby` + `@vitejs/plugin-react` — паттерн cookware, рабочий.
Плюс `@tailwindcss/vite` и TypeScript, потому что этого требует design_system.

webpacker 5 из lave (с `NODE_OPTIONS=--openssl-legacy-provider` вокруг мёртвого webpack 4)
**копировать нельзя**.

### 1.5 Docker

`docker-base` не подошёл. `.dockerdev/` + `./run` пишутся по Ruby on Whales, без `dip`.
`./run` форкается из `lave/lave` (281 строка: готовый `case`, справка, `require_running`),
webpacker-команды меняются на vite, worker-сервис убирается.
Postgres — только во внутренней docker-сети, без проброса на хостовый 5432.

---

## 2. Гемы

Пересечение доноров **минус** out-of-scope из `CLAUDE.md`. Не объединение — Gemfile lave это свалка.

### Берём

| Гем | Откуда | Зачем |
|---|---|---|
| `rails ~> 8.0`, `pg`, `puma`, `bootsnap` | оба | база |
| `bcrypt` | оба | `has_secure_password` для Superuser |
| `jwt` | оба | уже используется в `app/components/json_web_token.rb` |
| `kaminari` | оба | **если** делаем server-side пагинацию — см. §4.1. При чисто клиентском DataTable не нужен |
| `vite_rails` | cookware | сборка |
| `rack-cors` | lave | уже в v1 |
| `dotenv-rails` | из v1 | `TG_BOT_TOKEN` только через ENV |
| `rubocop-rspec`, (`rubocop-factory_bot`) | ни у кого | см. §0.6 — сам rubocop уже едет из Rails 8.1, не хватает только rspec-плагинов |
| `rspec-rails`, `factory_bot_rails`, `shoulda-matchers`, `faker`, `database_cleaner-active_record` | оба | уже в v1 |
| `annotate`, `pry-rails` | оба | уже в v1 |
| `debug` | Rails 8 default | вместо `byebug` |

### Выкидываем явно

| Гем | Почему |
|---|---|
| `webpacker`, `sprockets`, `sass-rails`, `uglifier` | легаси-сборка lave, вытеснена vite |
| **`slim-rails`** | объявлен в `template.rb` v1, но **`.slim`-файлов в шаблоне ноль**. Под δ админские вьюхи схлопываются до mount-point layout. Мёртвый вес |
| `state_machines-activerecord` | есть у обоих, но ни одной модели шаблона состояния не нужны |
| `httparty` | под TG-API хватает `Net::HTTP` |
| `delayed_job_active_record`, `daemons`, `sentry-*`, `newrelic_rpm`, `twilio-ruby`, `sendgrid-ruby`, `bootstrap-email`, `telegram-bot-ruby` | out-of-scope по `CLAUDE.md` |
| `russian`, `searchlight`, `benchmark-ips`, `jbuilder`, `spring`, `spring-watcher-listen`, `aws-sdk-s3` | шум |
| `image_processing` | понадобится на картинках товаров — за флаг, не сейчас |

---

## 3. npm

`package.json` обоих Rails-доноров копировать нельзя: у cookware — jquery, react-scripts,
react-jvectormap, react-big-calendar, slate, moment; у lave — два ckeditor'а, draft-js, webpacker.

Список выведен из **фактических импортов design_system** (внешний импорт в компонентах ровно один — `react`):

```jsonc
// dependencies
"react": "^19.2",
"react-dom": "^19.2",
"clsx": "^2.1",              // нужен utils/cn
"tailwind-merge": "^3.5",    // нужен utils/cn
"react-router-dom": "^7.13"  // роутинг админки; сами компоненты его НЕ импортируют

// devDependencies
"typescript": "~5.9",
"@types/react", "@types/react-dom", "@types/node",
"vite", "vite-plugin-ruby", "@vitejs/plugin-react",
"tailwindcss": "^4.2", "@tailwindcss/vite": "^4.2",
"vitest", "@testing-library/react", "@testing-library/jest-dom", "jsdom"
```

Не берём: `reactstrap`, `bootstrap`, `axios` (есть `fetch`), `svelte` и всё вокруг него,
`chart.js`/`perfect-scrollbar`/`react-notification-alert` — они были нужны старым донорам, а не
design_system.

**Vitest-блок опционален** и зависит от решения по §4.2 (везём ли 83 теста).

---

## 4. Открытые вопросы

### 4.1 Server-side для таблиц — решить до генератора

design_system DataTable полностью клиентский (§0.4). Варианты:
- **A.** Оставить клиентским. Просто, работает до ~1000 строк, `kaminari` не нужен.
- **B.** Добавить server-mode в копию DataTable (`apiUrl`, `?sort=&order=&search=&page=`) +
  принимать эти params в admin-контроллерах. Тогда нужен `kaminari`, возможно `ransack`.
  Правка копии = расхождение с апстримом на одном файле (приемлемо, если локализовано).

От этого зависит и §2 (kaminari/ransack), и шаблоны генератора. **Решать до шага 7.**

### 4.2 Как design_system попадает в сгенерированный проект — центральный механический вопрос

Копирование из `~/works/design_system` на этапе scaffold **привязывает шаблон к диску автора** —
у кого угодно другого (и в CI) сборка сломается. Варианты:
- **A.** Вендорить снапшот дерева в `lib/templates/files/app/frontend/components/ds/`.
  Шаблон самодостаточен. Ре-синк = ручной диff против апстрима.
- **B.** Тянуть из git по тегу на этапе `after_bundle`. Всегда свежо, но нужна сеть и публичный доступ.
- **C.** Git submodule в сгенерированном проекте. Свежо, но submodule'ы больно.

Склоняюсь к **A** (шаблон обязан быть самодостаточным — это его смысл) + скрипт `bin/sync_ds`
для обновления снапшота. **Не решено.**

### 4.3 Деплой отсутствует как измерение

Ни в v1, ни здесь нет прода: Kamal / Fly / VPS. Решает, dev-only ли Dockerfile или multi-stage,
нужен ли precompile ассетов и Kamal-конфиг. Шаблон, генерирующий недеплоящиеся проекты, — половина шаблона.

### 4.4 Прочее

- ~~v1 никем не запускался с мая~~ — **прогнан 2026-08-15, см. §0.5.** Работает; найдены A/B/C.
- Интерактивный режим scaffolder (пункт 3 майского фидбека) — не зафиксирован.
  Учитывать §0.5-A: **не-интерактивный путь обязан быть дефолтом**, иначе шаблон непригоден
  для CI и для агента.
- Что делает первый реальный проект (платежи, доставка, склад) — рамка, не спека.

---

## 5. Порядок работ

| # | Шаг | Блокеры |
|---|---|---|
| 0 | ✅ **Сделано 2026-08-15** — `1d73adb` (v1 baseline) + `2f0ed3e` (решение δ) | — |
| 1 | ✅ **Сделано 2026-08-15** — прогон v1, результаты в §0.5 | — |
| 1.5 | ✅ **Сделано 2026-08-15** — `b9812f6`. §0.5-A и §0.5-C закрыты. Дополнительно: найден пятый интерактивный вопрос от `importmap:install` (прятался за exit 0), заглушка `app/javascript/application.js` удалена. Rubocop 0 offenses **без единого Exclude**. Побочный эффект: маркер `TMA_RESOURCE_NAV` уехал в начало `admin_nav_items` (`Style/TrailingCommaInArrayLiteral`) — сгенерированные ресурсы теперь в меню **выше** Superusers; шагу 7 это ограничение соблюдать | — |
| 2 | Docker-слой: `.dockerdev/`, compose с healthcheck'ами, Postgres без хостового порта, `./run` (форк `lave/lave`) | — |
| 3 | Расщепить `template.rb` на base + tma overlay | — |
| 4 | Решить §4.2, положить дерево design_system в шаблон + `bin/sync_ds` | §4.2 |
| 5 | Vite + React 19 + TS + Tailwind v4; два энтрипоинта; `tokens.css` | шаг 4 |
| 5.5 | **Решить §4.1** (клиентский DataTable или добавляем server-mode) — до того, как таблицы начнут разводиться по экранам | шаг 5 |
| 6 | Переписать админку на компоненты `ds/`; убрать ERB-вьюхи и `slim-rails` | шаг 5, §4.1 |
| 7 | Форк genya → `tma_resource`, шаблоны `.tsx.erb`, убрать `yes?`, забрать спеку | шаги 6, §4.1 |
| 8 | TMA на ecommerce-organisms (`ProductCard`, `ShoppingCart`, `PriceTag`, `Gallery`) | шаг 5 |
| 9 | `bin/test_e2e.sh` — генерация, миграции, rspec, снос | шаг 7 |
| 10 | Обновить `README.md` + `CLAUDE.md` (публичный интерфейс `bin/scaffold`, стек, out-of-scope) | всё выше |

Шаги 0–1 можно делать прямо сейчас, они ничем не заблокированы.
