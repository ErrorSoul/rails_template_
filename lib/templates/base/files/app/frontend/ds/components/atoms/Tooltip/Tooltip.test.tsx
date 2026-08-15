import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { Tooltip } from './index'

describe('Tooltip', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders children', () => {
    render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>
    )
    expect(screen.getByText('Hover me')).toBeInTheDocument()
  })

  it('tooltip is hidden by default', () => {
    render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>
    )
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('shows tooltip on mouseEnter after delay', () => {
    render(
      <Tooltip content="Tooltip text" delay={200}>
        <button>Hover me</button>
      </Tooltip>
    )
    const wrapper = screen.getByText('Hover me').closest('span')!
    fireEvent.mouseEnter(wrapper)
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    act(() => { vi.advanceTimersByTime(200) })
    expect(screen.getByRole('tooltip')).toBeInTheDocument()
  })

  it('hides tooltip on mouseLeave', () => {
    render(
      <Tooltip content="Tooltip text" delay={0}>
        <button>Hover me</button>
      </Tooltip>
    )
    const wrapper = screen.getByText('Hover me').closest('span')!
    fireEvent.mouseEnter(wrapper)
    act(() => { vi.advanceTimersByTime(0) })
    expect(screen.getByRole('tooltip')).toBeInTheDocument()
    fireEvent.mouseLeave(wrapper)
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('renders content in tooltip', () => {
    render(
      <Tooltip content="Hello World" delay={0}>
        <button>Hover me</button>
      </Tooltip>
    )
    fireEvent.mouseEnter(screen.getByText('Hover me').closest('span')!)
    act(() => { vi.advanceTimersByTime(0) })
    expect(screen.getByRole('tooltip')).toHaveTextContent('Hello World')
  })

  it('has role="tooltip" when visible', () => {
    render(
      <Tooltip content="Test" delay={0}>
        <span>target</span>
      </Tooltip>
    )
    const wrapper = screen.getByText('target').parentElement!
    fireEvent.mouseEnter(wrapper)
    act(() => { vi.advanceTimersByTime(0) })
    expect(screen.getByRole('tooltip')).toBeInTheDocument()
  })

  it('applies custom className to tooltip', () => {
    render(
      <Tooltip content="Test" delay={0} className="my-tooltip">
        <span>target</span>
      </Tooltip>
    )
    const wrapper = screen.getByText('target').parentElement!
    fireEvent.mouseEnter(wrapper)
    act(() => { vi.advanceTimersByTime(0) })
    expect(screen.getByRole('tooltip')).toHaveClass('my-tooltip')
  })
})
