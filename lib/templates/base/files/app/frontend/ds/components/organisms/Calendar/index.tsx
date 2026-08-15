import { useState } from 'react'
import { cn } from '../../../utils/cn'

export interface CalendarEvent {
  date: Date
  title: string
  color?: string
}

export interface CalendarProps {
  month?: number
  year?: number
  events?: CalendarEvent[]
  onDateClick?: (date: Date) => void
  onMonthChange?: (month: number, year: number) => void
  className?: string
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function sameDay(a: Date, b: Date) {
  return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()
}

export function Calendar({
  month: initialMonth,
  year: initialYear,
  events = [],
  onDateClick,
  onMonthChange,
  className,
}: CalendarProps) {
  const today = new Date()
  const [month, setMonth] = useState(initialMonth ?? today.getMonth())
  const [year, setYear] = useState(initialYear ?? today.getFullYear())

  function prevMonth() {
    const nm = month === 0 ? 11 : month - 1
    const ny = month === 0 ? year - 1 : year
    setMonth(nm)
    setYear(ny)
    onMonthChange?.(nm, ny)
  }

  function nextMonth() {
    const nm = month === 11 ? 0 : month + 1
    const ny = month === 11 ? year + 1 : year
    setMonth(nm)
    setYear(ny)
    onMonthChange?.(nm, ny)
  }

  // Build calendar grid
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (Date | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))

  return (
    <div
      className={cn('ds-calendar', className)}
      style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.25rem',
        fontFamily: 'var(--font-base)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <button
          aria-label="Previous month"
          onClick={prevMonth}
          style={{
            background: 'var(--color-default)',
            border: 'none',
            borderRadius: 'var(--radius-base)',
            color: 'var(--color-gray-300)',
            width: '2rem',
            height: '2rem',
            cursor: 'pointer',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ‹
        </button>
        <p style={{ margin: 0, fontWeight: 600, color: 'var(--color-gray-100)', fontSize: '0.95rem' }}>
          {MONTHS[month]} {year}
        </p>
        <button
          aria-label="Next month"
          onClick={nextMonth}
          style={{
            background: 'var(--color-default)',
            border: 'none',
            borderRadius: 'var(--radius-base)',
            color: 'var(--color-gray-300)',
            width: '2rem',
            height: '2rem',
            cursor: 'pointer',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ›
        </button>
      </div>

      {/* Day headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '0.5rem' }}>
        {DAYS.map((d) => (
          <div
            key={d}
            style={{
              textAlign: 'center',
              fontSize: '0.7rem',
              fontWeight: 600,
              color: 'var(--color-gray-600)',
              padding: '0.25rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
        {cells.map((date, i) => {
          if (!date) return <div key={i} />
          const isToday = sameDay(date, today)
          const dayEvents = events.filter((e) => sameDay(e.date, date))

          return (
            <div
              key={i}
              onClick={() => onDateClick?.(date)}
              style={{
                position: 'relative',
                textAlign: 'center',
                padding: '0.4rem 0.2rem',
                borderRadius: 'var(--radius-base)',
                cursor: onDateClick ? 'pointer' : 'default',
                background: isToday ? 'var(--gradient-primary)' : 'transparent',
                color: isToday ? '#fff' : 'var(--color-gray-300)',
                fontSize: '0.8rem',
                fontWeight: isToday ? 700 : 400,
                transition: 'background var(--duration-fast)',
              }}
              onMouseEnter={(e) => {
                if (!isToday) (e.currentTarget as HTMLDivElement).style.background = 'var(--color-default)'
              }}
              onMouseLeave={(e) => {
                if (!isToday) (e.currentTarget as HTMLDivElement).style.background = 'transparent'
              }}
            >
              {date.getDate()}
              {dayEvents.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2px', marginTop: '2px', flexWrap: 'wrap' }}>
                  {dayEvents.slice(0, 3).map((ev, ei) => (
                    <div
                      key={ei}
                      title={ev.title}
                      style={{
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        background: ev.color ?? 'var(--color-primary)',
                        flexShrink: 0,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
