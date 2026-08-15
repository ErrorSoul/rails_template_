import React from 'react'
import { cn } from '../../../utils/cn'

export type SkeletonVariant = 'text' | 'circular' | 'rectangular'
export type SkeletonAnimation = 'pulse' | 'wave' | 'none'

export interface SkeletonProps {
  variant?: SkeletonVariant
  width?: string | number
  height?: string | number
  animation?: SkeletonAnimation
  className?: string
}

const keyframes = `
@keyframes ds-skeleton-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
@keyframes ds-skeleton-wave {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
`

let styleInjected = false
function injectStyles() {
  if (styleInjected || typeof document === 'undefined') return
  const style = document.createElement('style')
  style.textContent = keyframes
  document.head.appendChild(style)
  styleInjected = true
}

export function Skeleton({
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  className,
}: SkeletonProps) {
  injectStyles()

  const borderRadius =
    variant === 'circular'
      ? '50%'
      : variant === 'text'
      ? 'var(--radius-xs)'
      : 'var(--radius-sm)'

  const defaultWidth =
    variant === 'circular' ? '40px' : variant === 'rectangular' ? '100%' : '100%'
  const defaultHeight =
    variant === 'circular' ? '40px' : variant === 'rectangular' ? '120px' : '1em'

  const animationStyle: React.CSSProperties =
    animation === 'pulse'
      ? { animation: 'ds-skeleton-pulse 1.5s ease-in-out infinite' }
      : animation === 'wave'
      ? {
          backgroundImage:
            'linear-gradient(90deg, var(--color-surface) 25%, var(--color-surface-alt) 50%, var(--color-surface) 75%)',
          backgroundSize: '200% 100%',
          animation: 'ds-skeleton-wave 1.5s linear infinite',
        }
      : {}

  return (
    <span
      className={cn('ds-skeleton', className)}
      aria-hidden="true"
      style={{
        display: 'block',
        width: width !== undefined ? (typeof width === 'number' ? `${width}px` : width) : defaultWidth,
        height: height !== undefined ? (typeof height === 'number' ? `${height}px` : height) : defaultHeight,
        borderRadius,
        backgroundColor: animation === 'wave' ? undefined : 'var(--color-surface)',
        ...animationStyle,
      }}
    />
  )
}
