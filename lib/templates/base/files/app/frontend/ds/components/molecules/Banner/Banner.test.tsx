import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Banner } from './index'

describe('Banner', () => {
  it('renders children content', () => {
    render(<Banner>Hello world</Banner>)
    expect(screen.getByText('Hello world')).toBeInTheDocument()
  })

  it('applies variant via data attribute', () => {
    render(<Banner variant="success">Test</Banner>)
    expect(screen.getByTestId('banner')).toHaveAttribute('data-variant', 'success')
  })

  it('applies warning variant', () => {
    render(<Banner variant="warning">Warning</Banner>)
    expect(screen.getByTestId('banner')).toHaveAttribute('data-variant', 'warning')
  })

  it('applies danger variant', () => {
    render(<Banner variant="danger">Danger</Banner>)
    expect(screen.getByTestId('banner')).toHaveAttribute('data-variant', 'danger')
  })

  it('shows dismiss button when dismissible=true', () => {
    render(<Banner dismissible>Test</Banner>)
    expect(screen.getByTestId('banner-dismiss')).toBeInTheDocument()
  })

  it('hides dismiss button by default', () => {
    render(<Banner>Test</Banner>)
    expect(screen.queryByTestId('banner-dismiss')).not.toBeInTheDocument()
  })

  it('calls onDismiss and hides banner when dismissed', async () => {
    const onDismiss = vi.fn()
    render(<Banner dismissible onDismiss={onDismiss}>Test</Banner>)
    await userEvent.click(screen.getByTestId('banner-dismiss'))
    expect(onDismiss).toHaveBeenCalledTimes(1)
    expect(screen.queryByTestId('banner')).not.toBeInTheDocument()
  })

  it('renders action button', () => {
    render(<Banner action={{ label: 'Upgrade', onClick: vi.fn() }}>Test</Banner>)
    expect(screen.getByTestId('banner-action')).toHaveTextContent('Upgrade')
  })

  it('calls action.onClick when action button clicked', async () => {
    const onClick = vi.fn()
    render(<Banner action={{ label: 'Act', onClick }}>Test</Banner>)
    await userEvent.click(screen.getByTestId('banner-action'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('shows icon when provided', () => {
    render(<Banner icon={<span data-testid="icon">★</span>}>Test</Banner>)
    expect(screen.getByTestId('banner-icon')).toBeInTheDocument()
  })

  it('applies sticky position when sticky=true', () => {
    render(<Banner sticky>Test</Banner>)
    const banner = screen.getByTestId('banner')
    expect(banner).toHaveStyle({ position: 'sticky' })
  })
})
