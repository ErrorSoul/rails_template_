import React from 'react'
import { cn } from '../../../utils/cn'

export interface AuthLayoutProps {
  title?: string
  subtitle?: string
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
  className,
}: AuthLayoutProps) {
  return (
    <div
      className={cn('ds-auth-layout', className)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100%',
        padding: '2rem',
        background: 'linear-gradient(135deg, var(--color-bg) 0%, #1a1a2e 50%, var(--color-bg) 100%)',
        fontFamily: 'var(--font-base)',
      }}
    >
      <div
        className="ds-auth-layout__card"
        style={{
          width: '100%',
          maxWidth: '420px',
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-raised)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        {(title || subtitle) && (
          <div
            className="ds-auth-layout__header"
            style={{
              padding: '2rem 2rem 0',
              textAlign: 'center',
            }}
          >
            {title && (
              <h1
                style={{
                  margin: '0 0 0.5rem',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: 'var(--color-gray-100)',
                }}
              >
                {title}
              </h1>
            )}
            {subtitle && (
              <p
                style={{
                  margin: 0,
                  fontSize: '0.85rem',
                  color: 'var(--color-gray-600)',
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Form area */}
        <div
          className="ds-auth-layout__body"
          style={{ padding: '2rem' }}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            className="ds-auth-layout__footer"
            style={{
              padding: '1rem 2rem',
              borderTop: '1px solid var(--color-default)',
              textAlign: 'center',
              fontSize: '0.8rem',
              color: 'var(--color-gray-600)',
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
