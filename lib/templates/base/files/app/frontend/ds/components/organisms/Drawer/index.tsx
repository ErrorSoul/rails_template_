import React, { useEffect, useCallback } from 'react'
import { cn } from '../../../utils/cn'

export interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  position?: 'left' | 'right'
  size?: 'sm' | 'md' | 'lg'
  title?: string
  children?: React.ReactNode
  className?: string
}

const sizeMap = {
  sm: '280px',
  md: '400px',
  lg: '560px',
}

export function Drawer({
  isOpen,
  onClose,
  position = 'right',
  size = 'md',
  title,
  children,
  className,
}: DrawerProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  const width = sizeMap[size]

  return (
    <div
      className={cn('ds-drawer-backdrop', className)}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1100,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: position === 'right' ? 'flex-end' : 'flex-start',
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title ?? 'Drawer'}
        onClick={(e) => e.stopPropagation()}
        style={{
          width,
          maxWidth: '100vw',
          height: '100%',
          background: 'var(--color-surface)',
          boxShadow: position === 'right'
            ? '-4px 0 32px rgba(0,0,0,0.4)'
            : '4px 0 32px rgba(0,0,0,0.4)',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'var(--font-base)',
        }}
      >
        {/* header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--color-default)',
          }}
        >
          {title && (
            <span style={{ color: 'var(--color-gray-200)', fontWeight: 600, fontSize: 'var(--font-size-lg)' }}>
              {title}
            </span>
          )}
          <button
            onClick={onClose}
            aria-label="Close drawer"
            style={{
              marginLeft: 'auto',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-gray-500)',
              fontSize: '1.2rem',
              lineHeight: 1,
              padding: '0.25rem',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-gray-200)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-gray-500)')}
          >
            ✕
          </button>
        </div>

        {/* body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
