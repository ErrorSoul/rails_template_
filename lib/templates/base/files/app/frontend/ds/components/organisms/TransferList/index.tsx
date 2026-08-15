import React, { useState } from 'react'
import { cn } from '../../../utils/cn'

export interface TransferItem {
  id: string
  label: string
  disabled?: boolean
}

export interface TransferListProps {
  available: TransferItem[]
  selected: TransferItem[]
  onTransfer: (available: TransferItem[], selected: TransferItem[]) => void
  titles?: [string, string]
  searchable?: boolean
  className?: string
}

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

function ArrowLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  )
}

function ArrowsRightIcon() {
  return (
    <svg width="16" height="14" viewBox="0 0 28 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="2" y1="8" x2="16" y2="8" />
      <polyline points="10 2 16 8 10 14" />
      <line x1="2" y1="16" x2="16" y2="16" />
      <polyline points="10 10 16 16 10 22" />
    </svg>
  )
}

function ArrowsLeftIcon() {
  return (
    <svg width="16" height="14" viewBox="0 0 28 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="26" y1="8" x2="12" y2="8" />
      <polyline points="18 2 12 8 18 14" />
      <line x1="26" y1="16" x2="12" y2="16" />
      <polyline points="18 10 12 16 18 22" />
    </svg>
  )
}

interface ListPanelProps {
  title: string
  items: TransferItem[]
  checkedIds: Set<string>
  onCheck: (id: string) => void
  onCheckAll: () => void
  allChecked: boolean
  searchQuery: string
  onSearch: (q: string) => void
  searchable: boolean
  testId: string
}

