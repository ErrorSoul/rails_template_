import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FormDivider } from './index'

describe('FormDivider', () => {
  it('renders without crashing', () => {
    render(<FormDivider />)
    expect(screen.getByText('or')).toBeInTheDocument()
  })

  it('shows default "or" text', () => {
    render(<FormDivider />)
    expect(screen.getByText('or')).toBeInTheDocument()
  })

  it('shows custom text', () => {
    render(<FormDivider text="or continue with" />)
    expect(screen.getByText('or continue with')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<FormDivider className="my-divider" />)
    expect(container.firstChild).toHaveClass('my-divider')
  })
})
