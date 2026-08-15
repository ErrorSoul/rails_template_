import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { RangeSlider } from './index'

describe('RangeSlider', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <RangeSlider min={0} max={100} value={[20, 80]} onChange={() => {}} />
    )
    expect(container.firstChild).toBeTruthy()
  })

  it('renders two range inputs', () => {
    render(<RangeSlider min={0} max={100} value={[20, 80]} onChange={() => {}} />)
    const inputs = screen.getAllByRole('slider')
    expect(inputs).toHaveLength(2)
  })

  it('shows label when provided', () => {
    render(<RangeSlider min={0} max={100} value={[20, 80]} onChange={() => {}} label="Price Range" />)
    expect(screen.getByText('Price Range')).toBeTruthy()
  })

  it('shows current values in label area', () => {
    render(<RangeSlider min={0} max={100} value={[20, 80]} onChange={() => {}} label="Range" />)
    expect(screen.getByText('20 – 80')).toBeTruthy()
  })

  it('calls onChange when low thumb changes', () => {
    const onChange = vi.fn()
    render(<RangeSlider min={0} max={100} value={[20, 80]} onChange={onChange} />)
    const [lowInput] = screen.getAllByRole('slider')
    fireEvent.change(lowInput, { target: { value: '30' } })
    expect(onChange).toHaveBeenCalledWith([30, 80])
  })

  it('calls onChange when high thumb changes', () => {
    const onChange = vi.fn()
    render(<RangeSlider min={0} max={100} value={[20, 80]} onChange={onChange} />)
    const [, highInput] = screen.getAllByRole('slider')
    fireEvent.change(highInput, { target: { value: '70' } })
    expect(onChange).toHaveBeenCalledWith([20, 70])
  })

  it('does not allow low to exceed high', () => {
    const onChange = vi.fn()
    render(<RangeSlider min={0} max={100} value={[20, 80]} onChange={onChange} />)
    const [lowInput] = screen.getAllByRole('slider')
    fireEvent.change(lowInput, { target: { value: '90' } }) // exceeds high (80)
    expect(onChange).not.toHaveBeenCalled()
  })

  it('has correct aria-labels on thumbs', () => {
    render(<RangeSlider min={0} max={100} value={[25, 75]} onChange={() => {}} />)
    expect(screen.getByLabelText('Minimum value: 25')).toBeTruthy()
    expect(screen.getByLabelText('Maximum value: 75')).toBeTruthy()
  })
})
