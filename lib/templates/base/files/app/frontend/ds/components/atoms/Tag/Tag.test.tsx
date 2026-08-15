import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Tag } from './index'

describe('Tag', () => {
  it('renders label', () => {
    render(<Tag label="React" />)
    expect(screen.getByText('React')).toBeTruthy()
  })

  it('renders without remove button by default', () => {
    render(<Tag label="Vue" />)
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('renders remove button when removable', () => {
    render(<Tag label="TypeScript" removable />)
    expect(screen.getByRole('button')).toBeTruthy()
  })

  it('calls onRemove when X is clicked', () => {
    const onRemove = vi.fn()
    render(<Tag label="Angular" removable onRemove={onRemove} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onRemove).toHaveBeenCalledOnce()
  })

  it('applies primary variant styles', () => {
    const { container } = render(<Tag label="Primary" variant="primary" />)
    const tag = container.firstChild as HTMLElement
    expect(tag.style.color).toBeTruthy()
  })

  it('applies success variant', () => {
    const { container } = render(<Tag label="Done" variant="success" />)
    expect(container.firstChild).toBeTruthy()
  })

  it('applies warning variant', () => {
    const { container } = render(<Tag label="Pending" variant="warning" />)
    expect(container.firstChild).toBeTruthy()
  })

  it('applies danger variant', () => {
    const { container } = render(<Tag label="Error" variant="danger" />)
    expect(container.firstChild).toBeTruthy()
  })

  it('renders sm size', () => {
    const { container } = render(<Tag label="Small" size="sm" />)
    expect(container.firstChild).toBeTruthy()
  })

  it('remove button has accessible label', () => {
    render(<Tag label="Go" removable />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Remove Go')
  })
})
