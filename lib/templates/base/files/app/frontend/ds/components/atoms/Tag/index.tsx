import React from 'react'
import { cn } from '../../../utils/cn'

export type TagVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger'
export type TagSize = 'sm' | 'md'

export interface TagProps {
  label: string
  variant?: TagVariant
  removable?: boolean
  onRemove?: () => void
  size?: TagSize
  className?: string
}

const variantStyles: Record<TagVariant, { bg: string; color: string; border: string }> = {
  default:  { bg: 'rgba(255,255,255,0.06)', color: 'var(--color-gray-300)', border: 'rgba(255,255,255,0.12)' },
  primary:  { bg: 'rgba(var(--color-accent-rgb), 0.15)', color: 'var(--color-primary)', border: 'rgba(var(--color-accent-rgb), 0.3)' },
  success:  { bg: 'rgba(0,242,195,0.12)', color: 'var(--color-success)', border: 'rgba(0,242,195,0.25)' },
  warning:  { bg: 'rgba(255,141,114,0.12)', color: 'var(--color-warning)', border: 'rgba(255,141,114,0.25)' },
  danger:   { bg: 'rgba(253,93,147,0.12)', color: 'var(--color-danger)', border: 'rgba(253,93,147,0.25)' },
}

const sizeStyles: Record<TagSize, { fontSize: string; padding: string; gap: string }> = {
  sm: { fontSize: '0.7rem',  padding: '0.1rem 0.5rem', gap: '0.25rem' },
  md: { fontSize: '0.8rem',  padding: '0.2rem 0.65rem', gap: '0.3rem' },
}

export function Tag({ label, variant = 'default', removable = false, onRemove, size = 'md', className }: TagProps) {
  const { bg, color, border } = variantStyles[variant]
  const { fontSize, padding, gap } = sizeStyles[size]

  return (
    <span
      className={cn('ds-tag', className)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap,
        fontSize,
        fontFamily: 'var(--font-base)',
        fontWeight: 500,
        padding,
        borderRadius: '9999px',
        background: bg,
        color,
        border: `1px solid ${border}`,
        whiteSpace: 'nowrap',
        transition: 'opacity 0.15s ease',
      }}
    >
      {label}
      {removable && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${label}`}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'inherit',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            opacity: 0.7,
            fontSize: '0.75em',
            lineHeight: 1,
            transition: 'opacity 0.15s ease',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.7' }}
        >
          ✕
        </button>
      )}
    </span>
  )
}
