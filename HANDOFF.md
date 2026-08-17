# HANDOFF — TG Mini App scaffolder

Обновлено: 2026-08-17. Ветка **`feat/v2-implementation`** (отведена от `feat/tg-mini-app-template`),
синхронна с `origin`.

Этот файл **отслеживается git с 2026-08-16.** До этого он лежал в `.gitignore`, из-за чего
ритуал §6 («первым делом прочитать `HANDOFF.md`») из свежего клона был неисполним.

---

## ⚠️ НЕЗАВЕРШЁННОЕ НА МОМЕНТ ЗАПИСИ

**Незавершённого кода нет.** Шаги 0–5 и решение 5.5 закрыты, дерево чистое, гейт зелёный
целиком — на обоих пресетах, плюс отдельный докер-прогон и браузерная проверка.

**Открытым остаётся HMR** (`78c4dcc`): Vite не может открыть websocket — прокси Rails не
делает upgrade, фолбэк на `:3036` не проходит, порт намеренно не проброшен. Правка фронтенда
в докере требует ручного F5. Чинить — значит пересматривать решение о пробросе 3036.

## С чего начинать следующую сессию

**`V2_PLAN.md §6 «План по сессиям»** — там ритуал начала/конца сессии и разбивка оставшегося.
Сессии A, B и C (шаги 3–5) закрыты. Следующая — **сессия D (шаг 6: админка → SPA)**.

**Развилка «острова или SPA» закрыта 2026-08-16 в пользу SPA** — Rails отдаёт mount-point,
роутит React. Так план говорил изначально (§1.2, §2, §3); промежуточная запись «острова»,
сделанная в тот же день, была ошибкой чтения находки сессии B и удалена. Полный разбор —
§6, сессия D. Оттуда же главное для старта: логин **остаётся серверным**, catch-all
`/admin/*path` объявлять ПОСЛЕ `namespace :admin`, роуты и меню собираются через
`import.meta.glob` по `screens/*` (генератор тогда просто кладёт файл), а удаления v1-CSS
и `_ds_table` **отложены до E**, потому что ими пока пользуется генератор.
`react-router-dom` в `package.json` ещё нет — ставится в D.

**Опорное дерево для диффов живёт в сессионном скретчпаде и следующую сессию не переживёт.**
Первым делом в сессии D — заново снять снимок с HEAD (`bin/scaffold` в отдельный каталог,
тем же `--app-name`, скопировать дерево), иначе сравнивать «до/после» будет не с чем.

**Докер проверен на tma-пресете.** base отличается только отсутствием второго энтрипоинта;
всё, что участвует в докер-пути (`compose.yml`, `Dockerfile`, `vite.config.ts`, `run`,
`package.json`), лежит в слое base и на хосте проверено обоими пресетами.

Открытые вопросы к пользователю сведены в **`V2_PLAN.md §7`** — задавать в начале той сессии,
которую они блокируют. §4.2 (вендоринг design_system) записан как решённый, пользователь не
возражал и не подтверждал; вендорить не начинал.

---

## Состояние git

```
78c4dcc  fix: admin JS was dead — importmap tag missing, delete never confirmed
69d9bb6  docs(rules): commit and push to feature branches without asking
e7202bf  fix: drop the never-executed typecheck script, document why ds fails tsc
beafd92  feat: Vite + React 19 + TS + Tailwind v4 + Vitest (step 5)
76df07c  feat: vendor design_system snapshot + bin/sync_ds (step 4)
9cd3a24  feat: split template.rb into base + tma layers (step 3)
18f6508  chore: point compact instructions at V2_PLAN sec 6/7 and the 4.2 decision
0fa379c  docs: session-by-session plan (V2_PLAN §6) + open questions register (§7)
a3d38d9  docs: record finding B partial closure (shoulda was never wired)
bd03af4  fix: quality gate to fully green — real model spec, shoulda wired, ./run psql db name
0fc5f81  feat: Ruby-on-Whales dev docker layer + ./run (step 2)
9ec65dc  docs: mark step 1.5 done in V2_PLAN
b9812f6  fix: non-interactive scaffold + rubocop to zero offenses (step 1.5)
3dc36ed  docs: record v1 verification run + mandatory quality gate
2f0ed3e  docs: v2 architecture decision (delta) — single React stack
1d73adb  v1: TG Mini App scaffolder (baseline)
```

`HANDOFF.md` числится в `.gitignore` (наследие «session-local artifacts»). Вопрос убрать ли
строку задан пользователю трижды, **ответа не было** — файл живёт только на диске и в GitHub
не уехал.

**Remote подключён 2026-08-15:** `git@github.com:ErrorSoul/rails_template_.git`. Обе ветки
запушены по отдельности. Внимание: у `origin/master` (старый шаблон 2021 года, ветки
`paper_template`, `template_rails_6_*`, `etherium`) **нет общего предка** с нашими —
`git merge-base` пуст. PR откроется, но диффа не покажет; слияние потребует
`--allow-unrelated-histories`. Решать в сессии G.

---

## Источники правды

- **`V2_PLAN.md`** — архитектура v2, гемы/npm, открытые вопросы, порядок работ. §0 — проверенные
  факты, **не переоткрывать и не пересказывать своими словами**.
- **`CLAUDE.md`** — контракт проекта + обязательный **quality gate** перед каждым коммитом кода
  (не-интерактивный скаффолд → rspec → rubocop 0 offenses → смоук → уборка). Распространяется
  на агентов: агент без гейта работу не сдал.
- Этот файл — состояние репозитория и незавершённое.

## Решение, на котором всё стоит

**δ — единый React-стек: React 19 + TypeScript + Tailwind v4 и в админке, и в TMA.**
Svelte выкинут, вопрос α/β/γ закрыт. Доказательства — `V2_PLAN.md §0.2–0.3`.
Коротко: design_system оказался не Black Dashboard Pro, а своей библиотекой (84 компонента,
83 теста, единственный внешний импорт — `react`), и в ней есть ecommerce-organisms
(`ProductCard`, `ShoppingCart`, `PriceTag`, `Gallery`), что обнулило единственный аргумент за Svelte.

---

## Сделано

| Шаг | Статус |
|---|---|
| 0. Закоммитить v1 как базу для диффа | ✅ `1d73adb` |
| 1. Прогнать v1, зафиксировать что отвалилось | ✅ результаты в `V2_PLAN.md §0.5` |
| 1.5. Починить §0.5-A и §0.5-C | ✅ `b9812f6` |
| 2. Docker-слой | ✅ `0fc5f81` |
| 3. Расщепление `template.rb` на base + tma | ✅ `9cd3a24` |
| 4. Вендоринг design_system + `bin/sync_ds` | ✅ `76df07c` |
| 5. Vite + React + TS + Tailwind + Vitest | ✅ (эта сессия) |
| 5.5. Решение §4.1 (DataTable клиентский) | ✅ |
| 6+ | не начато |

### Что дал шаг 5 (фронтенд)

Vite 8 / React 19 / TS 5.9 / Tailwind v4 / Vitest 4, два энтрипоинта (`admin.tsx`, `tma.tsx`).
`tma.js` и sprockets-`tma.css` удалены — TMA-страница целиком на Vite. Вендоренный `ds/`
перестал быть мёртвым грузом: **754 теста в 85 файлах зелёные**.

Грабли, за которые уже заплачено:
- **Thor'овский `run` обрывает генератор при ненулевом коде** — `yarn install` на неподходящем
  Node уносил с собой `git init` и next-steps. Для необязательных команд — `system`.
- **Node 23 и любая нечётная линия вне спеки** (`vitest@4`, `jsdom@30`). В образе Node 24.
  На хосте `yarn install` падает — это ожидаемо, докер-путь от него не зависит.
- **`skipProxy` в `vite_rails` 3.11 по умолчанию `true`** и ломает наш compose. Стоит `false`.
- **Vite отбивает незнакомый `Host` 403-м** — в докере это было 403 на каждый ассет при
  честных 200 на саму страницу. Лечится `server.allowedHosts: ['vite', …]` в `vite.config.ts`.
  Имя дублирует имя compose-сервиса: переименуешь сервис — правь конфиг.
- **Хостовый гейт зелёный ≠ докер работает.** Без dev-сервера Rails отдаёт манифест статикой,
  и весь путь через `ViteRuby::DevServerProxy` остаётся непроверенным. Отсюда отдельный
  `scratchpad/docker_check.sh`.

### Что дал шаг 3 (расщепление)

`template.rb` → тонкий диспетчер; слои `lib/templates/{base,tma}.rb`, оверлеи
`lib/templates/{base,tma}/{files,erb}` + `tma/snippets/` (куски, которые дописываются
в base-файлы). `bin/scaffold --preset=tma|base`, дефолт `tma` — иначе гейт из `CLAUDE.md`
молча начал бы проверять другое приложение.

Механика DSL проверена эмпирически (railties 8.1.3 / thor 1.5.0), записана в `CLAUDE.md`
§ «Механика расщепления»: `apply` — `instance_eval` на том же генераторе; относительный
`apply` ищется в `source_paths`, а не рядом с вызывающим файлом; `source_paths` определяется
один раз и обязан кончаться `+ super`; `directory` не сливает два дерева; `after_bundle` — FIFO.

Переименования, вытекающие из расщепления: `tg_app_name` → `app_display_name`,
`TG_APP_NAME`/`TG_ADMIN_*` → `APP_NAME`/`ADMIN_*`. `TG_BOT_TOKEN` — единственная оставшаяся
телеграмная переменная. Маркеры оверлея в base-роутах названы `PRESET_*`, не `TMA_*`.

### Что дал шаг 2 (Docker)

`.dockerdev/` + `./run` (15 команд) вместо корневых `Dockerfile`/`docker-compose.yml`.
Наружу только `:3000`. `COMPOSE_PROJECT_NAME` = имя папки репо — иначе все проекты звались бы
`dockerdev` и делили volume'ы, поэтому **ходить только через `./run`**, не через
`docker compose -f` напрямую. `copy_file 'run'` требует `mode: :preserve`, иначе 644.
Продакшн-`Dockerfile` от Rails 8.1 оставлен нетронутым.
**Не проверено:** полный `./run up` — сервис `vite` в рестарт-цикле, пока нет `bin/vite` (шаг 5).

### Что дал шаг 1 (прогон v1)

v1 работает на Ruby 3.4.5 / Rails 8.1.3 / PG 16, за три месяца ничего не сгнило. Найдено:
- **A** — скаффолд зависал без TTY (нет `force: true`) → починено
- **B** — шаблон не генерирует ни одного теста, `rspec` зелёный вхолостую → **частично закрыто
  `bd03af4`**: `tma_resource` пишет реальную спеку, pending-стабов нет. Вскрылось, что
  shoulda-matchers не был подключён (`infer_spec_type_from_file_location!` закомментирован
  rspec-rails'ом) — три месяца гем стоял вхолостую. Спеки самого шаблона (auth, TMA) — шаг 7
- **C** — утверждение «гема rubocop нет» было **неверным**: Rails 8.1 везёт omakase.
  Реальная проблема — наш конфиг затирал его, 167 offenses → починено

### Что дал шаг 1.5

- `force: true` на всех `directory`/`copy_file`
- найден **пятый** интерактивный вопрос, прятавшийся за exit 0: `importmap:install` перезаписывал
  `app/javascript/application.js`. Заглушка удалена — вывод байт-в-байт тот же
- rubocop 167 → **0 offenses, без единого `Exclude`**; `.rubocop.yml` наследует omakase
- **Ограничение для шага 7:** маркер `TMA_RESOURCE_NAV` теперь в НАЧАЛЕ `admin_nav_items`
  (иначе `Style/TrailingCommaInArrayLiteral`), генератор вставляет через `after:`.
  Сгенерированные ресурсы в меню выше Superusers. Не сломать при переезде на genya.

---

## Следующие шаги

Разбивка по сессиям с ловушками и критериями готовности — **`V2_PLAN.md §6`**. Коротко:

1. **Сессия A / шаг 3** — расщепить `template.rb` на base-слой (Rails+Docker+auth+admin, без
   Telegram) и TMA-оверлей. Ничем не заблокирована, начинать с неё.
2. **Сессия B / шаг 4 — вендоринг design_system.** §4.2 решён (вариант A) на фактах: у
   design_system **нет ни remote, ни тегов**, тянуть неоткуда. Берём только `components/`
   (860 KB, 84 компонента + 83 теста) + `utils/cn.ts` + `tokens/index.css`; showcase/pages НЕ
   берём — они тянут `react-router-dom`, а сами компоненты импортируют только
   `react`/`react-dom`/тест-либы. Рядом `DS_VERSION` с upstream-SHA, `bin/sync_ds` = диff от него
   до HEAD. Апстрим стоит с `4a804fb` (2026-03-29). **Пользователь на решение не отвечал.**
3. **Сессия C / шаг 5** — Vite + React. Здесь же впервые полностью проверяется Docker-слой:
   до появления `bin/vite` сервис `vite` в рестарт-цикле.
4. Открыты §4.1 (DataTable), §4.3 (деплой) — см. `V2_PLAN.md §7`.

---

## Практические грабли окружения

- На macOS **нет команды `timeout`** (нет coreutils) — не закладываться на неё в скриптах.
- Скретчпад для временных проектов:
  `/private/tmp/claude-501/-Users-abu-works-rails-template/df4b0047-a24e-44c7-a958-59188d3c1cb7/scratchpad/`
- Postgres локальный на 5432, уже запущен. После прогонов **обязательно** `dropdb <app>_development
  <app>_test` и убить сервер — иначе следующий прогон спотыкается.
- `pkill -f "rails server"` **не убивает puma**: `bin/rails server` заменяет себя процессом
  `puma`, и в его командной строке строки «rails server» уже нет. Проверять
  `pgrep -fl puma` и убивать по PID, иначе порт останется занят после `rm -rf` проекта.
- Повторный scaffold с тем же app-name без `dropdb` → конфликт `schema_migrations`.
- **`rails new` нельзя запускать из каталога другого Rails-приложения** — bundler цепляется
  за его `Gemfile` и генерация падает. В скриптах гейта — `cd /tmp` перед каждым прогоном.
- **Хостовый Node 23.10 (EOL, нечётная линия) вне спеки** `vitest@4`/`jsdom@30`: `yarn install`
  на хосте падает. Сборке Vite это не мешает. В dev-образе Node 24. Для хостовых прогонов —
  `yarn install --ignore-engines` (костыль гейта, в шаблон не тащить).
- **Уборка после докера:** `docker compose down` без `COMPOSE_PROJECT_NAME` гасит чужой проект;
  файлы из volume'ов принадлежат root'у — сносить `docker run --rm -v /tmp:/host alpine:3 …`.
- `pre-commit` хук в сгенерированном проекте блокирует коммиты в main/master.

## Доноры

- `~/works/design_system/app/src/` — **главный**: 84 React 19 + TS + Tailwind v4 компонента
  с тестами. И админка, и ecommerce-TMA. Живой: 90 коммитов за 2026.
- `~/works/lave-cashback` (master, не в ветках!) — `lib/generators/genya/` + его спека (291 стр.)
  + скрипт `lave` (донор для `./run`). Сборку webpacker 5 не копировать.
- `~/works/cookware.me` — паттерн `vite_rails` + `vite-plugin-ruby` + `@vitejs/plugin-react`.
- `~/works/docker-base` — **не донор**, корпоративный CI-монорепо.
- `~/works/cashback` — **не существует**, это `lave-cashback`.
