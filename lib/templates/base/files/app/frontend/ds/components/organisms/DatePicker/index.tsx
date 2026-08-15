import React, { useState, useRef, useEffect } from 'react'
import { cn } from '../../../utils/cn'

export interface DatePickerProps {
  value?: Date
  onChange: (date: Date) => void
  min?: Date
  max?: Date
  placeholder?: string
  className?: string
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']

function pad(n: number) { return String(n).padStart(2, '0') }
function toDateStr(d: Date) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` }

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

export function DatePicker({ value, onChange, min, max, placeholder = 'Select date', className }: DatePickerProps) {
  const today = new Date()
  const currentYear = today.getFullYear()
  const currentMonth = today.getMonth()
  const [open, setOpen] = useState(false)
  const [view, setView] = useState({ year: value?.getFullYear() ?? currentYear, month: value?.getMonth() ?? currentMonth })
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const prevMonth = () => setView((v) => v.month === 0 ? { year: v.year - 1, month: 11 } : { ...v, month: v.month - 1 })
  const nextMonth = () => setView((v) => v.month === 11 ? { year: v.year + 1, month: 0 } : { ...v, month: v.month + 1 })

  const isDisabled = (day: number) => {
    const d = new Date(view.year, view.month, day)
    if (min && d < min) return true
    if (max && d > max) return true
    return false
  }
  const isSelected = (day: number) => {
    if (!value) return false
    return value.getFullYear() === view.year && value.getMonth() === view.month && value.getDate() === day
  }
  const isToday = (day: number) => {
    return today.getFullYear() === view.year && today.getMonth() === view.month && today.getDate() === day
  }

  const daysInMonth = getDaysInMonth(view.year, view.month)
  const firstDay = getFirstDayOfWeek(view.year, view.month)
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]

  return (
    <div ref={ref} className={cn('ds-datepicker', className)} style={{ position: 'relative', fontFamily: 'var(--font-base)' }}>
      <input
        readOnly
        value={value ? toDateStr(value) : ''}
        placeholder={placeholder}
        onClick={() => setOpen((v) => !v)}
        style={{
          display: 'block',
          width: '100%',
          padding: '0.5rem 1rem',
          fontSize: 'var(--font-size-base)',
          fontFamily: 'var(--font-base)',
          color: 'var(--color-white)',
          backgroundColor: 'var(--color-surface)',
          border: `1px solid ${open ? 'var(--color-info)' : 'var(--color-default)'}`,
          borderRadius: 'var(--radius-base)',
          outline: 'none',
          cursor: 'pointer',
          boxSizing: 'border-box',
        }}
      />

      {open && (
        <div
          role="dialog"
          aria-label="Date picker calendar"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            width: '280px',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-default)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-dropdown)',
            zIndex: 1000,
            padding: '1rem',
          }}
        >
          {/* header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <button
              onClick={prevMonth}
              aria-label="Previous month"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-gray-400)', fontSize: '1rem' }}
            >
              ‹
            </button>
            <span style={{ color: 'var(--color-gray-200)', fontWeight: 600, fontSize: 'var(--font-size-base)' }}>
              {MONTHS[view.month]} {view.year}
            </span>
            <button
              onClick={nextMonth}
              aria-label="Next month"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-gray-400)', fontSize: '1rem' }}
            >
              ›
            </button>
          </div>

          {/* day headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '0.25rem' }}>
            {DAYS.map((d) => (
              <div key={d} style={{ textAlign: 'center', color: 'var(--color-gray-600)', fontSize: 'var(--font-size-xs)' }}>
                {d}
              </div>
            ))}
          </div>

          {/* cells */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
            {cells.map((day, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                {day === null ? null : (
                  <button
                    onClick={() => { if (!isDisabled(day)) { onChange(new Date(view.year, view.month, day)); setOpen(false) } }}
                    disabled={isDisabled(day)}
                    aria-label={`${view.year}-${pad(view.month + 1)}-${pad(day)}`}
                    aria-pressed={isSelected(day)}
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      border: 'none',
                      cursor: isDisabled(day) ? 'not-allowed' : 'pointer',
                      background: isSelected(day)
                        ? 'var(--gradient-info)'
                        : isToday(day)
                        ? 'rgba(var(--color-accent-rgb), 0.15)'
                        : 'transparent',
                      color: isDisabled(day)
                        ? 'var(--color-gray-700)'
                        : isSelected(day)
                        ? '#fff'
                        : 'var(--color-gray-300)',
                      fontSize: 'var(--font-size-sm)',
                    }}
                  >
                    {day}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
