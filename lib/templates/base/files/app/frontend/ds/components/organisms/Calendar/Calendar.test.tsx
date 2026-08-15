import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Calendar } from '.'

describe('Calendar', () => {
  it('renders without crash', () => {
    render(<Calendar month={0} year={2026} />)
    expect(screen.getByText('January 2026')).toBeInTheDocument()
  })

  it('renders day headers', () => {
    render(<Calendar month={0} year={2026} />)
    expect(screen.getByText('Sun')).toBeInTheDocument()
    expect(screen.getByText('Mon')).toBeInTheDocument()
    expect(screen.getByText('Sat')).toBeInTheDocument()
  })

  it('renders correct number of days', () => {
    // January 2026 has 31 days
    render(<Calendar month={0} year={2026} />)
    expect(screen.getByText('31')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('shows events as dots', () => {
    const events = [{ date: new Date(2026, 0, 15), title: 'Meeting', color: '#ff0000' }]
    const { container } = render(<Calendar month={0} year={2026} events={events} />)
    // Event dot should be rendered
    const dots = container.querySelectorAll('[title="Meeting"]')
    expect(dots.length).toBeGreaterThan(0)
  })

  it('calls onDateClick when date clicked', () => {
    const onDateClick = vi.fn()
    render(<Calendar month={0} year={2026} onDateClick={onDateClick} />)
    fireEvent.click(screen.getByText('15'))
    expect(onDateClick).toHaveBeenCalledTimes(1)
    expect(onDateClick.mock.calls[0][0]).toBeInstanceOf(Date)
  })

  it('navigates to next month', () => {
    render(<Calendar month={0} year={2026} />)
    fireEvent.click(screen.getByLabelText('Next month'))
    expect(screen.getByText('February 2026')).toBeInTheDocument()
  })

  it('navigates to previous month', () => {
    render(<Calendar month={1} year={2026} />)
    fireEvent.click(screen.getByLabelText('Previous month'))
    expect(screen.getByText('January 2026')).toBeInTheDocument()
  })

  it('calls onMonthChange when month changes', () => {
    const onMonthChange = vi.fn()
    render(<Calendar month={0} year={2026} onMonthChange={onMonthChange} />)
    fireEvent.click(screen.getByLabelText('Next month'))
    expect(onMonthChange).toHaveBeenCalledWith(1, 2026)
  })

  it('wraps correctly Dec -> Jan', () => {
    render(<Calendar month={11} year={2025} />)
    fireEvent.click(screen.getByLabelText('Next month'))
    expect(screen.getByText('January 2026')).toBeInTheDocument()
  })
})
