import { useState } from 'react'
import { cn } from '../../../utils/cn'

export interface CopyButtonProps {
  text: string
  label?: string
  copiedLabel?: string
  timeout?: number
  size?: 'sm' | 'md'
  variant?: 'default' | 'ghost'
  className?: string
}

function ClipboardIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export function CopyButton({
  text,
  label = 'Copy',
  copiedLabel = 'Copied!',
  timeout = 2000,
  size = 'md',
  variant = 'default',
  className,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    if (copied) return
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), timeout)
    } catch {
      // clipboard not available in test env
    }
  }

  const isSmall = size === 'sm'
  const isGhost = variant === 'ghost'

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? copiedLabel : label}
      className={cn('ds-copy-button', className)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding: isSmall ? '0.25rem 0.6rem' : '0.4rem 0.85rem',
        fontSize: isSmall ? '0.75rem' : 'var(--font-size-sm)',
        fontFamily: 'var(--font-base)',
        fontWeight: 500,
        borderRadius: 'var(--radius-base)',
        border: isGhost ? 'none' : '1px solid var(--color-default)',
        background: copied
          ? 'rgba(var(--color-success-rgb, 62,207,142), 0.15)'
          : isGhost
          ? 'transparent'
          : 'var(--color-surface)',
        color: copied ? 'var(--color-success)' : 'var(--color-gray-300)',
        cursor: 'pointer',
        transition: 'background var(--duration-fast), color var(--duration-fast)',
        outline: 'none',
        whiteSpace: 'nowrap',
      }}
    >
      {copied ? <CheckIcon /> : <ClipboardIcon />}
      {copied ? copiedLabel : label}
    </button>
  )
}
