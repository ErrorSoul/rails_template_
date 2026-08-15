import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Row } from './index'

describe('Row', () => {
  it('renders children', () => {
    render(<Row>content</Row>)
    expect(screen.getByText('content')).toBeInTheDocument()
  })

  it('applies negative margin for gutters by default', () => {
    const { container } = render(<Row>content</Row>)
    expect(container.firstChild).toHaveClass('-mx-2')
  })

  it('removes gutter margin when noGutters', () => {
    const { container } = render(<Row noGutters>content</Row>)
    expect(container.firstChild).not.toHaveClass('-mx-2')
  })

  it('applies custom className', () => {
    const { container } = render(<Row className="my-row">content</Row>)
    expect(container.firstChild).toHaveClass('my-row')
  })
})
