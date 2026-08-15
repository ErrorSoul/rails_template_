import React, { useState } from 'react'
import { cn } from '../../../utils/cn'

export interface BannerProps {
  children: React.ReactNode
  variant?: 'info' | 'success' | 'warning' | 'danger'
  dismissible?: boolean
  onDismiss?: () => void
  icon?: React.ReactNode
  action?: { label: string; onClick: () => void }
  sticky?: boolean
  className?: string
}

const variantColors: Record<NonNullable<BannerProps['variant']>, { bg: string; border: string; color: string }> = {
  info:    { bg: 'rgba(var(--color-info-rgb, 0,168,255), 0.15)',    border: 'rgba(var(--color-info-rgb, 0,168,255), 0.35)',    color: 'var(--color-info)' },
  success: { bg: 'rgba(0,242,195, 0.12)',  border: 'rgba(0,242,195, 0.3)',  color: 'var(--color-success)' },
  warning: { bg: 'rgba(255,141,114, 0.12)', border: 'rgba(255,141,114, 0.3)', color: 'var(--color-warning)' },
  danger:  { bg: 'rgba(253,93,147, 0.12)', border: 'rgba(253,93,147, 0.3)', color: 'var(--color-danger)' },
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

export function Banner({
  children,
  variant = 'info',
  dismissible = false,
  onDismiss,
  icon,
  action,
  sticky = false,
  className,
}: BannerProps) {
  const [dismissed, setDismissed] = useState(false)
  const { bg, border, color } = variantColors[variant]

  if (dismissed) return null

  function handleDismiss() {
    setDismissed(true)
    onDismiss?.()
  }

  return (
    <div
      data-testid="banner"
      data-variant={variant}
      className={cn('ds-banner', className)}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.6rem 1rem',
        background: bg,
        borderBottom: `1px solid ${border}`,
        fontFamily: 'var(--font-base)',
        fontSize: '0.875rem',
        color: 'var(--color-gray-200)',
        ...(sticky ? { position: 'sticky', top: 0, zIndex: 40 } : {}),
      }}
    >
      {/* Icon */}
      {icon && (
        <span
          data-testid="banner-icon"
          style={{ color, flexShrink: 0, display: 'flex', alignItems: 'center' }}
        >
          {icon}
        </span>
      )}

      {/* Content */}
      <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {children}
      </span>

      {/* Action button */}
      {action && (
        <button
          type="button"
          data-testid="banner-action"
          onClick={action.onClick}
          style={{
            flexShrink: 0,
            background: 'none',
            border: `1px solid ${color}`,
            color,
            borderRadius: 'var(--radius-sm)',
            padding: '0.2rem 0.6rem',
            fontSize: '0.8rem',
            fontFamily: 'var(--font-base)',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'opacity var(--duration-fast)',
          }}
        >
          {action.label}
        </button>
      )}

      {/* Dismiss */}
      {dismissible && (
        <button
          type="button"
          data-testid="banner-dismiss"
          onClick={handleDismiss}
          aria-label="Dismiss"
          style={{
            flexShrink: 0,
            background: 'none',
            border: 'none',
            color: 'var(--color-gray-500)',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            transition: 'color var(--duration-fast)',
          }}
        >
          <CloseIcon />
        </button>
      )}
    </div>
  )
}
