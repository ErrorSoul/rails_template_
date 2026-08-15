import React, { useState } from 'react'
import { cn } from '../../../utils/cn'

export interface SocialButtonProps {
  provider: 'google' | 'github' | 'apple' | 'twitter'
  onClick?: () => void
  fullWidth?: boolean
  disabled?: boolean
  className?: string
}

const providerConfig: Record<
  SocialButtonProps['provider'],
  { label: string; bg: string; hoverBg: string; color: string; icon: React.ReactNode }
> = {
  google: {
    label: 'Continue with Google',
    bg: '#ffffff',
    hoverBg: '#f1f1f1',
    color: '#1f1f1f',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 0 0 1 12c0 1.82.41 3.54 1.18 5.07l3.66-2.98z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      </svg>
    ),
  },
  github: {
    label: 'Continue with GitHub',
    bg: '#24292e',
    hoverBg: '#2f363d',
    color: '#ffffff',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  apple: {
    label: 'Continue with Apple',
    bg: '#000000',
    hoverBg: '#1a1a1a',
    color: '#ffffff',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.32 2.32-2.15 4.27-3.74 4.25z" />
      </svg>
    ),
  },
  twitter: {
    label: 'Continue with Twitter',
    bg: '#1DA1F2',
    hoverBg: '#0d8ddb',
    color: '#ffffff',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733a4.67 4.67 0 0 0 2.048-2.578 9.3 9.3 0 0 1-2.958 1.13 4.66 4.66 0 0 0-7.938 4.25 13.229 13.229 0 0 1-9.602-4.868c-.4.69-.63 1.49-.63 2.342A4.66 4.66 0 0 0 3.96 9.824a4.647 4.647 0 0 1-2.11-.583v.06a4.66 4.66 0 0 0 3.737 4.568 4.692 4.692 0 0 1-2.104.08 4.661 4.661 0 0 0 4.352 3.234 9.348 9.348 0 0 1-5.786 1.995 9.5 9.5 0 0 1-1.112-.065 13.175 13.175 0 0 0 7.14 2.093c8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602a9.47 9.47 0 0 0 2.323-2.41l.002-.003z" />
      </svg>
    ),
  },
}

export function SocialButton({
  provider,
  onClick,
  fullWidth = false,
  disabled = false,
  className,
}: SocialButtonProps) {
  const [hovered, setHovered] = useState(false)
  const config = providerConfig[provider]

  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={cn('ds-social-button', className)}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        width: fullWidth ? '100%' : undefined,
        height: '44px',
        padding: '0 1.25rem',
        borderRadius: 'var(--radius-base)',
        border: provider === 'google' ? '1px solid #dadce0' : '1px solid transparent',
        background: hovered && !disabled ? config.hoverBg : config.bg,
        color: config.color,
        fontSize: '0.875rem',
        fontFamily: 'var(--font-base)',
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'background var(--duration-fast) ease, transform var(--duration-fast) ease',
        transform: hovered && !disabled ? 'scale(1.01)' : 'scale(1)',
        boxSizing: 'border-box',
        lineHeight: 1,
      }}
    >
      {config.icon}
      <span>{config.label}</span>
    </button>
  )
}
