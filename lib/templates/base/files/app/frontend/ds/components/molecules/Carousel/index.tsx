import { useState, useEffect, useCallback, useRef } from 'react'
import { cn } from '../../../utils/cn'

export interface CarouselProps {
  children: React.ReactNode[]
  autoPlay?: boolean
  interval?: number
  showDots?: boolean
  showArrows?: boolean
  className?: string
}

export function Carousel({
  children,
  autoPlay = false,
  interval = 3000,
  showDots = true,
  showArrows = true,
  className,
}: CarouselProps) {
  const [current, setCurrent] = useState(0)
  const count = children.length
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % count)
  }, [count])

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + count) % count)
  }, [count])

  useEffect(() => {
    if (!autoPlay) return
    timerRef.current = setInterval(next, interval)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [autoPlay, interval, next])

  return (
    <div
      className={cn('ds-carousel', className)}
      style={{ position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-xl)' }}
    >
      {/* Track */}
      <div
        style={{
          display: 'flex',
          transform: `translateX(-${current * 100}%)`,
          transition: 'transform var(--duration-normal) var(--ease-out)',
        }}
      >
        {children.map((child, i) => (
          <div
            key={i}
            style={{ minWidth: '100%', flexShrink: 0 }}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Arrows */}
      {showArrows && count > 1 && (
        <>
          <button
            aria-label="Previous slide"
            onClick={prev}
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(0,0,0,0.5)',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              width: '2.5rem',
              height: '2.5rem',
              color: '#fff',
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background var(--duration-fast)',
              backdropFilter: 'blur(4px)',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.75)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.5)' }}
          >
            ‹
          </button>
          <button
            aria-label="Next slide"
            onClick={next}
            style={{
              position: 'absolute',
              right: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(0,0,0,0.5)',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              width: '2.5rem',
              height: '2.5rem',
              color: '#fff',
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background var(--duration-fast)',
              backdropFilter: 'blur(4px)',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.75)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.5)' }}
          >
            ›
          </button>
        </>
      )}

      {/* Dots */}
      {showDots && count > 1 && (
        <div
          style={{
            position: 'absolute',
            bottom: '0.75rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '0.4rem',
          }}
        >
          {children.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setCurrent(i)}
              style={{
                width: i === current ? '1.5rem' : '0.5rem',
                height: '0.5rem',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: i === current ? 'var(--color-primary)' : 'rgba(255,255,255,0.4)',
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
