import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Pagination, getPageRange } from './index'

describe('Pagination', () => {
  it('renders without crash', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />)
    expect(document.querySelector('.ds-pagination')).toBeInTheDocument()
  })

  it('renders correct number of buttons for small total (no ellipsis)', () => {
    render(<Pagination currentPage={3} totalPages={5} onPageChange={vi.fn()} />)
    // 5 page buttons + prev + next = 7 buttons
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(7)
  })

  it('renders ellipsis for large total', () => {
    render(<Pagination currentPage={10} totalPages={20} onPageChange={vi.fn()} />)
    // should have ellipsis elements
    const ellipsis = document.querySelectorAll('.ds-pagination span')
    expect(ellipsis.length).toBeGreaterThan(0)
  })

  it('active page has aria-current="page"', () => {
    render(<Pagination currentPage={3} totalPages={5} onPageChange={vi.fn()} />)
    const activeBtn = screen.getByLabelText('Page 3')
    expect(activeBtn).toHaveAttribute('aria-current', 'page')
  })

  it('calls onPageChange with correct page number on click', () => {
    const handler = vi.fn()
    render(<Pagination currentPage={1} totalPages={5} onPageChange={handler} />)
    fireEvent.click(screen.getByLabelText('Page 3'))
    expect(handler).toHaveBeenCalledWith(3)
  })

  it('prev button is disabled on page 1', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />)
    expect(screen.getByLabelText('Previous page')).toBeDisabled()
  })

  it('next button is disabled on last page', () => {
    render(<Pagination currentPage={5} totalPages={5} onPageChange={vi.fn()} />)
    expect(screen.getByLabelText('Next page')).toBeDisabled()
  })

  it('compact mode renders only prev/next buttons', () => {
    render(<Pagination currentPage={3} totalPages={10} onPageChange={vi.fn()} compact />)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(2)
  })

  it('applies custom className', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} className="my-pager" />)
    expect(document.querySelector('.my-pager')).toBeInTheDocument()
  })

  it('prev/next call onPageChange when enabled', () => {
    const handler = vi.fn()
    render(<Pagination currentPage={3} totalPages={5} onPageChange={handler} />)
    fireEvent.click(screen.getByLabelText('Previous page'))
    expect(handler).toHaveBeenCalledWith(2)
    fireEvent.click(screen.getByLabelText('Next page'))
    expect(handler).toHaveBeenCalledWith(4)
  })
})

describe('getPageRange', () => {
  it('returns [1] for totalPages=1', () => {
    expect(getPageRange(1, 1)).toEqual([1])
  })

  it('returns full range when total is small', () => {
    expect(getPageRange(3, 5)).toEqual([1, 2, 3, 4, 5])
  })

  it('has right ellipsis when current is near start', () => {
    const result = getPageRange(2, 20)
    expect(result[result.length - 1]).toBe(20)
    expect(result).toContain('ellipsis')
  })

  it('has left ellipsis when current is near end', () => {
    const result = getPageRange(19, 20)
    expect(result[0]).toBe(1)
    expect(result).toContain('ellipsis')
  })

  it('has both ellipses when current is in middle', () => {
    const result = getPageRange(10, 20)
    expect(result[0]).toBe(1)
    expect(result[result.length - 1]).toBe(20)
    const ellipsisCount = result.filter((p) => p === 'ellipsis').length
    expect(ellipsisCount).toBe(2)
  })

  it('always includes first and last page', () => {
    const result = getPageRange(5, 15, 1)
    expect(result[0]).toBe(1)
    expect(result[result.length - 1]).toBe(15)
  })
})
