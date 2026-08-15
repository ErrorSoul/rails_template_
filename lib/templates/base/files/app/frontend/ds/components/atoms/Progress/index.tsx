import React from 'react'
import { cn } from '../../../utils/cn'

export type ProgressVariant = 'primary' | 'info' | 'success' | 'warning' | 'danger'

export interface ProgressProps {
  value: number
  variant?: ProgressVariant
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  striped?: boolean
  className?: string
}

const gradients: Record<ProgressVariant, string> = {
  primary: 'var(--gradient-primary)',
  info:    'var(--gradient-info)',
  success: 'var(--gradient-success)',
  warning: 'var(--gradient-warning)',
  danger:  'var(--gradient-danger)',
}

const heights: Record<'sm' | 'md' | 'lg', number> = {
  sm: 6,
  md: 10,
  lg: 16,
}

export function Progress({
  value,
  variant = 'info',
  size = 'md',
  showLabel = false,
  striped = false,
  className,
}: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value))
  const fillWidth = Math.max(2, clamped)
  const height = heights[size]
  const isLg = size === 'lg'

  const stripedStyle: React.CSSProperties = striped
    ? {
        backgroundImage: `${gradients[variant]}, repeating-linear-gradient(
          45deg,
          rgba(255,255,255,0.1) 0px,
          rgba(255,255,255,0.1) 10px,
          transparent 10px,
          transparent 20px
        )`,
        backgroundSize: '100% 100%, 28px 28px',
        animation: 'ds-progress-stripes 1s linear infinite',
      }
    : {}

  return (
    <div
      className={cn('ds-progress-wrap', className)}
      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
    >
      {striped && (
        <style>{`
          @keyframes ds-progress-stripes {
            from { background-position: 0 0, 28px 0; }
            to   { background-position: 0 0, 0 0; }
          }
        `}</style>
      )}
      <div
        style={{
          flex: 1,
          height: `${height}px`,
          backgroundColor: 'var(--color-surface-alt)',
          borderRadius: '30px',
          overflow: 'hidden',
          position: 'relative',
        }}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        data-size={size}
        data-variant={variant}
      >
        <div
          style={{
            width: `${fillWidth}%`,
            height: '100%',
            background: striped ? undefined : gradients[variant],
            borderRadius: '30px',
            transition: 'width 0.4s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: isLg && showLabel ? '0.5rem' : undefined,
            ...stripedStyle,
          }}
        >
          {isLg && showLabel && (
            <span
              style={{
                color: 'var(--color-white)',
                fontSize: '0.65rem',
                fontWeight: 600,
                fontFamily: 'var(--font-base)',
                whiteSpace: 'nowrap',
              }}
            >
              {clamped}%
            </span>
          )}
        </div>
      </div>
      {showLabel && !isLg && (
        <span
          style={{
            color: 'var(--color-gray-400)',
            fontSize: 'var(--font-size-sm)',
            fontFamily: 'var(--font-base)',
            minWidth: '2.5rem',
            textAlign: 'right',
          }}
        >
          {clamped}%
        </span>
      )}
    </div>
  )
}
