import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useKeydown, handlerMap } from './index'

describe('useKeydown', () => {
  let addEventListenerSpy: ReturnType<typeof vi.spyOn>
  let removeEventListenerSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    vi.clearAllMocks()
    addEventListenerSpy = vi.spyOn(document, 'addEventListener')
    removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')
  })

  afterEach(() => {
    vi.restoreAllMocks()
    handlerMap.clear()
  })

  it('should create only one global listener for multiple useKeydown calls', () => {
    const handler1 = vi.fn()
    const handler2 = vi.fn()
    const handler3 = vi.fn()

    const keydown1 = useKeydown({ key: 'Enter', handler: handler1 })
    const keydown2 = useKeydown({ key: 'Escape', handler: handler2 })
    const keydown3 = useKeydown({ key: 'Space', handler: handler3 })

    keydown1.startListening()
    keydown2.startListening()
    keydown3.startListening()

    expect(addEventListenerSpy).toHaveBeenCalledTimes(1)
    expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))

    expect(handlerMap.size).toBe(3)

    keydown1.stopListening()
    keydown2.stopListening()
    keydown3.stopListening()

    expect(removeEventListenerSpy).toHaveBeenCalledTimes(1)
    expect(handlerMap.size).toBe(0)
  })

  it('should handle multiple handlers for the same key', () => {
    const handler1 = vi.fn()
    const handler2 = vi.fn()

    const keydown1 = useKeydown({ key: 'Enter', handler: handler1 })
    const keydown2 = useKeydown({ key: 'Enter', handler: handler2 })

    keydown1.startListening()
    keydown2.startListening()

    const event = { key: 'Enter' } as KeyboardEvent

    const registeredHandler = addEventListenerSpy.mock.calls[0]![1] as (event: KeyboardEvent) => void
    registeredHandler(event)

    expect(handler1).toHaveBeenCalledWith(event)
    expect(handler2).toHaveBeenCalledWith(event)

    keydown1.stopListening()
    keydown2.stopListening()
  })

  it('should not remove global listener if other handlers are still active', () => {
    const handler1 = vi.fn()
    const handler2 = vi.fn()

    const keydown1 = useKeydown({ key: 'Enter', handler: handler1 })
    const keydown2 = useKeydown({ key: 'Escape', handler: handler2 })

    keydown1.startListening()
    keydown2.startListening()

    expect(addEventListenerSpy).toHaveBeenCalledTimes(1)

    keydown1.stopListening()

    expect(removeEventListenerSpy).not.toHaveBeenCalled()
    expect(handlerMap.size).toBe(1)

    keydown2.stopListening()

    expect(removeEventListenerSpy).toHaveBeenCalledTimes(1)
    expect(handlerMap.size).toBe(0)
  })
})
