import { useState, useEffect } from 'react'
import { cn } from '../../../utils/cn'

export type ThemeId = 'neon' | 'ocean' | 'emerald' | 'sunset' | 'emerald-classic' | 'sunset-classic'

interface ThemeOption {
  id: ThemeId
  label: string
  colors: [string, string, string]
}

const themes: ThemeOption[] = [
  { id: 'neon',    label: 'Neon',    colors: ['#e14eca', '#1d8cf8', '#00f2c3'] },
  { id: 'ocean',   label: 'Ocean',   colors: ['#38bdf8', '#818cf8', '#34d399'] },
  { id: 'emerald', label: 'Emerald', colors: ['#00f2c3', '#67e8f9', '#a3e635'] },
  { id: 'sunset',  label: 'Sunset',  colors: ['#fb923c', '#e879f9', '#4ade80'] },
  { id: 'emerald-classic', label: 'Emerald Classic', colors: ['#00f2c3', '#67e8f9', '#a3e635'] },
  { id: 'sunset-classic',  label: 'Sunset Classic',  colors: ['#fb923c', '#e879f9', '#fcd34d'] },
]

function applyTheme(themeId: ThemeId) {
  const root = document.documentElement
  if (themeId === 'neon') {
    root.removeAttribute('data-theme')
  } else {
    root.setAttribute('data-theme', themeId)
  }
}

function getSavedTheme(): ThemeId {
  try {
    const saved = localStorage.getItem('ds-theme')
    if (saved && themes.some((t) => t.id === saved)) return saved as ThemeId
  } catch { /* ignore */ }
  return 'neon'
}

/** Call this in pages that need to sync theme (e.g. iframe previews) */
export function useSyncTheme() {
  useEffect(() => {
    const apply = () => applyTheme(getSavedTheme())
    apply()

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'ds-theme') apply()
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])
}

export interface ThemeSwitcherProps {
  className?: string
}

export function ThemeSwitcher({ className }: ThemeSwitcherProps) {
  const [active, setActive] = useState<ThemeId>(getSavedTheme)
  const [hovered, setHovered] = useState<ThemeId | null>(null)

  useEffect(() => {
    applyTheme(active)
    localStorage.setItem('ds-theme', active)
  }, [active])

  return (
    <div
      className={cn('ds-theme-switcher', className)}
      style={{
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center',
      }}
    >
      {themes.map((theme) => {
        const isActive = active === theme.id
        const isHovered = hovered === theme.id

        return (
          <button
            key={theme.id}
            title={theme.label}
            onClick={() => setActive(theme.id)}
            onMouseEnter={() => setHovered(theme.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              position: 'relative',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              border: isActive
                ? '2px solid var(--color-gray-200)'
                : '2px solid transparent',
              padding: 0,
              cursor: 'pointer',
              background: `conic-gradient(${theme.colors[0]} 0deg, ${theme.colors[0]} 120deg, ${theme.colors[1]} 120deg, ${theme.colors[1]} 240deg, ${theme.colors[2]} 240deg, ${theme.colors[2]} 360deg)`,
              boxShadow: isActive
                ? `0 0 12px ${theme.colors[0]}60`
                : isHovered
                ? `0 0 8px ${theme.colors[0]}40`
                : 'none',
              transition: 'var(--transition-base)',
              transform: isActive ? 'scale(1.15)' : isHovered ? 'scale(1.08)' : 'scale(1)',
              flexShrink: 0,
            }}
            aria-label={`Theme: ${theme.label}`}
            aria-pressed={isActive}
          />
        )
      })}
    </div>
  )
}
