// Composables
import { createSelection } from '#v0/composables/useSelection'
import { useProxyModel } from './index'

// Utilities
import { describe, it, expect } from 'vitest'
import { nextTick } from 'vue'

describe('useProxyModel', () => {
  it('should sync model when selection changes', async () => {
    const selection = createSelection({ events: true })
    const model = useProxyModel(selection)

    selection.onboard([
      { id: 'item-1', value: 'value-1' },
      { id: 'item-2', value: 'value-2' },
    ])

    selection.select('item-1')
    await nextTick()

    expect(model.value).toBe('value-1')

    selection.unselect('item-1')
    selection.select('item-2')
    await nextTick()

    expect(model.value).toBe('value-2')
  })

  it('should sync selection when model changes', async () => {
    const selection = createSelection({ events: true })
    const model = useProxyModel(selection)

    selection.onboard([
      { id: 'item-1', value: 'value-1' },
      { id: 'item-2', value: 'value-2' },
    ])

    model.value = 'value-1'
    await nextTick()

    expect(selection.selectedIds.has('item-1')).toBe(true)
    expect(selection.selectedIds.size).toBe(1)

    model.value = 'value-2'
    await nextTick()

    expect(selection.selectedIds.has('item-2')).toBe(true)
    expect(selection.selectedIds.has('item-1')).toBe(false)
    expect(selection.selectedIds.size).toBe(1)
  })

  it('should handle array mode for multi-selection', async () => {
    const selection = createSelection({ events: true })
    const model = useProxyModel(selection, [])

    selection.onboard([
      { id: 'item-1', value: 'value-1' },
      { id: 'item-2', value: 'value-2' },
      { id: 'item-3', value: 'value-3' },
    ])

    model.value = ['value-1', 'value-3']
    await nextTick()

    expect(selection.selectedIds.has('item-1')).toBe(true)
    expect(selection.selectedIds.has('item-3')).toBe(true)
    expect(selection.selectedIds.size).toBe(2)
  })

  it('should select items that register after model is set', async () => {
    const selection = createSelection({ events: true })
    useProxyModel(selection, 'value-2')

    await nextTick()

    selection.onboard([
      { id: 'item-1', value: 'value-1' },
      { id: 'item-2', value: 'value-2' },
      { id: 'item-3', value: 'value-3' },
    ])

    await nextTick()

    expect(selection.selectedIds.has('item-2')).toBe(true)
    expect(selection.selectedIds.size).toBe(1)
  })

  it('should handle empty selection', async () => {
    const selection = createSelection({ events: true })
    const model = useProxyModel(selection)

    selection.onboard([
      { id: 'item-1', value: 'value-1' },
    ])

    selection.select('item-1')
    await nextTick()

    expect(model.value).toBe('value-1')

    selection.unselect('item-1')
    await nextTick()

    expect(model.value).toBeUndefined()
  })

  it('should handle array mode with empty selection', async () => {
    const selection = createSelection({ events: true })
    const model = useProxyModel(selection, [])

    selection.onboard([
      { id: 'item-1', value: 'value-1' },
    ])

    selection.select('item-1')
    await nextTick()

    expect(model.value).toEqual(['value-1'])

    selection.unselect('item-1')
    await nextTick()

    expect(model.value).toEqual([])
  })

  it('should maintain bidirectional sync', async () => {
    const selection = createSelection({ events: true })
    const model = useProxyModel(selection)

    selection.onboard([
      { id: 'item-1', value: 'value-1' },
      { id: 'item-2', value: 'value-2' },
    ])

    model.value = 'value-1'
    await nextTick()
    expect(selection.selectedIds.has('item-1')).toBe(true)

    model.value = 'value-2'
    await nextTick()
    expect(selection.selectedIds.has('item-2')).toBe(true)
    expect(selection.selectedIds.has('item-1')).toBe(false)
    expect(model.value).toBe('value-2')

    model.value = 'value-1'
    await nextTick()
    expect(selection.selectedIds.has('item-1')).toBe(true)
    expect(selection.selectedIds.has('item-2')).toBe(false)
  })
})
