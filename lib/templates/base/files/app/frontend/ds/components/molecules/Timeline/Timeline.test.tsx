import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Timeline } from './index'

const items = [
  { title: 'Step One', description: 'First event', date: '2024-01', status: 'completed' as const },
  { title: 'Step Two', description: 'Second event', date: '2024-02', status: 'active' as const },
  { title: 'Step Three', status: 'pending' as const },
]

describe('Timeline', () => {
  it('renders without crash', () => {
    render(<Timeline items={items} />)
    expect(screen.getByRole('list')).toBeDefined()
  })

  it('renders all item titles', () => {
    render(<Timeline items={items} />)
    expect(screen.getByText('Step One')).toBeDefined()
    expect(screen.getByText('Step Two')).toBeDefined()
    expect(screen.getByText('Step Three')).toBeDefined()
  })

  it('renders descriptions', () => {
    render(<Timeline items={items} />)
    expect(screen.getByText('First event')).toBeDefined()
    expect(screen.getByText('Second event')).toBeDefined()
  })

  it('renders dates', () => {
    render(<Timeline items={items} />)
    expect(screen.getByText('2024-01')).toBeDefined()
    expect(screen.getByText('2024-02')).toBeDefined()
  })

  it('renders status labels', () => {
    render(<Timeline items={items} />)
    expect(screen.getByText('completed')).toBeDefined()
    expect(screen.getByText('active')).toBeDefined()
    expect(screen.getByText('pending')).toBeDefined()
  })

  it('renders correct number of listitems', () => {
    render(<Timeline items={items} />)
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  it('alternating variant renders', () => {
    const { container } = render(<Timeline items={items} variant="alternating" />)
    expect(container.firstChild).toBeDefined()
  })

  it('applies custom className', () => {
    const { container } = render(<Timeline items={items} className="my-timeline" />)
    expect(container.firstChild).toHaveClass('my-timeline')
  })

  it('renders empty list without crash', () => {
    render(<Timeline items={[]} />)
    expect(screen.getByRole('list')).toBeDefined()
  })
})
