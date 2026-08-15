import React, { useState, useRef, useCallback } from 'react'
import { cn } from '../../../utils/cn'

export interface TooltipProps {
  content: string | React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
  children: React.ReactNode
  className?: string
}

const tooltipStyles: Record<NonNullable<TooltipProps['position']>, React.CSSProperties> = {
  top: {
    bottom: 'calc(100% + 8px)',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  bottom: {
    top: 'calc(100% + 8px)',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  left: {
    right: 'calc(100% + 8px)',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  right: {
    left: 'calc(100% + 8px)',
    top: '50%',
    transform: 'translateY(-50%)',
  },
}

const arrowStyles: Record<NonNullable<TooltipProps['position']>, React.CSSProperties> = {
  top: {
    bottom: -5,
    left: '50%',
    transform: 'translateX(-50%)',
    borderLeft: '5px solid transparent',
    borderRight: '5px solid transparent',
    borderTop: '5px solid var(--color-surface)',
  },
  bottom: {
    top: -5,
    left: '50%',
    transform: 'translateX(-50%)',
    borderLeft: '5px solid transparent',
    borderRight: '5px solid transparent',
    borderBottom: '5px solid var(--color-surface)',
  },
  left: {
    right: -5,
    top: '50%',
    transform: 'translateY(-50%)',
    borderTop: '5px solid transparent',
    borderBottom: '5px solid transparent',
    borderLeft: '5px solid var(--color-surface)',
  },
  right: {
    left: -5,
    top: '50%',
    transform: 'translateY(-50%)',
    borderTop: '5px solid transparent',
    borderBottom: '5px solid transparent',
    borderRight: '5px solid var(--color-surface)',
  },
}

export function Tooltip({
  content,
  position = 'top',
  delay = 200,
  children,
  className,
}: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const tooltipId = useRef(`tooltip-${Math.random().toString(36).slice(2)}`)

  const show = useCallback(() => {
    timerRef.current = setTimeout(() => setVisible(true), delay)
  }, [delay])

  const hide = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setVisible(false)
  }, [])

  return (
    <span
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={show}
      onMouseLeave={hide}
      aria-describedby={visible ? tooltipId.current : undefined}
    >
      {children}
      {visible && (
        <span
          id={tooltipId.current}
          role="tooltip"
          className={cn(className)}
          style={{
            position: 'absolute',
            ...tooltipStyles[position],
            background: 'var(--color-surface)',
            border: '1px solid rgba(var(--color-accent-rgb), 0.15)',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow-md)',
            padding: '0.4rem 0.75rem',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-gray-200)',
            whiteSpace: 'nowrap',
            zIndex: 9999,
            pointerEvents: 'none',
            animation: 'ds-fade-in var(--duration-fast) var(--ease-out), ds-scale-in var(--duration-fast) var(--ease-out)',
          }}
        >
          {content}
          <span
            style={{
              position: 'absolute',
              width: 0,
              height: 0,
              ...arrowStyles[position],
            }}
          />
        </span>
      )}
    </span>
  )
}
