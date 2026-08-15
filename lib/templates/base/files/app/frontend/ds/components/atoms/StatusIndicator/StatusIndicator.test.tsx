import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatusIndicator } from './index'

describe('StatusIndicator', () => {
  it('renders a status dot', () => {
    render(<StatusIndicator status="online" />)
    expect(screen.getByTestId('status-dot')).toBeInTheDocument()
  })

  it('applies online status', () => {
    render(<StatusIndicator status="online" />)
    const dot = screen.getByTestId('status-dot')
    expect(dot).toHaveAttribute('data-status', 'online')
  })

  it('applies offline status', () => {
    render(<StatusIndicator status="offline" />)
    expect(screen.getByTestId('status-dot')).toHaveAttribute('data-status', 'offline')
  })

  it('applies busy status', () => {
    render(<StatusIndicator status="busy" />)
    expect(screen.getByTestId('status-dot')).toHaveAttribute('data-status', 'busy')
  })

  it('applies away status', () => {
    render(<StatusIndicator status="away" />)
    expect(screen.getByTestId('status-dot')).toHaveAttribute('data-status', 'away')
  })

  it('shows pulse ring when pulse=true and status=online', () => {
    render(<StatusIndicator status="online" pulse />)
    expect(screen.getByTestId('pulse-ring')).toBeInTheDocument()
  })

  it('does not show pulse ring when pulse=false', () => {
    render(<StatusIndicator status="online" />)
    expect(screen.queryByTestId('pulse-ring')).not.toBeInTheDocument()
  })

  it('renders label text', () => {
    render(<StatusIndicator status="online" label="Available" />)
    expect(screen.getByText('Available')).toBeInTheDocument()
  })

  it('renders sm size', () => {
    render(<StatusIndicator status="online" size="sm" />)
    const dot = screen.getByTestId('status-dot')
    expect(dot).toBeInTheDocument()
  })

  it('renders lg size', () => {
    render(<StatusIndicator status="online" size="lg" />)
    expect(screen.getByTestId('status-dot')).toBeInTheDocument()
  })
})
