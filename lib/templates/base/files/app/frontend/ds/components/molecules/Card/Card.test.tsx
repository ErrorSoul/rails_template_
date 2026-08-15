import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Card } from './index'

describe('Card', () => {
  it('renders without crash', () => {
    render(<Card />)
  })

  it('shows title when provided', () => {
    render(<Card title="Заголовок" />)
    expect(screen.getByText('Заголовок')).toBeInTheDocument()
  })

  it('shows subtitle when provided', () => {
    render(<Card subtitle="Подзаголовок" />)
    expect(screen.getByText('Подзаголовок')).toBeInTheDocument()
  })

  it('renders children', () => {
    render(<Card>Содержимое карточки</Card>)
    expect(screen.getByText('Содержимое карточки')).toBeInTheDocument()
  })

  it('renders footer when provided', () => {
    render(<Card footer={<span>Footer</span>} />)
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })

  it('does not render image element when image prop absent', () => {
    const { container } = render(<Card title="Без картинки" />)
    expect(container.querySelector('img')).toBeNull()
  })
})
