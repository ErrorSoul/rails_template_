import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { CommandPalette, type CommandItem } from './index'

const items: CommandItem[] = [
  { id: '1', label: 'New File', description: 'Create a new file', shortcut: '⌘N', group: 'File', onSelect: vi.fn() },
  { id: '2', label: 'Open File', description: 'Open existing file', shortcut: '⌘O', group: 'File', onSelect: vi.fn() },
  { id: '3', label: 'Settings', description: 'Open settings', shortcut: '⌘,', group: 'App', onSelect: vi.fn() },
  { id: '4', label: 'Help', group: 'App', onSelect: vi.fn() },
]

describe('CommandPalette', () => {
  it('renders when open=true', () => {
    render(<CommandPalette items={items} open onOpenChange={vi.fn()} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('does not render when open=false', () => {
    render(<CommandPalette items={items} open={false} onOpenChange={vi.fn()} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('shows all items when no query', () => {
    render(<CommandPalette items={items} open onOpenChange={vi.fn()} />)
    expect(screen.getByText('New File')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  it('filters items by query', () => {
    render(<CommandPalette items={items} open onOpenChange={vi.fn()} />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'settings' } })
    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.queryByText('New File')).not.toBeInTheDocument()
  })

  it('shows "No results found" when no match', () => {
    render(<CommandPalette items={items} open onOpenChange={vi.fn()} />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'zzz' } })
    expect(screen.getByText('No results found')).toBeInTheDocument()
  })

  it('shows group headers', () => {
    render(<CommandPalette items={items} open onOpenChange={vi.fn()} />)
    expect(screen.getByText('File')).toBeInTheDocument()
    expect(screen.getByText('App')).toBeInTheDocument()
  })

  it('shows shortcut badge', () => {
    render(<CommandPalette items={items} open onOpenChange={vi.fn()} />)
    expect(screen.getByText('⌘N')).toBeInTheDocument()
  })

  it('fires onSelect when item is clicked', () => {
    const onSelect = vi.fn()
    const testItems = [{ id: '1', label: 'Click Me', group: 'Test', onSelect }]
    render(<CommandPalette items={testItems} open onOpenChange={vi.fn()} />)
    fireEvent.click(screen.getByText('Click Me'))
    expect(onSelect).toHaveBeenCalledTimes(1)
  })

  it('calls onOpenChange(false) when item is clicked', () => {
    const onOpenChange = vi.fn()
    render(<CommandPalette items={items} open onOpenChange={onOpenChange} />)
    fireEvent.click(screen.getByText('New File'))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('calls onOpenChange(false) on Escape key', () => {
    const onOpenChange = vi.fn()
    render(<CommandPalette items={items} open onOpenChange={onOpenChange} />)
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Escape' })
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('navigates with arrow keys', () => {
    render(<CommandPalette items={items} open onOpenChange={vi.fn()} />)
    const input = screen.getByRole('textbox')
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    // First item should be active, then second
    const options = screen.getAllByRole('option')
    expect(options[1]).toHaveAttribute('aria-selected', 'true')
  })

  it('shows placeholder text', () => {
    render(<CommandPalette items={items} open onOpenChange={vi.fn()} placeholder="Search commands..." />)
    expect(screen.getByPlaceholderText('Search commands...')).toBeInTheDocument()
  })
})
