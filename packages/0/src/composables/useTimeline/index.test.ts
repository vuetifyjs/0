import { describe, expect, it } from 'vitest'
import { createTimeline } from './index'

describe('createTimeline', () => {
  it('should register to the timeline buffer', () => {
    const timeline = createTimeline({ size: 15 })
    for (let i = 0; i <= 20; i++) {
      timeline.register({
        id: `item${i}`,
        value: i,
      })
    }

    expect(timeline.values()).toHaveLength(15)
    expect(timeline.values()[0]!.value).toEqual(6)
    expect(timeline.values()[14]!.value).toEqual(20)
  })

  it('should undo the last action', () => {
    const timeline = createTimeline({ size: 5 })
    for (let i = 0; i < 7; i++) {
      timeline.register({
        id: `item${i}`,
        value: i,
      })
    }

    expect(timeline.values()[4]!.value).toEqual(6)
    timeline.undo()
    expect(timeline.values()[0]!.value).toEqual(1)
    timeline.undo()
    expect(timeline.values()[0]!.value).toEqual(0)
  })

  it('should redo the last action', () => {
    const timeline = createTimeline({ size: 5 })
    for (let i = 0; i < 5; i++) {
      timeline.register({
        id: `item${i}`,
        value: i,
      })
    }

    timeline.undo()
    expect(timeline.values()[3]!.value).toEqual(3)
    timeline.redo()
    expect(timeline.values()[4]!.value).toEqual(4)
  })

  it('should preserve all remaining items when restoring from overflow', () => {
    const timeline = createTimeline({ size: 3 })

    // Register 5 items (overflow will have items 0 and 1)
    for (let i = 0; i < 5; i++) {
      timeline.register({
        id: `item${i}`,
        value: i,
      })
    }

    // Timeline should have items 2, 3, 4
    expect(timeline.size).toBe(3)
    expect(timeline.values()[0]!.value).toBe(2)
    expect(timeline.values()[1]!.value).toBe(3)
    expect(timeline.values()[2]!.value).toBe(4)

    // Undo should restore item 1 and preserve items 2, 3
    timeline.undo()

    expect(timeline.size).toBe(3)
    expect(timeline.values()[0]!.value).toBe(1)
    expect(timeline.values()[1]!.value).toBe(2)
    expect(timeline.values()[2]!.value).toBe(3)
  })

  it('should handle multiple undos with overflow restoration', () => {
    const timeline = createTimeline({ size: 3 })

    // Register 6 items
    for (let i = 0; i < 6; i++) {
      timeline.register({
        id: `item${i}`,
        value: i,
      })
    }

    // Timeline: [3, 4, 5], Overflow: [0, 1, 2]
    expect(timeline.values().map(t => t.value)).toEqual([3, 4, 5])

    timeline.undo()
    // Timeline: [2, 3, 4], Overflow: [0, 1]
    expect(timeline.values().map(t => t.value)).toEqual([2, 3, 4])

    timeline.undo()
    // Timeline: [1, 2, 3], Overflow: [0]
    expect(timeline.values().map(t => t.value)).toEqual([1, 2, 3])

    timeline.undo()
    // Timeline: [0, 1, 2], Overflow: []
    expect(timeline.values().map(t => t.value)).toEqual([0, 1, 2])
  })

  it('should not lose data when undoing with overflow', () => {
    const timeline = createTimeline({ size: 2 })

    timeline.register({ id: 'a', value: 'A' })
    timeline.register({ id: 'b', value: 'B' })
    timeline.register({ id: 'c', value: 'C' })

    // Timeline: [b, c], Overflow: [a]
    expect(timeline.size).toBe(2)
    expect(timeline.values()[0]!.value).toBe('B')
    expect(timeline.values()[1]!.value).toBe('C')

    // This is the critical test - undo should restore 'a' AND preserve 'b'
    // The bug would cause 'b' to be lost here
    timeline.undo()

    expect(timeline.size).toBe(2)
    expect(timeline.values()[0]!.value).toBe('A')
    expect(timeline.values()[1]!.value).toBe('B')
  })

  it('should handle undo when overflow is empty', () => {
    const timeline = createTimeline({ size: 3 })

    timeline.register({ id: 'a', value: 'A' })
    timeline.register({ id: 'b', value: 'B' })

    // No overflow yet
    timeline.undo()

    expect(timeline.size).toBe(1)
    expect(timeline.values()[0]!.value).toBe('A')
  })

  it('should support multiple consecutive redos', () => {
    const timeline = createTimeline({ size: 3 })

    timeline.register({ id: 'a', value: 'A' })
    timeline.register({ id: 'b', value: 'B' })
    timeline.register({ id: 'c', value: 'C' })

    // Undo twice to get [A]
    timeline.undo()
    timeline.undo()
    expect(timeline.values().map(t => t.value)).toEqual(['A'])

    // Redo twice to restore [A, B, C]
    timeline.redo()
    expect(timeline.values().map(t => t.value)).toEqual(['A', 'B'])
    timeline.redo()
    expect(timeline.values().map(t => t.value)).toEqual(['A', 'B', 'C'])
  })

  it('should clear redo stack when new item is registered after undo', () => {
    const timeline = createTimeline({ size: 3 })

    timeline.register({ id: 'a', value: 'A' })
    timeline.register({ id: 'b', value: 'B' })
    timeline.register({ id: 'c', value: 'C' })

    // Undo to get [A, B]
    timeline.undo()
    expect(timeline.values().map(t => t.value)).toEqual(['A', 'B'])

    // Register new item - should clear redo stack
    timeline.register({ id: 'd', value: 'D' })
    expect(timeline.values().map(t => t.value)).toEqual(['A', 'B', 'D'])

    // Redo should not restore C (redo stack was cleared)
    const result = timeline.redo()
    expect(result).toBeUndefined()
    expect(timeline.values().map(t => t.value)).toEqual(['A', 'B', 'D'])
  })

  it('should use seek to find first and last items correctly', () => {
    const timeline = createTimeline({ size: 3 })

    timeline.register({ id: 'a', value: 'A' })
    timeline.register({ id: 'b', value: 'B' })
    timeline.register({ id: 'c', value: 'C' })

    // Verify seek('first') finds the first item
    const first = timeline.seek('first')
    expect(first?.value).toBe('A')
    expect(first?.id).toBe('a')

    // Verify seek('last') finds the last item
    const last = timeline.seek('last')
    expect(last?.value).toBe('C')
    expect(last?.id).toBe('c')
  })

  it('should return undefined when undoing empty timeline', () => {
    const timeline = createTimeline({ size: 3 })

    const result = timeline.undo()

    expect(result).toBeUndefined()
  })

  it('should return undefined when redoing with empty stack', () => {
    const timeline = createTimeline({ size: 3 })

    timeline.register({ id: 'a', value: 'A' })

    const result = timeline.redo()

    expect(result).toBeUndefined()
  })

  it('should handle redo when timeline is at capacity', () => {
    const timeline = createTimeline({ size: 2 })

    timeline.register({ id: 'a', value: 'A' })
    timeline.register({ id: 'b', value: 'B' })
    timeline.register({ id: 'c', value: 'C' })

    // Timeline: [B, C], Overflow: [A]
    expect(timeline.values().map(t => t.value)).toEqual(['B', 'C'])

    timeline.undo()
    // Timeline: [A, B], Stack: [C], Overflow: []
    expect(timeline.values().map(t => t.value)).toEqual(['A', 'B'])

    timeline.redo()
    // redo() calls registry.register() directly (not the overridden register)
    // So it just adds C back without handling overflow, resulting in [A, B, C]
    expect(timeline.values().map(t => t.value)).toEqual(['A', 'B', 'C'])
  })

  it('should maintain correct indexes throughout operations', () => {
    const timeline = createTimeline({ size: 3 })

    const a = timeline.register({ id: 'a', value: 'A' })
    const b = timeline.register({ id: 'b', value: 'B' })
    const c = timeline.register({ id: 'c', value: 'C' })

    expect(a.index).toBe(0)
    expect(b.index).toBe(1)
    expect(c.index).toBe(2)

    timeline.undo()
    const aAfter = timeline.get('a')
    const bAfter = timeline.get('b')

    expect(aAfter?.index).toBe(0)
    expect(bAfter?.index).toBe(1)
  })

  it('should properly remove first item when timeline overflows', () => {
    const timeline = createTimeline({ size: 2 })

    // Fill timeline
    timeline.register({ id: 'a', value: 'A' })
    timeline.register({ id: 'b', value: 'B' })

    // This should remove 'a' (first item) and add 'c'
    timeline.register({ id: 'c', value: 'C' })

    expect(timeline.size).toBe(2)
    expect(timeline.values().map(t => t.value)).toEqual(['B', 'C'])

    // Verify 'a' is in overflow by undoing
    timeline.undo()
    expect(timeline.values().map(t => t.value)).toEqual(['A', 'B'])
  })
})
