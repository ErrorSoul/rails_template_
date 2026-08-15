import { cn } from '../../../utils/cn'

export interface SidebarItem {
  id: string
  label: string
  icon?: string
  badge?: string | number
  active?: boolean
}

export interface SidebarSection {
  title?: string
  items: SidebarItem[]
}

export interface SidebarProps {
  sections: SidebarSection[]
  onSelect?: (id: string) => void
  collapsed?: boolean
  className?: string
}

export function Sidebar({
  sections,
  onSelect,
  collapsed = false,
  className,
}: SidebarProps) {
  const width = collapsed ? '64px' : '240px'

  return (
    <aside
      className={cn('ds-sidebar', collapsed && 'ds-sidebar--collapsed', className)}
      style={{
        width,
        minHeight: '100vh',
        background: 'var(--color-surface)',
        borderRight: '1px solid var(--color-default)',
        transition: 'width var(--duration-slow) var(--ease-out)',
        overflowX: 'hidden',
        boxSizing: 'border-box',
        flexShrink: 0,
        animation: 'ds-slide-in-left var(--duration-normal) var(--ease-out)',
      }}
    >
      {sections.map((section, sIdx) => (
        <div
          key={sIdx}
          className="ds-sidebar__section"
          style={{ paddingTop: sIdx === 0 ? '1rem' : '0.5rem', paddingBottom: '0.5rem' }}
        >
          {section.title && !collapsed && (
            <p
              className="ds-sidebar__section-title"
              style={{
                fontFamily: 'var(--font-base)',
                fontSize: '0.65rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--color-gray-700)',
                margin: 0,
                padding: '0.5rem 1rem 0.25rem',
              }}
            >
              {section.title}
            </p>
          )}

          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {section.items.map((item) => (
              <li key={item.id}>
                <button
                  className={cn(
                    'ds-sidebar__item',
                    item.active && 'ds-sidebar__item--active'
                  )}
                  data-active={item.active ? 'true' : undefined}
                  onClick={() => onSelect?.(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    width: '100%',
                    padding: '0.625rem 1rem',
                    background: item.active ? 'rgba(225,78,202,0.1)' : 'transparent',
                    border: 'none',
                    borderLeft: item.active ? '3px solid var(--color-primary)' : '3px solid transparent',
                    cursor: 'pointer',
                    color: item.active ? 'var(--color-primary)' : 'var(--color-gray-500)',
                    fontFamily: 'var(--font-base)',
                    fontSize: '0.875rem',
                    fontWeight: item.active ? 600 : 400,
                    transition: 'var(--transition-base)',
                    textAlign: 'left',
                    boxSizing: 'border-box',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={(e) => {
                    if (!item.active) {
                      const el = e.currentTarget as HTMLButtonElement
                      el.style.color = 'var(--color-gray-300)'
                      el.style.backgroundColor = 'var(--color-default)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!item.active) {
                      const el = e.currentTarget as HTMLButtonElement
                      el.style.color = 'var(--color-gray-500)'
                      el.style.backgroundColor = 'transparent'
                    }
                  }}
                >
                  {item.icon && (
                    <span
                      className="ds-sidebar__item-icon"
                      style={{ fontSize: '1rem', flexShrink: 0, lineHeight: 1 }}
                      aria-hidden="true"
                    >
                      {item.icon}
                    </span>
                  )}

                  {!collapsed && (
                    <>
                      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.label}
                      </span>

                      {item.badge !== undefined && (
                        <span
                          className="ds-sidebar__item-badge"
                          style={{
                            display: 'inline-block',
                            padding: '0.15em 0.5em',
                            fontSize: '0.65rem',
                            fontWeight: 600,
                            background: 'var(--color-info)',
                            color: '#fff',
                            borderRadius: '30px',
                            flexShrink: 0,
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  )
}
