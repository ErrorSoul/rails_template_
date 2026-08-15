import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Select } from './index'

const options = [
  { value: 'a', label: 'Apple' },
  { value: 'b', label: 'Banana' },
  { value: 'c', label: 'Cherry', disabled: true },
]

describe('Select', () => {
  it('renders with placeholder', () => {
    render(<Select options={options} placeholder="Pick a fruit" />)
    expect(screen.getByText('Pick a fruit')).toBeInTheDocument()
  })

  it('shows label', () => {
    render(<Select options={options} label="Fruit" />)
    expect(screen.getByText('Fruit')).toBeInTheDocument()
  })

  it('opens dropdown on click', () => {
    render(<Select options={options} />)
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('Banana')).toBeInTheDocument()
  })

  it('selects option on click and calls onChange', () => {
    const onChange = vi.fn()
    render(<Select options={options} onChange={onChange} />)
    fireEvent.click(screen.getByRole('button'))
    fireEvent.click(screen.getByText('Apple'))
    expect(onChange).toHaveBeenCalledWith('a')
  })

  it('shows selected option in trigger', () => {
    render(<Select options={options} value="b" />)
    expect(screen.getByRole('button')).toHaveTextContent('Banana')
  })

  it('closes dropdown after selecting option', () => {
    render(<Select options={options} />)
    fireEvent.click(screen.getByRole('button'))
    fireEvent.click(screen.getByText('Apple'))
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('shows error message', () => {
    render(<Select options={options} error="Required field" />)
    expect(screen.getByText('Required field')).toBeInTheDocument()
  })

  it('is disabled when disabled=true', () => {
    render(<Select options={options} disabled />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('does not call onChange for disabled option', () => {
    const onChange = vi.fn()
    render(<Select options={options} onChange={onChange} />)
    fireEvent.click(screen.getByRole('button'))
    fireEvent.click(screen.getByText('Cherry'))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('opens with keyboard Enter', () => {
    render(<Select options={options} />)
    const trigger = screen.getByRole('button')
    fireEvent.keyDown(trigger, { key: 'Enter' })
    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })

  it('closes with Escape key', () => {
    render(<Select options={options} />)
    const trigger = screen.getByRole('button')
    fireEvent.keyDown(trigger, { key: 'Enter' })
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    fireEvent.keyDown(trigger, { key: 'Escape' })
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })
})
