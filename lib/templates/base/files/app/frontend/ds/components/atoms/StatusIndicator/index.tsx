import React from 'react'
import { cn } from '../../../utils/cn'

export type StatusType = 'online' | 'offline' | 'busy' | 'away'

export interface StatusIndicatorProps {
  status: StatusType
  size?: 'sm' | 'md' | 'lg'
  pulse?: boolean
  label?: string
  className?: string
}

const sizeMap: Record<'sm' | 'md' | 'lg', number> = {
  sm: 8,
  md: 10,
  lg: 14,
}

const colorMap: Record<StatusType, string> = {
  online:  'var(--color-success)',
  offline: 'var(--color-gray-600)',
  busy:    'var(--color-danger)',
  away:    'var(--color-warning)',
}

const labelMap: Record<StatusType, string> = {
  online:  'Online',
  offline: 'Offline',
  busy:    'Busy',
  away:    'Away',
}

export function StatusIndicator({
  status,
  size = 'md',
  pulse = false,
  label,
  className,
}: StatusIndicatorProps) {
  const px = sizeMap[size]
  const color = colorMap[status]

  return (
    <span
      className={cn('ds-status-indicator', className)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
      }}
    >
      <span
        data-status={status}
        data-testid="status-dot"
        aria-label={labelMap[status]}
        style={{
          position: 'relative',
          display: 'inline-block',
          width: px,
          height: px,
          borderRadius: '50%',
          background: color,
          flexShrink: 0,
        }}
      >
        {pulse && status === 'online' && (
          <span
            data-testid="pulse-ring"
            style={{
              position: 'absolute',
              inset: -3,
              borderRadius: '50%',
              border: `2px solid ${color}`,
              opacity: 0.5,
              animation: 'ds-status-pulse 1.5s ease-out infinite',
            }}
          />
        )}
      </span>
      {label !== undefined && (
        <span
          style={{
            fontSize: '0.8rem',
            fontFamily: 'var(--font-base)',
            color: 'var(--color-gray-400)',
          }}
        >
          {label}
        </span>
      )}
    </span>
  )
}
