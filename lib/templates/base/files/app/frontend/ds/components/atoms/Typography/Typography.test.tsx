import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Typography } from './index'

describe('Typography', () => {
  it('renders without crash', () => {
    render(<Typography>Hello</Typography>)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('renders as p by default (body variant)', () => {
    render(<Typography>Body text</Typography>)
    const el = screen.getByText('Body text')
    expect(el.tagName.toLowerCase()).toBe('p')
  })

  it('renders h1 tag for h1 variant', () => {
    render(<Typography variant="h1">Heading 1</Typography>)
    const el = screen.getByText('Heading 1')
    expect(el.tagName.toLowerCase()).toBe('h1')
  })

  it('renders h2 tag for h2 variant', () => {
    render(<Typography variant="h2">Heading 2</Typography>)
    expect(screen.getByText('Heading 2').tagName.toLowerCase()).toBe('h2')
  })

  it('renders h3 tag for h3 variant', () => {
    render(<Typography variant="h3">Heading 3</Typography>)
    expect(screen.getByText('Heading 3').tagName.toLowerCase()).toBe('h3')
  })

  it('renders h4 tag for h4 variant', () => {
    render(<Typography variant="h4">Heading 4</Typography>)
    expect(screen.getByText('Heading 4').tagName.toLowerCase()).toBe('h4')
  })

  it('renders small tag for small variant', () => {
    render(<Typography variant="small">Small text</Typography>)
    expect(screen.getByText('Small text').tagName.toLowerCase()).toBe('small')
  })

  it('renders span tag for caption variant', () => {
    render(<Typography variant="caption">Caption text</Typography>)
    expect(screen.getByText('Caption text').tagName.toLowerCase()).toBe('span')
  })

  it('applies variant data attribute', () => {
    render(<Typography variant="h2">Title</Typography>)
    expect(screen.getByText('Title')).toHaveAttribute('data-variant', 'h2')
  })

  it('applies color data attribute', () => {
    render(<Typography color="primary">Colored</Typography>)
    expect(screen.getByText('Colored')).toHaveAttribute('data-color', 'primary')
  })

  it('applies primary color style', () => {
    render(<Typography color="primary">Primary</Typography>)
    expect(screen.getByText('Primary').style.color).toBe('var(--color-primary)')
  })

  it('applies muted color style', () => {
    render(<Typography color="muted">Muted</Typography>)
    expect(screen.getByText('Muted').style.color).toBe('var(--color-gray-500)')
  })

  it('applies custom className', () => {
    render(<Typography className="custom">Text</Typography>)
    expect(screen.getByText('Text')).toHaveClass('custom')
  })
})
