import React from 'react'
import { cn } from '../../../utils/cn'

export interface PriceTagProps {
  price: number
  originalPrice?: number
  currency?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeStyles = {
  sm: { main: '1rem',    original: '0.75rem', badge: '0.65rem' },
  md: { main: '1.5rem',  original: '0.9rem',  badge: '0.7rem' },
  lg: { main: '2rem',    original: '1.1rem',  badge: '0.8rem' },
}

export function PriceTag({ price, originalPrice, currency = '$', size = 'md', className }: PriceTagProps) {
  const discount = originalPrice && originalPrice > price
    ? Math.round((1 - price / originalPrice) * 100)
    : null

  const { main, original, badge } = sizeStyles[size]

  return (
    <div
      className={cn('ds-price-tag', className)}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-base)' }}
    >
      <span style={{ fontSize: main, fontWeight: 700, color: 'var(--color-success)', lineHeight: 1 }}>
        {currency}{price.toFixed(2)}
      </span>

      {originalPrice && originalPrice > price && (
        <span style={{
          fontSize: original,
          color: 'var(--color-gray-600)',
          textDecoration: 'line-through',
          lineHeight: 1,
        }}>
          {currency}{originalPrice.toFixed(2)}
        </span>
      )}

      {discount !== null && (
        <span style={{
          fontSize: badge,
          fontWeight: 700,
          padding: '0.15em 0.4em',
          borderRadius: '4px',
          background: 'var(--gradient-danger)',
          color: '#fff',
          lineHeight: 1.4,
        }}>
          -{discount}%
        </span>
      )}
    </div>
  )
}
