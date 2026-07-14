import { describe, expect, it } from 'vitest'

import { distractorsNeeded, normalizeQuestion } from './index'

describe('normalizeQuestion', () => {
  it('infers single mode from exactly one answer', () => {
    const q = normalizeQuestion({
      id: 'a',
      stem: 'x',
      answers: ['b'],
      distractors: ['a', 'c', 'd'],
    })
    expect(q.mode).toBe('single')
    expect(q.correctAnswers).toEqual(['b'])
  })

  it('infers multiple mode from two or more answers', () => {
    const q = normalizeQuestion({
      id: 'b',
      stem: 'x',
      answers: ['a', 'b'],
      distractors: ['c', 'd'],
    })
    expect(q.mode).toBe('multiple')
    expect(q.correctAnswers).toEqual(['a', 'b'])
  })

  it('honors an explicit mode over inference', () => {
    const q = normalizeQuestion({
      id: 'c',
      stem: 'x',
      mode: 'multiple',
      answers: ['a'],
      distractors: ['b', 'c', 'd'],
    })
    expect(q.mode).toBe('multiple')
  })

  it('normalizes string options into { value, label }', () => {
    const q = normalizeQuestion({
      id: 'd',
      stem: 'x',
      answers: ['createSingle'],
      distractors: ['createGroup'],
    })
    expect(q.answers).toEqual([{ value: 'createSingle', label: 'createSingle' }])
    expect(q.distractors).toEqual([{ value: 'createGroup', label: 'createGroup' }])
  })

  it('defaults an object option label to its value', () => {
    const q = normalizeQuestion({
      id: 'e',
      stem: 'x',
      answers: [{ value: 'a', label: 'Option A' }],
      distractors: [{ value: 'b' }],
    })
    expect(q.answers).toEqual([{ value: 'a', label: 'Option A' }])
    expect(q.distractors).toEqual([{ value: 'b', label: 'b' }])
  })

  it('yields empty correctAnswers when there are no answers', () => {
    const q = normalizeQuestion({
      id: 'f',
      stem: 'x',
      answers: [],
      distractors: ['a'],
    })
    expect(q.correctAnswers).toEqual([])
    expect(q.mode).toBe('single')
  })
})

describe('distractorsNeeded', () => {
  it('needs enough distractors to reach four options', () => {
    expect(distractorsNeeded(1)).toBe(3)
    expect(distractorsNeeded(2)).toBe(2)
    expect(distractorsNeeded(3)).toBe(1)
  })

  it('always needs at least one distractor', () => {
    expect(distractorsNeeded(4)).toBe(1)
    expect(distractorsNeeded(5)).toBe(1)
  })
})
