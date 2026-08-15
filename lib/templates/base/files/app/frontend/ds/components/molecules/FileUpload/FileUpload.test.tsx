import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FileUpload } from './index'

describe('FileUpload', () => {
  it('renders without crash', () => {
    render(<FileUpload onUpload={vi.fn()} />)
    expect(screen.getByRole('button', { name: /upload files/i })).toBeDefined()
  })

  it('renders drop zone', () => {
    render(<FileUpload onUpload={vi.fn()} />)
    expect(screen.getByText(/drag & drop/i)).toBeDefined()
  })

  it('shows max size when provided', () => {
    render(<FileUpload onUpload={vi.fn()} maxSize={1024 * 1024} />)
    expect(screen.getByText(/1\.0 MB/i)).toBeDefined()
  })

  it('shows accept when provided', () => {
    render(<FileUpload onUpload={vi.fn()} accept=".pdf,.docx" />)
    expect(screen.getByText(/.pdf,.docx/)).toBeDefined()
  })

  it('calls onUpload when file selected', async () => {
    const onUpload = vi.fn()
    render(<FileUpload onUpload={onUpload} />)
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['content'], 'test.txt', { type: 'text/plain' })
    fireEvent.change(input, { target: { files: [file] } })
    expect(onUpload).toHaveBeenCalledWith([file])
  })

  it('shows file in list after upload', async () => {
    const onUpload = vi.fn()
    render(<FileUpload onUpload={onUpload} />)
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['content'], 'photo.png', { type: 'image/png' })
    fireEvent.change(input, { target: { files: [file] } })
    expect(screen.getByText('photo.png')).toBeDefined()
  })

  it('shows size error when file exceeds maxSize', () => {
    render(<FileUpload onUpload={vi.fn()} maxSize={10} />)
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['this is too big'], 'big.txt', { type: 'text/plain' })
    fireEvent.change(input, { target: { files: [file] } })
    expect(screen.getByText(/exceeds max size/i)).toBeDefined()
  })

  it('removes file from list', async () => {
    const user = userEvent.setup()
    render(<FileUpload onUpload={vi.fn()} />)
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['hi'], 'remove-me.txt', { type: 'text/plain' })
    fireEvent.change(input, { target: { files: [file] } })
    expect(screen.getByText('remove-me.txt')).toBeDefined()
    await user.click(screen.getByLabelText('Remove remove-me.txt'))
    expect(screen.queryByText('remove-me.txt')).toBeNull()
  })

  it('applies custom className', () => {
    const { container } = render(<FileUpload onUpload={vi.fn()} className="my-upload" />)
    expect(container.firstChild).toHaveClass('my-upload')
  })
})
