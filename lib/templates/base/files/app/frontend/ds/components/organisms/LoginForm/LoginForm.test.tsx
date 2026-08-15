import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LoginForm } from './index'

describe('LoginForm', () => {
  it('renders without crash', () => {
    render(<LoginForm />)
    expect(document.querySelector('.ds-login-form')).toBeInTheDocument()
  })

  it('renders email and password fields', () => {
    render(<LoginForm />)
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
  })

  it('renders sign in button', () => {
    render(<LoginForm />)
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('renders remember me checkbox', () => {
    render(<LoginForm />)
    expect(screen.getByText('Remember me')).toBeInTheDocument()
  })

  it('renders error message when provided', () => {
    render(<LoginForm error="Invalid credentials" />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
  })

  it('does not render error when not provided', () => {
    render(<LoginForm />)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('shows loading text when loading', () => {
    render(<LoginForm loading />)
    expect(screen.getByText('Signing in…')).toBeInTheDocument()
  })

  it('calls onSubmit with form values', () => {
    const onSubmit = vi.fn()
    render(<LoginForm onSubmit={onSubmit} />)

    fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
      target: { value: 'user@test.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'secret123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    expect(onSubmit).toHaveBeenCalledOnce()
    expect(onSubmit).toHaveBeenCalledWith({
      email: 'user@test.com',
      password: 'secret123',
      rememberMe: false,
    })
  })

  it('applies custom className', () => {
    render(<LoginForm className="my-login" />)
    expect(document.querySelector('.my-login')).toBeInTheDocument()
  })
})
