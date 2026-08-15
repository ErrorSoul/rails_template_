import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProgressCircle } from './index'

describe('ProgressCircle', () => {
  it('renders an SVG', () => {
    const { container } = render(<ProgressCircle value={50} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders track and progress arc', () => {
    render(<ProgressCircle value={50} />)
    expect(screen.getByTestId('progress-track')).toBeInTheDocument()
    expect(screen.getByTestId('progress-arc')).toBeInTheDocument()
  })

  it('shows percentage value when showValue=true', () => {
    render(<ProgressCircle value={75} showValue />)
    expect(screen.getByTestId('progress-value')).toHaveTextContent('75%')
  })

  it('does not show value by default', () => {
    render(<ProgressCircle value={50} />)
    expect(screen.queryByTestId('progress-value')).not.toBeInTheDocument()
  })

  it('clamps value to 0 at minimum', () => {
    render(<ProgressCircle value={-10} showValue />)
    expect(screen.getByTestId('progress-value')).toHaveTextContent('0%')
  })

  it('clamps value to 100 at maximum', () => {
    render(<ProgressCircle value={150} showValue />)
    expect(screen.getByTestId('progress-value')).toHaveTextContent('100%')
  })

  it('applies sm size', () => {
    const { container } = render(<ProgressCircle value={50} size="sm" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '40')
  })

  it('applies lg size', () => {
    const { container } = render(<ProgressCircle value={50} size="lg" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '96')
  })

  it('has correct role and aria attributes', () => {
    render(<ProgressCircle value={60} />)
    const el = screen.getByRole('progressbar')
    expect(el).toHaveAttribute('aria-valuenow', '60')
    expect(el).toHaveAttribute('aria-valuemin', '0')
    expect(el).toHaveAttribute('aria-valuemax', '100')
  })
})
