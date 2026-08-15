import React, { useState } from 'react'
import { cn } from '../../../utils/cn'

export interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  onClear?: () => void
  placeholder?: string
  loading?: boolean
  className?: string
}

export function SearchInput({
  value,
  onChange,
  onClear,
  placeholder = 'Search...',
  loading = false,
  className,
}: SearchInputProps) {
  const [focused, setFocused] = useState(false)

  const handleClear = () => {
    onChange('')
    onClear?.()
  }

  return (
    <div
      className={cn('ds-search-input', className)}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        background: 'var(--color-surface)',
        border: focused
          ? '1px solid var(--color-info)'
          : '1px solid rgba(255,255,255,0.08)',
        borderRadius: 'var(--radius-lg)',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        boxShadow: focused ? '0 0 0 3px rgba(var(--color-info-rgb), 0.15)' : 'none',
        fontFamily: 'var(--font-base)',
      }}
    >
      {/* Search icon */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          color: focused ? 'var(--color-info)' : 'var(--color-gray-500)',
          transition: 'color 0.2s ease',
          pointerEvents: 'none',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </span>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '0.5rem 2.5rem',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          color: 'var(--color-gray-100)',
          fontSize: 'var(--font-size-sm)',
          fontFamily: 'var(--font-base)',
        }}
      />

      {/* Right side: spinner or clear button */}
      <span
        style={{
          position: 'absolute',
          right: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          color: 'var(--color-gray-500)',
        }}
      >
        {loading ? (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            style={{ animation: 'spin 1s linear infinite' }}
            aria-label="Loading"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        ) : value ? (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-gray-500)',
              display: 'flex',
              alignItems: 'center',
              padding: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        ) : null}
      </span>
    </div>
  )
}
