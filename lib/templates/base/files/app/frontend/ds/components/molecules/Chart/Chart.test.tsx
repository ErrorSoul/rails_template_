import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Chart } from '.'

const data = [
  { label: 'Jan', value: 40 },
  { label: 'Feb', value: 70 },
  { label: 'Mar', value: 55 },
]

describe('Chart', () => {
  it('renders bar chart without crash', () => {
    const { container } = render(<Chart type="bar" data={data} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders line chart without crash', () => {
    const { container } = render(<Chart type="line" data={data} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders donut chart without crash', () => {
    const { container } = render(<Chart type="donut" data={data} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders title when provided', () => {
    render(<Chart type="bar" data={data} title="Monthly Sales" />)
    expect(screen.getByText('Monthly Sales')).toBeInTheDocument()
  })

  it('does not render title when not provided', () => {
    render(<Chart type="bar" data={data} />)
    expect(screen.queryByText('Monthly Sales')).not.toBeInTheDocument()
  })

  it('bar chart renders correct number of bars', () => {
    const { container } = render(<Chart type="bar" data={data} />)
    const rects = container.querySelectorAll('rect')
    expect(rects.length).toBe(data.length)
  })

  it('renders labels when showLabels=true', () => {
    render(<Chart type="bar" data={data} showLabels />)
    expect(screen.getByText('Jan')).toBeInTheDocument()
    expect(screen.getByText('Feb')).toBeInTheDocument()
  })

  it('donut chart renders correct number of path segments', () => {
    const { container } = render(<Chart type="donut" data={data} />)
    const paths = container.querySelectorAll('path')
    expect(paths.length).toBe(data.length)
  })

  it('line chart renders polyline', () => {
    const { container } = render(<Chart type="line" data={data} />)
    expect(container.querySelector('polyline')).toBeInTheDocument()
  })
})
