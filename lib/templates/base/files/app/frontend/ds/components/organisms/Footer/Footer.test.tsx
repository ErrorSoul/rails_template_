import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Footer } from './index'

describe('Footer', () => {
  it('renders without crash', () => {
    render(<Footer />)
    expect(document.querySelector('.ds-footer')).toBeInTheDocument()
  })

  it('renders brand name', () => {
    render(<Footer brand="MyBrand" />)
    expect(screen.getByText('MyBrand')).toBeInTheDocument()
  })

  it('renders tagline', () => {
    render(<Footer tagline="Build great products" />)
    expect(screen.getByText('Build great products')).toBeInTheDocument()
  })

  it('renders link columns', () => {
    const columns = [
      {
        title: 'Product',
        links: [
          { label: 'Features', href: '#features' },
          { label: 'Pricing', href: '#pricing' },
        ],
      },
    ]
    render(<Footer columns={columns} />)
    expect(screen.getByText('Product')).toBeInTheDocument()
    expect(screen.getByText('Features')).toBeInTheDocument()
    expect(screen.getByText('Pricing')).toBeInTheDocument()
  })

  it('renders social icons', () => {
    const socials = [
      { label: 'Twitter', href: '#twitter', icon: '🐦' },
      { label: 'GitHub', href: '#github', icon: '🐙' },
    ]
    render(<Footer socials={socials} />)
    expect(screen.getByLabelText('Twitter')).toBeInTheDocument()
    expect(screen.getByLabelText('GitHub')).toBeInTheDocument()
  })

  it('renders custom copyright', () => {
    render(<Footer copyright="© 2025 Acme Inc." />)
    expect(screen.getByText('© 2025 Acme Inc.')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Footer className="custom-footer" />)
    expect(document.querySelector('.custom-footer')).toBeInTheDocument()
  })
})
