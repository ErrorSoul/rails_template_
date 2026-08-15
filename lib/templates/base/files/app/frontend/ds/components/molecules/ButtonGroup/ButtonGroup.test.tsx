import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ButtonGroup } from './index'
import { Button } from '../../atoms/Button'

describe('ButtonGroup', () => {
  it('renders without crash', () => {
    render(
      <ButtonGroup>
        <Button>A</Button>
      </ButtonGroup>
    )
  })

  it('renders all children', () => {
    render(
      <ButtonGroup>
        <Button>First</Button>
        <Button>Second</Button>
        <Button>Third</Button>
      </ButtonGroup>
    )
    expect(screen.getByText('First')).toBeInTheDocument()
    expect(screen.getByText('Second')).toBeInTheDocument()
    expect(screen.getByText('Third')).toBeInTheDocument()
  })

  it('has group role', () => {
    render(
      <ButtonGroup>
        <Button>A</Button>
      </ButtonGroup>
    )
    expect(screen.getByRole('group')).toBeInTheDocument()
  })

  it('renders in vertical orientation', () => {
    render(
      <ButtonGroup orientation="vertical">
        <Button>Up</Button>
        <Button>Down</Button>
      </ButtonGroup>
    )
    const group = screen.getByRole('group')
    expect(group).toBeInTheDocument()
  })
})
