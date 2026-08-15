import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Hero } from './index'

describe('Hero', () => {
  it('renders without crash', () => {
    render(<Hero title="Hello World" />)
    expect(document.querySelector('.ds-hero')).toBeInTheDocument()
  })

  it('renders title', () => {
    render(<Hero title="Build Something Amazing" />)
    expect(screen.getByText('Build Something Amazing')).toBeInTheDocument()
  })

  it('renders subtitle when provided', () => {
    render(<Hero title="Title" subtitle="A compelling subtitle" />)
    expect(screen.getByText('A compelling subtitle')).toBeInTheDocument()
  })

  it('does not render subtitle when not provided', () => {
    render(<Hero title="Title" />)
    expect(screen.queryByText('.ds-hero__subtitle')).not.toBeInTheDocument()
  })

  it('renders actions', () => {
    render(<Hero title="Title" actions={<button>Get Started</button>} />)
    expect(screen.getByText('Get Started')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Hero title="Title" className="my-hero" />)
    expect(document.querySelector('.my-hero')).toBeInTheDocument()
  })

  it('renders with gradient backgroundVariant', () => {
    render(<Hero title="Title" backgroundVariant="gradient" />)
    expect(document.querySelector('.ds-hero')).toBeInTheDocument()
  })

  it('renders with dark backgroundVariant', () => {
    render(<Hero title="Title" backgroundVariant="dark" />)
    expect(document.querySelector('.ds-hero')).toBeInTheDocument()
  })
})
