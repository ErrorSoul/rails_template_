import React, { useState, useRef, useEffect } from 'react'
import { cn } from '../../../utils/cn'
import { Badge } from '../../atoms/Badge'
import { Checkbox } from '../../atoms/Checkbox'

export interface Option {
  value: string
  label: string
}

export interface MultiSelectProps {
  options: Option[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  searchable?: boolean
  className?: string
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = 'Select…',
  searchable = false,
  className,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const toggle = (val: string) => {
    onChange(value.includes(val) ? value.filter((v) => v !== val) : [...value, val])
  }

  const filtered = searchable && search
    ? options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
    : options

  const selectedLabels = options.filter((o) => value.includes(o.value))

  return (
    <div
      ref={ref}
      className={cn('ds-multiselect', className)}
      style={{ position: 'relative', fontFamily: 'var(--font-base)' }}
    >
      {/* trigger */}
      <div
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        tabIndex={0}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setOpen((v) => !v) }}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.4rem',
          alignItems: 'center',
          minHeight: '42px',
          padding: '0.4rem 0.75rem',
          background: 'var(--color-surface)',
          border: `1px solid ${open ? 'var(--color-info)' : 'var(--color-default)'}`,
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
          transition: 'border-color 0.2s',
        }}
      >
        {selectedLabels.length === 0 ? (
          <span style={{ color: 'var(--color-gray-600)', fontSize: 'var(--font-size-base)' }}>
            {placeholder}
          </span>
        ) : (
          selectedLabels.map((o) => (
            <Badge key={o.value} variant="info">
              {o.label}
              <span
                onClick={(e) => { e.stopPropagation(); toggle(o.value) }}
                style={{ marginLeft: '0.35rem', cursor: 'pointer', opacity: 0.7 }}
              >
                ✕
              </span>
            </Badge>
          ))
        )}
        <span style={{ marginLeft: 'auto', color: 'var(--color-gray-500)', fontSize: '0.7rem' }}>
          {open ? '▲' : '▼'}
        </span>
      </div>

      {/* dropdown */}
      {open && (
        <div
          role="listbox"
          aria-multiselectable="true"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            background: 'var(--color-surface)',
            border: '1px solid var(--color-default)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-dropdown)',
            zIndex: 1000,
            overflow: 'hidden',
          }}
        >
          {searchable && (
            <div style={{ padding: '0.5rem' }}>
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search…"
                style={{
                  width: '100%',
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-default)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.35rem 0.6rem',
                  color: 'var(--color-gray-200)',
                  fontSize: 'var(--font-size-base)',
                  outline: 'none',
                }}
              />
            </div>
          )}

          <ul style={{ listStyle: 'none', maxHeight: '220px', overflowY: 'auto' }}>
            {filtered.length === 0 ? (
              <li style={{ padding: '0.75rem 1rem', color: 'var(--color-gray-600)', fontSize: 'var(--font-size-sm)' }}>
                No options
              </li>
            ) : (
              filtered.map((option) => (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={value.includes(option.value)}
                  onClick={() => toggle(option.value)}
                  style={{
                    padding: '0.5rem 1rem',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(var(--color-accent-rgb), 0.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <Checkbox
                    checked={value.includes(option.value)}
                    onChange={() => toggle(option.value)}
                    label={option.label}
                  />
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
