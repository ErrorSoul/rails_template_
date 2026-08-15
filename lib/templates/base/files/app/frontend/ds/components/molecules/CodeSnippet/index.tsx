import React, { useState } from 'react'
import { cn } from '../../../utils/cn'

export interface CodeSnippetProps {
  code: string
  language?: string
  title?: string
  showLineNumbers?: boolean
  maxHeight?: string
  className?: string
}

function CopyIcon() {
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

export function CodeSnippet({
  code,
  language,
  title,
  showLineNumbers = false,
  maxHeight,
  className,
}: CodeSnippetProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard not available
    }
  }

  const lines = code.split('\n')

  return (
    <div
      data-testid="code-snippet"
      className={cn('ds-code-snippet', className)}
      style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid rgba(255,255,255,0.08)',
        overflow: 'hidden',
        fontFamily: 'var(--font-base)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.5rem 0.875rem',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          minHeight: '2.25rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {title && (
            <span data-testid="snippet-title" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-gray-300)' }}>
              {title}
            </span>
          )}
          {language && (
            <span data-testid="snippet-language" style={{ fontSize: '0.7rem', color: 'var(--color-gray-600)', background: 'rgba(255,255,255,0.06)', padding: '0.1rem 0.4rem', borderRadius: 'var(--radius-sm)' }}>
              {language}
            </span>
          )}
        </div>
        <button
          type="button"
          data-testid="snippet-copy"
          onClick={handleCopy}
          aria-label={copied ? 'Copied' : 'Copy code'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: copied ? 'var(--color-success)' : 'var(--color-gray-500)',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-base)',
            padding: '0.2rem 0.4rem',
            borderRadius: 'var(--radius-sm)',
            transition: 'color var(--duration-fast)',
          }}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Code area */}
      <div
        style={{
          overflowX: 'auto',
          overflowY: maxHeight ? 'auto' : 'visible',
          maxHeight,
          // thin scrollbar styling via CSS class
        }}
      >
        <pre
          data-testid="snippet-pre"
          style={{
            margin: 0,
            padding: '0.875rem',
            fontFamily: 'var(--font-mono, "Fira Code", "Cascadia Code", monospace)',
            fontSize: '0.82rem',
            lineHeight: 1.6,
            color: 'var(--color-gray-200)',
            whiteSpace: 'pre',
            display: showLineNumbers ? 'flex' : 'block',
            gap: showLineNumbers ? '0' : undefined,
          }}
        >
          {showLineNumbers ? (
            <>
              {/* Line number gutter */}
              <span
                data-testid="line-numbers"
                aria-hidden="true"
                style={{
                  userSelect: 'none',
                  color: 'var(--color-gray-700)',
                  textAlign: 'right',
                  paddingRight: '1rem',
                  borderRight: '1px solid rgba(255,255,255,0.06)',
                  marginRight: '1rem',
                  minWidth: `${String(lines.length).length + 1}ch`,
                }}
              >
                {lines.map((_, i) => (
                  <span key={i} style={{ display: 'block' }}>{i + 1}</span>
                ))}
              </span>
              <code style={{ flex: 1 }}>{code}</code>
            </>
          ) : (
            <code>{code}</code>
          )}
        </pre>
      </div>
    </div>
  )
}
