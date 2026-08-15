import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Progress } from './index'

describe('Progress', () => {
  it('renders without crash', () => {
    render(<Progress value={50} />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('width corresponds to value', () => {
    render(<Progress value={75} />)
    const bar = screen.getByRole('progressbar').firstElementChild as HTMLElement
    expect(bar.style.width).toBe('75%')
  })

  it('sets aria-valuenow to value', () => {
    render(<Progress value={42} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '42')
  })

  it('sets aria-valuemin and aria-valuemax', () => {
    render(<Progress value={50} />)
    const pb = screen.getByRole('progressbar')
    expect(pb).toHaveAttribute('aria-valuemin', '0')
    expect(pb).toHaveAttribute('aria-valuemax', '100')
  })

  it('clamps value above 100', () => {
    render(<Progress value={150} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
  })

  it('clamps value below 0', () => {
    render(<Progress value={-10} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')
  })

  it('variant sets data-variant attribute', () => {
    render(<Progress value={50} variant="success" />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('data-variant', 'success')
  })

  it('size sets data-size attribute', () => {
    render(<Progress value={50} size="lg" />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('data-size', 'lg')
  })

  it('sm size renders 6px height', () => {
    render(<Progress value={50} size="sm" />)
    const track = screen.getByRole('progressbar')
    expect(track.style.height).toBe('6px')
  })

  it('md size renders 10px height', () => {
    render(<Progress value={50} size="md" />)
    expect(screen.getByRole('progressbar').style.height).toBe('10px')
  })

  it('lg size renders 16px height', () => {
    render(<Progress value={50} size="lg" />)
    expect(screen.getByRole('progressbar').style.height).toBe('16px')
  })

  it('showLabel displays percentage text', () => {
    render(<Progress value={66} showLabel />)
    expect(screen.getByText('66%')).toBeInTheDocument()
  })

  it('does not show label by default', () => {
    render(<Progress value={66} />)
    expect(screen.queryByText('66%')).not.toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Progress value={50} className="my-class" />)
    const wrap = screen.getByRole('progressbar').parentElement
    expect(wrap).toHaveClass('my-class')
  })
})
