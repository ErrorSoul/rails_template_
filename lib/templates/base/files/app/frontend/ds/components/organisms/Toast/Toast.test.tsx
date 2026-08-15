import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import React from 'react'
import { Toast } from './index'
import { ToastProvider, useToast } from './ToastContext'
import { ToastContainer } from './ToastContainer'

// Helper wrapper for context tests
function ToastTestHarness({
  onToastId,
}: {
  onToastId?: (id: string) => void
}) {
  const { toast, dismiss, dismissAll } = useToast()
  return (
    <div>
      <button
        data-testid="add-success"
        onClick={() => {
          const id = toast('Saved!', { variant: 'success', title: 'Success' })
          onToastId?.(id)
        }}
      >
        Add success
      </button>
      <button
        data-testid="add-info"
        onClick={() => toast('Info message', { variant: 'info' })}
      >
        Add info
      </button>
      <button
        data-testid="add-persistent"
        onClick={() => toast('Persistent', { variant: 'warning', duration: 0 })}
      >
        Add persistent
      </button>
      <button data-testid="dismiss-all" onClick={dismissAll}>
        Dismiss all
      </button>
      <button
        data-testid="dismiss-first"
        onClick={() => {
          const toastEl = document.querySelector('[role="alert"]')
          const id = toastEl?.getAttribute('data-toast-id')
          if (id) dismiss(id)
        }}
      >
        Dismiss first
      </button>
    </div>
  )
}

// Standalone Toast component tests
describe('Toast component', () => {
  const defaultProps = {
    id: 'test-id',
    variant: 'success' as const,
    message: 'Test message',
    duration: 0,
    onDismiss: vi.fn(),
    position: 'top-right' as const,
    isExiting: false,
  }

  it('renders without crash', () => {
    render(<Toast {...defaultProps} />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('shows message', () => {
    render(<Toast {...defaultProps} message="Hello world" />)
    expect(screen.getByText('Hello world')).toBeInTheDocument()
  })

  it('shows title when provided', () => {
    render(<Toast {...defaultProps} title="My Title" />)
    expect(screen.getByText('My Title')).toBeInTheDocument()
  })

  it('does not show title when not provided', () => {
    render(<Toast {...defaultProps} />)
    expect(screen.queryByText('My Title')).not.toBeInTheDocument()
  })

  it('applies variant via data-variant attribute', () => {
    render(<Toast {...defaultProps} variant="danger" />)
    const el = screen.getByRole('alert')
    expect(el).toHaveAttribute('data-variant', 'danger')
  })

  it('close button calls onDismiss with correct id', () => {
    const onDismiss = vi.fn()
    render(<Toast {...defaultProps} id="abc-123" onDismiss={onDismiss} />)
    fireEvent.click(screen.getByLabelText('Close notification'))
    expect(onDismiss).toHaveBeenCalledWith('abc-123')
  })

  it('auto-dismiss fires after duration', () => {
    vi.useFakeTimers()
    const onDismiss = vi.fn()
    render(<Toast {...defaultProps} id="auto-id" duration={3000} onDismiss={onDismiss} />)
    expect(onDismiss).not.toHaveBeenCalled()
    act(() => vi.advanceTimersByTime(3000))
    expect(onDismiss).toHaveBeenCalledWith('auto-id')
    vi.useRealTimers()
  })

  it('does not auto-dismiss when duration is 0', () => {
    vi.useFakeTimers()
    const onDismiss = vi.fn()
    render(<Toast {...defaultProps} duration={0} onDismiss={onDismiss} />)
    act(() => vi.advanceTimersByTime(10000))
    expect(onDismiss).not.toHaveBeenCalled()
    vi.useRealTimers()
  })

  it('applies custom className', () => {
    render(<Toast {...defaultProps} className="my-toast" />)
    expect(document.querySelector('.my-toast')).toBeInTheDocument()
  })
})

// Context / useToast tests
describe('useToast hook', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  function renderWithProvider() {
    return render(
      <ToastProvider>
        <ToastTestHarness />
        <ToastContainer />
      </ToastProvider>
    )
  }

  it('toast() adds a toast to the DOM', () => {
    renderWithProvider()
    fireEvent.click(screen.getByTestId('add-success'))
    expect(screen.getByText('Saved!')).toBeInTheDocument()
    expect(screen.getByText('Success')).toBeInTheDocument()
  })

  it('multiple toasts stack', () => {
    renderWithProvider()
    fireEvent.click(screen.getByTestId('add-success'))
    fireEvent.click(screen.getByTestId('add-info'))
    expect(screen.getAllByRole('alert')).toHaveLength(2)
  })

  it('dismissAll() marks all exiting and removes after delay', () => {
    renderWithProvider()
    fireEvent.click(screen.getByTestId('add-success'))
    fireEvent.click(screen.getByTestId('add-info'))
    expect(screen.getAllByRole('alert')).toHaveLength(2)

    fireEvent.click(screen.getByTestId('dismiss-all'))
    act(() => vi.advanceTimersByTime(300))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('auto-dismiss removes toast after duration', () => {
    renderWithProvider()
    fireEvent.click(screen.getByTestId('add-success'))
    // duration default 5000
    expect(screen.getByText('Saved!')).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(5000))
    // after dismiss mark_exiting + 200ms remove
    act(() => vi.advanceTimersByTime(300))
    expect(screen.queryByText('Saved!')).not.toBeInTheDocument()
  })
})
