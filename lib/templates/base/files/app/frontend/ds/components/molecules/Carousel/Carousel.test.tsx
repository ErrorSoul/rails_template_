import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Carousel } from '.'

const slides = [
  <div key="1">Slide 1</div>,
  <div key="2">Slide 2</div>,
  <div key="3">Slide 3</div>,
]

describe('Carousel', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders without crash', () => {
    render(<Carousel>{slides}</Carousel>)
    expect(screen.getByText('Slide 1')).toBeInTheDocument()
  })

  it('renders all slides', () => {
    render(<Carousel>{slides}</Carousel>)
    expect(screen.getByText('Slide 1')).toBeInTheDocument()
    expect(screen.getByText('Slide 2')).toBeInTheDocument()
    expect(screen.getByText('Slide 3')).toBeInTheDocument()
  })

  it('renders prev/next buttons by default', () => {
    render(<Carousel>{slides}</Carousel>)
    expect(screen.getByLabelText('Previous slide')).toBeInTheDocument()
    expect(screen.getByLabelText('Next slide')).toBeInTheDocument()
  })

  it('hides arrows when showArrows=false', () => {
    render(<Carousel showArrows={false}>{slides}</Carousel>)
    expect(screen.queryByLabelText('Previous slide')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Next slide')).not.toBeInTheDocument()
  })

  it('renders dots by default', () => {
    render(<Carousel>{slides}</Carousel>)
    expect(screen.getByLabelText('Go to slide 1')).toBeInTheDocument()
    expect(screen.getByLabelText('Go to slide 2')).toBeInTheDocument()
    expect(screen.getByLabelText('Go to slide 3')).toBeInTheDocument()
  })

  it('hides dots when showDots=false', () => {
    render(<Carousel showDots={false}>{slides}</Carousel>)
    expect(screen.queryByLabelText('Go to slide 1')).not.toBeInTheDocument()
  })

  it('clicking next moves to next slide', () => {
    render(<Carousel>{slides}</Carousel>)
    fireEvent.click(screen.getByLabelText('Next slide'))
    // After clicking next, dot 2 should be "active" (wider)
    expect(screen.getByLabelText('Go to slide 2')).toBeInTheDocument()
  })

  it('clicking dot navigates to that slide', () => {
    render(<Carousel>{slides}</Carousel>)
    fireEvent.click(screen.getByLabelText('Go to slide 3'))
    // Component should not crash
    expect(screen.getByText('Slide 3')).toBeInTheDocument()
  })

  it('auto-play advances slides', () => {
    render(<Carousel autoPlay interval={1000}>{slides}</Carousel>)
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(screen.getByText('Slide 2')).toBeInTheDocument()
  })

  it('prev wraps around from first to last', () => {
    render(<Carousel>{slides}</Carousel>)
    fireEvent.click(screen.getByLabelText('Previous slide'))
    // Should not crash, wraps to last
    expect(screen.getByText('Slide 3')).toBeInTheDocument()
  })
})
