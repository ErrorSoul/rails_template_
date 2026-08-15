import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Gallery } from '.'

const images = [
  { src: 'img1.jpg', alt: 'Image 1', caption: 'Caption 1' },
  { src: 'img2.jpg', alt: 'Image 2' },
  { src: 'img3.jpg', alt: 'Image 3', caption: 'Caption 3' },
]

describe('Gallery', () => {
  it('renders without crash', () => {
    render(<Gallery images={images} />)
    expect(screen.getByAltText('Image 1')).toBeInTheDocument()
  })

  it('renders all images', () => {
    render(<Gallery images={images} />)
    expect(screen.getByAltText('Image 1')).toBeInTheDocument()
    expect(screen.getByAltText('Image 2')).toBeInTheDocument()
    expect(screen.getByAltText('Image 3')).toBeInTheDocument()
  })

  it('shows captions in grid', () => {
    render(<Gallery images={images} />)
    expect(screen.getByText('Caption 1')).toBeInTheDocument()
  })

  it('opens lightbox on image click', () => {
    render(<Gallery images={images} />)
    fireEvent.click(screen.getByAltText('Image 1'))
    // Lightbox should show prev/next buttons
    expect(screen.getByLabelText('Previous image')).toBeInTheDocument()
    expect(screen.getByLabelText('Next image')).toBeInTheDocument()
  })

  it('navigates to next image in lightbox', () => {
    render(<Gallery images={images} />)
    fireEvent.click(screen.getByAltText('Image 1'))
    fireEvent.click(screen.getByLabelText('Next image'))
    // Should not crash and show 2/3
    expect(screen.getByText('2 / 3')).toBeInTheDocument()
  })

  it('navigates to previous image in lightbox', () => {
    render(<Gallery images={images} />)
    fireEvent.click(screen.getByAltText('Image 2'))
    fireEvent.click(screen.getByLabelText('Previous image'))
    expect(screen.getByText('1 / 3')).toBeInTheDocument()
  })

  it('closes lightbox on Escape key', () => {
    render(<Gallery images={images} />)
    fireEvent.click(screen.getByAltText('Image 1'))
    expect(screen.getByLabelText('Previous image')).toBeInTheDocument()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByLabelText('Previous image')).not.toBeInTheDocument()
  })

  it('renders with 2 columns', () => {
    const { container } = render(<Gallery images={images} columns={2} />)
    const grid = container.querySelector('.ds-gallery') as HTMLElement
    expect(grid.style.gridTemplateColumns).toContain('repeat(2')
  })
})
