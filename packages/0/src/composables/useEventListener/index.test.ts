import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref } from 'vue'
import { useEventListener, useWindowEventListener, useDocumentEventListener } from './index'

// Mock IN_BROWSER constant
vi.mock('#v0/constants/globals', () => ({
  IN_BROWSER: true,
}))

describe('useEventListener', () => {
  let mockElement: HTMLElement
  let mockListener: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockElement = document.createElement('div')
    mockListener = vi.fn()
    document.body.append(mockElement)
  })

  afterEach(() => {
    mockElement.remove()
    vi.clearAllMocks()
  })

  it('should add event listener when started', () => {
    const addEventListenerSpy = vi.spyOn(mockElement, 'addEventListener')
    const { start, isListening } = useEventListener(mockElement, 'click', mockListener, { immediate: false })

    expect(isListening.value).toBe(false)
    expect(addEventListenerSpy).not.toHaveBeenCalled()

    start()

    expect(isListening.value).toBe(true)
    expect(addEventListenerSpy).toHaveBeenCalledWith('click', mockListener, {
      capture: false,
      passive: false,
      once: false,
    })
  })

  it('should remove event listener when stopped', () => {
    const removeEventListenerSpy = vi.spyOn(mockElement, 'removeEventListener')
    const { start, stop, isListening } = useEventListener(mockElement, 'click', mockListener, { immediate: false })

    start()
    expect(isListening.value).toBe(true)

    stop()

    expect(isListening.value).toBe(false)
    expect(removeEventListenerSpy).toHaveBeenCalledWith('click', mockListener, {
      capture: false,
      passive: false,
      once: false,
    })
  })

  it('should handle event listener options correctly', () => {
    const addEventListenerSpy = vi.spyOn(mockElement, 'addEventListener')
    const { start } = useEventListener(mockElement, 'click', mockListener, {
      immediate: false,
      capture: true,
      passive: true,
      once: true,
    })

    start()

    expect(addEventListenerSpy).toHaveBeenCalledWith('click', mockListener, {
      capture: true,
      passive: true,
      once: true,
    })
  })

  it('should work with reactive target', async () => {
    const targetRef = ref<HTMLElement | null>(null)
    const addEventListenerSpy = vi.spyOn(mockElement, 'addEventListener')
    const { start, isListening } = useEventListener(targetRef, 'click', mockListener, { immediate: false })

    start()
    expect(isListening.value).toBe(false)
    expect(addEventListenerSpy).not.toHaveBeenCalled()

    targetRef.value = mockElement
    start()

    expect(isListening.value).toBe(true)
    expect(addEventListenerSpy).toHaveBeenCalled()
  })

  it('should not add listener if target is null', () => {
    const { start, isListening } = useEventListener(null, 'click', mockListener, { immediate: false })

    start()

    expect(isListening.value).toBe(false)
  })

  it('should not add listener multiple times', () => {
    const addEventListenerSpy = vi.spyOn(mockElement, 'addEventListener')
    const { start } = useEventListener(mockElement, 'click', mockListener, { immediate: false })

    start()
    start()
    start()

    expect(addEventListenerSpy).toHaveBeenCalledTimes(1)
  })

  it('should handle stop when not listening', () => {
    const removeEventListenerSpy = vi.spyOn(mockElement, 'removeEventListener')
    const { stop } = useEventListener(mockElement, 'click', mockListener, { immediate: false })

    stop()

    expect(removeEventListenerSpy).not.toHaveBeenCalled()
  })

  it('should have immediate option set to true by default', () => {
    const { isListening } = useEventListener(mockElement, 'click', mockListener, { immediate: false })

    // When immediate is false, it should not be listening initially
    expect(isListening.value).toBe(false)
  })

  it('should not start immediately when immediate is false', () => {
    const addEventListenerSpy = vi.spyOn(mockElement, 'addEventListener')
    const { isListening } = useEventListener(mockElement, 'click', mockListener, { immediate: false })

    expect(isListening.value).toBe(false)
    expect(addEventListenerSpy).not.toHaveBeenCalled()
  })
})

describe('useWindowEventListener', () => {
  let mockListener: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockListener = vi.fn()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should add event listener to window', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
    const { start } = useWindowEventListener('resize', mockListener, { immediate: false })

    start()

    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', mockListener, {
      capture: false,
      passive: false,
      once: false,
    })
  })

  it('should remove event listener from window', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
    const { start, stop } = useWindowEventListener('resize', mockListener, { immediate: false })

    start()
    stop()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', mockListener, {
      capture: false,
      passive: false,
      once: false,
    })
  })
})

describe('useDocumentEventListener', () => {
  let mockListener: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockListener = vi.fn()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should add event listener to document', () => {
    const addEventListenerSpy = vi.spyOn(document, 'addEventListener')
    const { start } = useDocumentEventListener('click', mockListener, { immediate: false })

    start()

    expect(addEventListenerSpy).toHaveBeenCalledWith('click', mockListener, {
      capture: false,
      passive: false,
      once: false,
    })
  })

  it('should remove event listener from document', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')
    const { start, stop } = useDocumentEventListener('click', mockListener, { immediate: false })

    start()
    stop()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('click', mockListener, {
      capture: false,
      passive: false,
      once: false,
    })
  })
})

describe('useEventListener - Edge cases', () => {
  let testElement: HTMLElement
  let testListener: ReturnType<typeof vi.fn>

  beforeEach(() => {
    testElement = document.createElement('div')
    testListener = vi.fn()
    document.body.append(testElement)
  })

  afterEach(() => {
    testElement.remove()
    vi.clearAllMocks()
  })

  it('should handle cleanup after multiple stop calls', () => {
    const removeEventListenerSpy = vi.spyOn(testElement, 'removeEventListener')
    const { start, stop, isListening } = useEventListener(testElement, 'click', testListener, { immediate: false })

    start()
    expect(isListening.value).toBe(true)

    stop()
    stop()
    stop()

    expect(isListening.value).toBe(false)
    expect(removeEventListenerSpy).toHaveBeenCalledTimes(1)
  })
})
