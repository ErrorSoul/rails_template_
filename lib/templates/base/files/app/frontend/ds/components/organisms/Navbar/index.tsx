import React, { useState, useEffect } from 'react'
import { cn } from '../../../utils/cn'
import { SearchInput } from '../../molecules/SearchInput'
import { NavDropdown, type NavDropdownSection } from '../../molecules/NavDropdown'

export interface NavLink {
  label: string
  href: string
  active?: boolean
  megaMenu?: NavDropdownSection[]
}

export type NavbarVariant = 'default' | 'transparent' | 'search' | 'mega'

export interface NavbarProps {
  brand?: string
  links?: NavLink[]
  actions?: React.ReactNode
  transparent?: boolean
  variant?: NavbarVariant
  onSearch?: (query: string) => void
  className?: string
}

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') return window.innerWidth < breakpoint
    return false
  })
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [breakpoint])
  return isMobile
}

export function Navbar({
  brand = 'Design System',
  links = [],
  actions,
  transparent = false,
  variant = 'default',
  onSearch,
  className,
}: NavbarProps) {
  const isMobile = useIsMobile()
  const [menuOpen, setMenuOpen] = useState(false)
  const isTransparent = transparent || variant === 'transparent'
  const isSearch = variant === 'search'
  const isMega = variant === 'mega'

  return (
    <nav
      className={cn('ds-navbar', `ds-navbar--${variant}`, className)}
      style={{
        height: '64px',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 'var(--spacing-4)',
        paddingRight: 'var(--spacing-4)',
        background: isTransparent ? 'transparent' : 'var(--color-surface)',
        borderBottom: isTransparent ? 'none' : '1px solid var(--color-default)',
        boxShadow: isTransparent ? 'none' : 'var(--shadow-base)',
        boxSizing: 'border-box',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      {/* Brand */}
      <a
        href="/"
        className="ds-navbar__brand"
        style={{
          fontFamily: 'var(--font-base)',
          fontWeight: 700,
          fontSize: '1rem',
          color: 'var(--color-primary)',
          textDecoration: 'none',
          flexShrink: 0,
        }}
      >
        {brand}
      </a>

      {/* Search variant — centered search input */}
      {isSearch && !isMobile && (
        <div style={{ flex: 1, maxWidth: 480, marginLeft: 'var(--spacing-4)', marginRight: 'var(--spacing-4)' }}>
          <SearchInput
            placeholder="Search products..."
            onSearch={onSearch ?? (() => {})}
            fullWidth
          />
        </div>
      )}

      {/* Nav links — hidden on mobile */}
      {links.length > 0 && !isMobile && !isSearch && (
        <ul
          className="ds-navbar__links"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            listStyle: 'none',
            margin: 0,
            padding: 0,
          }}
        >
          {links.map((link) =>
            isMega && link.megaMenu ? (
              <li key={link.href}>
                <NavDropdown
                  trigger={
                    <span
                      style={{
                        fontFamily: 'var(--font-base)',
                        fontWeight: 500,
                        fontSize: '0.875rem',
                        color: link.active ? 'var(--color-primary)' : 'var(--color-gray-500)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}
                    >
                      {link.label} <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>▼</span>
                    </span>
                  }
                  items={link.megaMenu}
                  width="lg"
                />
              </li>
            ) : (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={cn('ds-navbar__link', link.active && 'ds-navbar__link--active')}
                  data-active={link.active ? 'true' : undefined}
                  style={{
                    fontFamily: 'var(--font-base)',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    color: link.active ? 'var(--color-primary)' : 'var(--color-gray-500)',
                    textDecoration: 'none',
                    transition: 'var(--transition-base)',
                  }}
                  onMouseEnter={(e) => {
                    if (!link.active) {
                      (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-gray-300)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!link.active) {
                      (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-gray-500)'
                    }
                  }}
                >
                  {link.label}
                </a>
              </li>
            )
          )}
        </ul>
      )}

      {/* Right side: actions + mobile burger */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', flexShrink: 0 }}>
        {actions && (
          <div
            className="ds-navbar__actions"
            style={{
              display: isMobile ? 'none' : 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-2)',
            }}
          >
            {actions}
          </div>
        )}

        {isMobile && links.length > 0 && (
          <button
            className="ds-navbar__burger"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-gray-400)',
              fontSize: '1.4rem',
              cursor: 'pointer',
              padding: '0.25rem',
              lineHeight: 1,
            }}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        )}
      </div>

      {/* Mobile dropdown menu */}
      {isMobile && menuOpen && (
        <div
          className="ds-navbar__mobile-menu"
          style={{
            position: 'absolute',
            top: '64px',
            left: 0,
            right: 0,
            background: 'var(--color-surface)',
            borderBottom: '1px solid var(--color-default)',
            boxShadow: 'var(--shadow-raised)',
            zIndex: 999,
            padding: '0.5rem 0',
          }}
        >
          {isSearch && (
            <div style={{ padding: '0.5rem var(--spacing-4)' }}>
              <SearchInput
                placeholder="Search..."
                onSearch={onSearch ?? (() => {})}
                fullWidth
              />
            </div>
          )}
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                display: 'block',
                padding: '0.75rem var(--spacing-4)',
                fontFamily: 'var(--font-base)',
                fontSize: '0.875rem',
                fontWeight: link.active ? 600 : 400,
                color: link.active ? 'var(--color-primary)' : 'var(--color-gray-400)',
                textDecoration: 'none',
                transition: 'var(--transition-base)',
              }}
            >
              {link.label}
            </a>
          ))}
          {actions && (
            <div style={{ padding: '0.5rem var(--spacing-4)' }}>
              {actions}
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
