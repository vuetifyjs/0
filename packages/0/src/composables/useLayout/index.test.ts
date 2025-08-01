import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useLayout } from './index.ts'
import { getCurrentInstance, onMounted } from 'vue'

vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    getCurrentInstance: vi.fn(),
    onMounted: vi.fn(),
    watch: vi.fn(),
    onScopeDispose: vi.fn(),
  }
})

// Mock globals
vi.mock('#v0/constants/globals', () => ({
  IN_BROWSER: true,
}))

describe('useLayout', () => {
  let originalWindow: any
  let mockWindow: any

  beforeEach(() => {
    vi.clearAllMocks()
    // Mock window object
    originalWindow = global.window
    mockWindow = {
      innerWidth: 1024,
      innerHeight: 768,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }
    global.window! = mockWindow
  })

  afterEach(() => {
    global.window! = originalWindow
    vi.restoreAllMocks()
  })

  const mockGetCurrentInstance = vi.mocked(getCurrentInstance)
  const mockOnMounted = vi.mocked(onMounted)

  it('registers components', () => {
    const context = useLayout('layout')[2]
    context.register({ id: 'Component1', position: 'top', size: 32 })
    context.register({ id: 'Component2', position: 'bottom', size: 64 })
    expect(context.collection.has('Component1')).toEqual(true)
    expect(context.collection.has('Component2')).toEqual(true)
  })

  it('calculates bound', () => {
    const context = useLayout('layout')[2]
    context.register({ id: 'Component1', position: 'top', size: 32 })
    context.register({ id: 'Component2', position: 'bottom', size: 128 })
    context.register({ id: 'Component3', position: 'left', size: 64 })

    expect(context.bounds.top.value).toEqual(32)
    expect(context.bounds.bottom.value).toEqual(128)
    expect(context.bounds.left.value).toEqual(64)
  })

  it('registers height and width in browser', () => {
    const context = useLayout('layout')[2]

    mockGetCurrentInstance.mockReturnValue({} as any)
    const mountedCallback = mockOnMounted.mock.calls[0][0]
    mountedCallback()

    context.register({ id: 'Component1', position: 'top', size: 32 })
    context.register({ id: 'Component2', position: 'left', size: 128 })

    expect(context.width.value).toEqual(1024)
    expect(context.height.value).toEqual(768)
  })

  it('correctly calculates main', () => {
    const context = useLayout('layout')[2]

    mockGetCurrentInstance.mockReturnValue({} as any)
    const mountedCallback = mockOnMounted.mock.calls[0][0]
    mountedCallback()

    context.register({ id: 'Component1', position: 'top', size: 32 })
    context.register({ id: 'Component2', position: 'left', size: 128 })

    expect(context.main.x.value).toEqual(128)
    expect(context.main.y.value).toEqual(32)
    expect(context.main.width.value).toEqual(896)
    expect(context.main.height.value).toEqual(736)
  })
})
