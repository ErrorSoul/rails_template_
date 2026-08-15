import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { OTPInput } from './index'

describe('OTPInput', () => {
  it('renders correct number of inputs (default 6)', () => {
    render(<OTPInput />)
    const inputs = screen.getAllByRole('textbox')
    expect(inputs).toHaveLength(6)
  })

  it('renders custom length inputs', () => {
    render(<OTPInput length={4} />)
    expect(screen.getAllByRole('textbox')).toHaveLength(4)
  })

  it('shows error message', () => {
    render(<OTPInput error="Invalid code" />)
    expect(screen.getByText('Invalid code')).toBeInTheDocument()
  })

  it('disables all inputs when disabled', () => {
    render(<OTPInput disabled />)
    screen.getAllByRole('textbox').forEach((input) => {
      expect(input).toBeDisabled()
    })
  })

  it('calls onChange when typing', () => {
    const onChange = vi.fn()
    render(<OTPInput onChange={onChange} />)
    const inputs = screen.getAllByRole('textbox')
    fireEvent.change(inputs[0], { target: { value: '1' } })
    expect(onChange).toHaveBeenCalledWith('1')
  })

  it('calls onComplete when all boxes filled', () => {
    const onComplete = vi.fn()
    render(<OTPInput length={3} value="12" onComplete={onComplete} onChange={vi.fn()} />)
    const inputs = screen.getAllByRole('textbox')
    fireEvent.change(inputs[2], { target: { value: '3' } })
    expect(onComplete).toHaveBeenCalledWith('123')
  })

  it('moves focus to next input on digit entry', () => {
    render(<OTPInput />)
    const inputs = screen.getAllByRole('textbox')
    inputs[0].focus()
    fireEvent.change(inputs[0], { target: { value: '5' } })
    // Focus should move to second input (index 1)
    expect(document.activeElement).toBe(inputs[1])
  })

  it('has numeric inputMode on all inputs', () => {
    render(<OTPInput />)
    screen.getAllByRole('textbox').forEach((input) => {
      expect(input).toHaveAttribute('inputMode', 'numeric')
    })
  })

  it('shows initial value in correct boxes', () => {
    render(<OTPInput length={4} value="12" />)
    const inputs = screen.getAllByRole('textbox')
    expect(inputs[0]).toHaveValue('1')
    expect(inputs[1]).toHaveValue('2')
    expect(inputs[2]).toHaveValue('')
  })
})
