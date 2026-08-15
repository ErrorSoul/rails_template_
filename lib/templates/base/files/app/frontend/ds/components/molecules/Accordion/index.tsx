import React, { useState } from 'react'
import { cn } from '../../../utils/cn'

export interface AccordionItem {
  id: string
  title: string
  content: React.ReactNode
  icon?: React.ReactNode
  disabled?: boolean
}

export interface AccordionProps {
  items: AccordionItem[]
  multiple?: boolean
  defaultOpen?: string[]
  className?: string
}

export function Accordion({
  items,
  multiple = false,
  defaultOpen = [],
  className,
}: AccordionProps) {
  const [openIds, setOpenIds] = useState<string[]>(defaultOpen)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id)
      }
      if (multiple) {
        return [...prev, id]
      }
      return [id]
    })
  }

  return (
    <div
      className={cn('ds-accordion', className)}
      style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-base)',
        overflow: 'hidden',
        fontFamily: 'var(--font-base)',
      }}
    >
      {items.map((item, index) => {
        const isOpen = openIds.includes(item.id)
        const isHovered = hoveredId === item.id
        const isDisabled = item.disabled === true

        return (
          <div
            key={item.id}
            style={{
              borderTop: index > 0 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            }}
          >
            <div
              role="button"
              aria-expanded={isOpen}
              aria-controls={`accordion-content-${item.id}`}
              aria-disabled={isDisabled}
              tabIndex={isDisabled ? -1 : 0}
              onClick={() => {
                if (!isDisabled) toggle(item.id)
              }}
              onKeyDown={(e) => {
                if (!isDisabled && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault()
                  toggle(item.id)
                }
              }}
              onMouseEnter={() => !isDisabled && setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.25rem',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                opacity: isDisabled ? 0.5 : 1,
                background: isHovered ? 'rgba(var(--color-accent-rgb), 0.05)' : 'transparent',
                transition: 'background var(--duration-fast) ease',
                userSelect: 'none',
              }}
            >
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: 'var(--color-gray-200)',
                  fontSize: 'var(--font-size-base)',
                  fontWeight: 500,
                }}
              >
                {item.icon && (
                  <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                )}
                {item.title}
              </span>
              <span
                style={{
                  color: isOpen ? 'var(--color-info)' : 'var(--color-gray-500)',
                  fontSize: '0.85rem',
                  transition: 'color var(--duration-fast) ease, transform var(--duration-normal) var(--ease-out)',
                  transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                  display: 'inline-block',
                  lineHeight: 1,
                }}
              >
                ▸
              </span>
            </div>
            {isOpen && (
              <div
                id={`accordion-content-${item.id}`}
                style={{
                  padding: '0 1.25rem 1rem',
                  color: 'var(--color-gray-400)',
                  fontSize: 'var(--font-size-base)',
                  lineHeight: 1.6,
                  animation: 'ds-slide-down var(--duration-normal) var(--ease-out)',
                }}
              >
                {item.content}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
