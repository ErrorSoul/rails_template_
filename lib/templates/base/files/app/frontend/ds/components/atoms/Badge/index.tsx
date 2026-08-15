import React, { useState } from 'react'
import { cn } from '../../../utils/cn'

export type BadgeVariant = 'primary' | 'info' | 'success' | 'warning' | 'danger' | 'default'

export interface BadgeProps {
  variant?: BadgeVariant
  children?: React.ReactNode
  className?: string
}

const variantColors: Record<BadgeVariant, string> = {
  primary: 'var(--color-primary)',
  info:    'var(--color-info)',
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  danger:  'var(--color-danger)',
  default: 'var(--color-default)',
}

export function Badge({ variant = 'primary', children, className }: BadgeProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <span
      className={cn('ds-badge', className)}
      data-variant={variant}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-block',
        padding: '0.2em 0.6em',
        fontSize: '0.7rem',
        fontFamily: 'var(--font-base)',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        color: 'var(--color-white)',
        backgroundColor: variantColors[variant],
        borderRadius: '30px',
        lineHeight: 1.4,
        whiteSpace: 'nowrap',
        transition: 'transform var(--duration-fast) var(--ease-out)',
        transform: hovered ? 'scale(1.08)' : 'scale(1)',
        cursor: 'default',
      }}
    >
      {children}
    </span>
  )
}
