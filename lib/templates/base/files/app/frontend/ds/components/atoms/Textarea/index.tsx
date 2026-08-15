import React, { useState } from 'react'
import { cn } from '../../../utils/cn'

export interface TextareaProps {
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  rows?: number
  maxLength?: number
  disabled?: boolean
  error?: string
  label?: string
  resize?: 'none' | 'vertical' | 'both'
  className?: string
}

export function Textarea({
  value,
  onChange,
  placeholder,
  rows = 4,
  maxLength,
  disabled = false,
  error,
  label,
  resize = 'vertical',
  className,
}: TextareaProps) {
  const [focused, setFocused] = useState(false)

  const borderColor = error
    ? 'var(--color-danger)'
    : focused
    ? 'var(--color-info)'
    : 'var(--color-default)'

  const boxShadow =
    focused && !error
      ? '0 0 0 3px rgba(var(--color-accent-rgb), 0.18)'
      : error && focused
      ? '0 0 0 3px rgba(253, 93, 147, 0.18)'
      : 'none'

  const charCount = value?.length ?? 0

  return (
    <div
      className={cn('ds-textarea-wrapper', className)}
      style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontFamily: 'var(--font-base)' }}
    >
      {label && (
        <label style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)', fontWeight: 500 }}>
          {label}
        </label>
      )}

      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        aria-invalid={!!error}
        style={{
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
          resize,
          transition: 'border-color var(--duration-fast), box-shadow var(--duration-fast)',
          boxShadow,
          opacity: disabled ? 0.6 : 1,
          cursor: disabled ? 'not-allowed' : 'text',
          boxSizing: 'border-box',
          lineHeight: 1.5,
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {error ? (
          <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-danger)' }}>{error}</span>
        ) : (
          <span />
        )}
        {maxLength !== undefined && (
          <span
            style={{
              fontSize: 'var(--font-size-xs)',
              color: charCount >= maxLength ? 'var(--color-danger)' : 'var(--color-gray-600)',
            }}
          >
            {charCount}/{maxLength}
          </span>
        )}
      </div>
    </div>
  )
}
