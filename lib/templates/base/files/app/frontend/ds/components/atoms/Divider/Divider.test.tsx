import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Divider } from './index'

describe('Divider', () => {
  it('renders horizontal divider without crash', () => {
    render(<Divider />)
    expect(screen.getByRole('separator')).toBeDefined()
  })

  it('horizontal orientation is default', () => {
    render(<Divider />)
    expect(screen.getByRole('separator').getAttribute('aria-orientation')).toBe('horizontal')
  })

  it('vertical orientation sets aria-orientation', () => {
    render(<Divider orientation="vertical" />)
    expect(screen.getByRole('separator').getAttribute('aria-orientation')).toBe('vertical')
  })

  it('renders label text when provided', () => {
    render(<Divider label="OR" />)
    expect(screen.getByText('OR')).toBeDefined()
  })

  it('no label text when not provided', () => {
    render(<Divider />)
    expect(screen.queryByText('OR')).toBeNull()
  })

  it('applies custom className', () => {
    const { container } = render(<Divider className="my-divider" />)
    expect(container.firstChild).toHaveClass('my-divider')
  })

  it('variant=primary applies primary color', () => {
    render(<Divider variant="primary" />)
    const el = screen.getByRole('separator')
    expect(el.getAttribute('style')).toContain('var(--color-primary)')
  })

  it('variant=gradient applies gradient background', () => {
    render(<Divider variant="gradient" />)
    const el = screen.getByRole('separator')
    expect(el.getAttribute('style')).toContain('var(--gradient-primary)')
  })
})
