import { useState, useRef, useEffect } from 'react'
import { cn } from '../../../utils/cn'

export interface NavDropdownItem {
  label: string
  description?: string
  icon?: React.ReactNode
  href?: string
  onClick?: () => void
}

export interface NavDropdownSection {
  title?: string
  items: NavDropdownItem[]
}

export interface NavDropdownProps {
  trigger: React.ReactNode
  items: NavDropdownSection[]
  width?: 'sm' | 'md' | 'lg' | 'full'
  className?: string
}

const widthMap = {
  sm: '200px',
  md: '280px',
  lg: '380px',
  full: '100vw',
}

export function NavDropdown({ trigger, items, width = 'md', className }: NavDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [open])

  const isMega = width === 'full'
  const columns = isMega ? items.length : 1

  return (
    <div
      ref={ref}
      className={cn('ds-nav-dropdown', className)}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      <div
        onClick={() => setOpen((o) => !o)}
        style={{ cursor: 'pointer', userSelect: 'none' }}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {trigger}
      </div>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: isMega ? '50%' : 0,
            transform: isMega ? 'translateX(-50%)' : 'none',
            width: widthMap[width],
            background: 'var(--color-surface)',
            border: '1px solid var(--color-default)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-xl)',
            zIndex: 200,
            animation: 'ds-fade-in var(--duration-fast) ease',
            display: isMega ? 'grid' : 'block',
            gridTemplateColumns: isMega ? `repeat(${columns}, 1fr)` : undefined,
            padding: '0.5rem',
            fontFamily: 'var(--font-base)',
          }}
        >
          {items.map((section, si) => (
            <div key={si} style={{ padding: isMega ? '0.5rem' : 0 }}>
              {section.title && (
                <p
                  style={{
                    margin: '0.25rem 0.5rem 0.4rem',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'var(--color-gray-600)',
                  }}
                >
                  {section.title}
                </p>
              )}
              {section.items.map((item, ii) => (
                <a
                  key={ii}
                  href={item.href ?? '#'}
                  onClick={(e) => {
                    if (item.onClick) {
                      e.preventDefault()
                      item.onClick()
                    }
                    setOpen(false)
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.6rem',
                    padding: '0.45rem 0.6rem',
                    borderRadius: 'var(--radius-base)',
                    textDecoration: 'none',
                    color: 'var(--color-gray-300)',
                    transition: 'background var(--duration-fast)',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--color-default)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent' }}
                >
                  {item.icon && (
                    <span style={{ flexShrink: 0, marginTop: '2px', color: 'var(--color-primary)', fontSize: '1rem' }}>
                      {item.icon}
                    </span>
                  )}
                  <span>
                    <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500 }}>{item.label}</span>
                    {item.description && (
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-gray-600)', marginTop: '2px' }}>
                        {item.description}
                      </span>
                    )}
                  </span>
                </a>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
