import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Navbar } from './index'

const links = [
  { label: 'Главная', href: '/', active: true },
  { label: 'О нас', href: '/about' },
  { label: 'Контакты', href: '/contacts' },
]

describe('Navbar', () => {
  it('renders without crash', () => {
    render(<Navbar />)
    expect(document.querySelector('.ds-navbar')).toBeInTheDocument()
  })

  it('shows default brand name', () => {
    render(<Navbar />)
    expect(screen.getByText('Design System')).toBeInTheDocument()
  })

  it('shows custom brand name', () => {
    render(<Navbar brand="My App" />)
    expect(screen.getByText('My App')).toBeInTheDocument()
  })

  it('renders nav links', () => {
    render(<Navbar links={links} />)
    expect(screen.getByText('Главная')).toBeInTheDocument()
    expect(screen.getByText('О нас')).toBeInTheDocument()
    expect(screen.getByText('Контакты')).toBeInTheDocument()
  })

  it('applies active style to active link', () => {
    render(<Navbar links={links} />)
    const activeLink = screen.getByText('Главная').closest('a')
    expect(activeLink).toHaveAttribute('data-active', 'true')
    expect(activeLink?.style.color).toBe('var(--color-primary)')
  })

  it('renders actions slot', () => {
    render(<Navbar actions={<button>Login</button>} />)
    expect(screen.getByText('Login')).toBeInTheDocument()
  })

  it('applies transparent style when transparent prop is true', () => {
    render(<Navbar transparent />)
    const nav = document.querySelector('.ds-navbar') as HTMLElement
    expect(nav.style.background).toBe('transparent')
  })

  it('applies transparent style for variant=transparent', () => {
    render(<Navbar variant="transparent" />)
    const nav = document.querySelector('.ds-navbar') as HTMLElement
    expect(nav.style.background).toBe('transparent')
  })

  it('applies custom className', () => {
    render(<Navbar className="my-nav" />)
    expect(document.querySelector('.my-nav')).toBeInTheDocument()
  })

  it('default variant renders with surface background', () => {
    render(<Navbar variant="default" />)
    const nav = document.querySelector('.ds-navbar') as HTMLElement
    expect(nav.style.background).toBe('var(--color-surface)')
  })

  it('search variant renders search input', () => {
    render(<Navbar variant="search" />)
    expect(document.querySelector('.ds-navbar--search')).toBeInTheDocument()
  })

  it('mega variant renders with mega class', () => {
    render(<Navbar variant="mega" />)
    expect(document.querySelector('.ds-navbar--mega')).toBeInTheDocument()
  })

  it('mega variant renders NavDropdown for links with megaMenu', () => {
    const megaLinks = [
      {
        label: 'Products',
        href: '/products',
        megaMenu: [{ title: 'Category', items: [{ label: 'Item A', href: '/a' }] }],
      },
    ]
    render(<Navbar variant="mega" links={megaLinks} />)
    expect(screen.getByText('Products')).toBeInTheDocument()
  })
})
