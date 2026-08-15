import React from 'react'
import { cn } from '../../../utils/cn'

export type AvatarSize = 'sm' | 'md' | 'lg'

export interface AvatarProps {
  src?: string
  alt?: string
  size?: AvatarSize
  initials?: string
  className?: string
}

const sizeMap: Record<AvatarSize, number> = {
  sm: 32,
  md: 48,
  lg: 64,
}

const fontSizeMap: Record<AvatarSize, string> = {
  sm: '0.75rem',
  md: '1rem',
  lg: '1.375rem',
}

export function Avatar({
  src,
  alt = 'avatar',
  size = 'md',
  initials,
  className,
}: AvatarProps) {
  const px = sizeMap[size]

  const baseStyle: React.CSSProperties = {
    width: px,
    height: px,
    borderRadius: '50%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    overflow: 'hidden',
  }

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        width={px}
        height={px}
        className={cn('ds-avatar', className)}
        data-size={size}
        style={{
          ...baseStyle,
          objectFit: 'cover',
          boxShadow: 'var(--shadow-raised)',
        }}
      />
    )
  }

  if (initials) {
    return (
      <span
        className={cn('ds-avatar', className)}
        data-size={size}
        aria-label={alt}
        style={{
          ...baseStyle,
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-white)',
          fontFamily: 'var(--font-base)',
          fontSize: fontSizeMap[size],
          fontWeight: 600,
          textTransform: 'uppercase',
          userSelect: 'none',
        }}
      >
        {initials.slice(0, 2)}
      </span>
    )
  }

  // Placeholder: gray circle
  return (
    <span
      className={cn('ds-avatar', className)}
      data-size={size}
      aria-label={alt}
      style={{
        ...baseStyle,
        backgroundColor: 'var(--color-default)',
      }}
    >
      <svg
        width={px * 0.5}
        height={px * 0.5}
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--color-gray-500)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    </span>
  )
}
