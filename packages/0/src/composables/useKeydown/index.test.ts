import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createKeydown } from './index'

describe('createKeydown', () => {
  let addEventListenerSpy: ReturnType<typeof vi.spyOn>
  let removeEventListenerSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    vi.clearAllMocks()
    addEventListenerSpy = vi.spyOn(document, 'addEventListener')
    removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should create separate document listeners for each keydown instance', () => {
    const handler1 = vi.fn()
    const handler2 = vi.fn()
    const handler3 = vi.fn()

    const keydown1 = createKeydown({ immediate: false })
    const keydown2 = createKeydown({ immediate: false })
    const keydown3 = createKeydown({ immediate: false })

    keydown1.register({ key: 'Enter', handler: handler1 })
    keydown2.register({ key: 'Escape', handler: handler2 })
    keydown3.register({ key: 'Space', handler: handler3 })

    keydown1.startListening()
    keydown2.startListening()
    keydown3.startListening()

    // Each instance creates its own listener
    expect(addEventListenerSpy).toHaveBeenCalledTimes(3)
    expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))

    keydown1.stopListening()
    keydown2.stopListening()
    keydown3.stopListening()

    expect(removeEventListenerSpy).toHaveBeenCalledTimes(3)
  })

  it('should handle multiple handlers for the same key within one instance', () => {
    const handler1 = vi.fn()
    const handler2 = vi.fn()

    const keydown = createKeydown({ immediate: false })

    keydown.register({ key: 'Enter', handler: handler1 })
    keydown.register({ key: 'Enter', handler: handler2 })

    keydown.startListening()

    const event = { key: 'Enter' } as KeyboardEvent

    const registeredHandler = addEventListenerSpy.mock.calls[0]![1] as (event: KeyboardEvent) => void
    registeredHandler(event)

    expect(handler1).toHaveBeenCalledWith(event)
    expect(handler2).toHaveBeenCalledWith(event)

    keydown.stopListening()
  })

  it('should only trigger handlers for matching keys', () => {
    const enterHandler = vi.fn()
    const escapeHandler = vi.fn()

    const keydown = createKeydown({ immediate: false })

    keydown.register({ key: 'Enter', handler: enterHandler })
    keydown.register({ key: 'Escape', handler: escapeHandler })

    keydown.startListening()

    const enterEvent = { key: 'Enter' } as KeyboardEvent
    const registeredHandler = addEventListenerSpy.mock.calls[0]![1] as (event: KeyboardEvent) => void

    registeredHandler(enterEvent)

    expect(enterHandler).toHaveBeenCalledWith(enterEvent)
    expect(escapeHandler).not.toHaveBeenCalled()

    keydown.stopListening()
  })

  it('should track isListening state correctly', () => {
    const keydown = createKeydown({ immediate: false })

    expect(keydown.isListening.value).toBe(false)

    keydown.register({ key: 'Enter', handler: vi.fn() })
    keydown.startListening()

    expect(keydown.isListening.value).toBe(true)

    keydown.stopListening()

    expect(keydown.isListening.value).toBe(false)
  })

  it('should provide registry methods', () => {
    const keydown = createKeydown({ immediate: false })

    expect(keydown.register).toBeDefined()
    expect(keydown.unregister).toBeDefined()
    expect(keydown.get).toBeDefined()
    expect(keydown.has).toBeDefined()
    expect(keydown.keys).toBeDefined()
    expect(keydown.values).toBeDefined()
  })
})
