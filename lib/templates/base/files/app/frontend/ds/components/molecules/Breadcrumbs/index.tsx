import React, { useState } from 'react'
import { cn } from '../../../utils/cn'

export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ReactNode
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  separator?: React.ReactNode
  className?: string
}

interface LinkItemProps {
  item: BreadcrumbItem
  isCurrent: boolean
}

function LinkItem({ item, isCurrent }: LinkItemProps) {
  const [hovered, setHovered] = useState(false)

  if (isCurrent) {
    return (
      <span
        aria-current="page"
        style={{
          color: 'var(--color-gray-300)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          fontSize: 'var(--font-size-sm)',
        }}
      >
        {item.icon && <span>{item.icon}</span>}
        {item.label}
      </span>
    )
  }

  if (item.href) {
    return (
      <a
        href={item.href}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          color: hovered ? 'var(--color-gray-200)' : 'var(--color-info)',
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          fontSize: 'var(--font-size-sm)',
          transition: 'color 0.15s',
        }}
      >
        {item.icon && <span>{item.icon}</span>}
        {item.label}
      </a>
    )
  }

  return (
    <span
      style={{
        color: 'var(--color-gray-500)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        fontSize: 'var(--font-size-sm)',
      }}
    >
      {item.icon && <span>{item.icon}</span>}
      {item.label}
    </span>
  )
}

export function Breadcrumbs({ items, separator = '/', className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn(className)}>
      <ol
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          listStyle: 'none',
          margin: 0,
          padding: 0,
        }}
      >
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1
          return (
            <li
              key={index}
              style={{ display: 'inline-flex', alignItems: 'center' }}
            >
              <LinkItem item={item} isCurrent={isCurrent} />
              {!isCurrent && (
                <span
                  aria-hidden="true"
                  style={{
                    color: 'var(--color-gray-600)',
                    margin: '0 0.5rem',
                    fontSize: '0.7rem',
                  }}
                >
                  {separator}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
