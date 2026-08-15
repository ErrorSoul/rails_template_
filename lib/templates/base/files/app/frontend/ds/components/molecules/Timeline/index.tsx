import React from 'react'
import { cn } from '../../../utils/cn'

export type TimelineStatus = 'completed' | 'active' | 'pending'

export interface TimelineItem {
  icon?: React.ReactNode
  title: string
  description?: string
  date?: string
  status?: TimelineStatus
}

export interface TimelineProps {
  items: TimelineItem[]
  variant?: 'default' | 'alternating'
  className?: string
}

const statusGradient: Record<TimelineStatus, string> = {
  completed: 'var(--gradient-success)',
  active: 'var(--gradient-info)',
  pending: 'var(--color-default)',
}

const statusLabel: Record<TimelineStatus, string> = {
  completed: 'var(--color-success)',
  active: 'var(--color-info)',
  pending: 'var(--color-gray-600)',
}

export function Timeline({ items, variant = 'default', className }: TimelineProps) {
  const isAlternating = variant === 'alternating'

  return (
    <div
      className={cn('ds-timeline', className)}
      role="list"
      style={{ position: 'relative', fontFamily: 'var(--font-base)' }}
    >
      {/* vertical line */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: isAlternating ? '50%' : '15px',
          top: 0,
          bottom: 0,
          width: '3px',
          background: 'var(--gradient-primary)',
          transform: isAlternating ? 'translateX(-50%)' : undefined,
          boxShadow: '0 0 8px rgba(var(--color-accent-rgb), 0.35)',
        }}
      />

      {items.map((item, idx) => {
        const status = item.status ?? 'pending'
        const isEven = idx % 2 === 0

        return (
          <div
            key={idx}
            role="listitem"
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: isAlternating && !isEven ? 'row-reverse' : 'row',
              gap: '1.25rem',
              paddingBottom: idx < items.length - 1 ? '2rem' : 0,
              alignItems: 'flex-start',
            }}
          >
            {/* dot */}
            <div
              style={{
                flexShrink: 0,
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: statusGradient[status],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '0.85rem',
                zIndex: 1,
                position: 'relative',
                boxShadow: status === 'pending'
                  ? '0 0 0 3px var(--color-default)'
                  : `0 0 0 3px rgba(var(--color-accent-rgb), 0.25), 0 0 12px rgba(var(--color-accent-rgb), 0.4)`,
              }}
            >
              {item.icon ?? (status === 'completed' ? '✓' : status === 'active' ? '●' : '○')}
            </div>

            {/* content */}
            <div
              style={{
                flex: 1,
                background: 'var(--color-surface)',
                borderRadius: 'var(--radius-lg)',
                padding: '0.875rem 1.25rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                <span style={{ color: 'var(--color-gray-200)', fontWeight: 600, fontSize: 'var(--font-size-lg)' }}>
                  {item.title}
                </span>
                {item.date && (
                  <span style={{ color: 'var(--color-gray-500)', fontSize: 'var(--font-size-sm)', whiteSpace: 'nowrap' }}>
                    {item.date}
                  </span>
                )}
              </div>
              {item.description && (
                <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--font-size-base)', marginTop: '0.35rem', lineHeight: 1.5 }}>
                  {item.description}
                </p>
              )}
              <span style={{ display: 'inline-block', marginTop: '0.4rem', fontSize: 'var(--font-size-xs)', color: statusLabel[status], textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {status}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
