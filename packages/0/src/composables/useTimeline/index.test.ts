import { describe, expect, it } from 'vitest'
import { useTimeline } from './index'

describe('useTimeline', () => {
  it('should register to the timeline buffer', () => {
    const timeline = useTimeline(15)
    for (let i = 0; i <= 20; i++) {
      timeline.register({
        id: `item${i}`,
        value: i,
      })
    }

    expect(timeline.timeline).toHaveLength(15)
    expect(timeline.timeline[0]!.value).toEqual(6)
    expect(timeline.timeline[14]!.value).toEqual(20)
  })

  it('should undo the last action', () => {
    const timeline = useTimeline(5)
    for (let i = 0; i < 7; i++) {
      timeline.register({
        id: `item${i}`,
        value: i,
      })
    }

    expect(timeline.timeline[4]!.value).toEqual(6)
    timeline.undo()

    expect(timeline.timeline[0]!.value).toEqual(1)
    timeline.undo()
    expect(timeline.timeline[0]!.value).toEqual(0)
  })

  it('should redo the last action', () => {
    const timeline = useTimeline(5)
    for (let i = 0; i < 5; i++) {
      timeline.register({
        id: `item${i}`,
        value: i,
      })
    }
    timeline.undo()
    expect(timeline.timeline[3]!.value).toEqual(3)
    timeline.redo()
    expect(timeline.timeline[4]!.value).toEqual(4)
  })
})
