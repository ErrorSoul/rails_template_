import React from 'react'
import { cn } from '../../../utils/cn'

export type TypographyVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'small' | 'caption'
export type TypographyColor = 'primary' | 'info' | 'success' | 'warning' | 'danger' | 'white' | 'muted'

export interface TypographyProps {
  variant?: TypographyVariant
  color?: TypographyColor
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const tagMap: Record<TypographyVariant, keyof React.JSX.IntrinsicElements> = {
  h1:      'h1',
  h2:      'h2',
  h3:      'h3',
  h4:      'h4',
  body:    'p',
  small:   'small',
  caption: 'span',
}

const fontSizeMap: Record<TypographyVariant, string> = {
  h1:      '2.25rem',
  h2:      '1.75rem',
  h3:      '1.375rem',
  h4:      '1.125rem',
  body:    'var(--font-size-base)',
  small:   'var(--font-size-sm)',
  caption: 'var(--font-size-xs)',
}

const fontWeightMap: Record<TypographyVariant, number> = {
  h1:      700,
  h2:      700,
  h3:      600,
  h4:      600,
  body:    400,
  small:   400,
  caption: 400,
}

const colorMap: Record<TypographyColor, string> = {
  primary: 'var(--color-primary)',
  info:    'var(--color-info)',
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  danger:  'var(--color-danger)',
  white:   'var(--color-white)',
  muted:   'var(--color-gray-500)',
}

export function Typography({
  variant = 'body',
  color = 'white',
  children,
  className,
  style: styleProp,
}: TypographyProps) {
  const Tag = tagMap[variant]

  return (
    <Tag
      className={cn('ds-typography', className)}
      data-variant={variant}
      data-color={color}
      style={{
        fontFamily: 'var(--font-base)',
        fontSize: fontSizeMap[variant],
        fontWeight: fontWeightMap[variant],
        color: colorMap[color],
        margin: 0,
        lineHeight: variant.startsWith('h') ? 1.2 : 1.6,
        ...styleProp,
      }}
    >
      {children}
    </Tag>
  )
}
