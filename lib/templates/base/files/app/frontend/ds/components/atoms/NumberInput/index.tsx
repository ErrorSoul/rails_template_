import React, { useState } from 'react'
import { cn } from '../../../utils/cn'

export interface NumberInputProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  label?: string
  error?: string
  className?: string
}

const sizePadding: Record<string, string> = {
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
}

const sizeFontSize: Record<string, string> = {
  sm: 'var(--font-size-sm)',
  md: 'var(--font-size-base)',
  lg: 'var(--font-size-lg)',
}

const sizeButtonWidth: Record<string, string> = {
  sm: '28px',
  md: '36px',
  lg: '44px',
}

const MinusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

function clampValue(val: number, min?: number, max?: number): number {
  let result = val
  if (min !== undefined && result < min) result = min
  if (max !== undefined && result > max) result = max
  return result
}

export function NumberInput({
  value,
  onChange,
  min,
  max,
  step = 1,
  disabled = false,
  size = 'md',
  label,
  error,
  className,
}: NumberInputProps) {
  const [focused, setFocused] = useState(false)
  const [localValue, setLocalValue] = useState<string>(String(value))

  const borderColor = error
    ? 'var(--color-danger)'
    : focused
    ? 'var(--color-primary)'
    : 'var(--color-default)'

  const increment = () => {
    if (disabled) return
    const next = clampValue(value + step, min, max)
    onChange(next)
    setLocalValue(String(next))
  }

  const decrement = () => {
    if (disabled) return
    const next = clampValue(value - step, min, max)
    onChange(next)
    setLocalValue(String(next))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value)
  }

  const handleBlur = () => {
    setFocused(false)
    const parsed = parseFloat(localValue)
    if (isNaN(parsed)) {
      setLocalValue(String(value))
    } else {
      const clamped = clampValue(parsed, min, max)
      onChange(clamped)
      setLocalValue(String(clamped))
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      increment()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      decrement()
    }
  }

  // Sync local with prop when prop changes externally
  React.useEffect(() => {
    if (!focused) {
      setLocalValue(String(value))
    }
  }, [value, focused])

  const buttonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: sizeButtonWidth[size],
    background: 'none',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    color: disabled ? 'var(--color-gray-700)' : 'var(--color-gray-400)',
    padding: 0,
    flexShrink: 0,
    transition: 'color var(--duration-fast) ease',
  }

  return (
    <div
      className={cn('ds-number-input', className)}
      style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}
    >
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

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--color-surface)',
          border: `1px solid ${borderColor}`,
          borderRadius: 'var(--radius-base)',
          transition: 'border-color var(--duration-fast) ease, box-shadow var(--duration-fast) ease',
          boxShadow: focused && !error
            ? '0 0 0 3px rgba(var(--color-accent-rgb), 0.18)'
            : 'none',
          opacity: disabled ? 0.6 : 1,
          overflow: 'hidden',
        }}
      >
        <button
          type="button"
          onClick={decrement}
          disabled={disabled || (min !== undefined && value <= min)}
          aria-label="Decrease value"
          style={{
            ...buttonStyle,
            borderRight: `1px solid ${borderColor}`,
          }}
        >
          <MinusIcon />
        </button>

        <input
          type="text"
          inputMode="numeric"
          value={localValue}
          onChange={handleInputChange}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-label={label || 'Number input'}
          aria-valuenow={value}
          aria-valuemin={min}
          aria-valuemax={max}
          style={{
            flex: 1,
            minWidth: 0,
            textAlign: 'center',
            padding: sizePadding[size],
            fontSize: sizeFontSize[size],
            fontFamily: 'var(--font-base)',
            color: 'var(--color-white)',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />

        <button
          type="button"
          onClick={increment}
          disabled={disabled || (max !== undefined && value >= max)}
          aria-label="Increase value"
          style={{
            ...buttonStyle,
            borderLeft: `1px solid ${borderColor}`,
          }}
        >
          <PlusIcon />
        </button>
      </div>

      {error && (
        <span
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
