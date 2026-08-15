import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MultiSelect } from './index'

const options = [
  { value: 'a', label: 'Apple' },
  { value: 'b', label: 'Banana' },
  { value: 'c', label: 'Cherry' },
]

describe('MultiSelect', () => {
  it('renders without crash', () => {
    render(<MultiSelect options={options} value={[]} onChange={vi.fn()} />)
    expect(screen.getByRole('combobox')).toBeDefined()
  })

  it('shows placeholder when nothing selected', () => {
    render(<MultiSelect options={options} value={[]} onChange={vi.fn()} placeholder="Pick one" />)
    expect(screen.getByText('Pick one')).toBeDefined()
  })

  it('opens dropdown on click', async () => {
    const user = userEvent.setup()
    render(<MultiSelect options={options} value={[]} onChange={vi.fn()} />)
    await user.click(screen.getByRole('combobox'))
    expect(screen.getByRole('listbox')).toBeDefined()
  })

  it('renders all options in dropdown', async () => {
    const user = userEvent.setup()
    render(<MultiSelect options={options} value={[]} onChange={vi.fn()} />)
    await user.click(screen.getByRole('combobox'))
    expect(screen.getByText('Apple')).toBeDefined()
    expect(screen.getByText('Banana')).toBeDefined()
    expect(screen.getByText('Cherry')).toBeDefined()
  })

  it('toggles selection on option click', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<MultiSelect options={options} value={[]} onChange={onChange} />)
    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getAllByRole('option')[0])
    expect(onChange).toHaveBeenCalledWith(['a'])
  })

  it('shows selected as badges', () => {
    render(<MultiSelect options={options} value={['a', 'b']} onChange={vi.fn()} />)
    expect(screen.getByText('Apple')).toBeDefined()
    expect(screen.getByText('Banana')).toBeDefined()
  })

  it('search filters options when searchable', async () => {
    const user = userEvent.setup()
    render(<MultiSelect options={options} value={[]} onChange={vi.fn()} searchable />)
    await user.click(screen.getByRole('combobox'))
    await user.type(screen.getByPlaceholderText('Search…'), 'ban')
    expect(screen.getByText('Banana')).toBeDefined()
    expect(screen.queryByText('Apple')).toBeNull()
  })

  it('applies custom className', () => {
    const { container } = render(<MultiSelect options={options} value={[]} onChange={vi.fn()} className="my-ms" />)
    expect(container.firstChild).toHaveClass('my-ms')
  })
})
