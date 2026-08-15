import { render, screen } from '@testing-library/react'
import { AdminBoot } from './AdminBoot'

describe('AdminBoot', () => {
  it('рендерит ds-компонент', () => {
    render(<AdminBoot />)
    expect(screen.getByText('ds')).toBeInTheDocument()
  })
})
