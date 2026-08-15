import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Col } from './index'

describe('Col', () => {
  it('renders children', () => {
    render(<Col>content</Col>)
    expect(screen.getByText('content')).toBeInTheDocument()
  })

  it('applies full width by default', () => {
    const { container } = render(<Col>content</Col>)
    expect(container.firstChild).toHaveClass('w-full')
  })

  it('applies span class', () => {
    const { container } = render(<Col span={6}>content</Col>)
    expect(container.firstChild).toHaveClass('w-6/12')
  })

  it('applies md responsive class', () => {
    const { container } = render(<Col md={4}>content</Col>)
    expect(container.firstChild).toHaveClass('md:w-4/12')
  })

  it('applies lg responsive class', () => {
    const { container } = render(<Col lg={3}>content</Col>)
    expect(container.firstChild).toHaveClass('lg:w-3/12')
  })

  it('applies custom className', () => {
    const { container } = render(<Col className="my-col">content</Col>)
    expect(container.firstChild).toHaveClass('my-col')
  })
})
