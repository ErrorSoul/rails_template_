import { useState } from 'react'
import { cn } from '../../../utils/cn'

interface CardProps {
  children?: React.ReactNode
  title?: string
  subtitle?: string
  image?: string
  footer?: React.ReactNode
  plain?: boolean
  className?: string
}

export function Card({ children, title, subtitle, image, footer, plain = false, className }: CardProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className={cn('flex flex-col overflow-hidden', className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: plain ? 'none' : hovered ? 'var(--shadow-lg)' : 'var(--shadow-base)',
        fontFamily: 'var(--font-base)',
        transform: hovered && !plain ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'transform var(--duration-normal) var(--ease-out), box-shadow var(--duration-normal) var(--ease-out)',
      }}
    >
      {image && (
        <img
          src={image}
          alt={title ?? ''}
          style={{ width: '100%', objectFit: 'cover', maxHeight: '200px', display: 'block' }}
        />
      )}

      {(title || subtitle || children) && (
        <div style={{ padding: 'var(--spacing-4)', flex: 1 }}>
          {title && (
            <p style={{ color: 'var(--color-gray-300)', fontWeight: 600, fontSize: '1rem', marginBottom: subtitle ? '0.25rem' : 0 }}>
              {title}
            </p>
          )}
          {subtitle && (
            <p style={{ color: 'var(--color-gray-600)', fontSize: '0.75rem', marginBottom: children ? 'var(--spacing-2)' : 0 }}>
              {subtitle}
            </p>
          )}
          {children && <div style={{ color: 'var(--color-gray-500)', fontSize: 'var(--font-size-base)' }}>{children}</div>}
        </div>
      )}

      {footer && (
        <div style={{ borderTop: '1px solid var(--color-default)', padding: 'var(--spacing-3) var(--spacing-4)' }}>
          {footer}
        </div>
      )}
    </div>
  )
}
