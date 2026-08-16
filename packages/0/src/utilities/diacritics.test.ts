import { describe, expect, it } from 'vitest'

// Utilities
import { findMatchRanges } from './diacritics'

describe('diacritics', () => {
  describe('findMatchRanges', () => {
    it('should match exactly when ignoreAccents is off', () => {
      expect(findMatchRanges('café', 'cafe', { matchAll: true })).toStrictEqual([])
      expect(findMatchRanges('cafe', 'cafe', { matchAll: true })).toStrictEqual([[0, 4]])
    })

    it('should return no ranges for an empty query', () => {
      expect(findMatchRanges('café', '', { ignoreAccents: true })).toStrictEqual([])
    })

    it('should fold both sides when true', () => {
      expect(findMatchRanges('café', 'cafe', { ignoreAccents: true })).toStrictEqual([[0, 4]])
    })

    it('should map ranges back onto a decomposed source', () => {
      const decomposed = 'cafe\u0301' // e + combining acute, 5 code units

      expect(decomposed).toHaveLength(5)
      expect(findMatchRanges(decomposed, 'cafe', { ignoreAccents: true })).toStrictEqual([[0, 5]])
    })

    it('should fold only the text when target', () => {
      expect(findMatchRanges('café', 'cafe', { ignoreAccents: 'target' })).toStrictEqual([[0, 4]])
      expect(findMatchRanges('cafe', 'café', { ignoreAccents: 'target' })).toStrictEqual([])
    })

    it('should fold only the query when query', () => {
      expect(findMatchRanges('cafe', 'café', { ignoreAccents: 'query' })).toStrictEqual([[0, 4]])
      expect(findMatchRanges('café', 'cafe', { ignoreAccents: 'query' })).toStrictEqual([])
    })

    it('should find the first occurrence only unless matchAll is set', () => {
      expect(findMatchRanges('é é', 'e', { ignoreAccents: true })).toStrictEqual([[0, 1]])
      expect(findMatchRanges('é é', 'e', { ignoreAccents: true, matchAll: true })).toStrictEqual([[0, 1], [2, 3]])
    })

    it('should combine folding with case-insensitivity', () => {
      expect(findMatchRanges('RÉSUMÉ', 'resume', { ignoreAccents: true, ignoreCase: true }))
        .toStrictEqual([[0, 6]])
    })

    it('should stay case-sensitive unless ignoreCase is set', () => {
      expect(findMatchRanges('RÉSUMÉ', 'resume', { ignoreAccents: true })).toStrictEqual([])
    })

    it('should fold letters that NFD leaves untouched', () => {
      expect(findMatchRanges('Łódź', 'lodz', { ignoreAccents: true, ignoreCase: true }))
        .toStrictEqual([[0, 4]])
      expect(findMatchRanges('Łódź', 'Lo', { ignoreAccents: 'target' })).toStrictEqual([[0, 2]])
    })

    it('should map ranges back across multi-character folds', () => {
      // 'ß' folds to 'ss', so the match spans a single source character
      expect(findMatchRanges('straße', 'strasse', { ignoreAccents: true })).toStrictEqual([[0, 6]])
    })

    describe('astral characters (surrogate pairs)', () => {
      // 3 capital Adlam letters (U+1E900..) case-fold to their lowercase forms.
      const adlam = String.fromCodePoint(0x1_E9_00, 0x1_E9_01, 0x1_E9_02)
      // CJK compatibility ideograph (U+2F800), NFD-decomposes to U+4E3D.
      const cjkCompat = String.fromCodePoint(0x2_F8_00)

      it('should case-fold an astral bicameral script', () => {
        expect(findMatchRanges(adlam, adlam.toLowerCase(), { ignoreAccents: true, ignoreCase: true }))
          .toStrictEqual([[0, adlam.length]])
      })

      it('should decompose an astral NFD character back to its base', () => {
        expect(findMatchRanges(cjkCompat, cjkCompat.normalize('NFD'), { ignoreAccents: true }))
          .toStrictEqual([[0, cjkCompat.length]])
      })

      it('should keep emoji intact and map ranges past them', () => {
        expect(findMatchRanges('👍 café', 'cafe', { ignoreAccents: true })).toStrictEqual([[3, 7]])
        expect(findMatchRanges('a👍b', 'b', { ignoreAccents: true })).toStrictEqual([[3, 4]])
      })
    })
  })
})
