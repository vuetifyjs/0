import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useTypeahead } from './index'

// Utilities
import { isUndefined } from '#v0/utilities'
import { effectScope } from 'vue'

// Types
import type { TypeaheadOptions, TypeaheadReturn } from './index'
import type { EffectScope } from 'vue'

const STATES = ['Alabama', 'Alaska', 'American Samoa', 'Arizona']

describe('useTypeahead', () => {
  let scope: EffectScope

  beforeEach(() => {
    vi.useFakeTimers()
    scope = effectScope()
  })

  afterEach(() => {
    scope.stop()
    vi.useRealTimers()
  })

  function setup<T> (items: readonly T[], text: (item: T) => string, duration?: number) {
    let api!: TypeaheadReturn<T>
    const options: TypeaheadOptions<T> = isUndefined(duration) ? { text } : { text, duration }

    scope.run(() => {
      api = useTypeahead(() => items, options)
    })

    return api
  }

  it('should accumulate a prefix while the window is open', () => {
    const { typeahead } = setup(STATES, state => state)

    expect(typeahead('a')?.item).toBe('Alabama')

    const match = typeahead('m')

    expect(match?.item).toBe('American Samoa')
    expect(match?.index).toBe(2)
  })

  it('should cycle on a repeated letter', () => {
    const { typeahead } = setup(STATES, state => state)

    const first = typeahead('a')

    expect(first?.item).toBe('Alabama')
    expect(first?.index).toBe(0)

    const second = typeahead('a')

    expect(second?.item).toBe('Alaska')
    expect(second?.index).toBe(1)
  })

  it('should keep a real prefix when a repeated letter still matches', () => {
    const items = ['Aardvark', 'Alabama', 'Alaska']
    const { typeahead } = setup(items, item => item)

    expect(typeahead('a')?.item).toBe('Aardvark')

    const match = typeahead('a')

    expect(match?.item).toBe('Aardvark')
    expect(match?.index).toBe(0)
  })

  it('should start a new query after one second', () => {
    const { typeahead } = setup(STATES, state => state)

    expect(typeahead('a')?.item).toBe('Alabama')

    vi.advanceTimersByTime(1000)

    const match = typeahead('a')

    expect(match?.item).toBe('Alabama')
    expect(match?.index).toBe(0)
  })

  it('should fall back to the single character when the prefix misses', () => {
    const items = ['Alabama', 'Alaska', 'Zanzibar']
    const { typeahead } = setup(items, item => item)

    expect(typeahead('a')?.item).toBe('Alabama')

    const match = typeahead('z')

    expect(match?.item).toBe('Zanzibar')
    expect(match?.index).toBe(2)
  })

  it('should wrap to an earlier item when the last item is current', () => {
    const { typeahead } = setup(STATES, state => state)

    expect(typeahead('a')?.index).toBe(0)
    expect(typeahead('a')?.index).toBe(1)
    expect(typeahead('a')?.index).toBe(2)
    expect(typeahead('a')?.item).toBe('Arizona')

    const wrapped = typeahead('a')

    expect(wrapped?.item).toBe('Alabama')
    expect(wrapped?.index).toBe(0)
  })

  it('should return undefined for an empty list', () => {
    const { typeahead } = setup([] as string[], item => item)

    expect(typeahead('a')).toBeUndefined()
  })

  it('should match case-insensitively', () => {
    const { typeahead } = setup(['Alabama'], item => item)

    expect(typeahead('A')?.item).toBe('Alabama')
    expect(typeahead('A')?.index).toBe(0)
  })

  it('should drop a partial prefix on reset', () => {
    const { typeahead, reset } = setup(STATES, state => state)

    expect(typeahead('a')?.item).toBe('Alabama')

    reset()

    const match = typeahead('a')

    expect(match?.item).toBe('Alabama')
    expect(match?.index).toBe(0)
  })

  it('should not skip disabled items', () => {
    const items = [
      { title: 'Apple', disabled: true },
      { title: 'Apricot', disabled: false },
    ]
    const { typeahead } = setup(items, item => item.title)

    const match = typeahead('a')

    expect(match?.item).toBe(items[0])
    expect(match?.index).toBe(0)
    expect(match?.item.disabled).toBe(true)
  })
})
