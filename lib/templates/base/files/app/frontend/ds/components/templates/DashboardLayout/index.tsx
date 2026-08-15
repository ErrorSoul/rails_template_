import React, { useState, useEffect } from 'react'
import { cn } from '../../../utils/cn'
import { Navbar, type NavLink } from '../../organisms/Navbar'
import { Sidebar, type SidebarSection } from '../../organisms/Sidebar'

export interface DashboardLayoutProps {
  brand?: string
  navLinks?: NavLink[]
  navActions?: React.ReactNode
  sidebarSections: SidebarSection[]
  activeSidebarItem?: string
  onSidebarSelect?: (id: string) => void
  children: React.ReactNode
  className?: string
}

export function DashboardLayout({
  brand,
  navLinks = [],
  navActions,
  sidebarSections,
  activeSidebarItem,
  onSidebarSelect,
  children,
  className,
}: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 992
    }
    return false
  })

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 991px)')
    const handler = (e: MediaQueryListEvent) => setCollapsed(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const sectionsWithActive = sidebarSections.map((s) => ({
    ...s,
    items: s.items.map((item) => ({
      ...item,
      active: item.id === activeSidebarItem,
    })),
  }))

  return (
    <div
      className={cn('ds-dashboard-layout', className)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: '100vh',
        background: 'var(--color-bg)',
        overflow: 'hidden',
      }}
    >
      <Navbar
        brand={brand}
        links={navLinks}
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
            <button
              onClick={() => setCollapsed((c) => !c)}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-gray-500)',
                fontSize: '1.2rem',
                cursor: 'pointer',
                padding: '0.25rem',
                lineHeight: 1,
              }}
            >
              {collapsed ? '☰' : '✕'}
            </button>
            {navActions}
          </div>
        }
      />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar
          sections={sectionsWithActive}
          onSelect={onSidebarSelect}
          collapsed={collapsed}
        />

        <main
          className="ds-dashboard-layout__content"
          style={{
            flex: 1,
            overflow: 'auto',
            padding: 'var(--spacing-4)',
          }}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
