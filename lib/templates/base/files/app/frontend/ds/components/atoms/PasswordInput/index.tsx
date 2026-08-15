import React, { useState } from 'react'
import { cn } from '../../../utils/cn'

export interface PasswordInputProps {
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  label?: string
  error?: string
  strength?: 'weak' | 'fair' | 'strong'
  showStrength?: boolean
  disabled?: boolean
  className?: string
}

const strengthColors: Record<string, string> = {
  weak: 'var(--color-danger)',
  fair: 'var(--color-warning)',
  strong: 'var(--color-success)',
}

const strengthLabels: Record<string, string> = {
  weak: 'Weak',
  fair: 'Fair',
  strong: 'Strong',
}

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
    <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
  </svg>
)

export function PasswordInput({
  value,
  onChange,
  placeholder = 'Enter password',
  label,
  error,
  strength,
  showStrength = false,
  disabled = false,
  className,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false)
  const [focused, setFocused] = useState(false)

  const borderColor = error
    ? 'var(--color-danger)'
    : focused
    ? 'var(--color-primary)'
    : 'var(--color-default)'

  return (
    <div
      className={cn('ds-password-input', className)}
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

      <div style={{ position: 'relative' }}>
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-invalid={!!error}
          style={{
            display: 'block',
            width: '100%',
            padding: '0.5rem 2.5rem 0.5rem 1rem',
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
          }}
        />

        <button
          type="button"
          onClick={() => setVisible(!visible)}
          disabled={disabled}
          aria-label={visible ? 'Hide password' : 'Show password'}
          style={{
            position: 'absolute',
            right: '0.5rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: disabled ? 'not-allowed' : 'pointer',
            color: 'var(--color-gray-500)',
            padding: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: disabled ? 0.5 : 1,
          }}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
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

      {showStrength && strength && (
        <div style={{ marginTop: '0.25rem' }}>
          <div
            style={{
              display: 'flex',
              gap: '0.25rem',
              marginBottom: '0.25rem',
            }}
          >
            {(['weak', 'fair', 'strong'] as const).map((level) => {
              const active =
                level === 'weak' ||
                (level === 'fair' && (strength === 'fair' || strength === 'strong')) ||
                (level === 'strong' && strength === 'strong')
              return (
                <div
                  key={level}
                  data-testid={`strength-bar-${level}`}
                  style={{
                    flex: 1,
                    height: '3px',
                    borderRadius: '2px',
                    background: active ? strengthColors[strength] : 'var(--color-default)',
                    transition: 'background var(--duration-fast) ease',
                  }}
                />
              )
            })}
          </div>
          <span
            data-testid="strength-label"
            style={{
              fontSize: '0.7rem',
              fontFamily: 'var(--font-base)',
              color: strengthColors[strength],
            }}
          >
            {strengthLabels[strength]}
          </span>
        </div>
      )}
    </div>
  )
}
