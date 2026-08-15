import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Drawer } from './index'

describe('Drawer', () => {
  it('renders when open', () => {
    render(<Drawer isOpen={true} onClose={vi.fn()} title="Settings" />)
    expect(screen.getByRole('dialog')).toBeDefined()
  })

  it('does not render when closed', () => {
    render(<Drawer isOpen={false} onClose={vi.fn()} title="Settings" />)
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('shows title', () => {
    render(<Drawer isOpen={true} onClose={vi.fn()} title="My Drawer" />)
    expect(screen.getByText('My Drawer')).toBeDefined()
  })

  it('renders children', () => {
    render(<Drawer isOpen={true} onClose={vi.fn()}><p>Content here</p></Drawer>)
    expect(screen.getByText('Content here')).toBeDefined()
  })

  it('calls onClose when close button clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<Drawer isOpen={true} onClose={onClose} title="Test" />)
    await user.click(screen.getByLabelText('Close drawer'))
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when backdrop clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<Drawer isOpen={true} onClose={onClose} title="Test" />)
    await user.click(screen.getByRole('dialog').parentElement!)
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose on Escape key', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<Drawer isOpen={true} onClose={onClose} />)
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalled()
  })

  it('left position renders', () => {
    render(<Drawer isOpen={true} onClose={vi.fn()} position="left" />)
    expect(screen.getByRole('dialog')).toBeDefined()
  })

  it('size variants render', () => {
    const { rerender } = render(<Drawer isOpen={true} onClose={vi.fn()} size="sm" />)
    expect(screen.getByRole('dialog')).toBeDefined()
    rerender(<Drawer isOpen={true} onClose={vi.fn()} size="lg" />)
    expect(screen.getByRole('dialog')).toBeDefined()
  })

  it('applies custom className', () => {
    const { container } = render(<Drawer isOpen={true} onClose={vi.fn()} className="my-drawer" />)
    expect(container.firstChild).toHaveClass('my-drawer')
  })
})
