import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { DashboardPanel } from './index'

const chartData = [
  { label: 'Jan', value: 120 },
  { label: 'Feb', value: 90 },
  { label: 'Mar', value: 150 },
]

const stats = [
  { title: 'Revenue', value: '$12,400', iconVariant: 'success' as const, icon: '💰' },
  { title: 'Users', value: '3,421', iconVariant: 'info' as const, icon: '👤' },
]

describe('DashboardPanel', () => {
  it('renders without crash', () => {
    render(<DashboardPanel title="Overview" />)
    expect(screen.getByText('Overview')).toBeInTheDocument()
  })

  it('shows title', () => {
    render(<DashboardPanel title="Sales Analytics" />)
    expect(screen.getByText('Sales Analytics')).toBeInTheDocument()
  })

  it('renders stats cards', () => {
    render(<DashboardPanel title="Panel" stats={stats} />)
    expect(screen.getByText('Revenue')).toBeInTheDocument()
    expect(screen.getByText('$12,400')).toBeInTheDocument()
    expect(screen.getByText('Users')).toBeInTheDocument()
  })

  it('renders chart when provided', () => {
    render(<DashboardPanel title="Panel" chart={{ type: 'bar', data: chartData }} />)
    expect(screen.getByRole('img', { name: /bar chart/i })).toBeInTheDocument()
  })

  it('renders line chart', () => {
    render(<DashboardPanel title="Panel" chart={{ type: 'line', data: chartData }} />)
    expect(screen.getByRole('img', { name: /line chart/i })).toBeInTheDocument()
  })

  it('renders donut chart', () => {
    const donutData = [{ label: 'A', value: 60 }, { label: 'B', value: 40 }]
    render(<DashboardPanel title="Panel" chart={{ type: 'donut', data: donutData }} />)
    expect(screen.getByRole('img', { name: /donut chart/i })).toBeInTheDocument()
  })

  it('shows period selector when period prop provided', () => {
    render(<DashboardPanel title="Panel" period="7 days" />)
    expect(screen.getByTestId('period-selector')).toBeInTheDocument()
  })

  it('calls onPeriodChange when period changed', () => {
    const onPeriodChange = vi.fn()
    render(<DashboardPanel title="Panel" period="7 days" onPeriodChange={onPeriodChange} />)
    fireEvent.change(screen.getByTestId('period-selector'), { target: { value: '30 days' } })
    expect(onPeriodChange).toHaveBeenCalledWith('30 days')
  })

  it('does not show period selector when period is undefined', () => {
    render(<DashboardPanel title="Panel" />)
    expect(screen.queryByTestId('period-selector')).not.toBeInTheDocument()
  })

  it('renders chart title when provided', () => {
    render(<DashboardPanel title="Panel" chart={{ type: 'bar', data: chartData, title: 'Monthly Revenue' }} />)
    expect(screen.getByText('Monthly Revenue')).toBeInTheDocument()
  })
})
