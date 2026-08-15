import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Spinner } from './index'

describe('Spinner', () => {
  it('renders without crash', () => {
    const { container } = render(<Spinner />)
    expect(container.firstChild).toBeTruthy()
  })

  it('has role="status"', () => {
    render(<Spinner />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('sm size — 16px', () => {
    render(<Spinner size="sm" />)
    const status = screen.getByRole('status')
    const inner = status.firstElementChild as HTMLElement
    expect(inner.style.width).toBe('16px')
    expect(inner.style.height).toBe('16px')
  })

  it('md size — 24px', () => {
    render(<Spinner size="md" />)
    const status = screen.getByRole('status')
    const inner = status.firstElementChild as HTMLElement
    expect(inner.style.width).toBe('24px')
    expect(inner.style.height).toBe('24px')
  })

  it('lg size — 40px', () => {
    render(<Spinner size="lg" />)
    const status = screen.getByRole('status')
    const inner = status.firstElementChild as HTMLElement
    expect(inner.style.width).toBe('40px')
    expect(inner.style.height).toBe('40px')
  })

  it('variant sets border-top-color', () => {
    render(<Spinner variant="success" />)
    const status = screen.getByRole('status')
    const inner = status.firstElementChild as HTMLElement
    expect(inner.style.borderTopColor).toBe('var(--color-success)')
  })

  it('default variant is info', () => {
    render(<Spinner />)
    const status = screen.getByRole('status')
    const inner = status.firstElementChild as HTMLElement
    expect(inner.style.borderTopColor).toBe('var(--color-info)')
  })

  it('label renders as sr-only text', () => {
    render(<Spinner label="Loading data" />)
    expect(screen.getByText('Loading data')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Spinner className="my-spinner" />)
    expect(screen.getByRole('status')).toHaveClass('my-spinner')
  })
})
