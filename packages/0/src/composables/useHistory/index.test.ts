import { describe, expect, it } from 'vitest'
import { useHistory } from './index'

describe('useHistory', () => {
  it('should push to the history buffer', () => {
    const history = useHistory({ size: 15 })
    for (let i = 0; i < 15; i++) {
      history.push(i)
    }

    history.push('/foo')
    expect(history.buffer.value[0]).toEqual(1)
    expect(history.buffer.value[14]).toEqual('/foo')
  })

  it('should undo the last action', () => {
    const history = useHistory({ size: 5 })
    for (let i = 0; i < 5; i++) {
      history.push(i)
    }

    expect(history.buffer.value).toEqual([0, 1, 2, 3, 4])
    history.undo()
    expect(history.buffer.value).toEqual([0, 1, 2, 3])
    history.push(6, 7, 8)
    expect(history.buffer.value).toEqual([2, 3, 6, 7, 8])
  })

  it('should redo the last action', () => {
    const history = useHistory({ size: 5 })
    for (let i = 0; i < 5; i++) {
      history.push(i)
    }

    history.undo()
    expect(history.buffer.value).toEqual([0, 1, 2, 3])
    history.redo()
    expect(history.buffer.value).toEqual([0, 1, 2, 3, 4])
  })
})
