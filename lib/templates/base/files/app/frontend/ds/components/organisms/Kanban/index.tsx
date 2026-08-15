import React from 'react'
import { cn } from '../../../utils/cn'
import { Tag } from '../../atoms/Tag'
import { Avatar } from '../../atoms/Avatar'

export interface KanbanCard {
  id: string
  title: string
  description?: string
  tags?: string[]
  assignee?: { name: string; avatar?: string }
  priority?: 'low' | 'medium' | 'high'
}

export interface KanbanColumn {
  id: string
  title: string
  cards: KanbanCard[]
  color?: string
}

export interface KanbanProps {
  columns: KanbanColumn[]
  onCardClick?: (card: KanbanCard) => void
  onAddCard?: (columnId: string) => void
  className?: string
}

const priorityColor: Record<'low' | 'medium' | 'high', string> = {
  low:    'var(--color-success)',
  medium: 'var(--color-warning)',
  high:   'var(--color-danger)',
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function KanbanCardItem({
  card,
  onClick,
}: {
  card: KanbanCard
  onClick?: () => void
}) {
  const [hovered, setHovered] = React.useState(false)

  return (
    <div
      data-testid="kanban-card"
      data-card-id={card.id}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--color-bg)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid rgba(255,255,255,0.07)',
        padding: '0.75rem',
        cursor: onClick ? 'pointer' : 'default',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hovered ? 'var(--shadow-lg)' : 'var(--shadow-base)',
        transition: 'transform var(--duration-normal) var(--ease-out), box-shadow var(--duration-normal) var(--ease-out)',
        fontFamily: 'var(--font-base)',
        ...(card.priority
          ? { borderLeft: `3px solid ${priorityColor[card.priority]}` }
          : {}),
      }}
    >
      {/* Tags */}
      {card.tags && card.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.4rem' }}>
          {card.tags.map((t) => (
            <Tag key={t} label={t} size="sm" variant="primary" />
          ))}
        </div>
      )}

      {/* Title */}
      <p
        data-testid="card-title"
        style={{
          margin: '0 0 0.3rem',
          fontSize: '0.875rem',
          fontWeight: 600,
          color: 'var(--color-gray-100)',
          lineHeight: 1.4,
        }}
      >
        {card.title}
      </p>

      {/* Description */}
      {card.description && (
        <p
          style={{
            margin: '0 0 0.5rem',
            fontSize: '0.78rem',
            color: 'var(--color-gray-600)',
            lineHeight: 1.4,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {card.description}
        </p>
      )}

      {/* Footer: assignee + priority */}
      {(card.assignee || card.priority) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
          {card.assignee && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Avatar
                src={card.assignee.avatar}
                size="sm"
                initials={card.assignee.name[0].toUpperCase()}
                alt={card.assignee.name}
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--color-gray-500)' }}>
                {card.assignee.name}
              </span>
            </div>
          )}
          {card.priority && (
            <span
              data-testid="priority-indicator"
              data-priority={card.priority}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: priorityColor[card.priority],
                flexShrink: 0,
              }}
            />
          )}
        </div>
      )}
    </div>
  )
}

export function Kanban({ columns, onCardClick, onAddCard, className }: KanbanProps) {
  return (
    <div
      data-testid="kanban"
      className={cn('ds-kanban', className)}
      style={{
        display: 'flex',
        gap: '1rem',
        overflowX: 'auto',
        alignItems: 'flex-start',
        padding: '0.25rem',
        fontFamily: 'var(--font-base)',
      }}
    >
      {columns.map((col) => (
        <div
          key={col.id}
          data-testid="kanban-column"
          data-column-id={col.id}
          style={{
            flexShrink: 0,
            width: 280,
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid rgba(255,255,255,0.06)',
            overflow: 'hidden',
          }}
        >
          {/* Column header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              ...(col.color ? { borderTop: `3px solid ${col.color}` } : {}),
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span
                data-testid="column-title"
                style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-gray-200)' }}
              >
                {col.title}
              </span>
              <span
                data-testid="column-count"
                style={{
                  fontSize: '0.72rem',
                  color: 'var(--color-gray-600)',
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.05rem 0.4rem',
                  fontWeight: 600,
                }}
              >
                {col.cards.length}
              </span>
            </div>

            {onAddCard && (
              <button
                type="button"
                data-testid="add-card-btn"
                data-column-id={col.id}
                onClick={() => onAddCard(col.id)}
                aria-label={`Add card to ${col.title}`}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-gray-600)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.2rem',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'color var(--duration-fast)',
                }}
              >
                <PlusIcon />
              </button>
            )}
          </div>

          {/* Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.75rem' }}>
            {col.cards.map((card) => (
              <KanbanCardItem
                key={card.id}
                card={card}
                onClick={onCardClick ? () => onCardClick(card) : undefined}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
