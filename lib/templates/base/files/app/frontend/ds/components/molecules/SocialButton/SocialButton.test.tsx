import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SocialButton } from './index'

describe('SocialButton', () => {
  it('renders Google button', () => {
    render(<SocialButton provider="google" />)
    expect(screen.getByText('Continue with Google')).toBeInTheDocument()
  })

  it('renders GitHub button', () => {
    render(<SocialButton provider="github" />)
    expect(screen.getByText('Continue with GitHub')).toBeInTheDocument()
  })

  it('renders Apple button', () => {
    render(<SocialButton provider="apple" />)
    expect(screen.getByText('Continue with Apple')).toBeInTheDocument()
  })

  it('renders Twitter button', () => {
    render(<SocialButton provider="twitter" />)
    expect(screen.getByText('Continue with Twitter')).toBeInTheDocument()
  })

  it('fires onClick handler', () => {
    const handleClick = vi.fn()
    render(<SocialButton provider="google" onClick={handleClick} />)
    fireEvent.click(screen.getByText('Continue with Google'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('renders in disabled state', () => {
    const handleClick = vi.fn()
    render(<SocialButton provider="google" onClick={handleClick} disabled />)
    const btn = screen.getByRole('button')
    expect(btn).toBeDisabled()
  })

  it('renders fullWidth', () => {
    render(<SocialButton provider="github" fullWidth />)
    const btn = screen.getByRole('button')
    expect(btn.style.width).toBe('100%')
  })

  it('contains an SVG icon', () => {
    const { container } = render(<SocialButton provider="google" />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<SocialButton provider="apple" className="my-social" />)
    const btn = screen.getByRole('button')
    expect(btn).toHaveClass('my-social')
  })
})
