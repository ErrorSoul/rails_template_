import { useState, useRef, useEffect } from 'react'
import { cn } from '../../../utils/cn'

export interface DropdownOption {
  value: string
  label: string
}

interface DropdownProps {
  options: DropdownOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function Dropdown({ options, value, onChange, placeholder = 'Выберите...', disabled = false, className }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selected = options.find(o => o.value === value)

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  function handleSelect(val: string) {
    onChange?.(val)
    setOpen(false)
  }

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(o => !o)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.5rem 1rem',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-default)',
          borderRadius: 'var(--radius-base)',
          color: selected ? 'var(--color-gray-300)' : 'var(--color-gray-600)',
          fontFamily: 'var(--font-base)',
          fontSize: '0.875rem',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'var(--transition-base)',
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <span style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'var(--transition-fast)', color: 'var(--color-gray-500)' }}>
          ▼
        </span>
      </button>

      {open && (
        <div
          data-testid="dropdown-list"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            background: 'var(--color-surface-alt)',
            borderRadius: 'var(--radius-base)',
            boxShadow: 'var(--shadow-raised)',
            zIndex: 50,
            overflow: 'hidden',
            animation: 'ds-slide-down var(--duration-fast) var(--ease-out)',
          }}
        >
          {options.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '0.5rem 1rem',
                background: 'none',
                border: 'none',
                color: option.value === value ? 'var(--color-primary)' : 'var(--color-gray-300)',
                fontFamily: 'var(--font-base)',
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'var(--transition-base)',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-default)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
