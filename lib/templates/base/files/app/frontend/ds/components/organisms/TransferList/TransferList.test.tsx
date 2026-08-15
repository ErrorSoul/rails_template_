import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TransferList } from './index'
import type { TransferItem } from './index'

const AVAILABLE: TransferItem[] = [
  { id: 'a1', label: 'Apple' },
  { id: 'a2', label: 'Banana' },
  { id: 'a3', label: 'Cherry', disabled: true },
]

const SELECTED: TransferItem[] = [
  { id: 's1', label: 'Mango' },
]

describe('TransferList', () => {
  it('renders two list panels', () => {
    render(<TransferList available={AVAILABLE} selected={SELECTED} onTransfer={vi.fn()} />)
    expect(screen.getByTestId('transfer-left')).toBeInTheDocument()
    expect(screen.getByTestId('transfer-right')).toBeInTheDocument()
  })

  it('shows default titles', () => {
    render(<TransferList available={AVAILABLE} selected={SELECTED} onTransfer={vi.fn()} />)
    expect(screen.getByText(/Available/)).toBeInTheDocument()
    expect(screen.getByText(/Selected/)).toBeInTheDocument()
  })

  it('shows custom titles', () => {
    render(<TransferList available={AVAILABLE} selected={SELECTED} onTransfer={vi.fn()} titles={['Left', 'Right']} />)
    expect(screen.getByText(/Left/)).toBeInTheDocument()
    expect(screen.getByText(/Right/)).toBeInTheDocument()
  })

  it('renders available items', () => {
    render(<TransferList available={AVAILABLE} selected={SELECTED} onTransfer={vi.fn()} />)
    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('Banana')).toBeInTheDocument()
  })

  it('transfers checked items to right on btn-right click', async () => {
    const onTransfer = vi.fn()
    render(<TransferList available={AVAILABLE} selected={SELECTED} onTransfer={onTransfer} />)
    // Check Apple
    const items = screen.getAllByTestId('transfer-item')
    const appleLabel = items.find((el) => el.textContent?.includes('Apple'))
    const checkbox = appleLabel?.querySelector('input[type="checkbox"]') as HTMLInputElement
    await userEvent.click(checkbox)
    await userEvent.click(screen.getByTestId('btn-right'))
    expect(onTransfer).toHaveBeenCalledWith(
      expect.not.arrayContaining([expect.objectContaining({ id: 'a1' })]),
      expect.arrayContaining([expect.objectContaining({ id: 'a1' })])
    )
  })

  it('transfers selected item back to left on btn-left click', async () => {
    const onTransfer = vi.fn()
    render(<TransferList available={AVAILABLE} selected={SELECTED} onTransfer={onTransfer} />)
    const items = screen.getAllByTestId('transfer-item')
    const mangoLabel = items.find((el) => el.textContent?.includes('Mango'))
    const checkbox = mangoLabel?.querySelector('input[type="checkbox"]') as HTMLInputElement
    await userEvent.click(checkbox)
    await userEvent.click(screen.getByTestId('btn-left'))
    expect(onTransfer).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ id: 's1' })]),
      expect.not.arrayContaining([expect.objectContaining({ id: 's1' })])
    )
  })

  it('moves all non-disabled available items to right on btn-all-right', async () => {
    const onTransfer = vi.fn()
    render(<TransferList available={AVAILABLE} selected={SELECTED} onTransfer={onTransfer} />)
    await userEvent.click(screen.getByTestId('btn-all-right'))
    const [newAvailable, newSelected] = onTransfer.mock.calls[0]
    expect(newSelected).toContainEqual(expect.objectContaining({ id: 'a1' }))
    expect(newSelected).toContainEqual(expect.objectContaining({ id: 'a2' }))
    // disabled item stays in available
    expect(newAvailable).toContainEqual(expect.objectContaining({ id: 'a3' }))
  })

  it('moves all selected items to left on btn-all-left', async () => {
    const onTransfer = vi.fn()
    render(<TransferList available={AVAILABLE} selected={SELECTED} onTransfer={onTransfer} />)
    await userEvent.click(screen.getByTestId('btn-all-left'))
    const [newAvailable] = onTransfer.mock.calls[0]
    expect(newAvailable).toContainEqual(expect.objectContaining({ id: 's1' }))
  })

  it('shows search input when searchable=true', () => {
    render(<TransferList available={AVAILABLE} selected={SELECTED} onTransfer={vi.fn()} searchable />)
    expect(screen.getByTestId('transfer-left-search')).toBeInTheDocument()
  })

  it('filters items by search query', async () => {
    render(<TransferList available={AVAILABLE} selected={SELECTED} onTransfer={vi.fn()} searchable />)
    await userEvent.type(screen.getByTestId('transfer-left-search'), 'ban')
    expect(screen.getByText('Banana')).toBeInTheDocument()
    expect(screen.queryByText('Apple')).not.toBeInTheDocument()
  })

  it('disabled items cannot be transferred', async () => {
    const onTransfer = vi.fn()
    render(<TransferList available={AVAILABLE} selected={SELECTED} onTransfer={onTransfer} />)
    // Cherry is disabled — click select-all, then move right
    await userEvent.click(screen.getByTestId('transfer-left-select-all'))
    await userEvent.click(screen.getByTestId('btn-right'))
    // Cherry should NOT appear in transferred items
    const [newAvailable] = onTransfer.mock.calls[0]
    expect(newAvailable).toContainEqual(expect.objectContaining({ id: 'a3' }))
  })
})
