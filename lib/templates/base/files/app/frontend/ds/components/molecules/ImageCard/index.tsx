import { useState } from 'react'
import { cn } from '../../../utils/cn'

export interface ImageCardProps {
  image: string
  alt: string
  title: string
  description?: string
  badge?: string
  footer?: React.ReactNode
  aspectRatio?: '16:9' | '4:3' | '1:1'
  onClick?: () => void
  className?: string
}

const aspectMap: Record<string, string> = {
  '16:9': '56.25%',
  '4:3': '75%',
  '1:1': '100%',
}

export function ImageCard({
  image,
  alt,
  title,
  description,
  badge,
  footer,
  aspectRatio = '16:9',
  onClick,
  className,
}: ImageCardProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className={cn('ds-image-card', className)}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        boxShadow: hovered ? 'var(--shadow-lg)' : 'var(--shadow-base)',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'transform var(--duration-normal) var(--ease-out), box-shadow var(--duration-normal) var(--ease-out)',
        cursor: onClick ? 'pointer' : 'default',
        fontFamily: 'var(--font-base)',
      }}
    >
      {/* Image container */}
      <div
        style={{
          position: 'relative',
          paddingBottom: aspectMap[aspectRatio],
          overflow: 'hidden',
        }}
      >
        <img
          src={image}
          alt={alt}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform var(--duration-slow) var(--ease-out)',
          }}
        />
        {badge && (
          <span
            style={{
              position: 'absolute',
              top: '0.75rem',
              left: '0.75rem',
              background: 'var(--gradient-primary)',
              color: '#fff',
              fontSize: '0.7rem',
              fontWeight: 600,
              padding: '0.2rem 0.6rem',
              borderRadius: 'var(--radius-full)',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: 'var(--spacing-4)' }}>
        <p
          style={{
            margin: 0,
            fontSize: '0.95rem',
            fontWeight: 600,
            color: 'var(--color-gray-100)',
            marginBottom: description ? '0.35rem' : 0,
          }}
        >
          {title}
        </p>
        {description && (
          <p
            style={{
              margin: 0,
              fontSize: '0.8rem',
              color: 'var(--color-gray-500)',
              lineHeight: 1.5,
            }}
          >
            {description}
          </p>
        )}
      </div>

      {footer && (
        <div
          style={{
            borderTop: '1px solid var(--color-default)',
            padding: 'var(--spacing-3) var(--spacing-4)',
          }}
        >
          {footer}
        </div>
      )}
    </div>
  )
}
