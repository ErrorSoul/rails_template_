import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { EmptyState } from './index'
import { Button } from '../../atoms/Button'

describe('EmptyState', () => {
  it('renders without crash', () => {
    render(<EmptyState title="No results" />)
  })

  it('shows title', () => {
    render(<EmptyState title="Nothing here" />)
    expect(screen.getByText('Nothing here')).toBeInTheDocument()
  })

  it('shows description when provided', () => {
    render(<EmptyState title="Empty" description="Try adding something" />)
    expect(screen.getByText('Try adding something')).toBeInTheDocument()
  })

  it('does not render description when absent', () => {
    render(<EmptyState title="Empty" />)
    expect(screen.queryByText(/Try/)).toBeNull()
  })

  it('renders icon when provided', () => {
    render(<EmptyState title="Empty" icon="📭" />)
    expect(screen.getByText('📭')).toBeInTheDocument()
  })

  it('renders action when provided', () => {
    render(
      <EmptyState
        title="No data"
        action={<Button>Add Item</Button>}
      />
    )
    expect(screen.getByText('Add Item')).toBeInTheDocument()
  })
})
