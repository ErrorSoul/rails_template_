import React from 'react'
import { cn } from '../../../utils/cn'
import { Navbar, type NavLink } from '../../organisms/Navbar'

export interface LandingLayoutProps {
  brand?: string
  navLinks?: NavLink[]
  navActions?: React.ReactNode
  hero?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export function LandingLayout({
  brand,
  navLinks = [],
  navActions,
  hero,
  children,
  footer,
  className,
}: LandingLayoutProps) {
  return (
    <div
      className={cn('ds-landing-layout', className)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: 'var(--color-bg)',
      }}
    >
      <Navbar brand={brand} links={navLinks} actions={navActions} transparent />

      {hero && (
        <section
          className="ds-landing-layout__hero"
          style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-info) 100%)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(30, 30, 47, 0.6)',
            }}
          />
          <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
            {hero}
          </div>
        </section>
      )}

      <main
        className="ds-landing-layout__content"
        style={{
          padding: '2rem',
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >
        {children}
      </main>

      {footer && (
        <footer
          className="ds-landing-layout__footer"
          style={{
            padding: '1.5rem 2rem',
            borderTop: '1px solid var(--color-default)',
            background: 'var(--color-surface)',
            fontFamily: 'var(--font-base)',
            fontSize: '0.8rem',
            color: 'var(--color-gray-600)',
            textAlign: 'center',
          }}
        >
          {footer}
        </footer>
      )}
    </div>
  )
}
