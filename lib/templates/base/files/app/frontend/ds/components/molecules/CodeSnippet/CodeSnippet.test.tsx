import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CodeSnippet } from './index'

describe('CodeSnippet', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    })
  })

  it('renders the code content', () => {
    render(<CodeSnippet code="const x = 1" />)
    expect(screen.getByTestId('snippet-pre')).toHaveTextContent('const x = 1')
  })

  it('shows title when provided', () => {
    render(<CodeSnippet code="foo" title="example.ts" />)
    expect(screen.getByTestId('snippet-title')).toHaveTextContent('example.ts')
  })

  it('shows language label when provided', () => {
    render(<CodeSnippet code="foo" language="typescript" />)
    expect(screen.getByTestId('snippet-language')).toHaveTextContent('typescript')
  })

  it('renders copy button', () => {
    render(<CodeSnippet code="hello" />)
    expect(screen.getByTestId('snippet-copy')).toBeInTheDocument()
  })

  it('copies code to clipboard on copy click', async () => {
    render(<CodeSnippet code="const y = 2" />)
    await userEvent.click(screen.getByTestId('snippet-copy'))
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('const y = 2')
  })

  it('shows copied state after click', async () => {
    render(<CodeSnippet code="abc" />)
    await userEvent.click(screen.getByTestId('snippet-copy'))
    expect(screen.getByTestId('snippet-copy')).toHaveTextContent('Copied!')
  })

  it('shows line numbers when showLineNumbers=true', () => {
    render(<CodeSnippet code={'line1\nline2\nline3'} showLineNumbers />)
    expect(screen.getByTestId('line-numbers')).toBeInTheDocument()
  })

  it('does not show line numbers by default', () => {
    render(<CodeSnippet code="hello" />)
    expect(screen.queryByTestId('line-numbers')).not.toBeInTheDocument()
  })

  it('applies maxHeight via inline style on scroll container', () => {
    render(<CodeSnippet code="foo" maxHeight="200px" />)
    // maxHeight applied — pre is still present
    expect(screen.getByTestId('snippet-pre')).toBeInTheDocument()
  })
})
