import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { SearchInput } from './index'

describe('SearchInput', () => {
  it('renders without crash', () => {
    render(<SearchInput value="" onChange={() => {}} />)
  })

  it('shows placeholder text', () => {
    render(<SearchInput value="" onChange={() => {}} placeholder="Find something" />)
    expect(screen.getByPlaceholderText('Find something')).toBeInTheDocument()
  })

  it('calls onChange when typing', () => {
    const onChange = vi.fn()
    render(<SearchInput value="" onChange={onChange} />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'hello' } })
    expect(onChange).toHaveBeenCalledWith('hello')
  })

  it('shows clear button when value is set', () => {
    render(<SearchInput value="test" onChange={() => {}} />)
    expect(screen.getByLabelText('Clear search')).toBeInTheDocument()
  })

  it('does not show clear button when value is empty', () => {
    render(<SearchInput value="" onChange={() => {}} />)
    expect(screen.queryByLabelText('Clear search')).toBeNull()
  })

  it('calls onClear and onChange when clear button clicked', () => {
    const onChange = vi.fn()
    const onClear = vi.fn()
    render(<SearchInput value="test" onChange={onChange} onClear={onClear} />)
    fireEvent.click(screen.getByLabelText('Clear search'))
    expect(onChange).toHaveBeenCalledWith('')
    expect(onClear).toHaveBeenCalled()
  })

  it('shows loading indicator when loading prop is true', () => {
    render(<SearchInput value="" onChange={() => {}} loading />)
    expect(screen.getByLabelText('Loading')).toBeInTheDocument()
  })
})
