import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Popover } from './index'

describe('Popover', () => {
  it('renders trigger', () => {
    render(
      <Popover trigger={<button>Open</button>}>
        <div>Content</div>
      </Popover>
    )
    expect(screen.getByText('Open')).toBeInTheDocument()
  })

  it('is closed by default', () => {
    render(
      <Popover trigger={<button>Open</button>}>
        <div>Popover content</div>
      </Popover>
    )
    expect(screen.queryByText('Popover content')).not.toBeInTheDocument()
  })

  it('opens on trigger click', () => {
    render(
      <Popover trigger={<button>Open</button>}>
        <div>Popover content</div>
      </Popover>
    )
    fireEvent.click(screen.getByText('Open'))
    expect(screen.getByText('Popover content')).toBeInTheDocument()
  })

  it('closes on second trigger click', () => {
    render(
      <Popover trigger={<button>Open</button>}>
        <div>Popover content</div>
      </Popover>
    )
    fireEvent.click(screen.getByText('Open'))
    expect(screen.getByText('Popover content')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Open'))
    expect(screen.queryByText('Popover content')).not.toBeInTheDocument()
  })

  it('closes on outside click', () => {
    render(
      <div>
        <Popover trigger={<button>Open</button>}>
          <div>Popover content</div>
        </Popover>
        <div data-testid="outside">Outside</div>
      </div>
    )
    fireEvent.click(screen.getByText('Open'))
    expect(screen.getByText('Popover content')).toBeInTheDocument()
    fireEvent.mouseDown(screen.getByTestId('outside'))
    expect(screen.queryByText('Popover content')).not.toBeInTheDocument()
  })

  it('closes on Escape key', () => {
    render(
      <Popover trigger={<button>Open</button>}>
        <div>Popover content</div>
      </Popover>
    )
    fireEvent.click(screen.getByText('Open'))
    expect(screen.getByText('Popover content')).toBeInTheDocument()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByText('Popover content')).not.toBeInTheDocument()
  })

  it('shows content when open prop is true (controlled)', () => {
    render(
      <Popover trigger={<button>Open</button>} open={true}>
        <div>Popover content</div>
      </Popover>
    )
    expect(screen.getByText('Popover content')).toBeInTheDocument()
  })

  it('calls onOpenChange when toggled', () => {
    const handleChange = vi.fn()
    render(
      <Popover trigger={<button>Open</button>} onOpenChange={handleChange}>
        <div>Content</div>
      </Popover>
    )
    fireEvent.click(screen.getByText('Open'))
    expect(handleChange).toHaveBeenCalledWith(true)
  })

  it('renders dialog role when open', () => {
    render(
      <Popover trigger={<button>Open</button>}>
        <div>Content</div>
      </Popover>
    )
    fireEvent.click(screen.getByText('Open'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <Popover trigger={<span>T</span>} className="my-popover">
        <div>C</div>
      </Popover>
    )
    expect(container.firstChild).toHaveClass('my-popover')
  })
})
