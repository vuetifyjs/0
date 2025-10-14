import { describe, expect, it } from 'vitest'
import { useTimeline } from './index'

describe('useTimeline', () => {
  it('should register to the timeline buffer', () => {
    const timeline = useTimeline({ size: 15 })
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
    const timeline = useTimeline({ size: 5 })
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
    const timeline = useTimeline({ size: 5 })
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
    const timeline = useTimeline({ size: 3 })

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
    const timeline = useTimeline({ size: 3 })

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
    const timeline = useTimeline({ size: 2 })

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
    const timeline = useTimeline({ size: 3 })

    timeline.register({ id: 'a', value: 'A' })
    timeline.register({ id: 'b', value: 'B' })

    // No overflow yet
    timeline.undo()

    expect(timeline.size).toBe(1)
    expect(timeline.values()[0]!.value).toBe('A')
  })
})
