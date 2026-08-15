import React from 'react'
import { cn } from '../../../utils/cn'

export interface FormDividerProps {
  text?: string
  className?: string
}

export function FormDivider({ text = 'or', className }: FormDividerProps) {
  return (
    <div
      className={cn('ds-form-divider', className)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        margin: '1.5rem 0',
      }}
    >
      <div
        style={{
          flex: 1,
          height: '1px',
          background: 'var(--color-default)',
        }}
      />
      <span
        style={{
          fontSize: 'var(--font-size-sm)',
          fontFamily: 'var(--font-base)',
          color: 'var(--color-gray-600)',
          textTransform: 'lowercase',
          whiteSpace: 'nowrap',
        }}
      >
        {text}
      </span>
      <div
        style={{
          flex: 1,
          height: '1px',
          background: 'var(--color-default)',
        }}
      />
    </div>
  )
}
