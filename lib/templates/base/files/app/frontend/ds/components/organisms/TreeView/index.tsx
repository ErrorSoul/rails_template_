import React, { useState } from 'react'
import { cn } from '../../../utils/cn'

export interface TreeNode {
  id: string
  label: string
  icon?: React.ReactNode
  children?: TreeNode[]
  disabled?: boolean
}

export interface TreeViewProps {
  nodes: TreeNode[]
  selected?: string
  expanded?: string[]
  onSelect?: (id: string) => void
  onToggle?: (id: string) => void
  defaultExpanded?: string[]
  className?: string
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
      style={{
        transition: 'transform var(--duration-fast)',
        transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
        flexShrink: 0,
      }}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

function FolderIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function FileIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <polyline points="13 2 13 9 20 9" />
    </svg>
  )
}

interface TreeNodeProps {
  node: TreeNode
  depth: number
  selected?: string
  expandedSet: Set<string>
  onSelect?: (id: string) => void
  onToggle?: (id: string) => void
}

function TreeNodeItem({ node, depth, selected, expandedSet, onSelect, onToggle }: TreeNodeProps) {
  const hasChildren = node.children && node.children.length > 0
  const isExpanded = expandedSet.has(node.id)
  const isSelected = selected === node.id

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation()
    if (node.disabled) return
    onSelect?.(node.id)
    if (hasChildren) {
      onToggle?.(node.id)
    }
  }

  function handleChevronClick(e: React.MouseEvent) {
    e.stopPropagation()
    if (node.disabled) return
    onToggle?.(node.id)
  }

  return (
    <div>
      <div
        role="treeitem"
        aria-selected={isSelected}
        aria-expanded={hasChildren ? isExpanded : undefined}
        aria-disabled={node.disabled}
        onClick={handleClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          padding: '0.3rem 0.5rem',
          paddingLeft: `${0.5 + depth * 1.25}rem`,
          borderRadius: 'var(--radius-base)',
          cursor: node.disabled ? 'not-allowed' : 'pointer',
          opacity: node.disabled ? 0.45 : 1,
          background: isSelected ? 'rgba(var(--color-accent-rgb), 0.15)' : 'transparent',
          color: isSelected ? 'var(--color-white)' : 'var(--color-gray-200)',
          transition: 'background var(--duration-fast)',
          userSelect: 'none',
        }}
        onMouseEnter={(e) => {
          if (!isSelected && !node.disabled) {
            (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'
          }
        }}
        onMouseLeave={(e) => {
          if (!isSelected) {
            (e.currentTarget as HTMLElement).style.background = 'transparent'
          }
        }}
      >
        {/* Chevron or spacer */}
        {hasChildren ? (
          <span onClick={handleChevronClick} style={{ display: 'flex', color: 'var(--color-gray-500)' }}>
            <ChevronIcon open={isExpanded} />
          </span>
        ) : (
          <span style={{ width: '14px', flexShrink: 0 }} />
        )}

        {/* Icon */}
        <span style={{ display: 'flex', color: isSelected ? 'var(--color-info)' : 'var(--color-gray-500)' }}>
          {node.icon ?? (hasChildren ? <FolderIcon /> : <FileIcon />)}
        </span>

        {/* Label */}
        <span style={{ fontSize: '0.875rem', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {node.label}
        </span>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div role="group">
          {node.children!.map((child) => (
            <TreeNodeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              selected={selected}
              expandedSet={expandedSet}
              onSelect={onSelect}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function TreeView({
  nodes,
  selected,
  expanded,
  onSelect,
  onToggle,
  defaultExpanded = [],
  className,
}: TreeViewProps) {
  const [internalExpanded, setInternalExpanded] = useState<Set<string>>(
    new Set(defaultExpanded)
  )

  const isControlled = expanded !== undefined
  const expandedSet = isControlled ? new Set(expanded) : internalExpanded

  function handleToggle(id: string) {
    if (isControlled) {
      onToggle?.(id)
    } else {
      setInternalExpanded((prev) => {
        const next = new Set(prev)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        return next
      })
      onToggle?.(id)
    }
  }

  return (
    <div
      role="tree"
      className={cn('ds-treeview', className)}
      style={{ fontFamily: 'var(--font-base)' }}
    >
      {nodes.map((node) => (
        <TreeNodeItem
          key={node.id}
          node={node}
          depth={0}
          selected={selected}
          expandedSet={expandedSet}
          onSelect={onSelect}
          onToggle={handleToggle}
        />
      ))}
    </div>
  )
}
