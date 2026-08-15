import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Table } from './index'

const columns = [
  { key: 'name', title: 'Имя' },
  { key: 'role', title: 'Роль' },
  { key: 'status', title: 'Статус' },
]

const data = [
  { name: 'Алексей', role: 'Разработчик', status: 'Активен' },
  { name: 'Мария', role: 'Дизайнер', status: 'В отпуске' },
  { name: 'Иван', role: 'Менеджер', status: 'Активен' },
]

describe('Table', () => {
  it('renders without crash', () => {
    render(<Table columns={columns} data={data} />)
    expect(document.querySelector('.ds-table')).toBeInTheDocument()
  })

  it('renders column headers', () => {
    render(<Table columns={columns} data={data} />)
    expect(screen.getByText('Имя')).toBeInTheDocument()
    expect(screen.getByText('Роль')).toBeInTheDocument()
    expect(screen.getByText('Статус')).toBeInTheDocument()
  })

  it('renders data rows', () => {
    render(<Table columns={columns} data={data} />)
    expect(screen.getByText('Алексей')).toBeInTheDocument()
    expect(screen.getByText('Дизайнер')).toBeInTheDocument()
    expect(screen.getAllByText('Активен')).toHaveLength(2)
  })

  it('shows empty state', () => {
    render(<Table columns={columns} data={[]} />)
    expect(screen.getByText('Нет данных')).toBeInTheDocument()
  })

  it('shows custom empty text', () => {
    render(<Table columns={columns} data={[]} emptyText="Пусто" />)
    expect(screen.getByText('Пусто')).toBeInTheDocument()
  })

  it('applies striped rows', () => {
    render(<Table columns={columns} data={data} striped />)
    const rows = document.querySelectorAll('.ds-table__row')
    expect(rows[1]).toHaveClass('ds-table__row--striped')
  })

  it('renders custom cell with render function', () => {
    const customColumns = [
      ...columns.slice(0, 2),
      {
        key: 'status',
        title: 'Статус',
        render: (value: unknown) => <span data-testid="badge">{String(value)}</span>,
      },
    ]
    render(<Table columns={customColumns} data={data} />)
    expect(screen.getAllByTestId('badge')).toHaveLength(3)
  })

  it('applies custom className', () => {
    render(<Table columns={columns} data={data} className="my-table" />)
    expect(document.querySelector('.my-table')).toBeInTheDocument()
  })
})
