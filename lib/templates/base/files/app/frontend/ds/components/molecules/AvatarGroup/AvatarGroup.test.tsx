import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { AvatarGroup } from './index'

const avatars = [
  { initials: 'AB', alt: 'Alice Brown' },
  { initials: 'CD', alt: 'Chris Davis' },
  { initials: 'EF', alt: 'Eva Fox' },
  { initials: 'GH', alt: 'George Hall' },
  { initials: 'IJ', alt: 'Iris James' },
]

describe('AvatarGroup', () => {
  it('renders without crash', () => {
    render(<AvatarGroup avatars={avatars} />)
  })

  it('shows overflow badge when avatars exceed max', () => {
    render(<AvatarGroup avatars={avatars} max={3} />)
    expect(screen.getByLabelText('2 more')).toBeInTheDocument()
  })

  it('does not show overflow badge when all avatars visible', () => {
    render(<AvatarGroup avatars={avatars} max={10} />)
    expect(screen.queryByLabelText(/more/)).toBeNull()
  })

  it('renders correct number of visible avatars', () => {
    render(<AvatarGroup avatars={avatars} max={2} />)
    expect(screen.getAllByLabelText(/Alice Brown|Chris Davis/)).toHaveLength(2)
  })

  it('renders with different sizes', () => {
    render(<AvatarGroup avatars={avatars.slice(0, 2)} size="sm" />)
    render(<AvatarGroup avatars={avatars.slice(0, 2)} size="lg" />)
  })
})
