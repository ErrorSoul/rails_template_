import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Textarea } from './index'

describe('Textarea', () => {
  it('renders without crash', () => {
    render(<Textarea />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('shows label', () => {
    render(<Textarea label="Message" />)
    expect(screen.getByText('Message')).toBeInTheDocument()
  })

  it('shows placeholder', () => {
    render(<Textarea placeholder="Type here..." />)
    expect(screen.getByPlaceholderText('Type here...')).toBeInTheDocument()
  })

  it('shows character count with maxLength', () => {
    render(<Textarea value="hello" maxLength={100} />)
    expect(screen.getByText('5/100')).toBeInTheDocument()
  })

  it('does not show character count without maxLength', () => {
    render(<Textarea value="hello" />)
    expect(screen.queryByText(/\//)).not.toBeInTheDocument()
  })

  it('shows error message', () => {
    render(<Textarea error="This field is required" />)
    expect(screen.getByText('This field is required')).toBeInTheDocument()
  })

  it('is disabled when disabled=true', () => {
    render(<Textarea disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('calls onChange when typing', () => {
    const onChange = vi.fn()
    render(<Textarea onChange={onChange} />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } })
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('applies rows prop', () => {
    render(<Textarea rows={6} />)
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '6')
  })
})
