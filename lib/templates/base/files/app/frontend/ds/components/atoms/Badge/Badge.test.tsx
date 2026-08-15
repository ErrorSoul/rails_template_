import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from './index'

describe('Badge', () => {
  it('renders without crash', () => {
    render(<Badge>New</Badge>)
    expect(screen.getByText('New')).toBeInTheDocument()
  })

  it('renders children', () => {
    render(<Badge>Beta</Badge>)
    expect(screen.getByText('Beta')).toBeInTheDocument()
  })

  it('applies default variant', () => {
    render(<Badge>Default</Badge>)
    expect(screen.getByText('Default')).toHaveAttribute('data-variant', 'primary')
  })

  it('applies info variant', () => {
    render(<Badge variant="info">Info</Badge>)
    const badge = screen.getByText('Info')
    expect(badge).toHaveAttribute('data-variant', 'info')
    expect(badge.style.backgroundColor).toBe('var(--color-info)')
  })

  it('applies success variant', () => {
    render(<Badge variant="success">Success</Badge>)
    const badge = screen.getByText('Success')
    expect(badge).toHaveAttribute('data-variant', 'success')
    expect(badge.style.backgroundColor).toBe('var(--color-success)')
  })

  it('applies warning variant', () => {
    render(<Badge variant="warning">Warning</Badge>)
    expect(screen.getByText('Warning')).toHaveAttribute('data-variant', 'warning')
  })

  it('applies danger variant', () => {
    render(<Badge variant="danger">Danger</Badge>)
    expect(screen.getByText('Danger')).toHaveAttribute('data-variant', 'danger')
  })

  it('applies default variant color', () => {
    render(<Badge variant="default">Default</Badge>)
    const badge = screen.getByText('Default')
    expect(badge.style.backgroundColor).toBe('var(--color-default)')
  })

  it('applies custom className', () => {
    render(<Badge className="my-badge">Badge</Badge>)
    expect(screen.getByText('Badge')).toHaveClass('my-badge')
  })
})
