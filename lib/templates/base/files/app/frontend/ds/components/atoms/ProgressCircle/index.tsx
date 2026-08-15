import React from 'react'
import { cn } from '../../../utils/cn'

export interface ProgressCircleProps {
  value: number
  size?: 'sm' | 'md' | 'lg'
  strokeWidth?: number
  showValue?: boolean
  color?: string
  trackColor?: string
  className?: string
}

const sizeMap: Record<'sm' | 'md' | 'lg', number> = {
  sm: 40,
  md: 64,
  lg: 96,
}

const fontSizeMap: Record<'sm' | 'md' | 'lg', string> = {
  sm: '0.6rem',
  md: '0.85rem',
  lg: '1.1rem',
}

export function ProgressCircle({
  value,
  size = 'md',
  strokeWidth = 4,
  showValue = false,
  color = 'var(--color-info)',
  trackColor,
  className,
}: ProgressCircleProps) {
  const px = sizeMap[size]
  const radius = (px - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * radius
  const clampedValue = Math.min(100, Math.max(0, value))
  const offset = circumference - (clampedValue / 100) * circumference
  const center = px / 2
  const track = trackColor ?? 'rgba(255,255,255,0.1)'

  return (
    <span
      className={cn('ds-progress-circle', className)}
      style={{ display: 'inline-flex', position: 'relative', width: px, height: px }}
      aria-label={`${clampedValue}%`}
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg width={px} height={px} viewBox={`0 0 ${px} ${px}`} aria-hidden="true">
        {/* Track circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={track}
          strokeWidth={strokeWidth}
          data-testid="progress-track"
        />
        {/* Progress arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
          data-testid="progress-arc"
          style={{
            transition: 'stroke-dashoffset var(--duration-normal, 0.3s) ease',
          }}
        />
      </svg>
      {showValue && (
        <span
          data-testid="progress-value"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: fontSizeMap[size],
            fontWeight: 700,
            fontFamily: 'var(--font-base)',
            color: 'var(--color-gray-200)',
          }}
        >
          {clampedValue}%
        </span>
      )}
    </span>
  )
}
