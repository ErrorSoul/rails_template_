import React from 'react'
import { cn } from '../../../utils/cn'
import { Avatar } from '../../atoms/Avatar'
import type { AvatarSize } from '../../atoms/Avatar'

export interface AvatarItem {
  src?: string
  initials?: string
  alt?: string
}

export interface AvatarGroupProps {
  avatars: AvatarItem[]
  max?: number
  size?: AvatarSize
  className?: string
}

const overlapMap: Record<AvatarSize, number> = {
  sm: 10,
  md: 14,
  lg: 20,
}

const sizeMap: Record<AvatarSize, number> = {
  sm: 32,
  md: 48,
  lg: 64,
}

export function AvatarGroup({
  avatars,
  max = 4,
  size = 'md',
  className,
}: AvatarGroupProps) {
  const visible = avatars.slice(0, max)
  const overflow = avatars.length - visible.length
  const overlap = overlapMap[size]
  const px = sizeMap[size]

  return (
    <div
      className={cn('ds-avatar-group', className)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        fontFamily: 'var(--font-base)',
      }}
    >
      {visible.map((avatar, index) => (
        <div
          key={index}
          style={{
            marginLeft: index === 0 ? 0 : -overlap,
            zIndex: visible.length - index,
            position: 'relative',
            borderRadius: '50%',
            border: '2px solid var(--color-bg)',
            lineHeight: 0,
          }}
        >
          <Avatar
            src={avatar.src}
            initials={avatar.initials}
            alt={avatar.alt ?? `Avatar ${index + 1}`}
            size={size}
          />
        </div>
      ))}

      {overflow > 0 && (
        <div
          style={{
            marginLeft: -overlap,
            zIndex: 0,
            position: 'relative',
            width: px,
            height: px,
            borderRadius: '50%',
            border: '2px solid var(--color-bg)',
            background: 'var(--color-surface-alt)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-gray-300)',
            fontSize: size === 'lg' ? '1rem' : size === 'sm' ? '0.65rem' : '0.8rem',
            fontWeight: 600,
            userSelect: 'none',
          }}
          aria-label={`${overflow} more`}
        >
          +{overflow}
        </div>
      )}
    </div>
  )
}
