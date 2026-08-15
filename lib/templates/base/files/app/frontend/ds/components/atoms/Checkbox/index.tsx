import React, { useState } from 'react'
import { cn } from '../../../utils/cn'

export type CheckboxVariant = 'primary' | 'info' | 'success' | 'warning' | 'danger'

export interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
  indeterminate?: boolean
  variant?: CheckboxVariant
  className?: string
}

export function Checkbox({
  checked,
  onChange,
  label,
  disabled = false,
  indeterminate = false,
  variant = 'info',
  className,
}: CheckboxProps) {
  const [hovered, setHovered] = useState(false)

  const handleClick = () => {
    if (!disabled) onChange(!checked)
  }

  const isCheckedOrIndeterminate = checked || indeterminate
  const ariaChecked: boolean | 'mixed' = indeterminate ? 'mixed' : checked

  const gradientVar = `var(--gradient-${variant})`

  return (
    <label
      className={cn('ds-checkbox', className)}
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
        type="checkbox"
        checked={checked}
        onChange={() => {}}
        disabled={disabled}
        style={{ display: 'none' }}
        aria-hidden="true"
      />
      <span
        role="checkbox"
        aria-checked={ariaChecked}
        aria-disabled={disabled}
        onMouseEnter={() => !disabled && setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '18px',
          height: '18px',
          borderRadius: 'var(--radius-xs)',
          background: isCheckedOrIndeterminate
            ? gradientVar
            : hovered
            ? 'rgba(var(--color-accent-rgb), 0.15)'
            : 'transparent',
          border: isCheckedOrIndeterminate ? 'none' : '1px solid var(--color-default)',
          transition: 'background 0.2s ease, border 0.2s ease',
          flexShrink: 0,
          fontSize: '0.7rem',
          color: '#fff',
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        {checked && !indeterminate && '✓'}
        {indeterminate && '─'}
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
