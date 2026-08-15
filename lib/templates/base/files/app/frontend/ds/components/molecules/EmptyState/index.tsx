import React from 'react'
import { cn } from '../../../utils/cn'

export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn('ds-empty-state', className)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 2rem',
        textAlign: 'center',
        fontFamily: 'var(--font-base)',
      }}
    >
      {icon && (
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'var(--color-surface-alt)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem',
            fontSize: '1.75rem',
          }}
          aria-hidden="true"
        >
          {icon}
        </div>
      )}

      <p
        style={{
          margin: 0,
          color: 'var(--color-gray-200)',
          fontSize: 'var(--font-size-base)',
          fontWeight: 600,
        }}
      >
        {title}
      </p>

      {description && (
        <p
          style={{
            margin: '0.5rem 0 0',
            color: 'var(--color-gray-500)',
            fontSize: 'var(--font-size-sm)',
            maxWidth: '24rem',
            lineHeight: 1.5,
          }}
        >
          {description}
        </p>
      )}

      {action && (
        <div style={{ marginTop: '1.5rem' }}>
          {action}
        </div>
      )}
    </div>
  )
}
