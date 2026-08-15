import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { NotificationPanel, type Notification } from './index'

const mockNotifications: Notification[] = [
  { id: '1', title: 'Deployment complete', message: 'v1.2.0 deployed successfully.', variant: 'success', read: false },
  { id: '2', title: 'High memory usage', message: 'Memory at 85%.', variant: 'warning', read: false },
  { id: '3', title: 'Update available', message: 'Version 2.0 is ready.', variant: 'info', read: true, timestamp: '2 hours ago' },
]

describe('NotificationPanel', () => {
  it('renders without crash', () => {
    render(<NotificationPanel />)
    expect(document.querySelector('.ds-notification-panel')).toBeInTheDocument()
  })

  it('renders "No notifications" when empty', () => {
    render(<NotificationPanel notifications={[]} />)
    expect(screen.getByText('No notifications')).toBeInTheDocument()
  })

  it('renders notification titles', () => {
    render(<NotificationPanel notifications={mockNotifications} />)
    expect(screen.getByText('Deployment complete')).toBeInTheDocument()
    expect(screen.getByText('High memory usage')).toBeInTheDocument()
    expect(screen.getByText('Update available')).toBeInTheDocument()
  })

  it('renders notification messages', () => {
    render(<NotificationPanel notifications={mockNotifications} />)
    expect(screen.getByText('v1.2.0 deployed successfully.')).toBeInTheDocument()
  })

  it('renders timestamp when provided', () => {
    render(<NotificationPanel notifications={mockNotifications} />)
    expect(screen.getByText('2 hours ago')).toBeInTheDocument()
  })

  it('shows unread count badge', () => {
    render(<NotificationPanel notifications={mockNotifications} />)
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('does not show badge when all read', () => {
    const allRead = mockNotifications.map((n) => ({ ...n, read: true }))
    render(<NotificationPanel notifications={allRead} />)
    expect(screen.queryByText('2')).not.toBeInTheDocument()
  })

  it('calls onMarkRead when unread item clicked', () => {
    const onMarkRead = vi.fn()
    render(<NotificationPanel notifications={mockNotifications} onMarkRead={onMarkRead} />)
    fireEvent.click(screen.getByText('Deployment complete').closest('[data-read="false"]')!)
    expect(onMarkRead).toHaveBeenCalledWith('1')
  })

  it('renders Clear all button when onClear provided', () => {
    const onClear = vi.fn()
    render(<NotificationPanel notifications={mockNotifications} onClear={onClear} />)
    const clearBtn = screen.getByText('Clear all')
    expect(clearBtn).toBeInTheDocument()
    fireEvent.click(clearBtn)
    expect(onClear).toHaveBeenCalledOnce()
  })

  it('does not render Clear all when notifications empty', () => {
    render(<NotificationPanel notifications={[]} onClear={vi.fn()} />)
    expect(screen.queryByText('Clear all')).not.toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<NotificationPanel className="my-panel" />)
    expect(document.querySelector('.my-panel')).toBeInTheDocument()
  })
})
