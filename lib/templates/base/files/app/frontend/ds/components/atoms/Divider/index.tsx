import React from 'react'
import { cn } from '../../../utils/cn'

export type DividerVariant = 'default' | 'primary' | 'gradient'
export type DividerOrientation = 'horizontal' | 'vertical'

export interface DividerProps {
  orientation?: DividerOrientation
  variant?: DividerVariant
  spacing?: 'sm' | 'md' | 'lg'
  label?: string
  className?: string
}

const spacingMap = {
  sm: '0.5rem',
  md: '1rem',
  lg: '2rem',
}

export function Divider({
  orientation = 'horizontal',
  variant = 'default',
  spacing = 'md',
  label,
  className,
}: DividerProps) {
  const gap = spacingMap[spacing]

  const lineColor =
    variant === 'primary'
      ? 'var(--color-primary)'
      : variant === 'gradient'
      ? 'transparent'
      : 'var(--color-default)'

  const lineBackground =
    variant === 'gradient'
      ? 'var(--gradient-primary)'
      : lineColor

  if (orientation === 'vertical') {
    return (
      <span
        className={cn('ds-divider ds-divider--vertical', className)}
        style={{
          display: 'inline-block',
          width: '1px',
          alignSelf: 'stretch',
          minHeight: '1em',
          background: lineBackground,
          margin: `0 ${gap}`,
          flexShrink: 0,
        }}
        role="separator"
        aria-orientation="vertical"
      />
    )
  }

  if (label) {
    return (
      <div
        className={cn('ds-divider ds-divider--horizontal', className)}
        role="separator"
        aria-orientation="horizontal"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          margin: `${gap} 0`,
          fontFamily: 'var(--font-base)',
        }}
      >
        <span
          style={{
            flex: 1,
            height: '1px',
            background: lineBackground,
          }}
        />
        <span
          style={{
            color: 'var(--color-gray-500)',
            fontSize: 'var(--font-size-xs)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </span>
        <span
          style={{
            flex: 1,
            height: '1px',
            background: lineBackground,
          }}
        />
      </div>
    )
  }

  return (
    <hr
      className={cn('ds-divider ds-divider--horizontal', className)}
      role="separator"
      aria-orientation="horizontal"
      style={{
        border: 'none',
        height: '1px',
        background: lineBackground,
        margin: `${gap} 0`,
      }}
    />
  )
}
