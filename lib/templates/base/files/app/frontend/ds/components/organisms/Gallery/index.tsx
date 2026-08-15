import { useState, useEffect, useCallback } from 'react'
import { cn } from '../../../utils/cn'
import { Modal } from '../Modal'

export interface GalleryImage {
  src: string
  alt: string
  caption?: string
}

export interface GalleryProps {
  images: GalleryImage[]
  columns?: 2 | 3 | 4
  gap?: 'sm' | 'md' | 'lg'
  className?: string
}

const gapMap = { sm: '0.5rem', md: '1rem', lg: '1.5rem' }

export function Gallery({ images, columns = 3, gap = 'md', className }: GalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const closeLightbox = useCallback(() => setLightboxIndex(null), [])

  const goPrev = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length))
  }, [images.length])

  const goNext = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % images.length))
  }, [images.length])

  useEffect(() => {
    if (lightboxIndex === null) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') goNext()
      else if (e.key === 'ArrowLeft') goPrev()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [lightboxIndex, goNext, goPrev])

  const currentImage = lightboxIndex !== null ? images[lightboxIndex] : null

  return (
    <>
      <div
        className={cn('ds-gallery', className)}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: gapMap[gap],
        }}
      >
        {images.map((img, i) => (
          <div
            key={i}
            onClick={() => setLightboxIndex(i)}
            style={{
              position: 'relative',
              paddingBottom: '66.66%',
              overflow: 'hidden',
              borderRadius: 'var(--radius-lg)',
              cursor: 'pointer',
            }}
          >
            <img
              src={img.src}
              alt={img.alt}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform var(--duration-normal) var(--ease-out)',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.06)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)' }}
            />
            {img.caption && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '0.4rem 0.6rem',
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-base)',
                }}
              >
                {img.caption}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <Modal
        open={lightboxIndex !== null}
        onClose={closeLightbox}
        size="lg"
        title={currentImage?.caption}
      >
        {currentImage && (
          <div style={{ position: 'relative', textAlign: 'center' }}>
            <img
              src={currentImage.src}
              alt={currentImage.alt}
              style={{ maxWidth: '100%', maxHeight: '60vh', borderRadius: 'var(--radius-base)', objectFit: 'contain' }}
            />
            {images.length > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
                <button
                  aria-label="Previous image"
                  onClick={goPrev}
                  style={{
                    background: 'var(--color-default)',
                    border: 'none',
                    borderRadius: 'var(--radius-base)',
                    color: 'var(--color-gray-300)',
                    padding: '0.4rem 1rem',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-base)',
                    fontSize: '0.85rem',
                  }}
                >
                  ← Prev
                </button>
                <span style={{ color: 'var(--color-gray-600)', fontFamily: 'var(--font-base)', fontSize: '0.8rem', alignSelf: 'center' }}>
                  {(lightboxIndex ?? 0) + 1} / {images.length}
                </span>
                <button
                  aria-label="Next image"
                  onClick={goNext}
                  style={{
                    background: 'var(--color-default)',
                    border: 'none',
                    borderRadius: 'var(--radius-base)',
                    color: 'var(--color-gray-300)',
                    padding: '0.4rem 1rem',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-base)',
                    fontSize: '0.85rem',
                  }}
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  )
}
