import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Slider } from './index'

describe('Slider', () => {
  it('renders without crash', () => {
    const onChange = vi.fn()
    render(<Slider value={50} onChange={onChange} />)
    expect(screen.getByRole('slider')).toBeInTheDocument()
  })

  it('shows label', () => {
    const onChange = vi.fn()
    render(<Slider value={50} onChange={onChange} label="Volume" />)
    expect(screen.getByText('Volume')).toBeInTheDocument()
  })

  it('shows current value when showValue=true', () => {
    const onChange = vi.fn()
    render(<Slider value={75} onChange={onChange} showValue />)
    expect(screen.getByText('75')).toBeInTheDocument()
  })

  it('does not show value when showValue=false', () => {
    const onChange = vi.fn()
    render(<Slider value={75} onChange={onChange} label="Vol" />)
    expect(screen.queryByText('75')).not.toBeInTheDocument()
  })

  it('calls onChange when slider moves', () => {
    const onChange = vi.fn()
    render(<Slider value={50} onChange={onChange} />)
    fireEvent.change(screen.getByRole('slider'), { target: { value: '60' } })
    expect(onChange).toHaveBeenCalledWith(60)
  })

  it('is disabled when disabled=true', () => {
    const onChange = vi.fn()
    render(<Slider value={50} onChange={onChange} disabled />)
    expect(screen.getByRole('slider')).toBeDisabled()
  })

  it('respects min and max props', () => {
    const onChange = vi.fn()
    render(<Slider value={5} onChange={onChange} min={0} max={10} />)
    const slider = screen.getByRole('slider')
    expect(slider).toHaveAttribute('min', '0')
    expect(slider).toHaveAttribute('max', '10')
  })

  it('uses step prop', () => {
    const onChange = vi.fn()
    render(<Slider value={50} onChange={onChange} step={5} />)
    expect(screen.getByRole('slider')).toHaveAttribute('step', '5')
  })
})
