import React, { createContext, useContext, useReducer, useCallback } from 'react'

export type ToastVariant = 'success' | 'info' | 'warning' | 'danger'
export type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'bottom-center'

export interface ToastData {
  id: string
  variant: ToastVariant
  title?: string
  message: string
  duration?: number
  isExiting?: boolean
}

type Action =
  | { type: 'ADD_TOAST'; toast: ToastData }
  | { type: 'MARK_EXITING'; id: string }
  | { type: 'REMOVE_TOAST'; id: string }
  | { type: 'MARK_ALL_EXITING' }
  | { type: 'CLEAR_ALL' }

function reducer(state: ToastData[], action: Action): ToastData[] {
  switch (action.type) {
    case 'ADD_TOAST':
      return [...state, action.toast]
    case 'MARK_EXITING':
      return state.map((t) => (t.id === action.id ? { ...t, isExiting: true } : t))
    case 'REMOVE_TOAST':
      return state.filter((t) => t.id !== action.id)
    case 'MARK_ALL_EXITING':
      return state.map((t) => ({ ...t, isExiting: true }))
    case 'CLEAR_ALL':
      return []
    default:
      return state
  }
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random()}`
}

interface ToastContextValue {
  toasts: ToastData[]
  position: ToastPosition
  toast: (message: string, options?: Partial<Omit<ToastData, 'id' | 'message'>>) => string
  dismiss: (id: string) => void
  dismissAll: () => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

interface ToastProviderProps {
  children: React.ReactNode
  position?: ToastPosition
}

export function ToastProvider({ children, position = 'top-right' }: ToastProviderProps) {
  const [toasts, dispatch] = useReducer(reducer, [])

  const dismiss = useCallback((id: string) => {
    dispatch({ type: 'MARK_EXITING', id })
    setTimeout(() => dispatch({ type: 'REMOVE_TOAST', id }), 200)
  }, [])

  const toast = useCallback(
    (message: string, options?: Partial<Omit<ToastData, 'id' | 'message'>>) => {
      const id = generateId()
      dispatch({
        type: 'ADD_TOAST',
        toast: {
          id,
          message,
          variant: options?.variant ?? 'info',
          title: options?.title,
          duration: options?.duration ?? 5000,
        },
      })
      return id
    },
    []
  )

  const dismissAll = useCallback(() => {
    dispatch({ type: 'MARK_ALL_EXITING' })
    setTimeout(() => dispatch({ type: 'CLEAR_ALL' }), 200)
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, position, toast, dismiss, dismissAll }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
