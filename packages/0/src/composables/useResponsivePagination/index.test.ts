// Composables
import { useResponsivePagination } from './index'

// Utilities
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, nextTick, shallowRef } from 'vue'

// Mock useElementSize to control width values
const mockWidth = shallowRef(0)
const mockHeight = shallowRef(0)
const mockPause = vi.fn()
const mockResume = vi.fn()
const mockStop = vi.fn()

vi.mock('#v0/composables/useResizeObserver', () => ({
  useElementSize: () => ({
    width: mockWidth,
    height: mockHeight,
    pause: mockPause,
    resume: mockResume,
    stop: mockStop,
    isActive: ref(true),
    isPaused: ref(false),
  }),
}))

describe('useResponsivePagination', () => {
  let element: HTMLDivElement

  beforeEach(() => {
    mockWidth.value = 0
    mockHeight.value = 0
    element = document.createElement('div')
    vi.clearAllMocks()
  })

  it('should return minVisible when container width is 0', () => {
    const target = ref<Element | undefined>(element)
    const { visible } = useResponsivePagination(target, {
      minVisible: 3,
    })

    expect(visible.value).toBe(3)
  })

  it('should calculate visible buttons based on container width', async () => {
    const target = ref<Element | undefined>(element)

    // Default: buttonWidth=36, gap=4, navButtons=4
    // navSpace = 4 * (36 + 4) = 160
    // For 400px container: availableSpace = 400 - 160 = 240
    // maxButtons = floor((240 + 4) / 40) = floor(244/40) = 6
    mockWidth.value = 400

    const { visible } = useResponsivePagination(target)
    await nextTick()

    expect(visible.value).toBe(6)
  })

  it('should respect minVisible constraint', async () => {
    const target = ref<Element | undefined>(element)

    // Very small container - should fall back to minVisible
    mockWidth.value = 100

    const { visible } = useResponsivePagination(target, {
      minVisible: 3,
    })
    await nextTick()

    expect(visible.value).toBe(3)
  })

  it('should respect maxVisible constraint', async () => {
    const target = ref<Element | undefined>(element)

    // Large container - should cap at maxVisible
    mockWidth.value = 1000

    const { visible } = useResponsivePagination(target, {
      maxVisible: 5,
    })
    await nextTick()

    expect(visible.value).toBe(5)
  })

  it('should update visible when container width changes', async () => {
    const target = ref<Element | undefined>(element)
    const { visible } = useResponsivePagination(target, {
      buttonWidth: 40,
      gap: 8,
      navButtons: 4,
    })

    // navSpace = 4 * (40 + 8) = 192
    // width 300: availableSpace = 300 - 192 = 108, maxButtons = floor((108+8)/48) = 2
    mockWidth.value = 300
    await nextTick()
    expect(visible.value).toBe(2)

    // width 500: availableSpace = 500 - 192 = 308, maxButtons = floor((308+8)/48) = 6
    mockWidth.value = 500
    await nextTick()
    expect(visible.value).toBe(6)
  })

  it('should account for reserved space', async () => {
    const target = ref<Element | undefined>(element)

    // Default: buttonWidth=36, gap=4, navButtons=4
    // navSpace = 4 * (36 + 4) = 160
    // reservedSpace = 100
    // width 400: availableSpace = 400 - 160 - 100 = 140
    // maxButtons = floor((140 + 4) / 40) = 3
    mockWidth.value = 400

    const { visible } = useResponsivePagination(target, {
      reservedSpace: 100,
    })
    await nextTick()

    expect(visible.value).toBe(3)
  })

  it('should return minVisible when available space is negative', async () => {
    const target = ref<Element | undefined>(element)

    // Small container with lots of nav buttons
    mockWidth.value = 100

    const { visible } = useResponsivePagination(target, {
      navButtons: 10,
      minVisible: 1,
    })
    await nextTick()

    expect(visible.value).toBe(1)
  })

  it('should handle custom button dimensions', async () => {
    const target = ref<Element | undefined>(element)

    // buttonWidth=50, gap=10, navButtons=2
    // navSpace = 2 * (50 + 10) = 120
    // width 400: availableSpace = 400 - 120 = 280
    // maxButtons = floor((280 + 10) / 60) = 4
    mockWidth.value = 400

    const { visible } = useResponsivePagination(target, {
      buttonWidth: 50,
      gap: 10,
      navButtons: 2,
    })
    await nextTick()

    expect(visible.value).toBe(4)
  })

  it('should expose width and height from useElementSize', () => {
    const target = ref<Element | undefined>(element)
    mockWidth.value = 500
    mockHeight.value = 100

    const { width, height } = useResponsivePagination(target)

    expect(width.value).toBe(500)
    expect(height.value).toBe(100)
  })

  it('should expose observer control functions', () => {
    const target = ref<Element | undefined>(element)
    const { pause, resume, stop } = useResponsivePagination(target)

    pause()
    expect(mockPause).toHaveBeenCalled()

    resume()
    expect(mockResume).toHaveBeenCalled()

    stop()
    expect(mockStop).toHaveBeenCalled()
  })

  it('should support reactive options', async () => {
    const target = ref<Element | undefined>(element)
    const buttonWidth = ref(36)

    // navSpace = 4 * (36 + 4) = 160
    // width 400: availableSpace = 400 - 160 = 240
    // maxButtons = floor((240 + 4) / 40) = 6
    mockWidth.value = 400

    const { visible } = useResponsivePagination(target, {
      buttonWidth: () => buttonWidth.value,
    })
    await nextTick()
    expect(visible.value).toBe(6)

    // Change button width
    // navSpace = 4 * (50 + 4) = 216
    // width 400: availableSpace = 400 - 216 = 184
    // maxButtons = floor((184 + 4) / 54) = 3
    buttonWidth.value = 50
    await nextTick()
    expect(visible.value).toBe(3)
  })

  it('should return minVisible when no nav buttons are used', async () => {
    const target = ref<Element | undefined>(element)

    // buttonWidth=36, gap=4, navButtons=0
    // navSpace = 0
    // width 200: availableSpace = 200
    // maxButtons = floor((200 + 4) / 40) = 5
    mockWidth.value = 200

    const { visible } = useResponsivePagination(target, {
      navButtons: 0,
    })
    await nextTick()

    expect(visible.value).toBe(5)
  })
})
