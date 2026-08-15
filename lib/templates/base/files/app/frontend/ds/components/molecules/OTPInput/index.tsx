import React, { useRef, useEffect } from 'react'
import { cn } from '../../../utils/cn'

export interface OTPInputProps {
  length?: number
  value?: string
  onChange?: (value: string) => void
  onComplete?: (value: string) => void
  disabled?: boolean
  error?: string
  autoFocus?: boolean
  className?: string
}

export function OTPInput({
  length = 6,
  value = '',
  onChange,
  onComplete,
  disabled = false,
  error,
  autoFocus = false,
  className,
}: OTPInputProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])
  const digits = Array.from({ length }, (_, i) => value[i] ?? '')

  useEffect(() => {
    if (autoFocus) inputRefs.current[0]?.focus()
  }, [autoFocus])

  function updateValue(newDigits: string[]) {
    const next = newDigits.join('')
    onChange?.(next)
    if (next.length === length && newDigits.every((d) => d !== '')) {
      onComplete?.(next)
    }
  }

  function handleChange(idx: number, e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value
    // Take last entered char (handles Android input)
    const char = raw.replace(/[^0-9]/g, '').slice(-1)
    const newDigits = [...digits]
    newDigits[idx] = char
    updateValue(newDigits)
    if (char && idx < length - 1) {
      inputRefs.current[idx + 1]?.focus()
    }
  }

  function handleKeyDown(idx: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace') {
      if (digits[idx]) {
        const newDigits = [...digits]
        newDigits[idx] = ''
        updateValue(newDigits)
      } else if (idx > 0) {
        inputRefs.current[idx - 1]?.focus()
        const newDigits = [...digits]
        newDigits[idx - 1] = ''
        updateValue(newDigits)
      }
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      inputRefs.current[idx - 1]?.focus()
    } else if (e.key === 'ArrowRight' && idx < length - 1) {
      inputRefs.current[idx + 1]?.focus()
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, length)
    if (!pasted) return
    const newDigits = [...digits]
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i]
    }
    updateValue(newDigits)
    const focusIdx = Math.min(pasted.length, length - 1)
    inputRefs.current[focusIdx]?.focus()
  }

  const borderColor = error ? 'var(--color-danger)' : 'var(--color-default)'

  return (
    <div
      className={cn('ds-otp-input', className)}
      style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontFamily: 'var(--font-base)' }}
    >
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        {Array.from({ length }).map((_, idx) => (
          <input
            key={idx}
            ref={(el) => { inputRefs.current[idx] = el }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={2}
            value={digits[idx]}
            disabled={disabled}
            onChange={(e) => handleChange(idx, e)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            aria-label={`Digit ${idx + 1}`}
            style={{
              width: '44px',
              height: '52px',
              textAlign: 'center',
              fontSize: '1.3rem',
              fontWeight: 700,
              fontFamily: 'var(--font-base)',
              color: 'var(--color-white)',
              background: 'var(--color-surface)',
              border: `2px solid ${error ? 'var(--color-danger)' : borderColor}`,
              borderRadius: 'var(--radius-base)',
              outline: 'none',
              transition: 'border-color var(--duration-fast), box-shadow var(--duration-fast)',
              cursor: disabled ? 'not-allowed' : 'text',
              opacity: disabled ? 0.6 : 1,
            }}
            onFocusCapture={(e) => {
              e.target.style.borderColor = error ? 'var(--color-danger)' : 'var(--color-info)'
              e.target.style.boxShadow = '0 0 0 3px rgba(var(--color-accent-rgb), 0.18)'
            }}
            onBlurCapture={(e) => {
              e.target.style.borderColor = error ? 'var(--color-danger)' : 'var(--color-default)'
              e.target.style.boxShadow = 'none'
            }}
          />
        ))}
      </div>
      {error && (
        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-danger)' }}>{error}</span>
      )}
    </div>
  )
}
