import React from 'react'
import { cn } from '../../../utils/cn'

export type NotificationVariant = 'info' | 'success' | 'warning' | 'danger'

export interface Notification {
  id: string
  title: string
  message: string
  variant?: NotificationVariant
  timestamp?: string
  read?: boolean
}

export interface NotificationPanelProps {
  notifications?: Notification[]
  onMarkRead?: (id: string) => void
  onClear?: () => void
  className?: string
}

const variantColors: Record<NotificationVariant, string> = {
  info:    'var(--color-info)',
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  danger:  'var(--color-danger)',
}

const variantIcons: Record<NotificationVariant, string> = {
  info:    'ℹ',
  success: '✓',
  warning: '⚠',
  danger:  '✕',
}

export function NotificationPanel({
  notifications = [],
  onMarkRead,
  onClear,
  className,
}: NotificationPanelProps) {
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div
      className={cn('ds-notification-panel', className)}
      role="region"
      aria-label="Notifications"
      style={{
        width: '100%',
        maxWidth: '380px',
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--color-default)',
        boxShadow: 'var(--shadow-raised)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.875rem 1rem',
          borderBottom: '1px solid var(--color-default)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-base)',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--color-gray-200)',
            }}
          >
            Notifications
          </span>
          {unreadCount > 0 && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '18px',
                height: '18px',
                borderRadius: '9px',
                padding: '0 5px',
                background: 'var(--gradient-primary)',
                fontSize: '0.65rem',
                fontWeight: 700,
                color: '#fff',
                fontFamily: 'var(--font-base)',
              }}
            >
              {unreadCount}
            </span>
          )}
        </div>

        {onClear && notifications.length > 0 && (
          <button
            onClick={onClear}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-base)',
              fontSize: '0.72rem',
              color: 'var(--color-gray-600)',
              padding: '0.1rem 0.3rem',
              transition: 'var(--transition-base)',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--color-danger)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--color-gray-600)'
            }}
          >
            Clear all
          </button>
        )}
      </div>

      {/* Notification list */}
      <div
        style={{
          maxHeight: '360px',
          overflowY: 'auto',
        }}
      >
        {notifications.length === 0 ? (
          <div
            style={{
              padding: '2.5rem 1rem',
              textAlign: 'center',
              fontFamily: 'var(--font-base)',
              fontSize: '0.8rem',
              color: 'var(--color-gray-600)',
            }}
          >
            No notifications
          </div>
        ) : (
          notifications.map((notification) => {
            const variant = notification.variant ?? 'info'
            const color = variantColors[variant]
            const icon = variantIcons[variant]

            return (
              <div
                key={notification.id}
                className={cn('ds-notification-panel__item', !notification.read && 'ds-notification-panel__item--unread')}
                data-read={notification.read ? 'true' : 'false'}
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  padding: '0.875rem 1rem',
                  borderBottom: '1px solid var(--color-default)',
                  background: notification.read ? 'transparent' : `${color}08`,
                  cursor: onMarkRead && !notification.read ? 'pointer' : 'default',
                  transition: 'var(--transition-base)',
                }}
                onClick={() => {
                  if (!notification.read) onMarkRead?.(notification.id)
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    flexShrink: 0,
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: `${color}20`,
                    border: `1px solid ${color}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    color,
                    fontWeight: 700,
                    marginTop: '2px',
                  }}
                >
                  {icon}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: '0.5rem',
                      marginBottom: '0.2rem',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-base)',
                        fontSize: '0.8rem',
                        fontWeight: notification.read ? 500 : 600,
                        color: notification.read ? 'var(--color-gray-400)' : 'var(--color-gray-200)',
                      }}
                    >
                      {notification.title}
                    </span>
                    {!notification.read && (
                      <span
                        style={{
                          flexShrink: 0,
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: color,
                          marginTop: '4px',
                        }}
                      />
                    )}
                  </div>
                  <p
                    style={{
                      fontFamily: 'var(--font-base)',
                      fontSize: '0.75rem',
                      color: 'var(--color-gray-600)',
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    {notification.message}
                  </p>
                  {notification.timestamp && (
                    <span
                      style={{
                        fontFamily: 'var(--font-base)',
                        fontSize: '0.68rem',
                        color: 'var(--color-gray-600)',
                        marginTop: '0.25rem',
                        display: 'block',
                        opacity: 0.7,
                      }}
                    >
                      {notification.timestamp}
                    </span>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
