import { describe, expect, it, vi } from 'vitest'

// Transformers
import {
  clearTextMarks,
  paintTextFragment,
  readTextFragment,
  toFragmentUrl,
  toTextDirective,
  toTextFragment,
  toTextQuote,
  toTextRanges,
} from './toTextFragment'

describe('toTextFragment', () => {
  describe('parse and format', () => {
    it('should round-trip a directive that contains commas and hyphens', () => {
      const directive = {
        prefix: 'see the',
        start: 'hello, world',
        end: 'end-bit',
        suffix: 'next',
      }

      expect(toTextDirective(`#${toTextFragment(directive)}`)).toEqual(directive)
    })

    it('should read a fragment that follows a heading id', () => {
      expect(toTextDirective('#usage:~:text=ordered%20collection')).toEqual({
        start: 'ordered collection',
      })
    })

    it('should ignore a hash with no text directive', () => {
      expect(toTextDirective('#usage')).toBeUndefined()
    })

    it('should replace an existing hash with the text fragment', () => {
      expect(toFragmentUrl('https://0.vuetifyjs.com/guide/start#usage', {
        start: 'ordered collection',
      })).toBe('https://0.vuetifyjs.com/guide/start#:~:text=ordered%20collection')
    })

    it('should read a fragment the browser stripped from the location hash', () => {
      const href = `${location.origin}${location.pathname}${location.search}#:~:text=ordered%20collection`
      using spy = vi.spyOn(performance, 'getEntriesByType').mockReturnValue([
        { name: href } as PerformanceNavigationTiming,
      ])

      expect(readTextFragment()).toEqual({ start: 'ordered collection' })
      expect(spy).toHaveBeenCalledTimes(1)
    })

    it('should ignore an arrival fragment for a different page', () => {
      using spy = vi.spyOn(performance, 'getEntriesByType').mockReturnValue([
        { name: 'https://0.vuetifyjs.com/other#:~:text=ordered%20collection' } as PerformanceNavigationTiming,
      ])

      expect(readTextFragment()).toBeUndefined()
      expect(spy).toHaveBeenCalledTimes(1)
    })
  })

  describe('toTextDirective', () => {
    it('should keep a unique phrase exact', () => {
      const text = 'Register a ticket before anyone else does.'
      const at = text.indexOf('ticket')

      expect(toTextDirective(text, 'ticket', at)).toEqual({ start: 'ticket' })
    })

    it('should add surrounding words until a repeated phrase is unique', () => {
      const text = 'See the registry before the registry grows.'
      const at = text.lastIndexOf('registry')
      const directive = toTextDirective(text, 'registry', at)

      expect(toTextRanges(text, directive)).toEqual([[at, at + 'registry'.length]])
    })
  })

  describe('painting', () => {
    function mount (html: string): HTMLElement {
      const root = document.createElement('div')
      root.innerHTML = html
      document.body.append(root)
      return root
    }

    it('should wrap the disambiguated occurrence in a mark', () => {
      const root = mount('<p>See the registry before the <strong>registry</strong> grows.</p>')

      expect(paintTextFragment(root, {
        prefix: 'the',
        start: 'registry',
        suffix: 'grows.',
      })).toBe(true)

      const marks = root.querySelectorAll('mark.docs-text-mark')
      expect(marks).toHaveLength(1)
      expect(marks[0]?.textContent).toBe('registry')
      expect(marks[0]?.closest('strong')).not.toBeNull()
      expect(root.textContent).toBe('See the registry before the registry grows.')
    })

    it('should leave the article unmarked when the phrase is absent', () => {
      const root = mount('<p>Nothing to find here.</p>')

      expect(paintTextFragment(root, { start: 'registry' })).toBe(false)
      expect(root.querySelector('mark')).toBeNull()
    })

    it('should restore the original text nodes when marks are cleared', () => {
      const root = mount('<p>Highlight the registry once.</p>')

      paintTextFragment(root, { start: 'registry' })
      clearTextMarks(root)

      expect(root.querySelector('mark')).toBeNull()
      expect(root.querySelector('p')?.firstChild).toBeInstanceOf(Text)
      expect(root.textContent).toBe('Highlight the registry once.')
    })

    it('should read a selection inside one paragraph', () => {
      const root = mount('<p>alpha beta target gamma</p>')
      const text = root.querySelector('p')?.firstChild

      expect(text).toBeInstanceOf(Text)
      if (!(text instanceof Text)) return

      const at = text.data.indexOf('target')
      const range = document.createRange()
      range.setStart(text, at)
      range.setEnd(text, at + 'target'.length)

      expect(toTextQuote(root, range)).toMatchObject({ quote: 'target', at })
    })

    it('should refuse a selection that crosses paragraphs', () => {
      const root = mount('<div><p>one two</p><p>three four</p></div>')
      const first = root.querySelector('p')?.firstChild
      const second = root.querySelectorAll('p')[1]?.firstChild

      expect(first).toBeInstanceOf(Text)
      expect(second).toBeInstanceOf(Text)
      if (!(first instanceof Text) || !(second instanceof Text)) return

      const range = document.createRange()
      range.setStart(first, 0)
      range.setEnd(second, second.data.length)

      expect(toTextQuote(root, range)).toBeUndefined()
    })
  })
})
