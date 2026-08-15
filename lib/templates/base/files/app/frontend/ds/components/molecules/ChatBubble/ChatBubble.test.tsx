import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ChatBubble } from './index'

describe('ChatBubble', () => {
  it('renders the message', () => {
    render(<ChatBubble message="Hello!" sender="user" />)
    expect(screen.getByTestId('bubble-content')).toHaveTextContent('Hello!')
  })

  it('renders user bubble with data-sender=user', () => {
    render(<ChatBubble message="Hi" sender="user" />)
    expect(screen.getByTestId('chat-bubble')).toHaveAttribute('data-sender', 'user')
  })

  it('renders other bubble with data-sender=other', () => {
    render(<ChatBubble message="Hey" sender="other" />)
    expect(screen.getByTestId('chat-bubble')).toHaveAttribute('data-sender', 'other')
  })

  it('shows name when provided', () => {
    render(<ChatBubble message="Yo" sender="other" name="Alice" />)
    expect(screen.getByTestId('bubble-name')).toHaveTextContent('Alice')
  })

  it('shows timestamp when provided', () => {
    render(<ChatBubble message="Yo" sender="user" timestamp="12:34" />)
    expect(screen.getByTestId('bubble-timestamp')).toHaveTextContent('12:34')
  })

  it('shows status icon for user messages', () => {
    render(<ChatBubble message="test" sender="user" status="sent" />)
    expect(screen.getByTestId('status-icon')).toHaveAttribute('data-status', 'sent')
  })

  it('shows delivered status', () => {
    render(<ChatBubble message="test" sender="user" status="delivered" />)
    expect(screen.getByTestId('status-icon')).toHaveAttribute('data-status', 'delivered')
  })

  it('shows read status', () => {
    render(<ChatBubble message="test" sender="user" status="read" />)
    expect(screen.getByTestId('status-icon')).toHaveAttribute('data-status', 'read')
  })

  it('renders avatar element', () => {
    render(<ChatBubble message="hi" sender="other" avatar="https://example.com/a.jpg" />)
    // Avatar renders an img
    expect(screen.getByRole('img')).toBeInTheDocument()
  })
})
