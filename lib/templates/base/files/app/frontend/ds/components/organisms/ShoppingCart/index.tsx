import React from 'react'
import { cn } from '../../../utils/cn'
import { PriceTag } from '../../molecules/PriceTag'
import { Button } from '../../atoms/Button'
import { Divider } from '../../atoms/Divider'

export interface CartItem {
  id: string
  title: string
  price: number
  quantity: number
  image: string
}

export interface ShoppingCartProps {
  items: CartItem[]
  onUpdateQuantity: (id: string, qty: number) => void
  onRemove: (id: string) => void
  onCheckout?: () => void
  className?: string
}

function CartIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  )
}

export function ShoppingCart({
  items,
  onUpdateQuantity,
  onRemove,
  onCheckout,
  className,
}: ShoppingCartProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  if (items.length === 0) {
    return (
      <div
        className={cn('ds-shopping-cart text-center py-12 px-4', className)}
        style={{ fontFamily: 'var(--font-base)', color: 'var(--color-gray-600)' }}
      >
        <div className="flex justify-center mb-3">
          <CartIcon />
        </div>
        <p className="m-0 text-[0.9rem]">Your cart is empty</p>
      </div>
    )
  }

  return (
    <div
      className={cn('ds-shopping-cart', className)}
      style={{ fontFamily: 'var(--font-base)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="m-0 text-base font-bold" style={{ color: 'var(--color-gray-100)' }}>
          Shopping Cart
        </h3>
        <span
          data-testid="item-count"
          className="text-xs font-bold text-white px-[0.55rem] py-[0.15rem] rounded-full"
          style={{ background: 'var(--gradient-primary)' }}
        >
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Items */}
      <div className="flex flex-col gap-3">
        {items.map((item, idx) => (
          <div key={item.id}>
            <div
              data-testid={`cart-item-${item.id}`}
              className="flex gap-3 items-center p-[0.65rem]"
              style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {/* Image */}
              <img
                src={item.image}
                alt={item.title}
                className="w-14 h-14 object-cover shrink-0"
                style={{ borderRadius: 'var(--radius-base)' }}
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p
                  className="mb-1 text-[0.85rem] font-semibold overflow-hidden text-ellipsis whitespace-nowrap"
                  style={{ margin: '0 0 0.25rem', color: 'var(--color-gray-200)' }}
                >
                  {item.title}
                </p>
                <PriceTag price={item.price} size="sm" />
              </div>

              {/* Quantity controls */}
              <div className="flex items-center gap-[0.35rem] shrink-0">
                <button
                  aria-label="Decrease quantity"
                  onClick={() => item.quantity > 1 ? onUpdateQuantity(item.id, item.quantity - 1) : onRemove(item.id)}
                  className="w-[26px] h-[26px] rounded-full flex items-center justify-center p-0 leading-none cursor-pointer text-[0.9rem]"
                  style={{
                    border: '1px solid rgba(255,255,255,0.15)',
                    background: 'rgba(255,255,255,0.06)',
                    color: 'var(--color-gray-300)',
                    transition: 'background var(--duration-fast)',
                  }}
                >
                  −
                </button>
                <span
                  data-testid={`qty-${item.id}`}
                  className="text-[0.85rem] font-semibold min-w-[1.25rem] text-center"
                  style={{ color: 'var(--color-gray-200)' }}
                >
                  {item.quantity}
                </span>
                <button
                  aria-label="Increase quantity"
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  className="w-[26px] h-[26px] rounded-full flex items-center justify-center p-0 leading-none cursor-pointer text-[0.9rem]"
                  style={{
                    border: '1px solid rgba(255,255,255,0.15)',
                    background: 'rgba(255,255,255,0.06)',
                    color: 'var(--color-gray-300)',
                    transition: 'background var(--duration-fast)',
                  }}
                >
                  +
                </button>
              </div>

              {/* Subtotal + remove */}
              <div className="shrink-0 text-right">
                <p className="mb-1 text-[0.85rem] font-bold" style={{ margin: '0 0 0.25rem', color: 'var(--color-success)' }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  aria-label={`Remove ${item.title}`}
                  onClick={() => onRemove(item.id)}
                  className="cursor-pointer text-[0.75rem] p-0 opacity-70 hover:opacity-100 transition-opacity"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-danger)',
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
            {idx < items.length - 1 && <Divider style={{ margin: '0.4rem 0' }} />}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div
        className="mt-5 p-4"
        style={{
          background: 'rgba(255,255,255,0.04)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div className="flex justify-between mb-2">
          <span className="text-[0.85rem]" style={{ color: 'var(--color-gray-500)' }}>Subtotal ({itemCount} items)</span>
          <span className="text-[0.85rem] font-semibold" style={{ color: 'var(--color-gray-200)' }}>${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="text-[0.85rem]" style={{ color: 'var(--color-gray-500)' }}>Shipping</span>
          <span className="text-[0.85rem] font-semibold" style={{ color: 'var(--color-success)' }}>Free</span>
        </div>
        <Divider style={{ margin: '0 0 0.75rem' }} />
        <div className="flex justify-between mb-4">
          <span className="text-base font-bold" style={{ color: 'var(--color-gray-100)' }}>Total</span>
          <span
            data-testid="cart-total"
            className="text-[1.1rem] font-bold"
            style={{ color: 'var(--color-success)' }}
          >
            ${total.toFixed(2)}
          </span>
        </div>
        <Button variant="success" fullWidth onClick={onCheckout}>
          Checkout
        </Button>
      </div>
    </div>
  )
}
