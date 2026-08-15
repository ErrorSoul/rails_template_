import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Kanban } from './index'
import type { KanbanColumn } from './index'

const COLUMNS: KanbanColumn[] = [
  {
    id: 'todo',
    title: 'To Do',
    color: '#f00',
    cards: [
      {
        id: 'c1',
        title: 'Fix bug',
        description: 'Something is broken',
        tags: ['bug'],
        assignee: { name: 'Alice' },
        priority: 'high',
      },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    cards: [
      {
        id: 'c2',
        title: 'Write docs',
        priority: 'low',
      },
    ],
  },
]

describe('Kanban', () => {
  it('renders columns', () => {
    render(<Kanban columns={COLUMNS} />)
    const cols = screen.getAllByTestId('kanban-column')
    expect(cols).toHaveLength(2)
  })

  it('renders column titles', () => {
    render(<Kanban columns={COLUMNS} />)
    expect(screen.getByText('To Do')).toBeInTheDocument()
    expect(screen.getByText('Done')).toBeInTheDocument()
  })

  it('renders card count in column header', () => {
    render(<Kanban columns={COLUMNS} />)
    const counts = screen.getAllByTestId('column-count')
    expect(counts[0]).toHaveTextContent('1')
  })

  it('renders cards', () => {
    render(<Kanban columns={COLUMNS} />)
    const cards = screen.getAllByTestId('kanban-card')
    expect(cards).toHaveLength(2)
  })

  it('renders card title', () => {
    render(<Kanban columns={COLUMNS} />)
    expect(screen.getByText('Fix bug')).toBeInTheDocument()
  })

  it('fires onCardClick when card is clicked', async () => {
    const onCardClick = vi.fn()
    render(<Kanban columns={COLUMNS} onCardClick={onCardClick} />)
    await userEvent.click(screen.getByText('Fix bug'))
    expect(onCardClick).toHaveBeenCalledWith(expect.objectContaining({ id: 'c1' }))
  })

  it('renders tag on card', () => {
    render(<Kanban columns={COLUMNS} />)
    expect(screen.getByText('bug')).toBeInTheDocument()
  })

  it('renders priority indicator', () => {
    render(<Kanban columns={COLUMNS} />)
    const indicators = screen.getAllByTestId('priority-indicator')
    expect(indicators[0]).toHaveAttribute('data-priority', 'high')
  })

  it('renders assignee name', () => {
    render(<Kanban columns={COLUMNS} />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
  })

  it('renders add card button when onAddCard provided', () => {
    const onAddCard = vi.fn()
    render(<Kanban columns={COLUMNS} onAddCard={onAddCard} />)
    const btns = screen.getAllByTestId('add-card-btn')
    expect(btns.length).toBeGreaterThan(0)
  })

  it('fires onAddCard with column id', async () => {
    const onAddCard = vi.fn()
    render(<Kanban columns={COLUMNS} onAddCard={onAddCard} />)
    const btns = screen.getAllByTestId('add-card-btn')
    await userEvent.click(btns[0])
    expect(onAddCard).toHaveBeenCalledWith('todo')
  })
})
