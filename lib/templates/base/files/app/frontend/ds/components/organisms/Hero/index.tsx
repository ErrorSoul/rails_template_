import React from 'react'
import { cn } from '../../../utils/cn'

export type HeroBackgroundVariant = 'gradient' | 'dark' | 'mesh'

export interface HeroProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
  backgroundVariant?: HeroBackgroundVariant
  className?: string
}

const backgroundStyles: Record<HeroBackgroundVariant, React.CSSProperties> = {
  gradient: {
    background: 'linear-gradient(135deg, var(--color-surface) 0%, var(--color-surface-alt) 50%, #1e1b4b 100%)',
  },
  dark: {
    background: 'var(--color-bg)',
  },
  mesh: {
    background:
      'radial-gradient(ellipse at 20% 50%, rgba(225,78,202,0.15) 0%, transparent 50%), ' +
      'radial-gradient(ellipse at 80% 20%, rgba(29,140,248,0.15) 0%, transparent 50%), ' +
      'var(--color-bg)',
  },
}

export function Hero({
  title,
  subtitle,
  actions,
  backgroundVariant = 'mesh',
  className,
}: HeroProps) {
  return (
    <section
      className={cn('ds-hero', className)}
      style={{
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        padding: '5rem 1.5rem',
        textAlign: 'center',
        ...backgroundStyles[backgroundVariant],
      }}
    >
      {/* Decorative orbs */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-80px',
          right: '-80px',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(225,78,202,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '-60px',
          left: '-60px',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(29,140,248,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '720px',
          margin: '0 auto',
        }}
      >
        <h1
          className="ds-hero__title"
          style={{
            fontFamily: 'var(--font-base)',
            fontWeight: 700,
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            lineHeight: 1.15,
            margin: '0 0 1rem',
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {title}
        </h1>

        {subtitle && (
          <p
            className="ds-hero__subtitle"
            style={{
              fontFamily: 'var(--font-base)',
              fontSize: 'clamp(0.9rem, 2vw, 1.125rem)',
              color: 'var(--color-gray-500)',
              lineHeight: 1.7,
              margin: '0 0 2.5rem',
            }}
          >
            {subtitle}
          </p>
        )}

        {actions && (
          <div
            className="ds-hero__actions"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            {actions}
          </div>
        )}
      </div>
    </section>
  )
}
