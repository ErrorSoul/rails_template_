import React, { useState } from 'react'
import { cn } from '../../../utils/cn'

export interface InputProps {
  type?: React.HTMLInputTypeAttribute
  placeholder?: string
  value?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  disabled?: boolean
  label?: string
  error?: string
  className?: string
}

export function Input({
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  label,
  error,
  className,
}: InputProps) {
  const [focused, setFocused] = useState(false)

  const borderColor = error
    ? 'var(--color-danger)'
    : focused
    ? 'var(--color-primary)'
    : 'var(--color-default)'

  const inputStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    padding: '0.5rem 1rem',
    fontSize: 'var(--font-size-base)',
    fontFamily: 'var(--font-base)',
    color: 'var(--color-white)',
    backgroundColor: 'var(--color-surface)',
    border: `1px solid ${borderColor}`,
    borderRadius: 'var(--radius-base)',
    outline: 'none',
    transition: 'border-color var(--duration-fast) ease, box-shadow var(--duration-fast) ease',
    boxShadow: focused && !error
      ? '0 0 0 3px rgba(var(--color-accent-rgb), 0.18)'
      : error && focused
      ? '0 0 0 3px rgba(253, 93, 147, 0.18)'
      : 'none',
    opacity: disabled ? 0.6 : 1,
    cursor: disabled ? 'not-allowed' : 'text',
    boxSizing: 'border-box',
  }

  return (
    <div className={cn('ds-input-wrapper', className)} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      {label && (
        <label
          style={{
            fontSize: 'var(--font-size-sm)',
            fontFamily: 'var(--font-base)',
            color: 'var(--color-gray-500)',
            fontWeight: 500,
          }}
        >
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        style={inputStyle}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        aria-invalid={!!error}
        aria-describedby={error ? 'input-error' : undefined}
      />
      {error && (
        <span
          id="input-error"
          style={{
            fontSize: 'var(--font-size-sm)',
            fontFamily: 'var(--font-base)',
            color: 'var(--color-danger)',
          }}
        >
          {error}
        </span>
      )}
    </div>
  )
}
