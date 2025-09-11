import { describe, expect, it } from 'vitest'
import { useHistory } from '#v0'

describe('useHistory', () => {
  it('should push to the history buffer', () => {
    const history = useHistory({ size: 15 })
    for (let i = 0; i <= 20; i++) {
      history.push({
        id: `item${i}`,
        value: i,
      })
    }

    expect(history.history).toHaveLength(15)
    expect(history.history[0]!.value).toEqual(6)
    expect(history.history[14]!.value).toEqual(20)
  })

  it('should undo the last action', () => {
    const history = useHistory({ size: 5 })
    for (let i = 0; i < 7; i++) {
      history.push({
        id: `item${i}`,
        value: i,
      })
    }

    expect(history.history[4]!.value).toEqual(6)
    history.undo()

    expect(history.history[0].value).toEqual(1)
    history.undo()
    expect(history.history[0].value).toEqual(0)
  })

  it('should redo the last action', () => {
    const history = useHistory({ size: 5 })
    for (let i = 0; i < 5; i++) {
      history.push({
        id: `item${i}`,
        value: i,
      })
    }
    console.log(history.history)
    history.undo()
    expect(history.history[3]!.value).toEqual(3)
    console.log(history.history)
    history.redo()
    console.log(history.history)
    expect(history.history[4]!.value).toEqual(4)
  })
})
