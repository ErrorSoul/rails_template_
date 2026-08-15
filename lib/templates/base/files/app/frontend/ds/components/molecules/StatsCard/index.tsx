import React, { useState } from 'react'
import { cn } from '../../../utils/cn'

export type StatsVariant = 'primary' | 'info' | 'success' | 'warning' | 'danger'
export type TrendDirection = 'up' | 'down' | 'neutral'

export interface StatsCardProps {
  title: string
  value: string | number
  icon?: React.ReactNode
  iconVariant?: StatsVariant
  trend?: {
    value: string
    direction: TrendDirection
  }
  subtitle?: string
  className?: string
}

const gradients: Record<StatsVariant, string> = {
  primary: 'var(--gradient-primary)',
  info:    'var(--gradient-info)',
  success: 'var(--gradient-success)',
  warning: 'var(--gradient-warning)',
  danger:  'var(--gradient-danger)',
}

const trendColor: Record<TrendDirection, string> = {
  up:      'var(--color-success)',
  down:    'var(--color-danger)',
  neutral: 'var(--color-gray-500)',
}

const trendIcon: Record<TrendDirection, string> = {
  up:      '▲',
  down:    '▼',
  neutral: '─',
}

export function StatsCard({
  title,
  value,
  icon,
  iconVariant = 'info',
  trend,
  subtitle,
  className,
}: StatsCardProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className={cn(className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: hovered ? 'var(--shadow-lg)' : 'var(--shadow-base)',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: '1px solid rgba(var(--color-accent-rgb), 0.08)',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'transform var(--duration-normal) var(--ease-out), box-shadow var(--duration-normal) var(--ease-out)',
        fontFamily: 'var(--font-base)',
      }}
    >
      {/* Left: title, value, trend */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <p
          style={{
            color: 'var(--color-gray-500)',
            fontSize: 'var(--font-size-sm)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            margin: 0,
            fontWeight: 600,
          }}
        >
          {title}
        </p>

        <p
          style={{
            color: 'var(--color-gray-100)',
            fontSize: '1.75rem',
            fontWeight: 700,
            margin: 0,
            lineHeight: 1.2,
          }}
          data-testid="stats-value"
        >
          {value}
        </p>

        {(trend || subtitle) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem' }}>
            {trend && (
              <span
                style={{
                  color: trendColor[trend.direction],
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                }}
                data-testid="stats-trend"
                data-direction={trend.direction}
              >
                <span style={{ fontSize: '0.625rem' }}>{trendIcon[trend.direction]}</span>
                {trend.value}
              </span>
            )}
            {subtitle && (
              <span
                style={{
                  color: 'var(--color-gray-600)',
                  fontSize: 'var(--font-size-sm)',
                }}
                data-testid="stats-subtitle"
              >
                {subtitle}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Right: icon circle */}
      {icon !== undefined && (
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: gradients[iconVariant],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontSize: '1.25rem',
            color: 'var(--color-white)',
          }}
          data-testid="stats-icon"
        >
          {icon}
        </div>
      )}
    </div>
  )
}
