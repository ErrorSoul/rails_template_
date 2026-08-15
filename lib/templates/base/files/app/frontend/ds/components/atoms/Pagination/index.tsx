import React, { useState } from 'react'
import { cn } from '../../../utils/cn'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  siblingCount?: number
  compact?: boolean
  className?: string
}

export function getPageRange(
  currentPage: number,
  totalPages: number,
  siblingCount = 1
): (number | 'ellipsis')[] {
  if (totalPages <= 1) return [1]

  const range = (start: number, end: number): number[] =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i)

  const totalPageNumbers = siblingCount * 2 + 5 // siblings + current + 2 edges + 2 ellipsis

  if (totalPageNumbers >= totalPages) {
    return range(1, totalPages)
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages)

  const showLeftEllipsis = leftSiblingIndex > 2
  const showRightEllipsis = rightSiblingIndex < totalPages - 1

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftItemCount = 3 + 2 * siblingCount
    return [...range(1, leftItemCount), 'ellipsis', totalPages]
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightItemCount = 3 + 2 * siblingCount
    return [1, 'ellipsis', ...range(totalPages - rightItemCount + 1, totalPages)]
  }

  return [1, 'ellipsis', ...range(leftSiblingIndex, rightSiblingIndex), 'ellipsis', totalPages]
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  compact = false,
  className,
}: PaginationProps) {
  const [hoveredPage, setHoveredPage] = useState<number | string | null>(null)

  const pages = getPageRange(currentPage, totalPages, siblingCount)

  const buttonBase: React.CSSProperties = {
    width: '32px',
    height: '32px',
    borderRadius: '30px',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-base)',
    fontSize: '0.8rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'var(--transition-base)',
    flexShrink: 0,
  }

  const getPageStyle = (page: number): React.CSSProperties => {
    const isActive = page === currentPage
    const isHovered = hoveredPage === page

    return {
      ...buttonBase,
      background: isActive
        ? 'var(--gradient-info)'
        : isHovered
        ? 'rgba(var(--color-accent-rgb), 0.15)'
        : 'var(--color-surface-alt)',
      color: isActive ? 'var(--color-white)' : 'var(--color-gray-300)',
      boxShadow: isActive ? 'var(--shadow-raised)' : 'none',
    }
  }

  const getNavStyle = (disabled: boolean): React.CSSProperties => ({
    ...buttonBase,
    background: hoveredPage === (disabled ? null : 'prev' + (disabled ? '' : currentPage))
      ? 'rgba(var(--color-accent-rgb), 0.15)'
      : 'var(--color-surface-alt)',
    color: 'var(--color-gray-300)',
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
  })

  const prevDisabled = currentPage <= 1
  const nextDisabled = currentPage >= totalPages

  return (
    <nav
      aria-label="Pagination"
      className={cn('ds-pagination', className)}
      style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}
    >
      <button
        style={getNavStyle(prevDisabled)}
        disabled={prevDisabled}
        onClick={() => !prevDisabled && onPageChange(currentPage - 1)}
        onMouseEnter={() => !prevDisabled && setHoveredPage('prev')}
        onMouseLeave={() => setHoveredPage(null)}
        aria-label="Previous page"
      >
        ‹
      </button>

      {!compact &&
        pages.map((page, idx) =>
          page === 'ellipsis' ? (
            <span
              key={`ellipsis-${idx}`}
              style={{
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-gray-500)',
                fontSize: '0.8rem',
              }}
            >
              …
            </span>
          ) : (
            <button
              key={page}
              style={getPageStyle(page)}
              onClick={() => onPageChange(page)}
              onMouseEnter={() => setHoveredPage(page)}
              onMouseLeave={() => setHoveredPage(null)}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          )
        )}

      <button
        style={getNavStyle(nextDisabled)}
        disabled={nextDisabled}
        onClick={() => !nextDisabled && onPageChange(currentPage + 1)}
        onMouseEnter={() => !nextDisabled && setHoveredPage('next')}
        onMouseLeave={() => setHoveredPage(null)}
        aria-label="Next page"
      >
        ›
      </button>
    </nav>
  )
}
