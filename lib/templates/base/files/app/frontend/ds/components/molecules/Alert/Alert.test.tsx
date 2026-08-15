import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Alert } from './index'

describe('Alert', () => {
  it('renders without crash', () => {
    render(<Alert variant="info">Сообщение</Alert>)
  })

  it('shows children content', () => {
    render(<Alert variant="success">Операция выполнена</Alert>)
    expect(screen.getByText('Операция выполнена')).toBeInTheDocument()
  })

  it('shows title when provided', () => {
    render(<Alert variant="warning" title="Внимание">Текст</Alert>)
    expect(screen.getByText('Внимание')).toBeInTheDocument()
  })

  it('does not render dismiss button when dismissible not set', () => {
    render(<Alert variant="info">Текст</Alert>)
    expect(screen.queryByLabelText('Закрыть')).toBeNull()
  })

  it('renders dismiss button when dismissible=true', () => {
    render(<Alert variant="danger" dismissible>Текст</Alert>)
    expect(screen.getByLabelText('Закрыть')).toBeInTheDocument()
  })

  it('calls onDismiss when dismiss button clicked', async () => {
    const onDismiss = vi.fn()
    render(<Alert variant="primary" dismissible onDismiss={onDismiss}>Текст</Alert>)
    await userEvent.click(screen.getByLabelText('Закрыть'))
    expect(onDismiss).toHaveBeenCalledOnce()
  })
})
