import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ContextMenu, type ContextMenuItem } from './index'

const basicItems: ContextMenuItem[] = [
  { label: 'Cut', shortcut: 'Ctrl+X', onClick: vi.fn() },
  { label: 'Copy', shortcut: 'Ctrl+C', onClick: vi.fn() },
  { label: 'Paste', shortcut: 'Ctrl+V', onClick: vi.fn() },
]

const mixedItems: ContextMenuItem[] = [
  { label: 'Edit', onClick: vi.fn() },
  { label: 'Divider1', divider: true },
  { label: 'Disabled', disabled: true, onClick: vi.fn() },
  { label: 'Delete', danger: true, onClick: vi.fn() },
]

describe('ContextMenu', () => {
  it('renders children area', () => {
    render(
      <ContextMenu items={basicItems}>
        <div data-testid="area">Right-click here</div>
      </ContextMenu>
    )
    expect(screen.getByTestId('area')).toBeInTheDocument()
  })

  it('menu is hidden by default', () => {
    render(
      <ContextMenu items={basicItems}>
        <div>Area</div>
      </ContextMenu>
    )
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('opens on right-click (contextmenu event)', () => {
    render(
      <ContextMenu items={basicItems}>
        <div data-testid="area">Area</div>
      </ContextMenu>
    )
    fireEvent.contextMenu(screen.getByTestId('area'))
    expect(screen.getByRole('menu')).toBeInTheDocument()
  })

  it('shows all menu items', () => {
    render(
      <ContextMenu items={basicItems}>
        <div data-testid="area">Area</div>
      </ContextMenu>
    )
    fireEvent.contextMenu(screen.getByTestId('area'))
    expect(screen.getByText('Cut')).toBeInTheDocument()
    expect(screen.getByText('Copy')).toBeInTheDocument()
    expect(screen.getByText('Paste')).toBeInTheDocument()
  })

  it('shows shortcut text', () => {
    render(
      <ContextMenu items={basicItems}>
        <div data-testid="area">Area</div>
      </ContextMenu>
    )
    fireEvent.contextMenu(screen.getByTestId('area'))
    expect(screen.getByText('Ctrl+X')).toBeInTheDocument()
  })

  it('closes menu and calls onClick on item click', () => {
    const onClick = vi.fn()
    const items: ContextMenuItem[] = [{ label: 'Action', onClick }]
    render(
      <ContextMenu items={items}>
        <div data-testid="area">Area</div>
      </ContextMenu>
    )
    fireEvent.contextMenu(screen.getByTestId('area'))
    fireEvent.click(screen.getByText('Action'))
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('renders divider separator', () => {
    render(
      <ContextMenu items={mixedItems}>
        <div data-testid="area">Area</div>
      </ContextMenu>
    )
    fireEvent.contextMenu(screen.getByTestId('area'))
    expect(screen.getByRole('separator')).toBeInTheDocument()
  })

  it('disabled item does not fire onClick', () => {
    const onClick = vi.fn()
    const items: ContextMenuItem[] = [{ label: 'Disabled action', disabled: true, onClick }]
    render(
      <ContextMenu items={items}>
        <div data-testid="area">Area</div>
      </ContextMenu>
    )
    fireEvent.contextMenu(screen.getByTestId('area'))
    fireEvent.click(screen.getByText('Disabled action'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('danger item has aria-disabled=undefined (not disabled)', () => {
    render(
      <ContextMenu items={mixedItems}>
        <div data-testid="area">Area</div>
      </ContextMenu>
    )
    fireEvent.contextMenu(screen.getByTestId('area'))
    const deleteItem = screen.getByText('Delete').closest('[role="menuitem"]')
    expect(deleteItem).not.toHaveAttribute('aria-disabled')
  })

  it('closes on Escape key', () => {
    render(
      <ContextMenu items={basicItems}>
        <div data-testid="area">Area</div>
      </ContextMenu>
    )
    fireEvent.contextMenu(screen.getByTestId('area'))
    expect(screen.getByRole('menu')).toBeInTheDocument()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('navigates with arrow keys', () => {
    render(
      <ContextMenu items={basicItems}>
        <div data-testid="area">Area</div>
      </ContextMenu>
    )
    fireEvent.contextMenu(screen.getByTestId('area'))
    // Press ArrowDown to focus first item
    fireEvent.keyDown(document, { key: 'ArrowDown' })
    // Press Enter to select it
    fireEvent.keyDown(document, { key: 'Enter' })
    expect(basicItems[0].onClick).toHaveBeenCalled()
  })

  it('closes on outside mousedown', () => {
    render(
      <div>
        <ContextMenu items={basicItems}>
          <div data-testid="area">Area</div>
        </ContextMenu>
        <div data-testid="outside">Outside</div>
      </div>
    )
    fireEvent.contextMenu(screen.getByTestId('area'))
    expect(screen.getByRole('menu')).toBeInTheDocument()
    fireEvent.mouseDown(screen.getByTestId('outside'))
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })
})
