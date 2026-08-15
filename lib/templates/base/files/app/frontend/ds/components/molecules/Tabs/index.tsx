import React, { useState } from 'react'
import { cn } from '../../../utils/cn'

export interface Tab {
  id: string
  label: string
  icon?: React.ReactNode
  badge?: number
  disabled?: boolean
}

export interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (id: string) => void
  variant?: 'underline' | 'pills'
  fullWidth?: boolean
  className?: string
}

export function Tabs({
  tabs,
  activeTab,
  onTabChange,
  variant = 'underline',
  fullWidth = false,
  className,
}: TabsProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <div
      role="tablist"
      className={cn('ds-tabs', className)}
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: variant === 'pills' ? '0.5rem' : '0',
        borderBottom: variant === 'underline' ? '1px solid rgba(255,255,255,0.06)' : 'none',
        fontFamily: 'var(--font-base)',
        fontSize: 'var(--font-size-base)',
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        const isHovered = hoveredId === tab.id
        const isDisabled = tab.disabled === true

        const underlineStyle: React.CSSProperties = {
          padding: '0.625rem 1rem',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          opacity: isDisabled ? 0.5 : 1,
          border: 'none',
          background: 'transparent',
          color: isActive
            ? 'var(--color-info)'
            : isHovered
            ? 'var(--color-gray-300)'
            : 'var(--color-gray-500)',
          borderBottom: isActive
            ? '2px solid var(--color-info)'
            : '2px solid transparent',
          marginBottom: '-1px',
          transition: 'color 0.2s ease, border-color 0.2s ease',
          fontFamily: 'inherit',
          fontSize: 'inherit',
          flexShrink: fullWidth ? undefined : 0,
          flex: fullWidth ? 1 : undefined,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          whiteSpace: 'nowrap',
        }

        const pillsStyle: React.CSSProperties = {
          padding: '0.4rem 1.25rem',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          opacity: isDisabled ? 0.5 : 1,
          border: 'none',
          background: isActive ? 'var(--gradient-info)' : 'transparent',
          color: isActive ? '#fff' : isHovered ? 'var(--color-gray-300)' : 'var(--color-gray-400)',
          borderRadius: '30px',
          transition: 'color 0.2s ease, background 0.2s ease',
          fontFamily: 'inherit',
          fontSize: 'inherit',
          flexShrink: fullWidth ? undefined : 0,
          flex: fullWidth ? 1 : undefined,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          whiteSpace: 'nowrap',
        }

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-disabled={isDisabled}
            disabled={isDisabled}
            onClick={() => {
              if (!isDisabled) onTabChange(tab.id)
            }}
            onMouseEnter={() => !isDisabled && setHoveredId(tab.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={variant === 'pills' ? pillsStyle : underlineStyle}
          >
            {tab.icon && <span style={{ display: 'flex', alignItems: 'center' }}>{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '18px',
                  height: '18px',
                  padding: '0 5px',
                  borderRadius: '9px',
                  background: 'var(--color-danger)',
                  color: '#fff',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                {tab.badge}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
