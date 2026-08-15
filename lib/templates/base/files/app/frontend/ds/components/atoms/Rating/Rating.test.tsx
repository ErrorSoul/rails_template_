import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Rating } from './index'

describe('Rating', () => {
  it('renders correct number of stars', () => {
    render(<Rating value={3} max={5} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(5)
  })

  it('uses custom max', () => {
    render(<Rating value={2} max={10} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(10)
  })

  it('calls onChange with star value on click', () => {
    const onChange = vi.fn()
    render(<Rating value={2} onChange={onChange} />)
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[3]) // 4th star (index 3 = value 4)
    expect(onChange).toHaveBeenCalledWith(4)
  })

  it('does not call onChange when readonly', () => {
    const onChange = vi.fn()
    render(<Rating value={3} onChange={onChange} readonly />)
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[0])
    expect(onChange).not.toHaveBeenCalled()
  })

  it('disables buttons in readonly mode', () => {
    render(<Rating value={3} readonly />)
    const buttons = screen.getAllByRole('button')
    buttons.forEach((btn) => expect(btn).toBeDisabled())
  })

  it('has correct aria-label', () => {
    render(<Rating value={4} max={5} />)
    expect(screen.getByRole('group', { hidden: true })).toHaveAttribute('aria-label', 'Rating: 4 out of 5')
  })

  it('renders sm size without crashing', () => {
    const { container } = render(<Rating value={2} size="sm" />)
    expect(container.firstChild).toBeTruthy()
  })

  it('renders lg size without crashing', () => {
    const { container } = render(<Rating value={5} size="lg" max={5} />)
    expect(container.firstChild).toBeTruthy()
  })
})
