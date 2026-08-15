import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Radio } from './index'

describe('Radio', () => {
  it('renders without crash', () => {
    render(<Radio checked={false} onChange={vi.fn()} />)
    expect(screen.getByRole('radio')).toBeDefined()
  })

  it('checked: aria-checked="true"', () => {
    render(<Radio checked={true} onChange={vi.fn()} />)
    expect(screen.getByRole('radio').getAttribute('aria-checked')).toBe('true')
  })

  it('unchecked: aria-checked="false"', () => {
    render(<Radio checked={false} onChange={vi.fn()} />)
    expect(screen.getByRole('radio').getAttribute('aria-checked')).toBe('false')
  })

  it('click calls onChange with value', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Radio checked={false} onChange={onChange} label="Option A" value="a" />)
    await user.click(screen.getByText('Option A'))
    expect(onChange).toHaveBeenCalledWith('a')
  })

  it('disabled: onChange not called', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Radio checked={false} onChange={onChange} label="Disabled" disabled />)
    await user.click(screen.getByText('Disabled'))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('displays label', () => {
    render(<Radio checked={false} onChange={vi.fn()} label="My radio" />)
    expect(screen.getByText('My radio')).toBeDefined()
  })

  it('applies variant gradient when checked', () => {
    render(<Radio checked={true} onChange={vi.fn()} variant="success" />)
    const radio = screen.getByRole('radio')
    expect(radio.getAttribute('style')).toContain('var(--gradient-success)')
  })

  it('renders with custom className', () => {
    const { container } = render(<Radio checked={false} onChange={vi.fn()} className="my-class" />)
    expect(container.firstChild).toHaveClass('my-class')
  })
})
