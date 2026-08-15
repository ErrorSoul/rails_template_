import { useEffect, useState } from 'react'
import type { TgUser, TelegramWebApp } from './telegram'
import { applyThemeParams } from './telegram'

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; user: TgUser }

// 1. Прокидывает themeParams Telegram в CSS-переменные.
// 2. Шлёт initData в /api/v1/tma/auth (сервер проверяет HMAC и ставит JWT-cookie).
// 3. Рисует приветствие. Заменяй содержимое на своё.
export function TmaApp() {
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    const tg: TelegramWebApp | undefined = window.Telegram?.WebApp
    if (!tg) {
      setState({
        status: 'error',
        message: 'window.Telegram.WebApp не найден — открой страницу из Telegram (Menu Button или t.me).',
      })
      return
    }

    applyThemeParams(tg)
    tg.ready()
    tg.expand()

    const csrf = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? ''

    fetch('/api/v1/tma/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf },
      credentials: 'same-origin',
      body: JSON.stringify({ init_data: tg.initData || '' }),
    })
      .then(async (r) => ({ ok: r.ok, body: await r.json() }))
      .then(({ ok, body }) => {
        if (!ok) {
          setState({ status: 'error', message: `Не удалось авторизоваться: ${body.error ?? 'unknown'}` })
          return
        }
        setState({ status: 'ready', user: body })
      })
      .catch((e: Error) => setState({ status: 'error', message: `Сеть: ${e.message}` }))
  }, [])

  if (state.status === 'loading') return <div className="tma-loading">Загрузка…</div>
  if (state.status === 'error') {
    return (
      <div className="tma-error">
        <p>{state.message}</p>
      </div>
    )
  }

  const { first_name, username, telegram_id } = state.user
  return (
    <div className="tma-card">
      <h1>Привет, {first_name || username || `tg#${telegram_id}`}!</h1>
      <p>
        Это шаблон Telegram Mini App. Замени <code>app/frontend/components/tma/TmaApp.tsx</code>.
      </p>
    </div>
  )
}
