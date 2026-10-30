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

    it('should link a selection that runs through a heading and a bullet', () => {
      const root = mount('<div><p>one two</p><h2>Usage heading</h2><ul><li>first bullet</li><li>second bullet</li></ul></div>')
      const first = root.querySelector('p')?.firstChild
      const last = root.querySelectorAll('li')[1]?.firstChild

      expect(first).toBeInstanceOf(Text)
      expect(last).toBeInstanceOf(Text)
      if (!(first instanceof Text) || !(last instanceof Text)) return

      const range = document.createRange()
      range.setStart(first, 0)
      range.setEnd(last, last.data.length)

      const quote = toTextQuote(root, range)

      expect(quote).toMatchObject({ quote: 'one two', tail: 'second bullet' })
      if (!quote?.tail || quote.tailAt === undefined) return

      const directive = toTextDirective(quote.text, quote.quote, quote.at, quote.tail, quote.tailAt)

      expect(directive.start).toBe('one two')
      expect(directive.end).toBe('second bullet')
      expect(directive.start).not.toContain('Usage')
      expect(paintTextFragment(root, directive)).toBe(true)

      const marked = [...root.querySelectorAll('mark.docs-text-mark')].map(mark => mark.textContent).join('')
      expect(marked).toContain('one two')
      expect(marked).toContain('Usage heading')
      expect(marked).toContain('first bullet')
      expect(marked).toContain('second bullet')
    })

    it('should link a selection that crosses two bullets', () => {
      const root = mount('<ul><li>alpha beta</li><li>gamma delta</li></ul>')
      const first = root.querySelector('li')?.firstChild
      const second = root.querySelectorAll('li')[1]?.firstChild

      expect(first).toBeInstanceOf(Text)
      expect(second).toBeInstanceOf(Text)
      if (!(first instanceof Text) || !(second instanceof Text)) return

      const range = document.createRange()
      range.setStart(first, first.data.indexOf('beta'))
      range.setEnd(second, second.data.indexOf('delta'))

      const quote = toTextQuote(root, range)

      expect(quote).toMatchObject({ quote: 'beta', tail: 'gamma' })
    })

    it('should link a loose list whose items wrap a paragraph', () => {
      const root = mount('<ul><li><p>alpha beta</p></li><li><p>gamma delta</p></li></ul>')
      const first = root.querySelector('p')?.firstChild
      const second = root.querySelectorAll('p')[1]?.firstChild

      expect(first).toBeInstanceOf(Text)
      expect(second).toBeInstanceOf(Text)
      if (!(first instanceof Text) || !(second instanceof Text)) return

      const range = document.createRange()
      range.setStart(first, 0)
      range.setEnd(second, second.data.length)

      expect(toTextQuote(root, range)).toMatchObject({ quote: 'alpha beta', tail: 'gamma delta' })
    })

    it('should disambiguate a repeated passage that crosses a heading', () => {
      const root = mount([
        '<div>',
        '<p>See the registry</p><h2>Notes</h2><ul><li>the registry grows</li></ul>',
        '<p>See the registry</p><h2>Later</h2><ul><li>the registry stops</li></ul>',
        '</div>',
      ].join(''))
      const paragraphs = root.querySelectorAll('p')
      const items = root.querySelectorAll('li')
      const first = paragraphs[1]?.firstChild
      const last = items[1]?.firstChild

      expect(first).toBeInstanceOf(Text)
      expect(last).toBeInstanceOf(Text)
      if (!(first instanceof Text) || !(last instanceof Text)) return

      const range = document.createRange()
      range.setStart(first, 0)
      range.setEnd(last, last.data.length)

      const quote = toTextQuote(root, range)

      expect(quote).toMatchObject({ quote: 'See the registry', tail: 'the registry stops' })
      if (!quote?.tail || quote.tailAt === undefined) return

      const directive = toTextDirective(quote.text, quote.quote, quote.at, quote.tail, quote.tailAt)

      expect(paintTextFragment(root, directive)).toBe(true)

      const marked = [...root.querySelectorAll('mark.docs-text-mark')].map(mark => mark.textContent).join('')
      expect(marked).toContain('Later')
      expect(marked).not.toContain('Notes')
    })
  })
})
