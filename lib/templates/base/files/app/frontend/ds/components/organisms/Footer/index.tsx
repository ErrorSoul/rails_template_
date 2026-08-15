import React from 'react'
import { cn } from '../../../utils/cn'

export interface FooterLink {
  label: string
  href: string
}

export interface FooterColumn {
  title: string
  links: FooterLink[]
}

export interface FooterSocial {
  label: string
  href: string
  icon: React.ReactNode
}

export interface FooterProps {
  brand?: string
  tagline?: string
  columns?: FooterColumn[]
  socials?: FooterSocial[]
  copyright?: string
  className?: string
}

export function Footer({
  brand = 'Design System',
  tagline,
  columns = [],
  socials = [],
  copyright,
  className,
}: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer
      className={cn('ds-footer', className)}
      style={{
        width: '100%',
        background: 'var(--color-surface)',
        borderTop: '2px solid transparent',
        backgroundClip: 'padding-box',
        position: 'relative',
      }}
    >
      {/* Gradient top border */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'var(--gradient-primary)',
        }}
      />

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '2.5rem 1.5rem 1.5rem',
        }}
      >
        {/* Main grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: columns.length > 0
              ? `1fr repeat(${Math.min(columns.length, 3)}, auto)`
              : '1fr',
            gap: '2rem',
            marginBottom: '2rem',
          }}
        >
          {/* Brand column */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-base)',
                fontWeight: 700,
                fontSize: '1.125rem',
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '0.5rem',
              }}
            >
              {brand}
            </div>
            {tagline && (
              <p
                style={{
                  fontFamily: 'var(--font-base)',
                  fontSize: '0.8rem',
                  color: 'var(--color-gray-600)',
                  lineHeight: 1.6,
                  maxWidth: '260px',
                  margin: 0,
                }}
              >
                {tagline}
              </p>
            )}
            {socials.length > 0 && (
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'var(--color-surface-alt)',
                      color: 'var(--color-gray-400)',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      transition: 'var(--transition-base)',
                      border: '1px solid var(--color-default)',
                    }}
                    onMouseEnter={(e) => {
                      ;(e.currentTarget as HTMLAnchorElement).style.background = 'var(--gradient-primary)'
                      ;(e.currentTarget as HTMLAnchorElement).style.color = '#fff'
                      ;(e.currentTarget as HTMLAnchorElement).style.borderColor = 'transparent'
                    }}
                    onMouseLeave={(e) => {
                      ;(e.currentTarget as HTMLAnchorElement).style.background = 'var(--color-surface-alt)'
                      ;(e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-gray-400)'
                      ;(e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--color-default)'
                    }}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <p
                style={{
                  fontFamily: 'var(--font-base)',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'var(--color-gray-500)',
                  marginBottom: '0.75rem',
                  margin: '0 0 0.75rem',
                }}
              >
                {col.title}
              </p>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {col.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      style={{
                        fontFamily: 'var(--font-base)',
                        fontSize: '0.8rem',
                        color: 'var(--color-gray-600)',
                        textDecoration: 'none',
                        transition: 'var(--transition-base)',
                      }}
                      onMouseEnter={(e) => {
                        ;(e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-primary)'
                      }}
                      onMouseLeave={(e) => {
                        ;(e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-gray-600)'
                      }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid var(--color-default)',
            paddingTop: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-base)',
              fontSize: '0.75rem',
              color: 'var(--color-gray-600)',
              margin: 0,
            }}
          >
            {copyright ?? `© ${year} ${brand}. All rights reserved.`}
          </p>
        </div>
      </div>
    </footer>
  )
}
