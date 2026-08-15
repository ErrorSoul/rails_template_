import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { TextBlock } from './index'

describe('TextBlock', () => {
  it('renders title', () => {
    render(<TextBlock title="Hello World">Body content</TextBlock>)
    expect(screen.getByText('Hello World')).toBeTruthy()
  })

  it('renders subtitle when provided', () => {
    render(<TextBlock title="Title" subtitle="Subtitle text">Body</TextBlock>)
    expect(screen.getByText('Subtitle text')).toBeTruthy()
  })

  it('does not render subtitle element when not provided', () => {
    render(<TextBlock title="Title">Body</TextBlock>)
    expect(screen.queryByText('Subtitle text')).toBeNull()
  })

  it('renders children body content', () => {
    render(<TextBlock title="T">Some body text here</TextBlock>)
    expect(screen.getByText('Some body text here')).toBeTruthy()
  })

  it('renders action button when provided', () => {
    const onClick = vi.fn()
    render(
      <TextBlock title="T" action={{ label: 'Learn More', onClick }}>
        Content
      </TextBlock>
    )
    expect(screen.getByRole('button', { name: 'Learn More' })).toBeTruthy()
  })

  it('calls action onClick when button is clicked', () => {
    const onClick = vi.fn()
    render(
      <TextBlock title="T" action={{ label: 'Click Me', onClick }}>
        Content
      </TextBlock>
    )
    fireEvent.click(screen.getByRole('button', { name: 'Click Me' }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('does not render action button when not provided', () => {
    render(<TextBlock title="T">Content</TextBlock>)
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('applies center alignment', () => {
    const { container } = render(
      <TextBlock title="T" align="center">Content</TextBlock>
    )
    const root = container.firstChild as HTMLElement
    expect(root.style.textAlign).toBe('center')
  })

  it('defaults to left alignment', () => {
    const { container } = render(<TextBlock title="T">Content</TextBlock>)
    const root = container.firstChild as HTMLElement
    expect(root.style.textAlign).toBe('left')
  })
})
