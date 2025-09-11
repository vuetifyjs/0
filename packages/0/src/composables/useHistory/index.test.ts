import { describe, expect, it } from 'vitest'
import { useHistory } from './index'

describe('useHistory', () => {
  it('should push to the history buffer', () => {
    const history = useHistory({ size: 15 })
    for (let i = 0; i <= 20; i++) {
      history.push({
        id: `item${i}`,
        value: i,
      })
    }

    expect(history.buffer).toHaveLength(15)
    expect(history.buffer[0]!.value).toEqual(6)
    expect(history.buffer[14]!.value).toEqual(20)
  })

  it('should undo the last action', () => {
    const history = useHistory({ size: 5 })
    for (let i = 0; i < 7; i++) {
      history.push({
        id: `item${i}`,
        value: i,
      })
    }

    expect(history.buffer[4]!.value).toEqual(6)
    history.undo()
    expect(history.buffer[4]).toBeUndefined()
  })

  it.only('should redo the last action', () => {
    const history = useHistory({ size: 5 })
    for (let i = 0; i < 5; i++) {
      history.push({
        id: `item${i}`,
        value: i,
      })
    }

    console.log(history.buffer)
    history.undo()
    expect(history.buffer[3]!.value).toEqual(3)
    history.redo()
    console.log(history.buffer)
    expect(history.buffer[4]!.value).toEqual(4)
  })
})
