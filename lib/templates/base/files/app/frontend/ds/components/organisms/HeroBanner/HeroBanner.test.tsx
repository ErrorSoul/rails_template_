import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { HeroBanner, type HeroBannerSlide } from './index'

const img = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>'

const slides: HeroBannerSlide[] = [
  {
    image: img,
    title: 'Slide One Title',
    subtitle: 'Slide one subtitle text',
    cta: { label: 'Buy Now', onClick: vi.fn() },
    ctaSecondary: { label: 'Learn More', onClick: vi.fn() },
    align: 'center',
  },
  {
    image: img,
    title: 'Slide Two Title',
    subtitle: 'Slide two subtitle text',
    cta: { label: 'Explore', onClick: vi.fn() },
    align: 'left',
  },
  {
    image: img,
    title: 'Slide Three Title',
    align: 'right',
  },
]

describe('HeroBanner', () => {
  it('renders without crash and shows first slide title', () => {
    render(<HeroBanner slides={slides} />)
    expect(screen.getByTestId('hero-banner')).toBeInTheDocument()
    expect(screen.getByText('Slide One Title')).toBeInTheDocument()
  })

  it('shows subtitle of first slide', () => {
    render(<HeroBanner slides={slides} />)
    expect(screen.getByText('Slide one subtitle text')).toBeInTheDocument()
  })

  it('renders CTA button and fires onClick', () => {
    const onClick = vi.fn()
    render(<HeroBanner slides={[{ image: img, title: 'Test', cta: { label: 'Click Me', onClick } }]} />)
    fireEvent.click(screen.getByText('Click Me'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('renders secondary CTA button', () => {
    render(<HeroBanner slides={slides} />)
    expect(screen.getByText('Learn More')).toBeInTheDocument()
  })

  it('shows dots when showDots=true', () => {
    render(<HeroBanner slides={slides} showDots />)
    expect(screen.getByTestId('hero-dots')).toBeInTheDocument()
    expect(screen.getAllByLabelText(/Go to slide/)).toHaveLength(3)
  })

  it('hides dots when showDots=false', () => {
    render(<HeroBanner slides={slides} showDots={false} />)
    expect(screen.queryByTestId('hero-dots')).not.toBeInTheDocument()
  })

  it('navigates to next slide via arrow button', () => {
    render(<HeroBanner slides={slides} showArrows />)
    expect(screen.getByText('Slide One Title')).toBeInTheDocument()
    fireEvent.click(screen.getByLabelText('Next slide'))
    expect(screen.getByText('Slide Two Title')).toBeInTheDocument()
  })

  it('navigates to previous slide via arrow button', () => {
    render(<HeroBanner slides={slides} showArrows />)
    // go next first
    fireEvent.click(screen.getByLabelText('Next slide'))
    expect(screen.getByText('Slide Two Title')).toBeInTheDocument()
    // then go back
    fireEvent.click(screen.getByLabelText('Previous slide'))
    expect(screen.getByText('Slide One Title')).toBeInTheDocument()
  })

  it('advances slide on autoPlay interval', () => {
    vi.useFakeTimers()
    render(<HeroBanner slides={slides} autoPlay interval={3000} />)
    expect(screen.getByText('Slide One Title')).toBeInTheDocument()
    act(() => { vi.advanceTimersByTime(3000) })
    expect(screen.getByText('Slide Two Title')).toBeInTheDocument()
    vi.useRealTimers()
  })

  it('applies md height style', () => {
    render(<HeroBanner slides={slides} height="md" />)
    const banner = screen.getByTestId('hero-banner')
    expect(banner).toHaveStyle({ height: '350px' })
  })

  it('applies lg height style', () => {
    render(<HeroBanner slides={slides} height="lg" />)
    const banner = screen.getByTestId('hero-banner')
    expect(banner).toHaveStyle({ height: '500px' })
  })

  it('renders overlay gradient when overlay=true', () => {
    render(<HeroBanner slides={slides} overlay />)
    expect(screen.getByTestId('hero-overlay')).toBeInTheDocument()
  })

  it('does not render overlay when overlay=false', () => {
    render(<HeroBanner slides={slides} overlay={false} />)
    expect(screen.queryByTestId('hero-overlay')).not.toBeInTheDocument()
  })
})
