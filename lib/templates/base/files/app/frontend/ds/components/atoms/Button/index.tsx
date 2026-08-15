import React, { useState } from 'react'
import { cn } from '../../../utils/cn'

export type ButtonVariant = 'primary' | 'info' | 'success' | 'warning' | 'danger' | 'default'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  outline?: boolean
  disabled?: boolean
  fullWidth?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const gradients: Record<ButtonVariant, string> = {
  primary: 'var(--gradient-primary)',
  info:    'var(--gradient-info)',
  success: 'var(--gradient-success)',
  warning: 'var(--gradient-warning)',
  danger:  'var(--gradient-danger)',
  default: 'var(--gradient-default)',
}

const outlineColors: Record<ButtonVariant, string> = {
  primary: 'var(--color-primary)',
  info:    'var(--color-info)',
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  danger:  'var(--color-danger)',
  default: 'var(--color-default)',
}

const sizePadding: Record<ButtonSize, string> = {
  sm: '0.25rem 0.75rem',
  md: '0.5rem 1.5rem',
  lg: '0.75rem 2rem',
}

const sizeFontSize: Record<ButtonSize, string> = {
  sm: '0.75rem',
  md: '0.875rem',
  lg: '1rem',
}

export function Button({
  variant = 'primary',
  size = 'md',
  outline = false,
  disabled = false,
  fullWidth = false,
  onClick,
  children,
  className,
  style: styleProp,
}: ButtonProps) {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)
  const color = outlineColors[variant]

  const style: React.CSSProperties = {
    borderRadius: '30px',
    padding: sizePadding[size],
    fontSize: sizeFontSize[size],
    fontFamily: 'var(--font-base)',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    border: outline ? `2px solid ${color}` : 'none',
    background: outline ? 'transparent' : gradients[variant],
    color: outline ? color : 'var(--color-white)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    transition: 'transform var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out), opacity 0.15s ease',
    boxShadow: hovered && !disabled
      ? 'var(--shadow-lg)'
      : outline ? 'none' : 'var(--shadow-raised)',
    transform: pressed && !disabled
      ? 'scale(0.97)'
      : hovered && !disabled
      ? 'scale(1.02)'
      : 'scale(1)',
    display: fullWidth ? 'block' : 'inline-block',
    width: fullWidth ? '100%' : undefined,
    lineHeight: 1.4,
    ...styleProp,
  }

  return (
    <button
      style={style}
      className={cn('btn', className)}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false) }}
      onMouseDown={() => !disabled && setPressed(true)}
      onMouseUp={() => setPressed(false)}
      data-variant={variant}
      data-size={size}
    >
      {children}
    </button>
  )
}
