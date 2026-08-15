import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ImageCard } from '.'

const defaultProps = {
  image: 'test.jpg',
  alt: 'Test image',
  title: 'Test Title',
}

describe('ImageCard', () => {
  it('renders without crash', () => {
    render(<ImageCard {...defaultProps} />)
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('renders image with correct alt', () => {
    render(<ImageCard {...defaultProps} />)
    expect(screen.getByAltText('Test image')).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(<ImageCard {...defaultProps} description="Some description" />)
    expect(screen.getByText('Some description')).toBeInTheDocument()
  })

  it('renders badge when provided', () => {
    render(<ImageCard {...defaultProps} badge="NEW" />)
    expect(screen.getByText('NEW')).toBeInTheDocument()
  })

  it('does not render badge when not provided', () => {
    render(<ImageCard {...defaultProps} />)
    expect(screen.queryByText('NEW')).not.toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    render(<ImageCard {...defaultProps} onClick={onClick} />)
    fireEvent.click(screen.getByText('Test Title'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('renders footer when provided', () => {
    render(<ImageCard {...defaultProps} footer={<span>Footer content</span>} />)
    expect(screen.getByText('Footer content')).toBeInTheDocument()
  })

  it('renders with 4:3 aspect ratio', () => {
    const { container } = render(<ImageCard {...defaultProps} aspectRatio="4:3" />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders with 1:1 aspect ratio', () => {
    const { container } = render(<ImageCard {...defaultProps} aspectRatio="1:1" />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
