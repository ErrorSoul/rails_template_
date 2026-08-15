import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { NumberInput } from './index'

describe('NumberInput', () => {
  it('renders without crashing', () => {
    render(<NumberInput value={5} onChange={() => {}} />)
    expect(screen.getByDisplayValue('5')).toBeInTheDocument()
  })

  it('renders label', () => {
    render(<NumberInput value={0} onChange={() => {}} label="Quantity" />)
    expect(screen.getByText('Quantity')).toBeInTheDocument()
  })

  it('increments value on + button click', () => {
    const handleChange = vi.fn()
    render(<NumberInput value={5} onChange={handleChange} />)
    fireEvent.click(screen.getByRole('button', { name: /increase/i }))
    expect(handleChange).toHaveBeenCalledWith(6)
  })

  it('decrements value on - button click', () => {
    const handleChange = vi.fn()
    render(<NumberInput value={5} onChange={handleChange} />)
    fireEvent.click(screen.getByRole('button', { name: /decrease/i }))
    expect(handleChange).toHaveBeenCalledWith(4)
  })

  it('respects min bound', () => {
    const handleChange = vi.fn()
    render(<NumberInput value={0} onChange={handleChange} min={0} />)
    fireEvent.click(screen.getByRole('button', { name: /decrease/i }))
    // Button should be disabled at min
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('respects max bound', () => {
    const handleChange = vi.fn()
    render(<NumberInput value={10} onChange={handleChange} max={10} />)
    fireEvent.click(screen.getByRole('button', { name: /increase/i }))
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('increments with custom step', () => {
    const handleChange = vi.fn()
    render(<NumberInput value={5} onChange={handleChange} step={5} />)
    fireEvent.click(screen.getByRole('button', { name: /increase/i }))
    expect(handleChange).toHaveBeenCalledWith(10)
  })

  it('handles keyboard arrow up', () => {
    const handleChange = vi.fn()
    render(<NumberInput value={5} onChange={handleChange} />)
    const input = screen.getByDisplayValue('5')
    fireEvent.keyDown(input, { key: 'ArrowUp' })
    expect(handleChange).toHaveBeenCalledWith(6)
  })

  it('handles keyboard arrow down', () => {
    const handleChange = vi.fn()
    render(<NumberInput value={5} onChange={handleChange} />)
    const input = screen.getByDisplayValue('5')
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    expect(handleChange).toHaveBeenCalledWith(4)
  })

  it('allows direct input and validates on blur', () => {
    const handleChange = vi.fn()
    render(<NumberInput value={5} onChange={handleChange} />)
    const input = screen.getByDisplayValue('5')
    fireEvent.change(input, { target: { value: '42' } })
    fireEvent.blur(input)
    expect(handleChange).toHaveBeenCalledWith(42)
  })

  it('reverts invalid input on blur', () => {
    const handleChange = vi.fn()
    render(<NumberInput value={5} onChange={handleChange} />)
    const input = screen.getByDisplayValue('5')
    fireEvent.change(input, { target: { value: 'abc' } })
    fireEvent.blur(input)
    // Should not call onChange with NaN, and localValue reverts
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('renders disabled state', () => {
    render(<NumberInput value={5} onChange={() => {}} disabled />)
    const input = screen.getByDisplayValue('5')
    expect(input).toBeDisabled()
  })

  it('shows error message', () => {
    render(<NumberInput value={5} onChange={() => {}} error="Too high" />)
    expect(screen.getByText('Too high')).toBeInTheDocument()
  })
})
