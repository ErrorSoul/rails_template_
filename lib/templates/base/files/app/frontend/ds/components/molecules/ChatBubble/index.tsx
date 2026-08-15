import React from 'react'
import { cn } from '../../../utils/cn'
import { Avatar } from '../../atoms/Avatar'

export interface ChatBubbleProps {
  message: string
  sender: 'user' | 'other'
  avatar?: string
  name?: string
  timestamp?: string
  status?: 'sent' | 'delivered' | 'read'
  className?: string
}

function SentIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function DeliveredIcon() {
  return (
    <svg width="16" height="14" viewBox="0 0 28 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
      <polyline points="26 6 15 17 12 14" />
    </svg>
  )
}

export function ChatBubble({
  message,
  sender,
  avatar,
  name,
  timestamp,
  status,
  className,
}: ChatBubbleProps) {
  const isUser = sender === 'user'

  const bubbleStyle: React.CSSProperties = isUser
    ? {
        background: 'var(--color-info)',
        color: '#fff',
        borderRadius: 'var(--radius-xl) var(--radius-sm) var(--radius-xl) var(--radius-xl)',
      }
    : {
        background: 'var(--color-surface)',
        color: 'var(--color-gray-200)',
        borderRadius: 'var(--radius-sm) var(--radius-xl) var(--radius-xl) var(--radius-xl)',
        border: '1px solid rgba(255,255,255,0.07)',
      }

  function StatusIcon() {
    if (!status) return null
    const color = status === 'read' ? 'var(--color-info)' : 'var(--color-gray-500)'
    return (
      <span data-testid="status-icon" data-status={status} style={{ color, display: 'inline-flex', alignItems: 'center' }}>
        {status === 'sent' ? <SentIcon /> : <DeliveredIcon />}
      </span>
    )
  }

  return (
    <div
      data-testid="chat-bubble"
      data-sender={sender}
      className={cn('ds-chat-bubble', className)}
      style={{
        display: 'flex',
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-end',
        gap: '0.5rem',
        marginBottom: '0.75rem',
        fontFamily: 'var(--font-base)',
      }}
    >
      {/* Avatar */}
      <Avatar
        src={avatar}
        size="sm"
        initials={!avatar ? (name ? name[0].toUpperCase() : undefined) : undefined}
        alt={name ?? sender}
      />

      {/* Content */}
      <div
        style={{
          maxWidth: '70%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: isUser ? 'flex-end' : 'flex-start',
          gap: '0.2rem',
        }}
      >
        {/* Name + timestamp */}
        {(name || timestamp) && (
          <div
            data-testid="bubble-meta"
            style={{
              display: 'flex',
              gap: '0.4rem',
              alignItems: 'center',
              fontSize: '0.72rem',
              color: 'var(--color-gray-600)',
            }}
          >
            {name && <span data-testid="bubble-name">{name}</span>}
            {timestamp && <span data-testid="bubble-timestamp">{timestamp}</span>}
          </div>
        )}

        {/* Bubble */}
        <div
          data-testid="bubble-content"
          style={{
            ...bubbleStyle,
            padding: '0.55rem 0.85rem',
            fontSize: '0.875rem',
            lineHeight: 1.5,
            wordBreak: 'break-word',
          }}
        >
          {message}
        </div>

        {/* Status icon (user only) */}
        {isUser && status && (
          <div style={{ paddingRight: '0.25rem' }}>
            <StatusIcon />
          </div>
        )}
      </div>
    </div>
  )
}
