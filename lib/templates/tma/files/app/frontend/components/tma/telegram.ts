// Минимальный тип-контракт того куска Telegram WebApp API, который использует шаблон.
// Полный тип не нужен и быстро протух бы: описываем ровно то, что вызываем.

export interface TgUser {
  id: number
  telegram_id: number
  first_name?: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
  photo_url?: string
}

export interface TgThemeParams {
  bg_color?: string
  secondary_bg_color?: string
  text_color?: string
  hint_color?: string
  link_color?: string
  button_color?: string
  button_text_color?: string
}

export interface TelegramWebApp {
  initData: string
  themeParams?: TgThemeParams
  ready(): void
  expand(): void
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp }
  }
}

const THEME_MAP: Array<[string, keyof TgThemeParams]> = [
  ['--tg-bg', 'bg_color'],
  ['--tg-surface', 'secondary_bg_color'],
  ['--tg-text', 'text_color'],
  ['--tg-hint', 'hint_color'],
  ['--tg-link', 'link_color'],
  ['--tg-button', 'button_color'],
  ['--tg-button-text', 'button_text_color'],
]

// data-tg-theme включает блок :root[data-tg-theme] из styles/tg_theme.css —
// без атрибута переменные --tg-* никуда не подставляются.
export function applyThemeParams(tg: TelegramWebApp): void {
  const root = document.documentElement
  root.setAttribute('data-tg-theme', '')
  const params = tg.themeParams ?? {}
  for (const [cssVar, key] of THEME_MAP) {
    const value = params[key]
    if (value) root.style.setProperty(cssVar, value)
  }
}
