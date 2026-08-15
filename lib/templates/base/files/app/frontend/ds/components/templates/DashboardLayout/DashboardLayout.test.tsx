import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DashboardLayout } from './index'

const sections = [
  {
    title: 'Меню',
    items: [
      { id: 'home', label: 'Главная' },
      { id: 'stats', label: 'Статистика' },
    ],
  },
]

describe('DashboardLayout', () => {
  it('renders without crash', () => {
    render(<DashboardLayout sidebarSections={sections}>Content</DashboardLayout>)
    expect(document.querySelector('.ds-dashboard-layout')).toBeInTheDocument()
  })

  it('renders children', () => {
    render(<DashboardLayout sidebarSections={sections}>Dashboard Content</DashboardLayout>)
    expect(screen.getByText('Dashboard Content')).toBeInTheDocument()
  })

  it('renders sidebar items', () => {
    render(<DashboardLayout sidebarSections={sections}>Content</DashboardLayout>)
    expect(screen.getByText('Главная')).toBeInTheDocument()
    expect(screen.getByText('Статистика')).toBeInTheDocument()
  })

  it('renders navbar with brand', () => {
    render(<DashboardLayout sidebarSections={sections} brand="MyApp">Content</DashboardLayout>)
    expect(screen.getByText('MyApp')).toBeInTheDocument()
  })

  it('toggles sidebar collapse', () => {
    render(<DashboardLayout sidebarSections={sections}>Content</DashboardLayout>)
    const toggle = screen.getByLabelText('Collapse sidebar')
    fireEvent.click(toggle)
    expect(screen.getByLabelText('Expand sidebar')).toBeInTheDocument()
  })

  it('calls onSidebarSelect', () => {
    const onSelect = vi.fn()
    render(
      <DashboardLayout sidebarSections={sections} onSidebarSelect={onSelect}>
        Content
      </DashboardLayout>
    )
    fireEvent.click(screen.getByText('Статистика'))
    expect(onSelect).toHaveBeenCalledWith('stats')
  })

  it('applies custom className', () => {
    render(<DashboardLayout sidebarSections={sections} className="my-dash">Content</DashboardLayout>)
    expect(document.querySelector('.my-dash')).toBeInTheDocument()
  })
})
