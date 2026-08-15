import React, { useState, useEffect, useRef } from 'react'
import { cn } from '../../../utils/cn'

export interface CommandItem {
  id: string
  label: string
  description?: string
  icon?: React.ReactNode
  shortcut?: string
  group?: string
  onSelect: () => void
}

export interface CommandPaletteProps {
  items: CommandItem[]
  open: boolean
  onOpenChange: (open: boolean) => void
  placeholder?: string
  className?: string
}

export function CommandPalette({
  items,
  open,
  onOpenChange,
  placeholder = 'Type a command...',
  className,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Filter by query
  const filtered = items.filter((item) => {
    if (!query) return true
    const q = query.toLowerCase()
    return (
      item.label.toLowerCase().includes(q) ||
      (item.description?.toLowerCase().includes(q) ?? false)
    )
  })

  // Group items
  const groups = filtered.reduce<Record<string, CommandItem[]>>((acc, item) => {
    const group = item.group ?? ''
    if (!acc[group]) acc[group] = []
    acc[group].push(item)
    return acc
  }, {})
  const groupKeys = Object.keys(groups)

  // Flat list for keyboard navigation
  const flatFiltered = filtered

  useEffect(() => {
    if (open) {
      setQuery('')
      setActiveIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.querySelector('[data-active="true"]') as HTMLElement | null
    el?.scrollIntoView?.({ block: 'nearest' })
  }, [activeIndex])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      e.preventDefault()
      onOpenChange(false)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, flatFiltered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (flatFiltered[activeIndex]) {
        flatFiltered[activeIndex].onSelect()
        onOpenChange(false)
      }
    }
  }

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      className={cn('ds-command-palette', className)}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '15vh',
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={() => onOpenChange(false)}
    >
      <div
        className="ds-scale-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '560px',
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid rgba(255,255,255,0.08)',
          overflow: 'hidden',
          fontFamily: 'var(--font-base)',
        }}
      >
        {/* Search input */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0.75rem 1rem',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            gap: '0.75rem',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gray-500)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            aria-label={placeholder}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--color-white)',
              fontSize: '1rem',
              fontFamily: 'var(--font-base)',
            }}
          />
          <kbd
            style={{
              fontSize: '0.7rem',
              color: 'var(--color-gray-600)',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '4px',
              padding: '0.1rem 0.4rem',
              fontFamily: 'var(--font-base)',
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div
          ref={listRef}
          role="listbox"
          style={{ maxHeight: '340px', overflowY: 'auto', padding: '0.35rem' }}
        >
          {filtered.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '2rem',
                color: 'var(--color-gray-600)',
                fontSize: 'var(--font-size-sm)',
              }}
            >
              No results found
            </div>
          ) : (
            groupKeys.map((groupKey) => (
              <div key={groupKey}>
                {groupKey && (
                  <div
                    style={{
                      padding: '0.5rem 0.75rem 0.25rem',
                      fontSize: '0.65rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: 'var(--color-gray-600)',
                      fontWeight: 600,
                    }}
                  >
                    {groupKey}
                  </div>
                )}
                {groups[groupKey].map((item) => {
                  const flatIdx = flatFiltered.indexOf(item)
                  const isActive = flatIdx === activeIndex
                  return (
                    <div
                      key={item.id}
                      role="option"
                      aria-selected={isActive}
                      data-active={isActive}
                      onClick={() => {
                        item.onSelect()
                        onOpenChange(false)
                      }}
                      onMouseEnter={() => setActiveIndex(flatIdx)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        padding: '0.55rem 0.75rem',
                        borderRadius: 'var(--radius-base)',
                        background: isActive ? 'var(--color-info)' : 'transparent',
                        cursor: 'pointer',
                        transition: 'background var(--duration-fast)',
                      }}
                    >
                      {item.icon && (
                        <span style={{ color: isActive ? 'white' : 'var(--color-gray-400)', flexShrink: 0, display: 'flex' }}>
                          {item.icon}
                        </span>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.9rem', color: isActive ? 'white' : 'var(--color-gray-100)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.label}
                        </div>
                        {item.description && (
                          <div style={{ fontSize: '0.75rem', color: isActive ? 'rgba(255,255,255,0.7)' : 'var(--color-gray-600)', marginTop: '0.1rem' }}>
                            {item.description}
                          </div>
                        )}
                      </div>
                      {item.shortcut && (
                        <kbd
                          style={{
                            fontSize: '0.7rem',
                            color: isActive ? 'rgba(255,255,255,0.8)' : 'var(--color-gray-600)',
                            background: isActive ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)',
                            border: `1px solid ${isActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)'}`,
                            borderRadius: '4px',
                            padding: '0.1rem 0.4rem',
                            fontFamily: 'var(--font-base)',
                            flexShrink: 0,
                          }}
                        >
                          {item.shortcut}
                        </kbd>
                      )}
                    </div>
                  )
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
