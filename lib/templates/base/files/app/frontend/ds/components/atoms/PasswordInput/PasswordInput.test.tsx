import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PasswordInput } from './index'

describe('PasswordInput', () => {
  it('renders without crashing', () => {
    render(<PasswordInput />)
    expect(screen.getByPlaceholderText('Enter password')).toBeInTheDocument()
  })

  it('renders with label', () => {
    render(<PasswordInput label="Password" />)
    expect(screen.getByText('Password')).toBeInTheDocument()
  })

  it('starts as password type (hidden)', () => {
    render(<PasswordInput value="secret" onChange={() => {}} />)
    const input = screen.getByPlaceholderText('Enter password')
    expect(input).toHaveAttribute('type', 'password')
  })

  it('toggles visibility on eye button click', () => {
    render(<PasswordInput value="secret" onChange={() => {}} />)
    const input = screen.getByPlaceholderText('Enter password')
    const toggleBtn = screen.getByRole('button', { name: /show password/i })

    fireEvent.click(toggleBtn)
    expect(input).toHaveAttribute('type', 'text')

    const hideBtn = screen.getByRole('button', { name: /hide password/i })
    fireEvent.click(hideBtn)
    expect(input).toHaveAttribute('type', 'password')
  })

  it('shows strength indicator when showStrength is true', () => {
    render(<PasswordInput showStrength strength="weak" />)
    expect(screen.getByTestId('strength-label')).toHaveTextContent('Weak')
  })

  it('shows fair strength', () => {
    render(<PasswordInput showStrength strength="fair" />)
    expect(screen.getByTestId('strength-label')).toHaveTextContent('Fair')
  })

  it('shows strong strength', () => {
    render(<PasswordInput showStrength strength="strong" />)
    expect(screen.getByTestId('strength-label')).toHaveTextContent('Strong')
  })

  it('shows error state', () => {
    render(<PasswordInput error="Password is required" />)
    expect(screen.getByText('Password is required')).toBeInTheDocument()
    const input = screen.getByPlaceholderText('Enter password')
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })

  it('handles disabled state', () => {
    render(<PasswordInput disabled />)
    const input = screen.getByPlaceholderText('Enter password')
    expect(input).toBeDisabled()
  })

  it('calls onChange handler', () => {
    const handleChange = vi.fn()
    render(<PasswordInput onChange={handleChange} />)
    fireEvent.change(screen.getByPlaceholderText('Enter password'), {
      target: { value: 'test' },
    })
    expect(handleChange).toHaveBeenCalled()
  })
})
