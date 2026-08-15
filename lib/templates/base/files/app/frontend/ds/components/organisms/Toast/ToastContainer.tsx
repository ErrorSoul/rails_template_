import React from 'react'
import ReactDOM from 'react-dom'
import { useToast } from './ToastContext'
import { Toast } from './index'
import type { ToastPosition } from './ToastContext'

function getPositionStyle(position: ToastPosition): React.CSSProperties {
  const base: React.CSSProperties = {
    position: 'fixed',
    zIndex: 1100,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    pointerEvents: 'none',
  }

  switch (position) {
    case 'top-right':
      return { ...base, top: '1rem', right: '1rem', alignItems: 'flex-end' }
    case 'top-left':
      return { ...base, top: '1rem', left: '1rem', alignItems: 'flex-start' }
    case 'top-center':
      return { ...base, top: '1rem', left: '50%', transform: 'translateX(-50%)', alignItems: 'center' }
    case 'bottom-right':
      return { ...base, bottom: '1rem', right: '1rem', flexDirection: 'column-reverse', alignItems: 'flex-end' }
    case 'bottom-left':
      return { ...base, bottom: '1rem', left: '1rem', flexDirection: 'column-reverse', alignItems: 'flex-start' }
    case 'bottom-center':
      return { ...base, bottom: '1rem', left: '50%', transform: 'translateX(-50%)', flexDirection: 'column-reverse', alignItems: 'center' }
  }
}

export function ToastContainer() {
  const { toasts, position, dismiss } = useToast()

  return ReactDOM.createPortal(
    <div className="ds-toast-container" style={getPositionStyle(position)}>
      {toasts.map((t) => (
        <div key={t.id} style={{ pointerEvents: 'auto' }}>
          <Toast
            {...t}
            isExiting={t.isExiting ?? false}
            onDismiss={dismiss}
            position={position}
          />
        </div>
      ))}
    </div>,
    document.body
  )
}
