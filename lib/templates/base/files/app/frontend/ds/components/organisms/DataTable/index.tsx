import React, { useState, useMemo, useEffect } from 'react'
import { cn } from '../../../utils/cn'
import { Table } from '../Table'
import type { TableColumn } from '../Table'
import { Input } from '../../atoms/Input'
import { Pagination } from '../../atoms/Pagination'

export interface DataTableColumn<T = Record<string, unknown>> extends TableColumn<T> {
  sortable?: boolean
}

type SortDirection = 'asc' | 'desc' | null

export interface DataTableProps<T = Record<string, unknown>> {
  columns: DataTableColumn<T>[]
  data: T[]
  pageSize?: number
  searchable?: boolean
  searchPlaceholder?: string
  emptyText?: string
  className?: string
}

function SortArrow({ direction }: { direction: SortDirection }) {
  const activeColor = 'var(--color-info)'
  const inactiveColor = 'var(--color-gray-600)'

  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      style={{ marginLeft: '4px', flexShrink: 0 }}
      aria-hidden="true"
    >
      {/* Up arrow */}
      <path
        d="M6 1L10 5H2L6 1Z"
        fill={direction === 'asc' ? activeColor : inactiveColor}
      />
      {/* Down arrow */}
      <path
        d="M6 11L2 7H10L6 11Z"
        fill={direction === 'desc' ? activeColor : inactiveColor}
      />
    </svg>
  )
}

export function DataTable<T extends Record<string, unknown> = Record<string, unknown>>({
  columns,
  data,
  pageSize = 10,
  searchable = false,
  searchPlaceholder = 'Поиск...',
  emptyText = 'Нет данных',
  className,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [hoveredSortKey, setHoveredSortKey] = useState<string | null>(null)

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') setSortDirection('desc')
      else if (sortDirection === 'desc') {
        setSortDirection(null)
        setSortKey(null)
      }
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  const filteredData = useMemo(() => {
    if (!searchable || !searchQuery.trim()) return data
    const q = searchQuery.toLowerCase()
    return data.filter((row) =>
      columns.some((col) => {
        const val = row[col.key]
        return val != null && String(val).toLowerCase().includes(q)
      })
    )
  }, [data, searchQuery, searchable, columns])

  const sortedData = useMemo(() => {
    if (!sortKey || !sortDirection) return filteredData
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]
      let result = 0
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        result = aVal - bVal
      } else {
        result = String(aVal ?? '').localeCompare(String(bVal ?? ''))
      }
      return sortDirection === 'asc' ? result : -result
    })
  }, [filteredData, sortKey, sortDirection])

  const totalPages = pageSize > 0 ? Math.ceil(sortedData.length / pageSize) : 1
  const paginatedData = useMemo(() => {
    if (pageSize <= 0) return sortedData
    return sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  }, [sortedData, currentPage, pageSize])

  const transformedColumns: TableColumn<T>[] = columns.map((col) => {
    if (!col.sortable) return col as TableColumn<T>
    const titleNode = (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          userSelect: 'none',
          borderRadius: '4px',
          padding: '2px 4px',
          margin: '-2px -4px',
          background: hoveredSortKey === col.key ? 'rgba(225,78,202,0.1)' : 'transparent',
          transition: 'var(--transition-base)',
        }}
        onClick={() => handleSort(col.key)}
        onMouseEnter={() => setHoveredSortKey(col.key)}
        onMouseLeave={() => setHoveredSortKey(null)}
        data-sort-key={col.key}
        data-sort-direction={sortKey === col.key ? sortDirection : null}
      >
        {col.title}
        <SortArrow direction={sortKey === col.key ? sortDirection : null} />
      </div>
    )
    const title = titleNode as unknown as string
    return { ...col, title } as TableColumn<T>
  })

  const start = pageSize > 0 ? (currentPage - 1) * pageSize + 1 : 1
  const end = pageSize > 0 ? Math.min(currentPage * pageSize, sortedData.length) : sortedData.length
  const total = sortedData.length

  return (
    <div
      className={cn('ds-datatable', className)}
      style={{ fontFamily: 'var(--font-base)' }}
    >
      {searchable && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '1rem',
            padding: '0 1rem',
          }}
        >
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ maxWidth: '280px' } as React.CSSProperties}
          />
        </div>
      )}

      <Table
        columns={transformedColumns}
        data={paginatedData}
        striped
        hoverable
        emptyText={emptyText}
      />

      {pageSize > 0 && totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.75rem 1rem',
          }}
        >
          <span style={{ color: 'var(--color-gray-500)', fontSize: '0.8rem' }}>
            Показано {start}–{end} из {total}
          </span>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  )
}
