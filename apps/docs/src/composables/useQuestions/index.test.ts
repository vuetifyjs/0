import { describe, expect, it } from 'vitest'

import { normalizeQuestion } from './index'

describe('normalizeQuestion', () => {
  it('infers single mode from exactly one correct option', () => {
    const q = normalizeQuestion({
      id: 'a',
      stem: 'x',
      options: [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B', correct: true },
      ],
    })
    expect(q.mode).toBe('single')
    expect(q.correctAnswers).toEqual(['b'])
  })

  it('infers multiple mode from two or more correct options', () => {
    const q = normalizeQuestion({
      id: 'b',
      stem: 'x',
      options: [
        { value: 'a', label: 'A', correct: true },
        { value: 'b', label: 'B', correct: true },
        { value: 'c', label: 'C' },
      ],
    })
    expect(q.mode).toBe('multiple')
    expect(q.correctAnswers).toEqual(['a', 'b'])
  })

  it('honors an explicit mode over inference', () => {
    const q = normalizeQuestion({
      id: 'c',
      stem: 'x',
      mode: 'multiple',
      options: [{ value: 'a', label: 'A', correct: true }],
    })
    expect(q.mode).toBe('multiple')
  })

  it('yields empty correctAnswers when no option is correct', () => {
    const q = normalizeQuestion({
      id: 'd',
      stem: 'x',
      options: [{ value: 'a', label: 'A' }],
    })
    expect(q.correctAnswers).toEqual([])
    expect(q.mode).toBe('single')
  })
})
