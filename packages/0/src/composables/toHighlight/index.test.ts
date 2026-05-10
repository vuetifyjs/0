import { describe, expect, it } from 'vitest'

// Utilities
import { computed, shallowRef } from 'vue'

import { toHighlight } from './index'

describe('toHighlight', () => {
  describe('pre-computed matches', () => {
    it('should not emit a leading empty span when match starts at position 0', () => {
      expect(toHighlight('foobar', undefined, { matches: [[0, 3]] })).toStrictEqual([
        { text: 'foo', match: true },
        { text: 'bar', match: false },
      ])
    })

    it('should not emit a trailing empty span when match ends at text length', () => {
      expect(toHighlight('foobar', undefined, { matches: [[3, 6]] })).toStrictEqual([
        { text: 'foo', match: false },
        { text: 'bar', match: true },
      ])
    })

    it('should handle a mid-text match with surrounding non-match chunks', () => {
      expect(toHighlight('foobar', undefined, { matches: [[2, 4]] })).toStrictEqual([
        { text: 'fo', match: false },
        { text: 'ob', match: true },
        { text: 'ar', match: false },
      ])
    })

    it('should handle multiple non-overlapping matches', () => {
      expect(toHighlight('foobar', undefined, { matches: [[0, 2], [4, 6]] })).toStrictEqual([
        { text: 'fo', match: true },
        { text: 'ob', match: false },
        { text: 'ar', match: true },
      ])
    })

    it('should sort caller-supplied matches that arrive out of order', () => {
      expect(toHighlight('foobar', undefined, { matches: [[4, 6], [0, 2]] })).toStrictEqual([
        { text: 'fo', match: true },
        { text: 'ob', match: false },
        { text: 'ar', match: true },
      ])
    })

    it('should merge caller-supplied matches that overlap', () => {
      expect(toHighlight('foobar', undefined, { matches: [[0, 4], [2, 6]] })).toStrictEqual([
        { text: 'foobar', match: true },
      ])
    })

    it('should merge caller-supplied matches that are adjacent', () => {
      expect(toHighlight('foobar', undefined, { matches: [[0, 3], [3, 6]] })).toStrictEqual([
        { text: 'foobar', match: true },
      ])
    })

    it('should not mutate the caller-supplied matches array or its tuples', () => {
      const ranges: [number, number][] = [[0, 4], [2, 6]]
      const snapshot = ranges.map(r => [...r])
      toHighlight('foobar', undefined, { matches: ranges })
      expect(ranges.map(r => [...r])).toStrictEqual(snapshot)
    })

    it('should drop inverted ranges where start >= end', () => {
      expect(toHighlight('foobar', undefined, { matches: [[5, 3]] })).toStrictEqual([
        { text: 'foobar', match: false },
      ])
    })

    it('should drop zero-width ranges', () => {
      expect(toHighlight('foobar', undefined, { matches: [[3, 3], [0, 2]] })).toStrictEqual([
        { text: 'fo', match: true },
        { text: 'obar', match: false },
      ])
    })

    it('should clamp out-of-bounds end indices via String.slice semantics', () => {
      expect(toHighlight('hi', undefined, { matches: [[0, 999]] })).toStrictEqual([
        { text: 'hi', match: true },
      ])
    })
  })

  describe('query string', () => {
    it('should match case-insensitively by default', () => {
      expect(toHighlight('Hello World', 'HELLO')[0]).toStrictEqual({ text: 'Hello', match: true })
    })

    it('should match case-sensitively when ignoreCase is false', () => {
      expect(toHighlight('Hello World', 'HELLO', { ignoreCase: false })).toStrictEqual([
        { text: 'Hello World', match: false },
      ])
    })

    it('should find every occurrence by default (matchAll: true)', () => {
      expect(toHighlight('aa bb aa', 'aa').filter(c => c.match).map(c => c.text))
        .toStrictEqual(['aa', 'aa'])
    })

    it('should find only the first occurrence when matchAll is false', () => {
      expect(toHighlight('aa bb aa', 'aa', { matchAll: false }).filter(c => c.match).map(c => c.text))
        .toStrictEqual(['aa'])
    })

    it('should return a single no-match chunk when query has no match', () => {
      expect(toHighlight('hello', 'xyz')).toStrictEqual([{ text: 'hello', match: false }])
    })

    it('should merge overlapping spans from multiple queries', () => {
      expect(toHighlight('foobar', ['foo', 'oba'])).toStrictEqual([
        { text: 'fooba', match: true },
        { text: 'r', match: false },
      ])
    })

    it('should merge adjacent spans', () => {
      expect(toHighlight('foobar', ['foo', 'bar'])).toStrictEqual([
        { text: 'foobar', match: true },
      ])
    })

    it('should ignore empty strings in a query array', () => {
      expect(toHighlight('hello', ['', 'ell'])).toStrictEqual([
        { text: 'h', match: false },
        { text: 'ell', match: true },
        { text: 'o', match: false },
      ])
    })
  })

  describe('priority and fallthrough', () => {
    it('should use pre-computed matches over query when both are provided', () => {
      expect(toHighlight('hello', 'hello', { matches: [[1, 3]] })).toStrictEqual([
        { text: 'h', match: false },
        { text: 'el', match: true },
        { text: 'lo', match: false },
      ])
    })

    it('should fall through to query when matches is an empty array', () => {
      expect(toHighlight('hello', 'ell', { matches: [] })).toStrictEqual([
        { text: 'h', match: false },
        { text: 'ell', match: true },
        { text: 'o', match: false },
      ])
    })

    it('should return a single no-match chunk when neither query nor matches', () => {
      expect(toHighlight('hello')).toStrictEqual([{ text: 'hello', match: false }])
    })

    it('should ignore matchAll when matches is provided', () => {
      expect(toHighlight('aabbaa', undefined, { matches: [[0, 2], [4, 6]], matchAll: false })).toStrictEqual([
        { text: 'aa', match: true },
        { text: 'bb', match: false },
        { text: 'aa', match: true },
      ])
    })
  })

  describe('reactive inputs', () => {
    it('should snapshot reactive text at call time', () => {
      const text = shallowRef('hello world')
      expect(toHighlight(text, 'world')[1]).toStrictEqual({ text: 'world', match: true })

      text.value = 'goodbye world'
      expect(toHighlight(text, 'world')[1]).toStrictEqual({ text: 'world', match: true })
    })

    it('should snapshot reactive query at call time', () => {
      const query = shallowRef('hello')
      expect(toHighlight('hello world', query)[0]).toStrictEqual({ text: 'hello', match: true })

      query.value = 'world'
      expect(toHighlight('hello world', query)[1]).toStrictEqual({ text: 'world', match: true })
    })

    it('should snapshot reactive matches at call time', () => {
      const matches = shallowRef<[number, number][]>([[0, 5]])
      expect(toHighlight('hello world', undefined, { matches })[0]).toStrictEqual({ text: 'hello', match: true })

      matches.value = [[6, 11]]
      expect(toHighlight('hello world', undefined, { matches })[1]).toStrictEqual({ text: 'world', match: true })
    })

    it('should accept getter functions for any input', () => {
      const source = shallowRef('hello world')
      const term = shallowRef('world')
      const result = toHighlight(() => source.value, () => term.value, {
        ignoreCase: () => true,
        matchAll: () => true,
      })
      expect(result[1]).toStrictEqual({ text: 'world', match: true })

      source.value = 'goodbye world'
      term.value = 'goodbye'
      expect(toHighlight(() => source.value, () => term.value)[0])
        .toStrictEqual({ text: 'goodbye', match: true })
    })

    it('should recompute when wrapped in computed and a reactive input changes', () => {
      const text = shallowRef('hello world')
      const chunks = computed(() => toHighlight(text, 'world'))

      expect(chunks.value[1]).toStrictEqual({ text: 'world', match: true })

      text.value = 'goodbye world'
      expect(chunks.value[0]).toStrictEqual({ text: 'goodbye ', match: false })
    })
  })
})
