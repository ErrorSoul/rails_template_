import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Avatar } from './index'

describe('Avatar', () => {
  it('renders without crash', () => {
    render(<Avatar />)
  })

  it('renders img when src is provided', () => {
    render(<Avatar src="https://example.com/avatar.jpg" alt="John" />)
    const img = screen.getByRole('img')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg')
    expect(img).toHaveAttribute('alt', 'John')
  })

  it('shows initials when no src and initials provided', () => {
    render(<Avatar initials="AB" />)
    expect(screen.getByText('AB')).toBeInTheDocument()
  })

  it('truncates initials to 2 characters', () => {
    render(<Avatar initials="ABCD" />)
    expect(screen.getByText('AB')).toBeInTheDocument()
  })

  it('renders placeholder when neither src nor initials provided', () => {
    render(<Avatar alt="placeholder" />)
    // Should render a span with aria-label (placeholder circle)
    expect(screen.getByLabelText('placeholder')).toBeInTheDocument()
  })

  it('applies size sm via data attribute', () => {
    render(<Avatar size="sm" initials="SM" />)
    expect(screen.getByText('SM')).toHaveAttribute('data-size', 'sm')
  })

  it('applies size md by default', () => {
    render(<Avatar initials="MD" />)
    expect(screen.getByText('MD')).toHaveAttribute('data-size', 'md')
  })

  it('applies size lg via data attribute', () => {
    render(<Avatar size="lg" initials="LG" />)
    expect(screen.getByText('LG')).toHaveAttribute('data-size', 'lg')
  })

  it('sets correct pixel dimensions for sm size', () => {
    render(<Avatar size="sm" initials="S" />)
    const el = screen.getByText('S')
    expect(el.style.width).toBe('32px')
    expect(el.style.height).toBe('32px')
  })

  it('sets correct pixel dimensions for lg size on img', () => {
    render(<Avatar size="lg" src="https://example.com/img.jpg" alt="user" />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('width', '64')
    expect(img).toHaveAttribute('height', '64')
  })

  it('applies custom className', () => {
    render(<Avatar className="my-avatar" initials="CU" />)
    expect(screen.getByText('CU')).toHaveClass('my-avatar')
  })
})
