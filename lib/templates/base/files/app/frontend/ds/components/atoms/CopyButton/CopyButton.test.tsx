import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { CopyButton } from './index'

describe('CopyButton', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders with default label', () => {
    render(<CopyButton text="hello" />)
    expect(screen.getByText('Copy')).toBeInTheDocument()
  })

  it('renders with custom label', () => {
    render(<CopyButton text="hello" label="Copy Code" />)
    expect(screen.getByText('Copy Code')).toBeInTheDocument()
  })

  it('calls clipboard.writeText on click', async () => {
    render(<CopyButton text="test text" />)
    await act(async () => {
      fireEvent.click(screen.getByRole('button'))
    })
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test text')
  })

  it('shows copiedLabel after click', async () => {
    render(<CopyButton text="hello" copiedLabel="Done!" />)
    await act(async () => {
      fireEvent.click(screen.getByRole('button'))
    })
    expect(screen.getByText('Done!')).toBeInTheDocument()
  })

  it('reverts to original label after timeout', async () => {
    render(<CopyButton text="hello" timeout={2000} />)
    await act(async () => {
      fireEvent.click(screen.getByRole('button'))
    })
    expect(screen.getByText('Copied!')).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(2000))
    expect(screen.getByText('Copy')).toBeInTheDocument()
  })

  it('renders ghost variant', () => {
    render(<CopyButton text="hello" variant="ghost" />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('renders sm size', () => {
    render(<CopyButton text="hello" size="sm" />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
