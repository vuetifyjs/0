import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Utilities
import { effectScope, nextTick } from 'vue'

// Mock v0 dependencies before importing the composable
const mockScrollSpy = {
  activeId: { value: undefined as string | undefined },
  register: vi.fn(),
  unregister: vi.fn(),
  clear: vi.fn(),
  size: { value: 0 },
}

vi.mock('@vuetify/v0', async importOriginal => {
  const actual = await importOriginal<Record<string, unknown>>()
  return {
    ...actual,
    IN_BROWSER: true,
    useMutationObserver: vi.fn(),
  }
})

vi.mock('./useScrollSpy', () => ({
  useScrollSpy: () => mockScrollSpy,
}))

// Composables
import { useToc } from './useToc'

describe('useToc', () => {
  let scope: ReturnType<typeof effectScope>

  beforeEach(() => {
    scope = effectScope()
    vi.useFakeTimers()
    mockScrollSpy.activeId.value = undefined
    mockScrollSpy.register.mockClear()
    mockScrollSpy.clear.mockClear()
  })

  afterEach(() => {
    scope.stop()
    vi.useRealTimers()
  })

  it('returns empty headings when no container', () => {
    scope.run(() => {
      const { headings } = useToc({ container: undefined })
      expect(headings.value).toEqual([])
    })
  })

  it('scans headings from container when provided', async () => {
    const container = document.createElement('div')
    const h2 = document.createElement('h2')
    h2.id = 'intro'
    h2.textContent = 'Introduction'
    container.append(h2)

    const h2b = document.createElement('h2')
    h2b.id = 'usage'
    h2b.textContent = 'Usage'
    container.append(h2b)

    scope.run(() => {
      useToc({ container })
    })

    // Wait for nextTick + debounce timeout + rAF
    await nextTick()
    vi.advanceTimersByTime(50)
    vi.advanceTimersByTime(16) // rAF fallback

    expect(mockScrollSpy.register).toHaveBeenCalledWith('intro', h2)
    expect(mockScrollSpy.register).toHaveBeenCalledWith('usage', h2b)
  })

  it('builds hierarchy with h3 nested under h2', async () => {
    const container = document.createElement('div')

    const h2 = document.createElement('h2')
    h2.id = 'parent'
    h2.textContent = 'Parent'
    container.append(h2)

    const h3 = document.createElement('h3')
    h3.id = 'child'
    h3.textContent = 'Child'
    container.append(h3)

    let result!: ReturnType<typeof useToc>
    scope.run(() => {
      result = useToc({ container })
    })

    await nextTick()
    vi.advanceTimersByTime(50)
    vi.advanceTimersByTime(16)

    expect(result.headings.value).toHaveLength(1)
    expect(result.headings.value[0].id).toBe('parent')
    expect(result.headings.value[0].children).toHaveLength(1)
    expect(result.headings.value[0].children[0].id).toBe('child')
  })

  it('scrollTo calls scrollIntoView on the target element', () => {
    const el = document.createElement('div')
    el.id = 'target'
    document.body.append(el)
    el.scrollIntoView = vi.fn()

    scope.run(() => {
      const { scrollTo } = useToc({ container: undefined })
      scrollTo('target')
    })

    expect(el.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
    el.remove()
  })

  it('activeId reflects scroll spy state', () => {
    mockScrollSpy.activeId.value = 'section-2'

    scope.run(() => {
      const { activeId } = useToc({ container: undefined })
      expect(activeId.value).toBe('section-2')
    })
  })
})
