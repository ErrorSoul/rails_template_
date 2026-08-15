import React, { useState, useRef, useEffect } from 'react'
import { cn } from '../../../utils/cn'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps {
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  label?: string
  error?: string
  className?: string
}

const SIZE_STYLES = {
  sm: { padding: '0.3rem 0.75rem', fontSize: '0.8rem', minHeight: '32px' },
  md: { padding: '0.5rem 1rem', fontSize: 'var(--font-size-base)', minHeight: '40px' },
  lg: { padding: '0.65rem 1.25rem', fontSize: '1.05rem', minHeight: '48px' },
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
      style={{
        transition: 'transform var(--duration-fast)',
        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        flexShrink: 0,
      }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  size = 'md',
  label,
  error,
  className,
}: SelectProps) {
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const selectedOption = options.find((o) => o.value === value)

  const borderColor = error
    ? 'var(--color-danger)'
    : focused || open
    ? 'var(--color-info)'
    : 'var(--color-default)'

  const boxShadow =
    (focused || open) && !error
      ? '0 0 0 3px rgba(var(--color-accent-rgb), 0.18)'
      : error && (focused || open)
      ? '0 0 0 3px rgba(253, 93, 147, 0.18)'
      : 'none'

  // Close on outside click
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  function handleToggle() {
    if (disabled) return
    setOpen((o) => !o)
    setFocused(true)
    setActiveIndex(-1)
  }

  function handleSelect(option: SelectOption) {
    if (option.disabled) return
    onChange?.(option.value)
    setOpen(false)
    setFocused(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (disabled) return
    const enabledOptions = options.filter((o) => !o.disabled)
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        setOpen(true)
        setActiveIndex(0)
      }
      return
    }
    if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, enabledOptions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIndex >= 0 && activeIndex < enabledOptions.length) {
        handleSelect(enabledOptions[activeIndex])
      }
    }
  }

  return (
    <div
      ref={containerRef}
      className={cn('ds-select', className)}
      style={{ position: 'relative', fontFamily: 'var(--font-base)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}
    >
      {label && (
        <label style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)', fontWeight: 500 }}>
          {label}
        </label>
      )}

      {/* Trigger */}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label ?? placeholder}
        disabled={disabled}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => { if (!open) setFocused(false) }}
        style={{
          ...SIZE_STYLES[size],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
          width: '100%',
          background: 'var(--color-surface)',
          border: `1px solid ${borderColor}`,
          borderRadius: 'var(--radius-base)',
          color: selectedOption ? 'var(--color-white)' : 'var(--color-gray-600)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          boxShadow,
          transition: 'border-color var(--duration-fast), box-shadow var(--duration-fast)',
          outline: 'none',
          textAlign: 'left',
        }}
      >
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronIcon open={open} />
      </button>

      {/* Dropdown */}
      {open && (
        <ul
          ref={listRef}
          role="listbox"
          aria-label={label ?? placeholder}
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            background: 'var(--color-surface)',
            border: '1px solid var(--color-default)',
            borderRadius: 'var(--radius-base)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 999,
            listStyle: 'none',
            margin: 0,
            padding: '0.25rem',
            maxHeight: '200px',
            overflowY: 'auto',
          }}
        >
          {options.map((option, idx) => {
            const enabledOptions = options.filter((o) => !o.disabled)
            const enabledIdx = enabledOptions.indexOf(option)
            const isActive = enabledIdx === activeIndex
            const isSelected = option.value === value
            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                aria-disabled={option.disabled}
                onClick={() => handleSelect(option)}
                style={{
                  padding: '0.45rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  cursor: option.disabled ? 'not-allowed' : 'pointer',
                  opacity: option.disabled ? 0.45 : 1,
                  color: isSelected ? 'var(--color-white)' : 'var(--color-gray-200)',
                  background: isSelected
                    ? 'var(--color-info)'
                    : isActive
                    ? 'rgba(255,255,255,0.06)'
                    : 'transparent',
                  fontSize: SIZE_STYLES[size].fontSize,
                  transition: 'background var(--duration-fast)',
                }}
              >
                {option.label}
              </li>
            )
          })}
        </ul>
      )}

      {error && (
        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-danger)' }}>
          {error}
        </span>
      )}
    </div>
  )
}
