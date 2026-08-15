import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatsCard } from './index'

describe('StatsCard', () => {
  it('renders without crash', () => {
    const { container } = render(<StatsCard title="Revenue" value="$1.2M" />)
    expect(container.firstChild).toBeTruthy()
  })

  it('shows title', () => {
    render(<StatsCard title="Users" value={2847} />)
    expect(screen.getByText('Users')).toBeInTheDocument()
  })

  it('shows value', () => {
    render(<StatsCard title="Revenue" value="₽1.2M" />)
    expect(screen.getByTestId('stats-value')).toHaveTextContent('₽1.2M')
  })

  it('renders numeric value', () => {
    render(<StatsCard title="Count" value={42} />)
    expect(screen.getByTestId('stats-value')).toHaveTextContent('42')
  })

  it('renders icon in gradient circle', () => {
    render(<StatsCard title="Revenue" value="$1M" icon="💰" />)
    const iconEl = screen.getByTestId('stats-icon')
    expect(iconEl).toBeInTheDocument()
    expect(iconEl).toHaveTextContent('💰')
    expect(iconEl.style.borderRadius).toBe('50%')
    expect(iconEl.style.background).toBe('var(--gradient-info)')
  })

  it('iconVariant changes gradient', () => {
    render(<StatsCard title="Sales" value={100} icon="📈" iconVariant="success" />)
    const iconEl = screen.getByTestId('stats-icon')
    expect(iconEl.style.background).toBe('var(--gradient-success)')
  })

  it('trend up shows arrow and success color', () => {
    render(
      <StatsCard
        title="Revenue"
        value="$1M"
        trend={{ value: '+12.5%', direction: 'up' }}
      />
    )
    const trend = screen.getByTestId('stats-trend')
    expect(trend).toHaveTextContent('+12.5%')
    expect(trend).toHaveAttribute('data-direction', 'up')
    expect(trend.style.color).toBe('var(--color-success)')
  })

  it('trend down shows danger color', () => {
    render(
      <StatsCard
        title="Revenue"
        value="$1M"
        trend={{ value: '-3.2%', direction: 'down' }}
      />
    )
    const trend = screen.getByTestId('stats-trend')
    expect(trend.style.color).toBe('var(--color-danger)')
  })

  it('subtitle is displayed', () => {
    render(<StatsCard title="Revenue" value="$1M" subtitle="Last month" />)
    expect(screen.getByTestId('stats-subtitle')).toHaveTextContent('Last month')
  })

  it('applies custom className', () => {
    render(<StatsCard title="T" value="V" className="my-card" />)
    const el = screen.getByText('T').closest('.my-card')
    expect(el).toBeTruthy()
  })
})
