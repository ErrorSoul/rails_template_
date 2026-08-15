import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Stepper } from './index'

const steps = [
  { label: 'Account', description: 'Enter details' },
  { label: 'Profile', description: 'Upload photo' },
  { label: 'Review' },
]

describe('Stepper', () => {
  it('renders without crash', () => {
    render(<Stepper steps={steps} activeStep={0} />)
    expect(screen.getByRole('list')).toBeDefined()
  })

  it('renders all step labels', () => {
    render(<Stepper steps={steps} activeStep={1} />)
    expect(screen.getByText('Account')).toBeDefined()
    expect(screen.getByText('Profile')).toBeDefined()
    expect(screen.getByText('Review')).toBeDefined()
  })

  it('active step has aria-current="step"', () => {
    render(<Stepper steps={steps} activeStep={1} />)
    const items = screen.getAllByRole('listitem')
    expect(items[1].getAttribute('aria-current')).toBe('step')
  })

  it('inactive steps do not have aria-current', () => {
    render(<Stepper steps={steps} activeStep={1} />)
    const items = screen.getAllByRole('listitem')
    expect(items[0].getAttribute('aria-current')).toBeNull()
    expect(items[2].getAttribute('aria-current')).toBeNull()
  })

  it('completed steps show checkmark', () => {
    render(<Stepper steps={steps} activeStep={2} />)
    const checkmarks = screen.getAllByText('✓')
    expect(checkmarks.length).toBe(2)
  })

  it('renders descriptions', () => {
    render(<Stepper steps={steps} activeStep={0} />)
    expect(screen.getByText('Enter details')).toBeDefined()
    expect(screen.getByText('Upload photo')).toBeDefined()
  })

  it('vertical orientation renders', () => {
    const { container } = render(<Stepper steps={steps} activeStep={0} orientation="vertical" />)
    expect(container.firstChild).toBeDefined()
  })

  it('applies custom className', () => {
    const { container } = render(<Stepper steps={steps} activeStep={0} className="my-stepper" />)
    expect(container.firstChild).toHaveClass('my-stepper')
  })
})
