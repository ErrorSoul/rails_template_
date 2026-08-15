import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { TreeView, type TreeNode } from './index'

const nodes: TreeNode[] = [
  {
    id: 'src',
    label: 'src',
    children: [
      {
        id: 'components',
        label: 'components',
        children: [
          { id: 'button', label: 'Button.tsx' },
          { id: 'input', label: 'Input.tsx' },
        ],
      },
      { id: 'app', label: 'App.tsx' },
    ],
  },
  { id: 'package', label: 'package.json' },
  { id: 'disabled-node', label: 'Disabled', disabled: true },
]

describe('TreeView', () => {
  it('renders top-level nodes', () => {
    render(<TreeView nodes={nodes} />)
    expect(screen.getByText('src')).toBeInTheDocument()
    expect(screen.getByText('package.json')).toBeInTheDocument()
  })

  it('does not show children before expanding', () => {
    render(<TreeView nodes={nodes} />)
    expect(screen.queryByText('Button.tsx')).not.toBeInTheDocument()
  })

  it('expands node on toggle click', () => {
    render(<TreeView nodes={nodes} defaultExpanded={['src']} />)
    expect(screen.getByText('components')).toBeInTheDocument()
    expect(screen.getByText('App.tsx')).toBeInTheDocument()
  })

  it('collapses node when clicked again (uncontrolled)', () => {
    render(<TreeView nodes={nodes} defaultExpanded={['src']} />)
    expect(screen.getByText('components')).toBeInTheDocument()
    // Click src to collapse
    fireEvent.click(screen.getByText('src'))
    // children should be hidden
    expect(screen.queryByText('components')).not.toBeInTheDocument()
  })

  it('shows nested children when parent and grandparent expanded', () => {
    render(<TreeView nodes={nodes} defaultExpanded={['src', 'components']} />)
    expect(screen.getByText('Button.tsx')).toBeInTheDocument()
    expect(screen.getByText('Input.tsx')).toBeInTheDocument()
  })

  it('calls onSelect when node is clicked', () => {
    const onSelect = vi.fn()
    render(<TreeView nodes={nodes} onSelect={onSelect} />)
    fireEvent.click(screen.getByText('package.json'))
    expect(onSelect).toHaveBeenCalledWith('package')
  })

  it('calls onToggle when chevron is clicked', () => {
    const onToggle = vi.fn()
    render(<TreeView nodes={nodes} onToggle={onToggle} />)
    // Click the src node which has children
    fireEvent.click(screen.getByText('src'))
    expect(onToggle).toHaveBeenCalledWith('src')
  })

  it('selected node is highlighted', () => {
    render(<TreeView nodes={nodes} selected="package" />)
    const el = screen.getByText('package.json').closest('[role="treeitem"]')
    expect(el).toHaveAttribute('aria-selected', 'true')
  })

  it('disabled node has aria-disabled', () => {
    render(<TreeView nodes={nodes} />)
    const el = screen.getByText('Disabled').closest('[role="treeitem"]')
    expect(el).toHaveAttribute('aria-disabled', 'true')
  })

  it('controlled mode uses expanded prop', () => {
    render(<TreeView nodes={nodes} expanded={['src']} onToggle={vi.fn()} />)
    expect(screen.getByText('components')).toBeInTheDocument()
  })

  it('leaf nodes have no aria-expanded attribute', () => {
    render(<TreeView nodes={nodes} defaultExpanded={['src']} />)
    const appNode = screen.getByText('App.tsx').closest('[role="treeitem"]')
    expect(appNode).not.toHaveAttribute('aria-expanded')
  })
})
