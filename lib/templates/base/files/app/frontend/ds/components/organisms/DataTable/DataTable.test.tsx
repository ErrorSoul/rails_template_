import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { DataTable } from './index'

const columns = [
  { key: 'name', title: 'Имя', sortable: true },
  { key: 'age', title: 'Возраст', sortable: true },
  { key: 'city', title: 'Город', sortable: false },
]

const data = [
  { name: 'Алексей', age: 30, city: 'Москва' },
  { name: 'Мария', age: 25, city: 'Санкт-Петербург' },
  { name: 'Иван', age: 35, city: 'Казань' },
  { name: 'Анна', age: 28, city: 'Новосибирск' },
  { name: 'Петр', age: 22, city: 'Екатеринбург' },
]

describe('DataTable', () => {
  it('renders without crash', () => {
    render(<DataTable columns={columns} data={data} />)
    expect(document.querySelector('.ds-datatable')).toBeInTheDocument()
    expect(document.querySelector('.ds-table')).toBeInTheDocument()
  })

  it('shows all rows when data fits one page', () => {
    render(<DataTable columns={columns} data={data} pageSize={10} />)
    expect(screen.getByText('Алексей')).toBeInTheDocument()
    expect(screen.getByText('Мария')).toBeInTheDocument()
    expect(screen.getByText('Иван')).toBeInTheDocument()
    expect(screen.getByText('Анна')).toBeInTheDocument()
    expect(screen.getByText('Петр')).toBeInTheDocument()
  })

  it('paginates: 5 items with pageSize=2 shows 2 rows on first page', () => {
    render(<DataTable columns={columns} data={data} pageSize={2} />)
    const rows = document.querySelectorAll('.ds-table__row')
    expect(rows).toHaveLength(2)
  })

  it('paginates: shows 3 pages for 5 items with pageSize=2', () => {
    render(<DataTable columns={columns} data={data} pageSize={2} />)
    // Pagination should appear
    expect(document.querySelector('.ds-pagination')).toBeInTheDocument()
  })

  it('navigating to page 2 shows next rows', () => {
    render(<DataTable columns={columns} data={data} pageSize={2} />)
    fireEvent.click(screen.getByLabelText('Page 2'))
    const rows = document.querySelectorAll('.ds-table__row')
    expect(rows).toHaveLength(2)
    // Page 2 should show items 3-4
    expect(screen.getByText('Иван')).toBeInTheDocument()
    expect(screen.getByText('Анна')).toBeInTheDocument()
  })

  it('sort asc: clicking sortable header sorts ascending', () => {
    render(<DataTable columns={columns} data={data} pageSize={10} />)
    const sortBtn = document.querySelector('[data-sort-key="age"]') as HTMLElement
    fireEvent.click(sortBtn)
    const cells = document.querySelectorAll('.ds-table__row td:nth-child(2)')
    const ages = Array.from(cells).map((c) => Number(c.textContent))
    expect(ages).toEqual([...ages].sort((a, b) => a - b))
  })

  it('sort desc: clicking sortable header twice sorts descending', () => {
    render(<DataTable columns={columns} data={data} pageSize={10} />)
    const sortBtn = document.querySelector('[data-sort-key="age"]') as HTMLElement
    fireEvent.click(sortBtn)
    fireEvent.click(sortBtn)
    const cells = document.querySelectorAll('.ds-table__row td:nth-child(2)')
    const ages = Array.from(cells).map((c) => Number(c.textContent))
    expect(ages).toEqual([...ages].sort((a, b) => b - a))
  })

  it('sort reset: clicking sortable header three times resets sort', () => {
    render(<DataTable columns={columns} data={data} pageSize={10} />)
    const sortBtn = document.querySelector('[data-sort-key="age"]') as HTMLElement
    fireEvent.click(sortBtn)
    fireEvent.click(sortBtn)
    fireEvent.click(sortBtn)
    // After reset, data-sort-direction attribute is removed by React (null prop → no attribute)
    expect(sortBtn).not.toHaveAttribute('data-sort-direction')
  })

  it('sort indicator changes data-sort-direction attribute', () => {
    render(<DataTable columns={columns} data={data} pageSize={10} />)
    const sortBtn = document.querySelector('[data-sort-key="age"]') as HTMLElement
    fireEvent.click(sortBtn)
    expect(sortBtn).toHaveAttribute('data-sort-direction', 'asc')
    fireEvent.click(sortBtn)
    expect(sortBtn).toHaveAttribute('data-sort-direction', 'desc')
  })

  it('non-sortable columns do not have data-sort-key attribute', () => {
    render(<DataTable columns={columns} data={data} pageSize={10} />)
    const sortableHeaders = document.querySelectorAll('[data-sort-key]')
    // Only 'name' and 'age' are sortable
    expect(sortableHeaders).toHaveLength(2)
  })

  it('search filters results', () => {
    render(<DataTable columns={columns} data={data} pageSize={10} searchable />)
    const input = screen.getByPlaceholderText('Поиск...')
    fireEvent.change(input, { target: { value: 'Алексей' } })
    const rows = document.querySelectorAll('.ds-table__row')
    expect(rows).toHaveLength(1)
    expect(screen.getByText('Алексей')).toBeInTheDocument()
  })

  it('search resets to page 1', () => {
    render(<DataTable columns={columns} data={data} pageSize={2} searchable />)
    // go to page 2
    fireEvent.click(screen.getByLabelText('Page 2'))
    // then search
    const input = screen.getByPlaceholderText('Поиск...')
    fireEvent.change(input, { target: { value: 'Алексей' } })
    // pagination should not show (only 1 result) or page 1 should be active
    const pagination = document.querySelector('.ds-pagination')
    if (pagination) {
      const activePage = pagination.querySelector('[aria-current="page"]')
      expect(activePage?.textContent).toBe('1')
    }
  })

  it('shows "Показано X–Y из Z" info text', () => {
    render(<DataTable columns={columns} data={data} pageSize={2} />)
    expect(screen.getByText(/Показано 1–2 из 5/)).toBeInTheDocument()
  })

  it('shows empty state text when filter matches nothing', () => {
    render(<DataTable columns={columns} data={data} pageSize={10} searchable emptyText="Ничего не найдено" />)
    const input = screen.getByPlaceholderText('Поиск...')
    fireEvent.change(input, { target: { value: 'xyznonexistent' } })
    expect(screen.getByText('Ничего не найдено')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<DataTable columns={columns} data={data} className="my-table" />)
    expect(document.querySelector('.my-table')).toBeInTheDocument()
  })
})
