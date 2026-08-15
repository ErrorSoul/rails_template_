import React from 'react'
import { cn } from '../../../utils/cn'

export interface TableColumn<T = Record<string, unknown>> {
  key: string
  title: string
  width?: string
  render?: (value: unknown, row: T, index: number) => React.ReactNode
}

export interface TableProps<T = Record<string, unknown>> {
  columns: TableColumn<T>[]
  data: T[]
  striped?: boolean
  hoverable?: boolean
  compact?: boolean
  emptyText?: string
  className?: string
}

export function Table<T extends Record<string, unknown> = Record<string, unknown>>({
  columns,
  data,
  striped = false,
  hoverable = true,
  compact = false,
  emptyText = 'Нет данных',
  className,
}: TableProps<T>) {
  const cellPadding = compact ? '0.5rem 0.75rem' : '0.75rem 1rem'

  return (
    <div
      className={cn('ds-table-wrapper', className)}
      style={{
        overflowX: 'auto',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid rgba(225,78,202,0.1)',
        background: 'var(--color-surface)',
        boxShadow: '0 0 20px rgba(0,0,0,0.15)',
      }}
    >
      <table
        className="ds-table"
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontFamily: 'var(--font-base)',
          fontSize: '0.875rem',
        }}
      >
        <thead>
          <tr
            className="ds-table__head-row"
            style={{
              background: 'linear-gradient(135deg, rgba(225,78,202,0.06) 0%, rgba(29,140,248,0.06) 100%)',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  padding: cellPadding,
                  textAlign: 'left',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--color-gray-400)',
                  whiteSpace: 'nowrap',
                  width: col.width,
                }}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  padding: '2rem 1rem',
                  textAlign: 'center',
                  color: 'var(--color-gray-600)',
                }}
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className={cn(
                  'ds-table__row',
                  striped && rowIdx % 2 === 1 && 'ds-table__row--striped'
                )}
                style={{
                  background:
                    striped && rowIdx % 2 === 1
                      ? 'rgba(255,255,255,0.02)'
                      : 'transparent',
                  borderBottom:
                    rowIdx < data.length - 1
                      ? '1px solid rgba(255,255,255,0.04)'
                      : 'none',
                  transition: hoverable ? 'var(--transition-base)' : undefined,
                }}
                onMouseEnter={
                  hoverable
                    ? (e) => {
                        ;(e.currentTarget as HTMLTableRowElement).style.background =
                          'rgba(225,78,202,0.05)'
                      }
                    : undefined
                }
                onMouseLeave={
                  hoverable
                    ? (e) => {
                        ;(e.currentTarget as HTMLTableRowElement).style.background =
                          striped && rowIdx % 2 === 1
                            ? 'rgba(255,255,255,0.02)'
                            : 'transparent'
                      }
                    : undefined
                }
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    style={{
                      padding: cellPadding,
                      color: 'var(--color-gray-300)',
                    }}
                  >
                    {col.render
                      ? col.render(row[col.key], row, rowIdx)
                      : (row[col.key] as React.ReactNode) ?? '—'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
