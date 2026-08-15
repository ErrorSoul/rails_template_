import React, { useEffect } from 'react'
import { cn } from '../../../utils/cn'

export type SpinnerVariant = 'primary' | 'info' | 'success' | 'warning' | 'danger' | 'white'
export type SpinnerSize = 'sm' | 'md' | 'lg'

export interface SpinnerProps {
  size?: SpinnerSize
  variant?: SpinnerVariant
  label?: string
  className?: string
}

const sizeMap: Record<SpinnerSize, number> = {
  sm: 16,
  md: 24,
  lg: 40,
}

const variantColor: Record<SpinnerVariant, string> = {
  primary: 'var(--color-primary)',
  info:    'var(--color-info)',
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  danger:  'var(--color-danger)',
  white:   'var(--color-white)',
}

const KEYFRAME_ID = 'ds-spin-keyframes'

export function Spinner({
  size = 'md',
  variant = 'info',
  label,
  className,
}: SpinnerProps) {
  useEffect(() => {
    if (typeof document !== 'undefined' && !document.getElementById(KEYFRAME_ID)) {
      const style = document.createElement('style')
      style.id = KEYFRAME_ID
      style.textContent = '@keyframes ds-spin { to { transform: rotate(360deg) } }'
      document.head.appendChild(style)
    }
  }, [])

  const px = sizeMap[size]

  const spinnerStyle: React.CSSProperties = {
    width: px,
    height: px,
    borderRadius: '50%',
    border: '3px solid rgba(255,255,255,0.1)',
    borderTopColor: variantColor[variant],
    animation: 'ds-spin 0.8s linear infinite',
    display: 'inline-block',
    flexShrink: 0,
  }

  return (
    <span
      role="status"
      aria-label={label ?? 'Loading'}
      className={cn(className)}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
      data-size={size}
      data-variant={variant}
    >
      <span style={spinnerStyle} />
      {label && (
        <span
          style={{
            position: 'absolute',
            width: 1,
            height: 1,
            padding: 0,
            margin: -1,
            overflow: 'hidden',
            clip: 'rect(0,0,0,0)',
            whiteSpace: 'nowrap',
            border: 0,
          }}
        >
          {label}
        </span>
      )}
    </span>
  )
}
