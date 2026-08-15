import React, { useState, useRef, useEffect, useCallback } from 'react'
import { cn } from '../../../utils/cn'

export interface PopoverProps {
  trigger: React.ReactNode
  children: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}

const positionStyles: Record<string, React.CSSProperties> = {
  top: {
    bottom: 'calc(100% + 10px)',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  bottom: {
    top: 'calc(100% + 10px)',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  left: {
    right: 'calc(100% + 10px)',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  right: {
    left: 'calc(100% + 10px)',
    top: '50%',
    transform: 'translateY(-50%)',
  },
}

const arrowMap: Record<string, React.CSSProperties> = {
  top: {
    bottom: '-5px',
    left: '50%',
    transform: 'translateX(-50%)',
    borderLeft: '6px solid transparent',
    borderRight: '6px solid transparent',
    borderTop: '6px solid var(--color-surface)',
  },
  bottom: {
    top: '-5px',
    left: '50%',
    transform: 'translateX(-50%)',
    borderLeft: '6px solid transparent',
    borderRight: '6px solid transparent',
    borderBottom: '6px solid var(--color-surface)',
  },
  left: {
    right: '-5px',
    top: '50%',
    transform: 'translateY(-50%)',
    borderTop: '6px solid transparent',
    borderBottom: '6px solid transparent',
    borderLeft: '6px solid var(--color-surface)',
  },
  right: {
    left: '-5px',
    top: '50%',
    transform: 'translateY(-50%)',
    borderTop: '6px solid transparent',
    borderBottom: '6px solid transparent',
    borderRight: '6px solid var(--color-surface)',
  },
}

export function Popover({
  trigger,
  children,
  position = 'bottom',
  open: controlledOpen,
  onOpenChange,
  className,
}: PopoverProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const isControlled = controlledOpen !== undefined
  const isOpen = isControlled ? controlledOpen : internalOpen

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next)
      onOpenChange?.(next)
    },
    [isControlled, onOpenChange]
  )

  const toggle = () => setOpen(!isOpen)

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpen, setOpen])

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, setOpen])

  return (
    <div
      ref={containerRef}
      className={cn('ds-popover', className)}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      <div
        onClick={toggle}
        role="button"
        aria-expanded={isOpen}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            toggle()
          }
        }}
        style={{ cursor: 'pointer' }}
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          role="dialog"
          style={{
            position: 'absolute',
            ...positionStyles[position],
            zIndex: 9999,
            background: 'var(--color-surface)',
            border: '1px solid rgba(var(--color-accent-rgb), 0.15)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            padding: '1rem',
            minWidth: '200px',
            animation: 'ds-scale-in var(--duration-fast) var(--ease-out)',
          }}
        >
          {children}
          <span
            style={{
              position: 'absolute',
              width: 0,
              height: 0,
              ...arrowMap[position],
            }}
          />
        </div>
      )}
    </div>
  )
}
