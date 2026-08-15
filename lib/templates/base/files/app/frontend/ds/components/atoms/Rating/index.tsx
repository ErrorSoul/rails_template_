import React, { useState } from 'react'
import { cn } from '../../../utils/cn'

export interface RatingProps {
  value: number
  max?: number
  onChange?: (value: number) => void
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = { sm: 16, md: 22, lg: 30 }

function Star({ filled, half, size }: { filled: boolean; half: boolean; size: number }) {
  const id = `half-${Math.random().toString(36).slice(2, 7)}`
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ display: 'block', flexShrink: 0 }}
    >
      {half && (
        <defs>
          <linearGradient id={id} x1="0" x2="1" y1="0" y2="0">
            <stop offset="50%" stopColor="var(--color-warning)" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
      )}
      <polygon
        points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
        fill={filled ? 'var(--color-warning)' : half ? `url(#${id})` : 'transparent'}
        stroke="var(--color-warning)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Rating({ value, max = 5, onChange, readonly = false, size = 'md', className }: RatingProps) {
  const [hovered, setHovered] = useState<number | null>(null)
  const px = sizeMap[size]
  const display = hovered ?? value

  return (
    <div
      className={cn('ds-rating', className)}
      role={readonly ? 'img' : 'group'}
      aria-label={`Rating: ${value} out of ${max}`}
      style={{ display: 'inline-flex', gap: '2px', cursor: readonly ? 'default' : 'pointer' }}
    >
      {Array.from({ length: max }, (_, i) => {
        const starValue = i + 1
        const filled = display >= starValue
        const half = !filled && display >= starValue - 0.5

        return (
          <button
            key={i}
            type="button"
            disabled={readonly}
            aria-label={`${starValue} star${starValue > 1 ? 's' : ''}`}
            onClick={() => !readonly && onChange?.(starValue)}
            onMouseEnter={() => !readonly && setHovered(starValue)}
            onMouseLeave={() => !readonly && setHovered(null)}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: readonly ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              transition: 'transform 0.15s ease',
              transform: hovered === starValue && !readonly ? 'scale(1.15)' : 'scale(1)',
            }}
          >
            <Star filled={filled} half={half} size={px} />
          </button>
        )
      })}
    </div>
  )
}
