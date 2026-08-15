import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LandingLayout } from './index'

describe('LandingLayout', () => {
  it('renders without crash', () => {
    render(<LandingLayout>Content</LandingLayout>)
    expect(document.querySelector('.ds-landing-layout')).toBeInTheDocument()
  })

  it('renders children', () => {
    render(<LandingLayout>Landing Content</LandingLayout>)
    expect(screen.getByText('Landing Content')).toBeInTheDocument()
  })

  it('renders hero section', () => {
    render(<LandingLayout hero={<h1>Hero Title</h1>}>Content</LandingLayout>)
    expect(screen.getByText('Hero Title')).toBeInTheDocument()
  })

  it('renders footer', () => {
    render(<LandingLayout footer="© 2026 Company">Content</LandingLayout>)
    expect(screen.getByText('© 2026 Company')).toBeInTheDocument()
  })

  it('renders navbar with brand', () => {
    render(<LandingLayout brand="BrandName">Content</LandingLayout>)
    expect(screen.getByText('BrandName')).toBeInTheDocument()
  })

  it('applies transparent navbar', () => {
    render(<LandingLayout>Content</LandingLayout>)
    const nav = document.querySelector('.ds-navbar') as HTMLElement
    expect(nav.style.background).toBe('transparent')
  })

  it('applies custom className', () => {
    render(<LandingLayout className="my-landing">Content</LandingLayout>)
    expect(document.querySelector('.my-landing')).toBeInTheDocument()
  })
})
