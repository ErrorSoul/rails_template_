import React from 'react'
import { cn } from '../../../utils/cn'
import { Button } from '../../atoms/Button'

export interface TextBlockAction {
  label: string
  onClick: () => void
}

export interface TextBlockProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  align?: 'left' | 'center'
  action?: TextBlockAction
  className?: string
}

export function TextBlock({ title, subtitle, children, align = 'left', action, className }: TextBlockProps) {
  const textAlign = align === 'center' ? 'center' : 'left'

  return (
    <div
      className={cn('ds-text-block', className)}
      style={{ fontFamily: 'var(--font-base)', textAlign }}
    >
      <h3 style={{
        margin: 0,
        fontSize: 'var(--font-size-2xl)',
        fontWeight: 700,
        color: 'var(--color-gray-100)',
        lineHeight: 1.25,
      }}>
        {title}
      </h3>

      {subtitle && (
        <p style={{
          margin: '0.4rem 0 0',
          fontSize: 'var(--font-size-lg)',
          color: 'var(--color-primary)',
          fontWeight: 500,
          lineHeight: 1.4,
        }}>
          {subtitle}
        </p>
      )}

      <div style={{
        marginTop: '0.75rem',
        fontSize: 'var(--font-size-base)',
        color: 'var(--color-gray-400)',
        lineHeight: 1.65,
      }}>
        {children}
      </div>

      {action && (
        <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: align === 'center' ? 'center' : 'flex-start' }}>
          <Button variant="primary" onClick={action.onClick}>
            {action.label}
          </Button>
        </div>
      )}
    </div>
  )
}
