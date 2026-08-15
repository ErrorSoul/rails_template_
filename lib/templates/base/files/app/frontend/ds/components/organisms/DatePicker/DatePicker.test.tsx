import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DatePicker } from './index'

describe('DatePicker', () => {
  it('renders without crash', () => {
    render(<DatePicker onChange={vi.fn()} />)
    expect(screen.getByPlaceholderText('Select date')).toBeDefined()
  })

  it('shows placeholder text', () => {
    render(<DatePicker onChange={vi.fn()} placeholder="Pick a date" />)
    expect(screen.getByPlaceholderText('Pick a date')).toBeDefined()
  })

  it('shows selected value in input', () => {
    const date = new Date(2024, 2, 15) // March 15 2024
    render(<DatePicker value={date} onChange={vi.fn()} />)
    const input = screen.getByDisplayValue('2024-03-15')
    expect(input).toBeDefined()
  })

  it('opens calendar on click', async () => {
    const user = userEvent.setup()
    render(<DatePicker onChange={vi.fn()} />)
    await user.click(screen.getByRole('textbox'))
    expect(screen.getByRole('dialog')).toBeDefined()
  })

  it('renders month navigation buttons', async () => {
    const user = userEvent.setup()
    render(<DatePicker onChange={vi.fn()} />)
    await user.click(screen.getByRole('textbox'))
    expect(screen.getByLabelText('Previous month')).toBeDefined()
    expect(screen.getByLabelText('Next month')).toBeDefined()
  })

  it('calls onChange when date selected', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<DatePicker onChange={onChange} />)
    await user.click(screen.getByRole('textbox'))
    const day15 = screen.getByLabelText(/\d{4}-\d{2}-15/)
    await user.click(day15)
    expect(onChange).toHaveBeenCalled()
  })

  it('respects min date — disabled days not clickable', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const min = new Date(2024, 2, 20)
    render(<DatePicker onChange={onChange} min={min} value={new Date(2024, 2, 15)} />)
    await user.click(screen.getByRole('textbox'))
    const day1 = screen.getByLabelText('2024-03-01')
    expect(day1).toBeDisabled()
  })

  it('applies custom className', () => {
    const { container } = render(<DatePicker onChange={vi.fn()} className="my-dp" />)
    expect(container.firstChild).toHaveClass('my-dp')
  })
})
