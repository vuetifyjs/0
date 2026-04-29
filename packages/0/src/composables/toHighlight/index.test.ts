import { describe, expect, it } from 'vitest'

// Utilities
import { shallowRef } from 'vue'

import { toHighlight } from './index'

function run (options: Parameters<typeof toHighlight>[0]) {
  return toHighlight(options).value
}

describe('toHighlight', () => {
  describe('pre-computed matches', () => {
    it('should not emit a leading empty span when match starts at position 0', () => {
      expect(run({ text: 'foobar', matches: [[0, 3]] })).toStrictEqual([
        { text: 'foo', match: true },
        { text: 'bar', match: false },
      ])
    })

    it('should not emit a trailing empty span when match ends at text length', () => {
      expect(run({ text: 'foobar', matches: [[3, 6]] })).toStrictEqual([
        { text: 'foo', match: false },
        { text: 'bar', match: true },
      ])
    })

    it('should handle a mid-text match with surrounding non-match chunks', () => {
      expect(run({ text: 'foobar', matches: [[2, 4]] })).toStrictEqual([
        { text: 'fo', match: false },
        { text: 'ob', match: true },
        { text: 'ar', match: false },
      ])
    })

    it('should handle multiple non-overlapping matches', () => {
      expect(run({ text: 'foobar', matches: [[0, 2], [4, 6]] })).toStrictEqual([
        { text: 'fo', match: true },
        { text: 'ob', match: false },
        { text: 'ar', match: true },
      ])
    })

    it('should sort caller-supplied matches that arrive out of order', () => {
      expect(run({ text: 'foobar', matches: [[4, 6], [0, 2]] })).toStrictEqual([
        { text: 'fo', match: true },
        { text: 'ob', match: false },
        { text: 'ar', match: true },
      ])
    })

    it('should merge caller-supplied matches that overlap', () => {
      expect(run({ text: 'foobar', matches: [[0, 4], [2, 6]] })).toStrictEqual([
        { text: 'foobar', match: true },
      ])
    })

    it('should merge caller-supplied matches that are adjacent', () => {
      expect(run({ text: 'foobar', matches: [[0, 3], [3, 6]] })).toStrictEqual([
        { text: 'foobar', match: true },
      ])
    })

    it('should not mutate the caller-supplied matches array or its tuples', () => {
      const ranges: [number, number][] = [[0, 4], [2, 6]]
      const snapshot = ranges.map(r => [...r])
      run({ text: 'foobar', matches: ranges })
      expect(ranges.map(r => [...r])).toStrictEqual(snapshot)
    })

    it('should drop inverted ranges where start >= end', () => {
      expect(run({ text: 'foobar', matches: [[5, 3]] })).toStrictEqual([
        { text: 'foobar', match: false },
      ])
    })

    it('should drop zero-width ranges', () => {
      expect(run({ text: 'foobar', matches: [[3, 3], [0, 2]] })).toStrictEqual([
        { text: 'fo', match: true },
        { text: 'obar', match: false },
      ])
    })

    it('should clamp out-of-bounds end indices via String.slice semantics', () => {
      expect(run({ text: 'hi', matches: [[0, 999]] })).toStrictEqual([
        { text: 'hi', match: true },
      ])
    })
  })

  describe('query string', () => {
    it('should match case-insensitively by default', () => {
      expect(run({ text: 'Hello World', query: 'HELLO' })[0]).toStrictEqual({ text: 'Hello', match: true })
    })

    it('should match case-sensitively when ignoreCase is false', () => {
      expect(run({ text: 'Hello World', query: 'HELLO', ignoreCase: false })).toStrictEqual([
        { text: 'Hello World', match: false },
      ])
    })

    it('should find every occurrence by default (matchAll: true)', () => {
      expect(run({ text: 'aa bb aa', query: 'aa' }).filter(c => c.match).map(c => c.text))
        .toStrictEqual(['aa', 'aa'])
    })

    it('should find only the first occurrence when matchAll is false', () => {
      expect(run({ text: 'aa bb aa', query: 'aa', matchAll: false }).filter(c => c.match).map(c => c.text))
        .toStrictEqual(['aa'])
    })

    it('should return a single no-match chunk when query has no match', () => {
      expect(run({ text: 'hello', query: 'xyz' })).toStrictEqual([{ text: 'hello', match: false }])
    })

    it('should merge overlapping spans from multiple queries', () => {
      expect(run({ text: 'foobar', query: ['foo', 'oba'] })).toStrictEqual([
        { text: 'fooba', match: true },
        { text: 'r', match: false },
      ])
    })

    it('should merge adjacent spans', () => {
      expect(run({ text: 'foobar', query: ['foo', 'bar'] })).toStrictEqual([
        { text: 'foobar', match: true },
      ])
    })

    it('should ignore empty strings in a query array', () => {
      expect(run({ text: 'hello', query: ['', 'ell'] })).toStrictEqual([
        { text: 'h', match: false },
        { text: 'ell', match: true },
        { text: 'o', match: false },
      ])
    })
  })

  describe('priority and fallthrough', () => {
    it('should use pre-computed matches over query when both are provided', () => {
      expect(run({ text: 'hello', matches: [[1, 3]], query: 'hello' })).toStrictEqual([
        { text: 'h', match: false },
        { text: 'el', match: true },
        { text: 'lo', match: false },
      ])
    })

    it('should fall through to query when matches is an empty array', () => {
      expect(run({ text: 'hello', matches: [], query: 'ell' })).toStrictEqual([
        { text: 'h', match: false },
        { text: 'ell', match: true },
        { text: 'o', match: false },
      ])
    })

    it('should return a single no-match chunk when neither query nor matches', () => {
      expect(run({ text: 'hello' })).toStrictEqual([{ text: 'hello', match: false }])
    })

    it('should ignore matchAll when matches is provided', () => {
      expect(run({ text: 'aabbaa', matches: [[0, 2], [4, 6]], matchAll: false })).toStrictEqual([
        { text: 'aa', match: true },
        { text: 'bb', match: false },
        { text: 'aa', match: true },
      ])
    })
  })

  describe('reactive inputs', () => {
    it('should recompute when reactive text changes', () => {
      const text = shallowRef('hello world')
      const chunks = toHighlight({ text, query: 'world' })

      expect(chunks.value[1]).toStrictEqual({ text: 'world', match: true })

      text.value = 'goodbye world'
      expect(chunks.value[0]).toStrictEqual({ text: 'goodbye ', match: false })
    })

    it('should recompute when reactive query changes', () => {
      const query = shallowRef('hello')
      const chunks = toHighlight({ text: 'hello world', query })

      expect(chunks.value[0]).toStrictEqual({ text: 'hello', match: true })

      query.value = 'world'
      expect(chunks.value[1]).toStrictEqual({ text: 'world', match: true })
    })

    it('should recompute when reactive matches change', () => {
      const matches = shallowRef<[number, number][]>([[0, 5]])
      const chunks = toHighlight({ text: 'hello world', matches })

      expect(chunks.value[0]).toStrictEqual({ text: 'hello', match: true })

      matches.value = [[6, 11]]
      expect(chunks.value[1]).toStrictEqual({ text: 'world', match: true })
    })

    it('should accept getter functions for any input', () => {
      const source = shallowRef('hello world')
      const term = shallowRef('world')
      const chunks = toHighlight({
        text: () => source.value,
        query: () => term.value,
        ignoreCase: () => true,
        matchAll: () => true,
      })

      expect(chunks.value[1]).toStrictEqual({ text: 'world', match: true })

      source.value = 'goodbye world'
      term.value = 'goodbye'
      expect(chunks.value[0]).toStrictEqual({ text: 'goodbye', match: true })
    })
  })
})
