import React, { useEffect, useState } from 'react'
import { cn } from '../../../utils/cn'
import type { ToastData, ToastPosition, ToastVariant } from './ToastContext'

const variantColors: Record<ToastVariant, string> = {
  success: 'var(--color-success)',
  info: 'var(--color-info)',
  warning: 'var(--color-warning)',
  danger: 'var(--color-danger)',
}

const variantGradients: Record<ToastVariant, string> = {
  success: 'var(--gradient-success)',
  info:    'var(--gradient-info)',
  warning: 'var(--gradient-warning)',
  danger:  'var(--gradient-danger)',
}

const variantIcons: Record<ToastVariant, string> = {
  success: '✓',
  info: 'i',
  warning: '!',
  danger: '✕',
}

function getSlideInAnimation(position: ToastPosition): string {
  if (position.includes('right')) return 'toast-slide-in-right 0.3s cubic-bezier(0.4,0,0.2,1) forwards'
  if (position.includes('left')) return 'toast-slide-in-left 0.3s cubic-bezier(0.4,0,0.2,1) forwards'
  if (position.startsWith('top')) return 'toast-slide-in-top 0.3s cubic-bezier(0.4,0,0.2,1) forwards'
  return 'toast-slide-in-bottom 0.3s cubic-bezier(0.4,0,0.2,1) forwards'
}

function getSlideOutAnimation(position: ToastPosition): string {
  if (position.includes('right')) return 'toast-slide-out-right 0.2s ease forwards'
  if (position.includes('left')) return 'toast-slide-out-left 0.2s ease forwards'
  return 'toast-slide-out-right 0.2s ease forwards'
}

export interface ToastProps extends ToastData {
  onDismiss: (id: string) => void
  position: ToastPosition
  isExiting: boolean
  className?: string
}

export function Toast({
  id,
  variant,
  title,
  message,
  duration = 5000,
  onDismiss,
  position,
  isExiting,
  className,
}: ToastProps) {
  const [hovered, setHovered] = useState(false)
  const color = variantColors[variant]

  useEffect(() => {
    if (duration === 0) return
    const timer = setTimeout(() => onDismiss(id), duration)
    return () => clearTimeout(timer)
  }, [id, duration, onDismiss])

  const animation = isExiting
    ? getSlideOutAnimation(position)
    : getSlideInAnimation(position)

  return (
    <div
      className={cn('ds-toast', className)}
      role="alert"
      aria-live="polite"
      data-variant={variant}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '360px',
        maxWidth: 'calc(100vw - 2rem)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        padding: '0.875rem 1rem',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-raised)',
        background: `color-mix(in srgb, ${color} 10%, rgba(34,42,66,0.95))`,
        backdropFilter: 'blur(10px)',
        borderLeft: `4px solid ${color}`,
        fontFamily: 'var(--font-base)',
        fontSize: 'var(--font-size-base)',
        animation,
        opacity: hovered ? 0.95 : 1,
      }}
    >
      {/* Icon */}
      <div
        aria-hidden="true"
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: variantGradients[variant],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'var(--color-white)',
        }}
      >
        {variantIcons[variant]}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && (
          <div
            style={{
              fontWeight: 600,
              color: 'var(--color-gray-100)',
              marginBottom: '0.125rem',
              fontSize: '0.875rem',
            }}
          >
            {title}
          </div>
        )}
        <div style={{ color: 'var(--color-gray-400)', fontSize: '0.8125rem', lineHeight: 1.5 }}>
          {message}
        </div>
      </div>

      {/* Close button */}
      <button
        aria-label="Close notification"
        onClick={() => onDismiss(id)}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--color-gray-500)',
          cursor: 'pointer',
          padding: '0.125rem',
          lineHeight: 1,
          fontSize: '1rem',
          flexShrink: 0,
          transition: 'var(--transition-base)',
        }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--color-gray-300)'
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--color-gray-500)'
        }}
      >
        ✕
      </button>
    </div>
  )
}
