import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ShoppingCart, type CartItem } from './index'

const mockItems: CartItem[] = [
  { id: 'p1', title: 'Headphones', price: 49.99, quantity: 2, image: 'data:image/svg+xml,<svg/>' },
  { id: 'p2', title: 'Keyboard', price: 89.99, quantity: 1, image: 'data:image/svg+xml,<svg/>' },
]

const noop = () => {}

describe('ShoppingCart', () => {
  it('renders without crash', () => {
    render(<ShoppingCart items={mockItems} onUpdateQuantity={noop} onRemove={noop} />)
    expect(screen.getByText('Shopping Cart')).toBeInTheDocument()
  })

  it('shows all cart items', () => {
    render(<ShoppingCart items={mockItems} onUpdateQuantity={noop} onRemove={noop} />)
    expect(screen.getByText('Headphones')).toBeInTheDocument()
    expect(screen.getByText('Keyboard')).toBeInTheDocument()
  })

  it('shows correct total', () => {
    render(<ShoppingCart items={mockItems} onUpdateQuantity={noop} onRemove={noop} />)
    // 49.99*2 + 89.99*1 = 189.97
    expect(screen.getByTestId('cart-total')).toHaveTextContent('$189.97')
  })

  it('shows item count badge', () => {
    render(<ShoppingCart items={mockItems} onUpdateQuantity={noop} onRemove={noop} />)
    expect(screen.getByTestId('item-count')).toHaveTextContent('3 items')
  })

  it('calls onUpdateQuantity when increasing quantity', () => {
    const onUpdateQuantity = vi.fn()
    render(<ShoppingCart items={mockItems} onUpdateQuantity={onUpdateQuantity} onRemove={noop} />)
    const increaseButtons = screen.getAllByRole('button', { name: /increase quantity/i })
    fireEvent.click(increaseButtons[0])
    expect(onUpdateQuantity).toHaveBeenCalledWith('p1', 3)
  })

  it('calls onUpdateQuantity when decreasing quantity', () => {
    const onUpdateQuantity = vi.fn()
    render(<ShoppingCart items={mockItems} onUpdateQuantity={onUpdateQuantity} onRemove={noop} />)
    const decreaseButtons = screen.getAllByRole('button', { name: /decrease quantity/i })
    fireEvent.click(decreaseButtons[0])
    expect(onUpdateQuantity).toHaveBeenCalledWith('p1', 1)
  })

  it('calls onRemove when quantity is 1 and decreased', () => {
    const onRemove = vi.fn()
    render(<ShoppingCart items={mockItems} onUpdateQuantity={noop} onRemove={onRemove} />)
    const decreaseButtons = screen.getAllByRole('button', { name: /decrease quantity/i })
    fireEvent.click(decreaseButtons[1]) // Keyboard has qty=1
    expect(onRemove).toHaveBeenCalledWith('p2')
  })

  it('calls onRemove when remove button clicked', () => {
    const onRemove = vi.fn()
    render(<ShoppingCart items={mockItems} onUpdateQuantity={noop} onRemove={onRemove} />)
    const removeBtn = screen.getByRole('button', { name: /remove headphones/i })
    fireEvent.click(removeBtn)
    expect(onRemove).toHaveBeenCalledWith('p1')
  })

  it('calls onCheckout when checkout button clicked', () => {
    const onCheckout = vi.fn()
    render(<ShoppingCart items={mockItems} onUpdateQuantity={noop} onRemove={noop} onCheckout={onCheckout} />)
    fireEvent.click(screen.getByText('Checkout'))
    expect(onCheckout).toHaveBeenCalledOnce()
  })

  it('shows empty state when no items', () => {
    render(<ShoppingCart items={[]} onUpdateQuantity={noop} onRemove={noop} />)
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
  })
})
