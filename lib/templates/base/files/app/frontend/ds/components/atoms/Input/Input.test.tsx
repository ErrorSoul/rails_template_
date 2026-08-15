import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Input } from './index'

describe('Input', () => {
  it('renders without crash', () => {
    render(<Input />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('renders with placeholder', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('renders label when provided', () => {
    render(<Input label="Email" />)
    expect(screen.getByText('Email')).toBeInTheDocument()
  })

  it('renders error message when provided', () => {
    render(<Input error="This field is required" />)
    expect(screen.getByText('This field is required')).toBeInTheDocument()
  })

  it('does not render label when not provided', () => {
    render(<Input placeholder="No label" />)
    expect(screen.queryByRole('label')).not.toBeInTheDocument()
  })

  it('does not render error when not provided', () => {
    render(<Input placeholder="No error" />)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('fires onChange when typing', () => {
    const handler = vi.fn()
    render(<Input onChange={handler} />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } })
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('renders as disabled when disabled prop is true', () => {
    render(<Input disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('marks input as invalid when error is present', () => {
    render(<Input error="bad input" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('controlled value renders correctly', () => {
    render(<Input value="hello" onChange={() => {}} />)
    expect(screen.getByRole('textbox')).toHaveValue('hello')
  })
})
