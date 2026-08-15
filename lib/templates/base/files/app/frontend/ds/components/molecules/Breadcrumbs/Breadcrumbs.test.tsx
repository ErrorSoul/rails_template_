import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Breadcrumbs } from './index'

const items = [
  { label: 'Home', href: '/' },
  { label: 'Components', href: '/components' },
  { label: 'Breadcrumbs' },
]

describe('Breadcrumbs', () => {
  it('renders all items', () => {
    render(<Breadcrumbs items={items} />)
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Components')).toBeInTheDocument()
    expect(screen.getByText('Breadcrumbs')).toBeInTheDocument()
  })

  it('last item has aria-current="page"', () => {
    render(<Breadcrumbs items={items} />)
    expect(screen.getByText('Breadcrumbs')).toHaveAttribute('aria-current', 'page')
  })

  it('link items have correct href', () => {
    render(<Breadcrumbs items={items} />)
    expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/')
    expect(screen.getByText('Components').closest('a')).toHaveAttribute('href', '/components')
  })

  it('renders custom separator', () => {
    render(<Breadcrumbs items={items} separator=">" />)
    const separators = screen.getAllByText('>')
    expect(separators.length).toBe(2)
  })

  it('renders icon before label', () => {
    render(
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/', icon: <span data-testid="home-icon">🏠</span> },
          { label: 'Page' },
        ]}
      />
    )
    expect(screen.getByTestId('home-icon')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Breadcrumbs items={items} className="my-breadcrumbs" />)
    expect(screen.getByRole('navigation')).toHaveClass('my-breadcrumbs')
  })

  it('nav has aria-label="Breadcrumb"', () => {
    render(<Breadcrumbs items={items} />)
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Breadcrumb')
  })
})
