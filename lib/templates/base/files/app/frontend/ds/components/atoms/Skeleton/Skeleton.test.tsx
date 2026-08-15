import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Skeleton } from './index'

describe('Skeleton', () => {
  it('renders without crash', () => {
    const { container } = render(<Skeleton />)
    expect(container.firstChild).toBeDefined()
  })

  it('has aria-hidden', () => {
    const { container } = render(<Skeleton />)
    expect((container.firstChild as Element).getAttribute('aria-hidden')).toBe('true')
  })

  it('variant=circular applies 50% border-radius', () => {
    const { container } = render(<Skeleton variant="circular" />)
    const el = container.firstChild as HTMLElement
    expect(el.style.borderRadius).toBe('50%')
  })

  it('variant=text is default', () => {
    const { container } = render(<Skeleton variant="text" />)
    const el = container.firstChild as HTMLElement
    expect(el.style.height).toBe('1em')
  })

  it('custom width and height', () => {
    const { container } = render(<Skeleton width={200} height={50} />)
    const el = container.firstChild as HTMLElement
    expect(el.style.width).toBe('200px')
    expect(el.style.height).toBe('50px')
  })

  it('string width and height', () => {
    const { container } = render(<Skeleton width="50%" height="3rem" />)
    const el = container.firstChild as HTMLElement
    expect(el.style.width).toBe('50%')
    expect(el.style.height).toBe('3rem')
  })

  it('applies custom className', () => {
    const { container } = render(<Skeleton className="my-skeleton" />)
    expect(container.firstChild).toHaveClass('my-skeleton')
  })

  it('animation=none has no animation style', () => {
    const { container } = render(<Skeleton animation="none" />)
    const el = container.firstChild as HTMLElement
    expect(el.style.animation).toBe('')
  })
})
