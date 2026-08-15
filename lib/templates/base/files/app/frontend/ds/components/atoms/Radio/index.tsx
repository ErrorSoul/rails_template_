import React, { useState } from 'react'
import { cn } from '../../../utils/cn'

export type RadioVariant = 'primary' | 'info' | 'success' | 'warning' | 'danger'

export interface RadioProps {
  checked: boolean
  onChange: (value: string) => void
  label?: string
  name?: string
  value?: string
  disabled?: boolean
  variant?: RadioVariant
  className?: string
}

export function Radio({
  checked,
  onChange,
  label,
  name,
  value = '',
  disabled = false,
  variant = 'info',
  className,
}: RadioProps) {
  const [hovered, setHovered] = useState(false)

  const handleClick = () => {
    if (!disabled) onChange(value)
  }

  return (
    <label
      className={cn('ds-radio', className)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.75rem',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        userSelect: 'none',
        fontFamily: 'var(--font-base)',
      }}
      onClick={handleClick}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => {}}
        disabled={disabled}
        style={{ display: 'none' }}
        aria-hidden="true"
      />
      <span
        role="radio"
        aria-checked={checked}
        aria-disabled={disabled}
        onMouseEnter={() => !disabled && setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          background: checked
            ? `var(--gradient-${variant})`
            : hovered
            ? 'rgba(var(--color-accent-rgb), 0.15)'
            : 'transparent',
          border: checked ? 'none' : '1px solid var(--color-default)',
          transition: 'background 0.2s ease, border 0.2s ease',
          flexShrink: 0,
        }}
      >
        {checked && (
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#fff',
            }}
          />
        )}
      </span>
      {label && (
        <span
          style={{
            color: 'var(--color-gray-300)',
            fontSize: 'var(--font-size-base)',
          }}
        >
          {label}
        </span>
      )}
    </label>
  )
}
