import React, { useState, useEffect, useCallback, useRef } from 'react'
import { cn } from '../../../utils/cn'
import { Button } from '../../atoms/Button'

export interface HeroBannerSlide {
  image: string
  title: string
  subtitle?: string
  cta?: { label: string; onClick: () => void }
  ctaSecondary?: { label: string; onClick: () => void }
  align?: 'left' | 'center' | 'right'
}

export interface HeroBannerProps {
  slides: HeroBannerSlide[]
  height?: 'full' | 'lg' | 'md'
  autoPlay?: boolean
  interval?: number
  overlay?: boolean
  showDots?: boolean
  showArrows?: boolean
  className?: string
}

const HEIGHT_MAP = {
  full: 'calc(100vh - 64px)',
  lg: '500px',
  md: '350px',
}

function ChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

export function HeroBanner({
  slides,
  height = 'lg',
  autoPlay = false,
  interval = 5000,
  overlay = true,
  showDots = true,
  showArrows = true,
  className,
}: HeroBannerProps) {
  const [current, setCurrent] = useState(0)
  const count = slides.length
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const next = useCallback(() => setCurrent((c) => (c + 1) % count), [count])
  const prev = useCallback(() => setCurrent((c) => (c - 1 + count) % count), [count])

  useEffect(() => {
    if (!autoPlay || count <= 1) return
    timerRef.current = setInterval(next, interval)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [autoPlay, interval, next, count])

  const slide = slides[current]
  const alignClass = slide.align === 'left' ? 'items-start text-left' : slide.align === 'right' ? 'items-end text-right' : 'items-center text-center'

  return (
    <div
      data-testid="hero-banner"
      className={cn('ds-hero-banner relative overflow-hidden w-full', className)}
      style={{ height: HEIGHT_MAP[height] }}
    >
      {/* Slide track */}
      <div
        className="flex h-full"
        style={{
          transform: `translateX(-${current * 100}%)`,
          transition: 'transform var(--duration-normal) var(--ease-out)',
        }}
      >
        {slides.map((s, i) => (
          <div
            key={i}
            className="relative shrink-0 w-full h-full"
            style={{ minWidth: '100%' }}
          >
            <img
              src={s.image}
              alt={s.title}
              className="w-full h-full object-cover block"
            />
          </div>
        ))}
      </div>

      {/* Gradient overlay */}
      {overlay && (
        <div
          data-testid="hero-overlay"
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.10) 100%)',
          }}
        />
      )}

      {/* Slide content */}
      <div
        className={cn('absolute inset-0 flex flex-col justify-end px-8 pb-16 sm:px-16 sm:pb-20', alignClass)}
        style={{ pointerEvents: 'none' }}
      >
        <div style={{ pointerEvents: 'auto', marginBottom: '2.5rem' }}>
          <h1
            className="m-0 mb-2 font-black text-white leading-tight text-3xl sm:text-4xl md:text-5xl"
            style={{ fontFamily: 'var(--font-base)', textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}
          >
            {slide.title}
          </h1>

          {slide.subtitle && (
            <p
              className="m-0 mb-5 text-base sm:text-lg font-medium"
              style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-base)', textShadow: '0 1px 6px rgba(0,0,0,0.3)' }}
            >
              {slide.subtitle}
            </p>
          )}

          {(slide.cta || slide.ctaSecondary) && (
            <div className="flex flex-wrap gap-3" style={{ justifyContent: slide.align === 'center' ? 'center' : slide.align === 'right' ? 'flex-end' : 'flex-start' }}>
              {slide.cta && (
                <Button variant="primary" size="lg" onClick={slide.cta.onClick}>
                  {slide.cta.label}
                </Button>
              )}
              {slide.ctaSecondary && (
                <Button variant="default" size="lg" onClick={slide.ctaSecondary.onClick}>
                  {slide.ctaSecondary.label}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Arrow buttons */}
      {showArrows && count > 1 && (
        <>
          <button
            aria-label="Previous slide"
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full text-white cursor-pointer"
            style={{
              background: 'rgba(0,0,0,0.45)',
              border: 'none',
              backdropFilter: 'blur(4px)',
              transition: 'background var(--duration-fast)',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.72)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.45)' }}
          >
            <ChevronLeft />
          </button>
          <button
            aria-label="Next slide"
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full text-white cursor-pointer"
            style={{
              background: 'rgba(0,0,0,0.45)',
              border: 'none',
              backdropFilter: 'blur(4px)',
              transition: 'background var(--duration-fast)',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.72)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.45)' }}
          >
            <ChevronRight />
          </button>
        </>
      )}

      {/* Dots */}
      {showDots && count > 1 && (
        <div
          data-testid="hero-dots"
          className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-[0.4rem]"
        >
          {slides.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setCurrent(i)}
              style={{
                width: i === current ? '1.5rem' : '0.5rem',
                height: '0.5rem',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: i === current ? '#fff' : 'rgba(255,255,255,0.45)',
                cursor: 'pointer',
                padding: 0,
                transition: 'width var(--duration-normal) var(--ease-out), background var(--duration-fast)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
