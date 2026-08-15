import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { FormField } from './index'

describe('FormField', () => {
  it('renders without crash', () => {
    render(<FormField label="Email" name="email" />)
  })

  it('shows label', () => {
    render(<FormField label="Email" name="email" />)
    expect(screen.getByText('Email')).toBeInTheDocument()
  })

  it('shows required asterisk when required=true', () => {
    render(<FormField label="Email" name="email" required />)
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('does not show asterisk when required=false', () => {
    render(<FormField label="Email" name="email" />)
    expect(screen.queryByText('*')).toBeNull()
  })

  it('shows hint text when provided', () => {
    render(<FormField label="Email" name="email" hint="Введите рабочий email" />)
    expect(screen.getByText('Введите рабочий email')).toBeInTheDocument()
  })

  it('shows error message when error provided', () => {
    render(<FormField label="Email" name="email" error="Поле обязательно" />)
    expect(screen.getByText('Поле обязательно')).toBeInTheDocument()
  })

  it('passes value and onChange to input', () => {
    const onChange = vi.fn()
    render(<FormField label="Email" name="email" value="test@test.com" onChange={onChange} />)
    expect(screen.getByDisplayValue('test@test.com')).toBeInTheDocument()
  })
})
