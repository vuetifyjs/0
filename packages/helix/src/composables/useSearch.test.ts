import { afterEach, describe, expect, it, vi } from 'vitest'

// Utilities
import { effectScope } from 'vue'

// Types
import type { SearchItem } from './useSearch'

// Mock useHotkey to avoid side effects in tests
vi.mock('@vuetify/v0', async importOriginal => {
  const original = await importOriginal<Record<string, unknown>>()
  return {
    ...original,
    useHotkey: vi.fn(),
  }
})

// Composables
import { useSearch } from './useSearch'

const items: SearchItem[] = [
  { id: '1', title: 'Getting Started', description: 'How to install the library', category: 'guide' },
  { id: '2', title: 'Components', description: 'List of all components', category: 'api' },
  { id: '3', title: 'Composables', description: 'Reactive utility functions', category: 'api' },
  { id: '4', title: 'Theme Guide', description: 'Customize colors and fonts', category: 'guide' },
  { id: '5', title: 'Installation', description: 'Getting started with npm', category: 'setup' },
]

describe('useSearch', () => {
  let scope: ReturnType<typeof effectScope>

  afterEach(() => {
    scope.stop()
  })

  function setup () {
    let result!: ReturnType<typeof useSearch>
    scope = effectScope()
    scope.run(() => {
      result = useSearch({ items })
    })
    return result
  }

  it('results returns empty array when query is empty', () => {
    const { results } = setup()
    expect(results.value).toEqual([])
  })

  it('results returns empty array when query is whitespace', () => {
    const { results, query } = setup()
    query.value = '   '
    expect(results.value).toEqual([])
  })

  it('filters by title match', () => {
    const { results, query } = setup()
    query.value = 'composables'
    expect(results.value).toHaveLength(1)
    expect(results.value[0].id).toBe('3')
  })

  it('filters by description match', () => {
    const { results, query } = setup()
    query.value = 'colors'
    expect(results.value).toHaveLength(1)
    expect(results.value[0].id).toBe('4')
  })

  it('filters by category match', () => {
    const { results, query } = setup()
    query.value = 'api'
    expect(results.value).toHaveLength(2)
    expect(results.value.map(r => r.id)).toEqual(['2', '3'])
  })

  it('handles multiple search terms with AND logic', () => {
    const { results, query } = setup()
    // "library" only appears in item 1's description
    // "started" appears in items 1 (title) and 5 (description)
    // AND logic: only item 1 matches both terms
    query.value = 'library started'
    expect(results.value).toHaveLength(1)
    expect(results.value[0].id).toBe('1')
  })

  it('search is case insensitive', () => {
    const { results, query } = setup()
    query.value = 'THEME'
    expect(results.value).toHaveLength(1)
    expect(results.value[0].id).toBe('4')
  })

  describe('open / close / toggle', () => {
    it('open() sets isOpen to true and clears query', () => {
      const { isOpen, query, open } = setup()
      query.value = 'test'
      open()
      expect(isOpen.value).toBe(true)
      expect(query.value).toBe('')
    })

    it('close() sets isOpen to false and clears query', () => {
      const { isOpen, query, open, close } = setup()
      open()
      query.value = 'test'
      close()
      expect(isOpen.value).toBe(false)
      expect(query.value).toBe('')
    })

    it('toggle() toggles isOpen', () => {
      const { isOpen, toggle } = setup()
      expect(isOpen.value).toBe(false)

      toggle()
      expect(isOpen.value).toBe(true)

      toggle()
      expect(isOpen.value).toBe(false)
    })
  })

  it('clear() resets query to empty string', () => {
    const { query, clear } = setup()
    query.value = 'something'
    clear()
    expect(query.value).toBe('')
  })
})
