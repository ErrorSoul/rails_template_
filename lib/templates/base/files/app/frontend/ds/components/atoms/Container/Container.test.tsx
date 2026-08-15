import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Container } from './index'

describe('Container', () => {
  it('renders children', () => {
    render(<Container>hello</Container>)
    expect(screen.getByText('hello')).toBeInTheDocument()
  })

  it('applies max-width class by default', () => {
    const { container } = render(<Container>content</Container>)
    expect(container.firstChild).toHaveClass('max-w-[1140px]')
  })

  it('removes max-width when fluid', () => {
    const { container } = render(<Container fluid>content</Container>)
    expect(container.firstChild).not.toHaveClass('max-w-[1140px]')
  })

  it('applies custom className', () => {
    const { container } = render(<Container className="my-class">content</Container>)
    expect(container.firstChild).toHaveClass('my-class')
  })
})
