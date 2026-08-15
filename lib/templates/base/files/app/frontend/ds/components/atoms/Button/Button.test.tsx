import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './index'

describe('Button', () => {
  it('renders without crash', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('renders children', () => {
    render(<Button>Hello</Button>)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('applies variant via data attribute', () => {
    render(<Button variant="info">Info</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('data-variant', 'info')
  })

  it('applies size via data attribute', () => {
    render(<Button size="lg">Large</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('data-size', 'lg')
  })

  it('fires onClick when clicked', () => {
    const handler = vi.fn()
    render(<Button onClick={handler}>Click</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('does not fire onClick when disabled', () => {
    const handler = vi.fn()
    render(<Button disabled onClick={handler}>Click</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(handler).not.toHaveBeenCalled()
  })

  it('renders as disabled button when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('applies outline style when outline prop is true', () => {
    render(<Button outline>Outline</Button>)
    const btn = screen.getByRole('button')
    expect(btn.style.background).toBe('transparent')
  })

  it('applies custom className', () => {
    render(<Button className="custom-class">Btn</Button>)
    expect(screen.getByRole('button')).toHaveClass('custom-class')
  })
})
