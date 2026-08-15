import React, { useState, useEffect, useRef, useCallback } from 'react'
import { cn } from '../../../utils/cn'

export interface ContextMenuItem {
  label: string
  icon?: React.ReactNode
  shortcut?: string
  disabled?: boolean
  danger?: boolean
  divider?: boolean
  onClick?: () => void
}

export interface ContextMenuProps {
  items: ContextMenuItem[]
  children: React.ReactNode
  className?: string
}

export function ContextMenu({ items, children, className }: ContextMenuProps) {
  const [visible, setVisible] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const menuRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const close = useCallback(() => {
    setVisible(false)
    setFocusedIndex(-1)
  }, [])

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    // Get position relative to viewport, but clamp to stay within bounds
    let x = e.clientX
    let y = e.clientY
    const menuWidth = 220
    const menuHeight = items.length * 36
    if (x + menuWidth > window.innerWidth) x = window.innerWidth - menuWidth - 8
    if (y + menuHeight > window.innerHeight) y = window.innerHeight - menuHeight - 8
    if (x < 0) x = 8
    if (y < 0) y = 8
    setPosition({ x, y })
    setVisible(true)
    setFocusedIndex(-1)
  }

  // Close on outside click
  useEffect(() => {
    if (!visible) return
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        close()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [visible, close])

  // Keyboard navigation
  useEffect(() => {
    if (!visible) return

    const getSelectableIndices = () =>
      items.reduce<number[]>((acc, item, i) => {
        if (!item.divider && !item.disabled) acc.push(i)
        return acc
      }, [])

    const handleKeyDown = (e: KeyboardEvent) => {
      const selectable = getSelectableIndices()
      if (!selectable.length) return

      if (e.key === 'Escape') {
        close()
        return
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        const currentPos = selectable.indexOf(focusedIndex)
        const nextPos = currentPos < selectable.length - 1 ? currentPos + 1 : 0
        setFocusedIndex(selectable[nextPos])
        return
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        const currentPos = selectable.indexOf(focusedIndex)
        const prevPos = currentPos > 0 ? currentPos - 1 : selectable.length - 1
        setFocusedIndex(selectable[prevPos])
        return
      }

      if (e.key === 'Enter') {
        e.preventDefault()
        if (focusedIndex >= 0 && items[focusedIndex] && !items[focusedIndex].disabled) {
          items[focusedIndex].onClick?.()
          close()
        }
        return
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [visible, focusedIndex, items, close])

  const handleItemClick = (item: ContextMenuItem) => {
    if (item.disabled) return
    item.onClick?.()
    close()
  }

  return (
    <div ref={containerRef} className={cn('ds-context-menu-area', className)}>
      <div onContextMenu={handleContextMenu}>{children}</div>

      {visible && (
        <div
          ref={menuRef}
          role="menu"
          data-testid="context-menu"
          style={{
            position: 'fixed',
            left: position.x,
            top: position.y,
            zIndex: 10000,
            minWidth: '180px',
            background: 'var(--color-surface)',
            border: '1px solid rgba(var(--color-accent-rgb), 0.15)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            padding: '0.25rem 0',
            animation: 'ds-scale-in var(--duration-fast) var(--ease-out)',
            fontFamily: 'var(--font-base)',
          }}
        >
          {items.map((item, index) => {
            if (item.divider) {
              return (
                <div
                  key={`divider-${index}`}
                  role="separator"
                  style={{
                    height: '1px',
                    background: 'var(--color-default)',
                    margin: '0.25rem 0',
                  }}
                />
              )
            }

            const isFocused = focusedIndex === index

            return (
              <div
                key={`item-${index}`}
                role="menuitem"
                aria-disabled={item.disabled || undefined}
                onClick={() => handleItemClick(item)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.5rem 1rem',
                  fontSize: '0.85rem',
                  cursor: item.disabled ? 'not-allowed' : 'pointer',
                  color: item.danger
                    ? 'var(--color-danger)'
                    : item.disabled
                    ? 'var(--color-gray-700)'
                    : 'var(--color-gray-300)',
                  background: isFocused
                    ? 'rgba(var(--color-accent-rgb), 0.1)'
                    : 'transparent',
                  transition: 'background var(--duration-fast) ease',
                  opacity: item.disabled ? 0.5 : 1,
                }}
                onMouseEnter={() => !item.disabled && setFocusedIndex(index)}
                onMouseLeave={() => setFocusedIndex(-1)}
              >
                {item.icon && (
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '18px',
                      flexShrink: 0,
                      color: item.danger ? 'var(--color-danger)' : 'var(--color-gray-500)',
                    }}
                  >
                    {item.icon}
                  </span>
                )}
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.shortcut && (
                  <span
                    style={{
                      fontSize: '0.7rem',
                      color: 'var(--color-gray-600)',
                      flexShrink: 0,
                    }}
                  >
                    {item.shortcut}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
