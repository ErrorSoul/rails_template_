import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Modal } from './index'

describe('Modal', () => {
  it('renders nothing when closed', () => {
    render(<Modal open={false}>Content</Modal>)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders when open', () => {
    render(<Modal open>Content</Modal>)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('renders title', () => {
    render(
      <Modal open title="Заголовок">
        Body
      </Modal>
    )
    expect(screen.getByText('Заголовок')).toBeInTheDocument()
  })

  it('renders footer', () => {
    render(
      <Modal open footer={<button>OK</button>}>
        Body
      </Modal>
    )
    expect(screen.getByText('OK')).toBeInTheDocument()
  })

  it('calls onClose when close button clicked', () => {
    const onClose = vi.fn()
    render(
      <Modal open onClose={onClose} title="Test">
        Body
      </Modal>
    )
    fireEvent.click(screen.getByLabelText('Close'))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose on backdrop click', () => {
    const onClose = vi.fn()
    render(
      <Modal open onClose={onClose}>
        Body
      </Modal>
    )
    fireEvent.click(screen.getByRole('dialog'))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('does not close on backdrop click when closeOnBackdrop is false', () => {
    const onClose = vi.fn()
    render(
      <Modal open onClose={onClose} closeOnBackdrop={false}>
        Body
      </Modal>
    )
    fireEvent.click(screen.getByRole('dialog'))
    expect(onClose).not.toHaveBeenCalled()
  })

  it('calls onClose on Escape key', () => {
    const onClose = vi.fn()
    render(
      <Modal open onClose={onClose}>
        Body
      </Modal>
    )
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('applies custom className', () => {
    render(
      <Modal open className="my-modal">
        Body
      </Modal>
    )
    expect(document.querySelector('.my-modal')).toBeInTheDocument()
  })
})
