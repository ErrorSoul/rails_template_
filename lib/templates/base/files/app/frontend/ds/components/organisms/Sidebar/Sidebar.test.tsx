import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Sidebar, type SidebarSection } from './index'

const sections: SidebarSection[] = [
  {
    title: 'Навигация',
    items: [
      { id: 'home', label: 'Главная', icon: '🏠', active: true },
      { id: 'users', label: 'Пользователи', badge: 5 },
      { id: 'settings', label: 'Настройки' },
    ],
  },
  {
    items: [{ id: 'logout', label: 'Выход' }],
  },
]

describe('Sidebar', () => {
  it('renders without crash', () => {
    render(<Sidebar sections={sections} />)
    expect(document.querySelector('.ds-sidebar')).toBeInTheDocument()
  })

  it('renders section title', () => {
    render(<Sidebar sections={sections} />)
    expect(screen.getByText('Навигация')).toBeInTheDocument()
  })

  it('renders all items', () => {
    render(<Sidebar sections={sections} />)
    expect(screen.getByText('Главная')).toBeInTheDocument()
    expect(screen.getByText('Пользователи')).toBeInTheDocument()
    expect(screen.getByText('Настройки')).toBeInTheDocument()
    expect(screen.getByText('Выход')).toBeInTheDocument()
  })

  it('marks active item', () => {
    render(<Sidebar sections={sections} />)
    const activeBtn = screen.getByText('Главная').closest('button')
    expect(activeBtn).toHaveAttribute('data-active', 'true')
  })

  it('renders badge', () => {
    render(<Sidebar sections={sections} />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('calls onSelect when item clicked', () => {
    const onSelect = vi.fn()
    render(<Sidebar sections={sections} onSelect={onSelect} />)
    fireEvent.click(screen.getByText('Настройки'))
    expect(onSelect).toHaveBeenCalledWith('settings')
  })

  it('hides labels when collapsed', () => {
    render(<Sidebar sections={sections} collapsed />)
    expect(screen.queryByText('Главная')).not.toBeInTheDocument()
    expect(screen.queryByText('Навигация')).not.toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Sidebar sections={sections} className="my-sidebar" />)
    expect(document.querySelector('.my-sidebar')).toBeInTheDocument()
  })
})
