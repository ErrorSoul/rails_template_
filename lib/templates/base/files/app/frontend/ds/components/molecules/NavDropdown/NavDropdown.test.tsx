import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { NavDropdown } from '.'

const sections = [
  {
    title: 'Products',
    items: [
      { label: 'Item One', description: 'Desc one' },
      { label: 'Item Two' },
    ],
  },
]

describe('NavDropdown', () => {
  it('renders trigger', () => {
    render(<NavDropdown trigger={<button>Menu</button>} items={sections} />)
    expect(screen.getByText('Menu')).toBeInTheDocument()
  })

  it('dropdown is hidden initially', () => {
    render(<NavDropdown trigger={<button>Menu</button>} items={sections} />)
    expect(screen.queryByText('Item One')).not.toBeInTheDocument()
  })

  it('opens dropdown on click', () => {
    render(<NavDropdown trigger={<button>Menu</button>} items={sections} />)
    fireEvent.click(screen.getByText('Menu'))
    expect(screen.getByText('Item One')).toBeInTheDocument()
  })

  it('shows section title', () => {
    render(<NavDropdown trigger={<button>Menu</button>} items={sections} />)
    fireEvent.click(screen.getByText('Menu'))
    expect(screen.getByText('Products')).toBeInTheDocument()
  })

  it('shows item description', () => {
    render(<NavDropdown trigger={<button>Menu</button>} items={sections} />)
    fireEvent.click(screen.getByText('Menu'))
    expect(screen.getByText('Desc one')).toBeInTheDocument()
  })

  it('closes on outside click', () => {
    render(
      <div>
        <NavDropdown trigger={<button>Menu</button>} items={sections} />
        <div>Outside</div>
      </div>
    )
    fireEvent.click(screen.getByText('Menu'))
    expect(screen.getByText('Item One')).toBeInTheDocument()
    fireEvent.mouseDown(screen.getByText('Outside'))
    expect(screen.queryByText('Item One')).not.toBeInTheDocument()
  })

  it('calls onClick on item click', () => {
    const onClick = vi.fn()
    const sectionsWithClick = [{ items: [{ label: 'Clickable', onClick }] }]
    render(<NavDropdown trigger={<button>Menu</button>} items={sectionsWithClick} />)
    fireEvent.click(screen.getByText('Menu'))
    fireEvent.click(screen.getByText('Clickable'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('toggles closed on second click', () => {
    render(<NavDropdown trigger={<button>Menu</button>} items={sections} />)
    fireEvent.click(screen.getByText('Menu'))
    fireEvent.click(screen.getByText('Menu'))
    expect(screen.queryByText('Item One')).not.toBeInTheDocument()
  })
})
