import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Accordion } from './index'

const items = [
  { id: 'a', title: 'Item A', content: 'Content A' },
  { id: 'b', title: 'Item B', content: 'Content B' },
  { id: 'c', title: 'Item C', content: 'Content C', disabled: true },
]

describe('Accordion', () => {
  it('renders all item titles', () => {
    render(<Accordion items={items} />)
    expect(screen.getByText('Item A')).toBeDefined()
    expect(screen.getByText('Item B')).toBeDefined()
    expect(screen.getByText('Item C')).toBeDefined()
  })

  it('click opens and closes an item', async () => {
    const user = userEvent.setup()
    render(<Accordion items={items} />)

    expect(screen.queryByText('Content A')).toBeNull()

    await user.click(screen.getByText('Item A'))
    expect(screen.getByText('Content A')).toBeDefined()

    await user.click(screen.getByText('Item A'))
    expect(screen.queryByText('Content A')).toBeNull()
  })

  it('only one item open at a time when multiple=false', async () => {
    const user = userEvent.setup()
    render(<Accordion items={items} />)

    await user.click(screen.getByText('Item A'))
    expect(screen.getByText('Content A')).toBeDefined()
    expect(screen.queryByText('Content B')).toBeNull()

    await user.click(screen.getByText('Item B'))
    expect(screen.queryByText('Content A')).toBeNull()
    expect(screen.getByText('Content B')).toBeDefined()
  })

  it('allows multiple open when multiple=true', async () => {
    const user = userEvent.setup()
    render(<Accordion items={items} multiple />)

    await user.click(screen.getByText('Item A'))
    await user.click(screen.getByText('Item B'))
    expect(screen.getByText('Content A')).toBeDefined()
    expect(screen.getByText('Content B')).toBeDefined()
  })

  it('defaultOpen works', () => {
    render(<Accordion items={items} defaultOpen={['b']} />)
    expect(screen.getByText('Content B')).toBeDefined()
    expect(screen.queryByText('Content A')).toBeNull()
  })

  it('disabled item is not clickable', async () => {
    const user = userEvent.setup()
    render(<Accordion items={items} />)

    await user.click(screen.getByText('Item C'))
    expect(screen.queryByText('Content C')).toBeNull()
  })

  it('aria-expanded matches open state', async () => {
    const user = userEvent.setup()
    render(<Accordion items={items} />)

    const headerA = screen.getByRole('button', { name: /Item A/i })
    expect(headerA.getAttribute('aria-expanded')).toBe('false')

    await user.click(headerA)
    expect(headerA.getAttribute('aria-expanded')).toBe('true')
  })

  it('renders with custom className', () => {
    const { container } = render(<Accordion items={items} className="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('renders item icon', () => {
    const withIcon = [{ id: 'x', title: 'With Icon', content: 'Content', icon: <span data-testid="icon">★</span> }]
    render(<Accordion items={withIcon} />)
    expect(screen.getByTestId('icon')).toBeDefined()
  })
})
