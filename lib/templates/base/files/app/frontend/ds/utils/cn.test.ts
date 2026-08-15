import { describe, it, expect } from 'vitest'
import { cn } from './cn'

describe('cn()', () => {
  it('merges class names correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles conditional classes — falsy values are ignored', () => {
    expect(cn('foo', false && 'bar', null, undefined, 0 && 'baz')).toBe('foo')
    expect(cn('foo', true && 'bar')).toBe('foo bar')
  })

  it('resolves tailwind conflicts — last conflicting utility wins', () => {
    // p-2 and p-4 conflict; tailwind-merge keeps the last one
    expect(cn('p-2', 'p-4')).toBe('p-4')
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  it('handles empty input', () => {
    expect(cn()).toBe('')
    expect(cn('')).toBe('')
  })
})
