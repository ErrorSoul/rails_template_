import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { PriceTag } from './index'

describe('PriceTag', () => {
  it('renders current price', () => {
    render(<PriceTag price={29.99} />)
    expect(screen.getByText('$29.99')).toBeTruthy()
  })

  it('renders original price with strikethrough when provided', () => {
    const { container } = render(<PriceTag price={19.99} originalPrice={39.99} />)
    const original = container.querySelector('[style*="line-through"]')
    expect(original).toBeTruthy()
    expect(original?.textContent).toContain('39.99')
  })

  it('does not show original price when not provided', () => {
    render(<PriceTag price={29.99} />)
    expect(screen.queryByText(/\$39/)).toBeNull()
  })

  it('shows discount percentage badge', () => {
    render(<PriceTag price={10} originalPrice={20} />)
    expect(screen.getByText('-50%')).toBeTruthy()
  })

  it('does not show discount badge when no original price', () => {
    render(<PriceTag price={10} />)
    expect(screen.queryByText(/%/)).toBeNull()
  })

  it('does not show discount when original price is less than price', () => {
    render(<PriceTag price={20} originalPrice={10} />)
    expect(screen.queryByText(/%/)).toBeNull()
  })

  it('uses custom currency symbol', () => {
    render(<PriceTag price={50} currency="€" />)
    expect(screen.getByText('€50.00')).toBeTruthy()
  })

  it('renders sm size without crashing', () => {
    const { container } = render(<PriceTag price={9.99} size="sm" />)
    expect(container.firstChild).toBeTruthy()
  })

  it('renders lg size without crashing', () => {
    const { container } = render(<PriceTag price={99.99} originalPrice={149.99} size="lg" />)
    expect(container.firstChild).toBeTruthy()
  })

  it('calculates correct discount percentage', () => {
    render(<PriceTag price={75} originalPrice={100} />)
    expect(screen.getByText('-25%')).toBeTruthy()
  })
})
