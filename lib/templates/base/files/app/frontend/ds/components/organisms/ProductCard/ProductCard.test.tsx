import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ProductCard } from './index'

const baseProps = {
  image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>',
  title: 'Wireless Headphones',
  price: 79.99,
}

describe('ProductCard', () => {
  it('renders without crash', () => {
    render(<ProductCard {...baseProps} />)
    expect(screen.getByText('Wireless Headphones')).toBeInTheDocument()
  })

  it('shows price', () => {
    render(<ProductCard {...baseProps} price={79.99} />)
    expect(screen.getByText('$79.99')).toBeInTheDocument()
  })

  it('shows original price with strikethrough when discounted', () => {
    render(<ProductCard {...baseProps} price={49.99} originalPrice={99.99} />)
    expect(screen.getByText('$49.99')).toBeInTheDocument()
    expect(screen.getByText('$99.99')).toBeInTheDocument()
  })

  it('shows discount percentage', () => {
    render(<ProductCard {...baseProps} price={50} originalPrice={100} />)
    expect(screen.getByText('-50%')).toBeInTheDocument()
  })

  it('renders tags', () => {
    render(<ProductCard {...baseProps} tags={['New', 'Sale']} />)
    expect(screen.getByText('New')).toBeInTheDocument()
    expect(screen.getByText('Sale')).toBeInTheDocument()
  })

  it('renders rating when provided', () => {
    render(<ProductCard {...baseProps} rating={4} reviewCount={128} />)
    expect(screen.getByText('(128)')).toBeInTheDocument()
  })

  it('fires onAddToCart when button clicked', () => {
    const onAddToCart = vi.fn()
    render(<ProductCard {...baseProps} onAddToCart={onAddToCart} />)
    fireEvent.click(screen.getByText('Add to Cart'))
    expect(onAddToCart).toHaveBeenCalledOnce()
  })

  it('shows out of stock overlay when inStock=false', () => {
    render(<ProductCard {...baseProps} inStock={false} />)
    expect(screen.getAllByText('Out of Stock').length).toBeGreaterThan(0)
  })

  it('disables add to cart button when out of stock', () => {
    render(<ProductCard {...baseProps} inStock={false} />)
    const btn = screen.getByRole('button', { name: /out of stock/i })
    expect(btn).toBeDisabled()
  })

  it('toggles favorite on click', () => {
    render(<ProductCard {...baseProps} />)
    const favBtn = screen.getByRole('button', { name: /add to favorites/i })
    fireEvent.click(favBtn)
    expect(screen.getByRole('button', { name: /remove from favorites/i })).toBeInTheDocument()
  })

  it('fires onFavorite callback', () => {
    const onFavorite = vi.fn()
    render(<ProductCard {...baseProps} onFavorite={onFavorite} />)
    fireEvent.click(screen.getByRole('button', { name: /add to favorites/i }))
    expect(onFavorite).toHaveBeenCalledOnce()
  })
})
