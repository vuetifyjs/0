import { describe, expect, it } from 'vitest'

// Composables
import { createSelection } from '#v0/composables/createSelection'

// Utilities
import { ref } from 'vue'

import { useProxyModel } from './index'

describe('useProxyModel', () => {
  it('should sync model when selection changes', () => {
    const selection = createSelection({ events: true })
    const model = ref()
    useProxyModel(selection, model)

    selection.onboard([
      { id: 'item-1', value: 'value-1' },
      { id: 'item-2', value: 'value-2' },
    ])

    selection.select('item-1')
    expect(model.value).toBe('value-1')

    selection.unselect('item-1')
    selection.select('item-2')
    expect(model.value).toBe('value-2')
  })

  it('should sync selection when model changes', () => {
    const selection = createSelection({ events: true })
    const model = ref()
    useProxyModel(selection, model)

    selection.onboard([
      { id: 'item-1', value: 'value-1' },
      { id: 'item-2', value: 'value-2' },
    ])

    model.value = 'value-1'
    expect(selection.selectedIds.has('item-1')).toBe(true)
    expect(selection.selectedIds.size).toBe(1)

    model.value = 'value-2'
    expect(selection.selectedIds.has('item-2')).toBe(true)
    expect(selection.selectedIds.has('item-1')).toBe(false)
    expect(selection.selectedIds.size).toBe(1)
  })

  it('should handle array mode for multi-selection', () => {
    const selection = createSelection({ events: true })
    const model = ref<string[]>([])
    useProxyModel(selection, model, { multiple: true })

    selection.onboard([
      { id: 'item-1', value: 'value-1' },
      { id: 'item-2', value: 'value-2' },
      { id: 'item-3', value: 'value-3' },
    ])

    model.value = ['value-1', 'value-3']
    expect(selection.selectedIds.has('item-1')).toBe(true)
    expect(selection.selectedIds.has('item-3')).toBe(true)
    expect(selection.selectedIds.size).toBe(2)
  })

  it('should select items that register after model is set', () => {
    const selection = createSelection({ events: true })
    const model = ref('value-2')
    useProxyModel(selection, model)

    selection.onboard([
      { id: 'item-1', value: 'value-1' },
      { id: 'item-2', value: 'value-2' },
      { id: 'item-3', value: 'value-3' },
    ])

    expect(selection.selectedIds.has('item-2')).toBe(true)
    expect(selection.selectedIds.size).toBe(1)
    expect(model.value).toBe('value-2')
  })

  it('should handle empty selection', () => {
    const selection = createSelection({ events: true })
    const model = ref()
    useProxyModel(selection, model)

    selection.onboard([
      { id: 'item-1', value: 'value-1' },
    ])

    selection.select('item-1')
    expect(model.value).toBe('value-1')

    selection.unselect('item-1')
    expect(model.value).toBeUndefined()
  })

  it('should handle array mode with empty selection', () => {
    const selection = createSelection({ events: true })
    const model = ref<string[]>([])
    useProxyModel(selection, model, { multiple: true })

    selection.onboard([
      { id: 'item-1', value: 'value-1' },
    ])

    selection.select('item-1')
    expect(model.value).toEqual(['value-1'])

    selection.unselect('item-1')
    expect(model.value).toEqual([])
  })

  it('should maintain bidirectional sync', () => {
    const selection = createSelection({ events: true })
    const model = ref()
    useProxyModel(selection, model)

    selection.onboard([
      { id: 'item-1', value: 'value-1' },
      { id: 'item-2', value: 'value-2' },
    ])

    model.value = 'value-1'
    expect(selection.selectedIds.has('item-1')).toBe(true)

    model.value = 'value-2'
    expect(selection.selectedIds.has('item-2')).toBe(true)
    expect(selection.selectedIds.has('item-1')).toBe(false)
    expect(model.value).toBe('value-2')

    model.value = 'value-1'
    expect(selection.selectedIds.has('item-1')).toBe(true)
    expect(selection.selectedIds.has('item-2')).toBe(false)
  })

  it('should support transform functions', () => {
    const selection = createSelection({ events: true })
    const model = ref()
    useProxyModel(selection, model, {
      transformIn: val => String(val).toUpperCase(),
      transformOut: val => String(val).toLowerCase(),
    })

    selection.onboard([
      { id: 'item-1', value: 'VALUE-1' },
      { id: 'item-2', value: 'VALUE-2' },
    ])

    model.value = 'value-1'
    expect(selection.selectedIds.has('item-1')).toBe(true)
    expect(model.value).toBe('value-1')

    model.value = 'value-2'
    expect(selection.selectedIds.has('item-2')).toBe(true)
    expect(selection.selectedIds.has('item-1')).toBe(false)
    expect(model.value).toBe('value-2')
  })

  it('should return stop function that cleans up watchers', () => {
    const selection = createSelection({ events: true })
    const model = ref()
    const stop = useProxyModel(selection, model)

    selection.onboard([
      { id: 'item-1', value: 'value-1' },
    ])

    selection.select('item-1')
    expect(model.value).toBe('value-1')

    stop()

    selection.unselect('item-1')
    expect(model.value).toBe('value-1')
  })
})
