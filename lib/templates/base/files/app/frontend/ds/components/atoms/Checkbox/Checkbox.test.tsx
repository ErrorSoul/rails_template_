import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Checkbox } from './index'

describe('Checkbox', () => {
  it('renders without crash', () => {
    render(<Checkbox checked={false} onChange={vi.fn()} />)
    expect(screen.getByRole('checkbox')).toBeDefined()
  })

  it('checked: aria-checked="true"', () => {
    render(<Checkbox checked={true} onChange={vi.fn()} />)
    expect(screen.getByRole('checkbox').getAttribute('aria-checked')).toBe('true')
  })

  it('unchecked: aria-checked="false"', () => {
    render(<Checkbox checked={false} onChange={vi.fn()} />)
    expect(screen.getByRole('checkbox').getAttribute('aria-checked')).toBe('false')
  })

  it('click calls onChange with toggled value', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Checkbox checked={false} onChange={onChange} label="Click me" />)

    await user.click(screen.getByText('Click me'))
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('disabled: onChange not called', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Checkbox checked={false} onChange={onChange} label="Disabled" disabled />)

    await user.click(screen.getByText('Disabled'))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('displays label', () => {
    render(<Checkbox checked={false} onChange={vi.fn()} label="My label" />)
    expect(screen.getByText('My label')).toBeDefined()
  })

  it('indeterminate: aria-checked="mixed"', () => {
    render(<Checkbox checked={false} onChange={vi.fn()} indeterminate />)
    expect(screen.getByRole('checkbox').getAttribute('aria-checked')).toBe('mixed')
  })

  it('variant applies gradient variable', () => {
    render(<Checkbox checked={true} onChange={vi.fn()} variant="success" />)
    const box = screen.getByRole('checkbox')
    expect(box.getAttribute('style')).toContain('var(--gradient-success)')
  })

  it('renders with custom className', () => {
    const { container } = render(<Checkbox checked={false} onChange={vi.fn()} className="my-class" />)
    expect(container.firstChild).toHaveClass('my-class')
  })
})