function ListPanel({
  title,
  items,
  checkedIds,
  onCheck,
  onCheckAll,
  allChecked,
  searchQuery,
  onSearch,
  searchable,
  testId,
}: ListPanelProps) {
  const filtered = searchQuery
    ? items.filter((it) => it.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : items
  const enabledItems = filtered.filter((it) => !it.disabled)
  const allEnabled = enabledItems.length > 0 && enabledItems.every((it) => checkedIds.has(it.id))

  return (
    <div
      data-testid={testId}
      style={{
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-xl)',
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
          gap: '0.5rem',
          padding: '0.6rem 0.875rem',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <input
          type="checkbox"
          aria-label={`Select all in ${title}`}
          checked={allEnabled && allChecked}
          onChange={onCheckAll}
          data-testid={`${testId}-select-all`}
          style={{ cursor: 'pointer', accentColor: 'var(--color-info)' }}
        />
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-gray-200)', flex: 1 }}>
          {title}
          <span style={{ fontSize: '0.72rem', fontWeight: 400, color: 'var(--color-gray-600)', marginLeft: '0.3rem' }}>
            ({items.length})
          </span>
        </span>
      </div>

      {/* Search */}
      {searchable && (
        <div style={{ padding: '0.4rem 0.875rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <input
            type="text"
            placeholder="Search…"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            data-testid={`${testId}-search`}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.3rem 0.6rem',
              fontSize: '0.8rem',
              color: 'var(--color-gray-200)',
              fontFamily: 'var(--font-base)',
              outline: 'none',
            }}
          />
        </div>
      )}

      {/* Items */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0.4rem' }}>
        {filtered.map((item) => (
          <label
            key={item.id}
            data-testid="transfer-item"
            data-item-id={item.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              cursor: item.disabled ? 'not-allowed' : 'pointer',
              opacity: item.disabled ? 0.45 : 1,
              background: checkedIds.has(item.id) ? 'rgba(var(--color-accent-rgb, 0,168,255), 0.1)' : 'transparent',
              fontSize: '0.85rem',
              color: 'var(--color-gray-200)',
              transition: 'background var(--duration-fast)',
            }}
          >
            <input
              type="checkbox"
              checked={checkedIds.has(item.id)}
              disabled={item.disabled}
              onChange={() => !item.disabled && onCheck(item.id)}
              style={{ cursor: item.disabled ? 'not-allowed' : 'pointer', accentColor: 'var(--color-info)' }}
            />
            {item.label}
          </label>
        ))}
      </div>
    </div>
  )
}

export function TransferList({
  available,
  selected,
  onTransfer,
  titles = ['Available', 'Selected'],
  searchable = false,
  className,
}: TransferListProps) {
  const [leftChecked, setLeftChecked] = useState<Set<string>>(new Set())
  const [rightChecked, setRightChecked] = useState<Set<string>>(new Set())
  const [leftSearch, setLeftSearch] = useState('')
  const [rightSearch, setRightSearch] = useState('')

  function toggleCheck(side: 'left' | 'right', id: string) {
    if (side === 'left') {
      setLeftChecked((prev) => {
        const next = new Set(prev)
        next.has(id) ? next.delete(id) : next.add(id)
        return next
      })
    } else {
      setRightChecked((prev) => {
        const next = new Set(prev)
        next.has(id) ? next.delete(id) : next.add(id)
        return next
      })
    }
  }

  function checkAll(side: 'left' | 'right') {
    if (side === 'left') {
      const enabledIds = available.filter((i) => !i.disabled).map((i) => i.id)
      const allChecked = enabledIds.every((id) => leftChecked.has(id))
      setLeftChecked(allChecked ? new Set() : new Set(enabledIds))
    } else {
      const enabledIds = selected.filter((i) => !i.disabled).map((i) => i.id)
      const allChecked = enabledIds.every((id) => rightChecked.has(id))
      setRightChecked(allChecked ? new Set() : new Set(enabledIds))
    }
  }

  function moveRight() {
    const moving = available.filter((i) => leftChecked.has(i.id) && !i.disabled)
    if (!moving.length) return
    const movingIds = new Set(moving.map((i) => i.id))
    onTransfer(available.filter((i) => !movingIds.has(i.id)), [...selected, ...moving])
    setLeftChecked(new Set())
  }

  function moveLeft() {
    const moving = selected.filter((i) => rightChecked.has(i.id) && !i.disabled)
    if (!moving.length) return
    const movingIds = new Set(moving.map((i) => i.id))
    onTransfer([...available, ...moving], selected.filter((i) => !movingIds.has(i.id)))
    setRightChecked(new Set())
  }

  function moveAllRight() {
    const moving = available.filter((i) => !i.disabled)
    if (!moving.length) return
    onTransfer(available.filter((i) => i.disabled), [...selected, ...moving])
    setLeftChecked(new Set())
  }

  function moveAllLeft() {
    const moving = selected.filter((i) => !i.disabled)
    if (!moving.length) return
    onTransfer([...available, ...moving], selected.filter((i) => i.disabled))
    setRightChecked(new Set())
  }

  const btnStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 34,
    height: 34,
    background: 'var(--color-surface)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    color: 'var(--color-gray-300)',
    transition: 'background var(--duration-fast), color var(--duration-fast)',
  }

  return (
    <div
      data-testid="transfer-list"
      className={cn('ds-transfer-list', className)}
      style={{
        display: 'flex',
        gap: '0.75rem',
        alignItems: 'stretch',
        fontFamily: 'var(--font-base)',
        flexWrap: 'wrap',
      }}
    >
      <ListPanel
        title={titles[0]}
        items={available}
        checkedIds={leftChecked}
        onCheck={(id) => toggleCheck('left', id)}
        onCheckAll={() => checkAll('left')}
        allChecked={available.filter((i) => !i.disabled).every((i) => leftChecked.has(i.id))}
        searchQuery={leftSearch}
        onSearch={setLeftSearch}
        searchable={searchable}
        testId="transfer-left"
      />

      {/* Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'center', justifyContent: 'center', padding: '0.5rem 0' }}>
        <button type="button" data-testid="btn-all-right" onClick={moveAllRight} aria-label="Move all right" style={btnStyle}>
          <ArrowsRightIcon />
        </button>
        <button type="button" data-testid="btn-right" onClick={moveRight} aria-label="Move selected right" style={btnStyle}>
          <ArrowRightIcon />
        </button>
        <button type="button" data-testid="btn-left" onClick={moveLeft} aria-label="Move selected left" style={btnStyle}>
          <ArrowLeftIcon />
        </button>
        <button type="button" data-testid="btn-all-left" onClick={moveAllLeft} aria-label="Move all left" style={btnStyle}>
          <ArrowsLeftIcon />
        </button>
      </div>

      <ListPanel
        title={titles[1]}
        items={selected}
        checkedIds={rightChecked}
        onCheck={(id) => toggleCheck('right', id)}
        onCheckAll={() => checkAll('right')}
        allChecked={selected.filter((i) => !i.disabled).every((i) => rightChecked.has(i.id))}
        searchQuery={rightSearch}
        onSearch={setRightSearch}
        searchable={searchable}
        testId="transfer-right"
      />
    </div>
  )
}
