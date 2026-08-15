import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Switch } from './index'

describe('Switch', () => {
  it('renders without crash', () => {
    render(<Switch checked={false} onChange={() => {}} />)
    expect(screen.getByRole('switch')).toBeInTheDocument()
  })

  it('checked state sets aria-checked true', () => {
    render(<Switch checked={true} onChange={() => {}} />)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
  })

  it('unchecked state sets aria-checked false', () => {
    render(<Switch checked={false} onChange={() => {}} />)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false')
  })

  it('click calls onChange with toggled value', () => {
    const handler = vi.fn()
    render(<Switch checked={false} onChange={handler} />)
    fireEvent.click(screen.getByRole('switch').parentElement!)
    expect(handler).toHaveBeenCalledWith(true)
  })

  it('click on checked switch calls onChange with false', () => {
    const handler = vi.fn()
    render(<Switch checked={true} onChange={handler} />)
    fireEvent.click(screen.getByRole('switch').parentElement!)
    expect(handler).toHaveBeenCalledWith(false)
  })

  it('disabled switch does not call onChange', () => {
    const handler = vi.fn()
    render(<Switch checked={false} onChange={handler} disabled />)
    fireEvent.click(screen.getByRole('switch').parentElement!)
    expect(handler).not.toHaveBeenCalled()
  })

  it('renders label text', () => {
    render(<Switch checked={false} onChange={() => {}} label="Enable notifications" />)
    expect(screen.getByText('Enable notifications')).toBeInTheDocument()
  })

  it('sm size sets data-size attribute', () => {
    render(<Switch checked={false} onChange={() => {}} size="sm" />)
    expect(screen.getByRole('switch')).toHaveAttribute('data-size', 'sm')
  })

  it('md size sets data-size attribute', () => {
    render(<Switch checked={false} onChange={() => {}} size="md" />)
    expect(screen.getByRole('switch')).toHaveAttribute('data-size', 'md')
  })

  it('applies custom className', () => {
    render(<Switch checked={false} onChange={() => {}} className="my-switch" />)
    expect(screen.getByRole('switch').parentElement).toHaveClass('my-switch')
  })
})
