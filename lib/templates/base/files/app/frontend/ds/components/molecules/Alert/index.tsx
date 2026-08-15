import { useState } from 'react'
import { cn } from '../../../utils/cn'

type AlertVariant = 'primary' | 'info' | 'success' | 'warning' | 'danger'

interface AlertProps {
  variant: AlertVariant
  title?: string
  children: React.ReactNode
  dismissible?: boolean
  onDismiss?: () => void
  className?: string
}

const colorMap: Record<AlertVariant, string> = {
  primary: 'var(--color-primary)',
  info: 'var(--color-info)',
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  danger: 'var(--color-danger)',
}

export function Alert({ variant, title, children, dismissible = false, onDismiss, className }: AlertProps) {
  const [hovered, setHovered] = useState(false)
  const color = colorMap[variant]

  return (
    <div
      role="alert"
      className={cn('relative', className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderLeft: `4px solid ${color}`,
        borderRadius: 'var(--radius-base)',
        padding: 'var(--spacing-3) var(--spacing-4)',
        background: `color-mix(in srgb, ${color} 12%, var(--color-surface))`,
        fontFamily: 'var(--font-base)',
        boxShadow: hovered ? `0 0 0 1px ${color}40, 0 4px 16px rgba(0,0,0,0.2)` : 'none',
        transition: 'box-shadow var(--duration-normal) ease',
      }}
    >
      {dismissible && (
        <button
          onClick={onDismiss}
          aria-label="Закрыть"
          style={{
            position: 'absolute',
            top: '0.5rem',
            right: '0.75rem',
            background: 'none',
            border: 'none',
            color: 'var(--color-gray-500)',
            fontSize: '1.25rem',
            cursor: 'pointer',
            lineHeight: 1,
            transition: 'var(--transition-base)',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-gray-300)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-gray-500)')}
        >
          ×
        </button>
      )}

      {title && (
        <p style={{ color, fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>
          {title}
        </p>
      )}
      <div style={{ color: 'var(--color-gray-300)', fontSize: '0.875rem' }}>
        {children}
      </div>
    </div>
  )
}
