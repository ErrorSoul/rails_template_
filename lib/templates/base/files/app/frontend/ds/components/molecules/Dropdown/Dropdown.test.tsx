import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Dropdown } from './index'

const options = [
  { value: 'ru', label: 'Русский' },
  { value: 'en', label: 'English' },
  { value: 'de', label: 'Deutsch' },
]

describe('Dropdown', () => {
  it('renders without crash', () => {
    render(<Dropdown options={options} />)
  })

  it('shows placeholder when no value selected', () => {
    render(<Dropdown options={options} placeholder="Выберите язык" />)
    expect(screen.getByText('Выберите язык')).toBeInTheDocument()
  })

  it('opens dropdown on trigger click', async () => {
    render(<Dropdown options={options} />)
    await userEvent.click(screen.getByRole('button'))
    expect(screen.getByTestId('dropdown-list')).toBeInTheDocument()
  })

  it('closes dropdown when clicking trigger again', async () => {
    render(<Dropdown options={options} />)
    const trigger = screen.getByRole('button')
    await userEvent.click(trigger)
    await userEvent.click(trigger)
    expect(screen.queryByTestId('dropdown-list')).toBeNull()
  })

  it('shows all options when open', async () => {
    render(<Dropdown options={options} />)
    await userEvent.click(screen.getByRole('button'))
    expect(screen.getByText('Русский')).toBeInTheDocument()
    expect(screen.getByText('English')).toBeInTheDocument()
    expect(screen.getByText('Deutsch')).toBeInTheDocument()
  })

  it('calls onChange with correct value when option clicked', async () => {
    const onChange = vi.fn()
    render(<Dropdown options={options} onChange={onChange} />)
    await userEvent.click(screen.getByRole('button'))
    await userEvent.click(screen.getByText('English'))
    expect(onChange).toHaveBeenCalledWith('en')
  })

  it('closes after selecting an option', async () => {
    render(<Dropdown options={options} />)
    await userEvent.click(screen.getByRole('button'))
    await userEvent.click(screen.getByText('Русский'))
    expect(screen.queryByTestId('dropdown-list')).toBeNull()
  })
})
