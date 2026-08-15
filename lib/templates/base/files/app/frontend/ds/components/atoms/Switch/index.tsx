import React from 'react'
import { cn } from '../../../utils/cn'

export type SwitchVariant = 'primary' | 'info' | 'success' | 'warning' | 'danger'

export interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
  size?: 'sm' | 'md'
  variant?: SwitchVariant
  className?: string
}

const sizes = {
  sm: { trackW: 32, trackH: 18, thumbSize: 14 },
  md: { trackW: 44, trackH: 24, thumbSize: 20 },
}

export function Switch({
  checked,
  onChange,
  label,
  disabled = false,
  size = 'md',
  variant = 'info',
  className,
}: SwitchProps) {
  const { trackW, trackH, thumbSize } = sizes[size]
  const thumbOffset = trackH / 2 - thumbSize / 2

  const handleClick = () => {
    if (!disabled) onChange(!checked)
  }

  return (
    <label
      className={cn('ds-switch', className)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.75rem',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        userSelect: 'none',
      }}
      onClick={handleClick}
    >
      <span
        role="switch"
        aria-checked={checked}
        data-size={size}
        style={{
          position: 'relative',
          display: 'inline-block',
          width: `${trackW}px`,
          height: `${trackH}px`,
          borderRadius: '999px',
          background: checked ? `var(--gradient-${variant})` : 'var(--color-default)',
          transition: 'background 0.2s ease',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: `${thumbOffset}px`,
            left: checked ? `${trackW - thumbSize - thumbOffset}px` : `${thumbOffset}px`,
            width: `${thumbSize}px`,
            height: `${thumbSize}px`,
            borderRadius: '50%',
            backgroundColor: 'var(--color-white)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
            transition: 'left 0.2s cubic-bezier(0.34, 1.61, 0.7, 1)',
          }}
        />
      </span>
      {label && (
        <span
          style={{
            color: 'var(--color-gray-300)',
            fontSize: 'var(--font-size-base)',
            fontFamily: 'var(--font-base)',
          }}
        >
          {label}
        </span>
      )}
    </label>
  )
}
