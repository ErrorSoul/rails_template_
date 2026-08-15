import React, { useEffect, useCallback } from 'react'
import { cn } from '../../../utils/cn'

export interface ModalProps {
  open: boolean
  onClose?: () => void
  title?: string
  children: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  closeOnBackdrop?: boolean
  className?: string
}

const sizeMap = {
  sm: '400px',
  md: '560px',
  lg: '720px',
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnBackdrop = true,
  className,
}: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.()
    },
    [onClose]
  )

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, handleKeyDown])

  if (!open) return null

  return (
    <div
      className={cn('ds-modal-backdrop', className)}
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Modal'}
      onClick={closeOnBackdrop ? onClose : undefined}
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        animation: 'ds-fade-in var(--duration-fast) ease',
      }}
    >
      <div
        className="ds-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '90%',
          maxWidth: sizeMap[size],
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden',
          animation: 'ds-scale-in var(--duration-normal) var(--ease-out)',
        }}
      >
        {/* Header */}
        {(title || onClose) && (
          <div
            className="ds-modal__header"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem 1.25rem',
              borderBottom: '1px solid var(--color-default)',
              flexShrink: 0,
            }}
          >
            {title && (
              <h3
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-base)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'var(--color-gray-100)',
                }}
              >
                {title}
              </h3>
            )}
            {onClose && (
              <button
                className="ds-modal__close"
                onClick={onClose}
                aria-label="Close"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-gray-500)',
                  fontSize: '1.25rem',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  lineHeight: 1,
                  marginLeft: 'auto',
                  transition: 'var(--transition-base)',
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--color-gray-300)'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--color-gray-500)'
                }}
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div
          className="ds-modal__body"
          style={{
            padding: '1.25rem',
            overflowY: 'auto',
            flex: 1,
            fontFamily: 'var(--font-base)',
            fontSize: '0.875rem',
            color: 'var(--color-gray-500)',
            lineHeight: 1.6,
          }}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            className="ds-modal__footer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '0.5rem',
              padding: '0.75rem 1.25rem',
              borderTop: '1px solid var(--color-default)',
              flexShrink: 0,
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
