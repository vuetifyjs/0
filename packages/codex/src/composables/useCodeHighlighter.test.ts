import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Utilities
import { effectScope } from 'vue'

// Mock v0 dependencies — IN_BROWSER false so shiki never loads
vi.mock('@vuetify/v0', async importOriginal => {
  const actual = await importOriginal<Record<string, unknown>>()
  return {
    ...actual,
    IN_BROWSER: false,
  }
})

// Mock useIdleCallback to avoid side effects
vi.mock('./useIdleCallback', () => ({
  useIdleCallback: vi.fn(),
}))

// Mock shiki so Vite doesn't fail resolving the dynamic import
vi.mock('shiki', () => ({
  createHighlighter: vi.fn(),
}))

// Composables
import { useCodeHighlighter } from './useCodeHighlighter'

describe('useCodeHighlighter', () => {
  let scope: ReturnType<typeof effectScope>

  beforeEach(() => {
    scope = effectScope()
  })

  afterEach(() => {
    scope.stop()
  })

  it('isReady starts as false', () => {
    scope.run(() => {
      const { isReady } = useCodeHighlighter()
      expect(isReady.value).toBe(false)
    })
  })

  it('highlight returns escaped HTML fallback when shiki unavailable', async () => {
    let result!: ReturnType<typeof useCodeHighlighter>
    scope.run(() => {
      result = useCodeHighlighter()
    })

    const html = await result.highlight('<div>Hello</div>', 'html')
    expect(html).toContain('&lt;div&gt;')
    expect(html).toContain('&lt;/div&gt;')
  })

  it('highlight wraps in pre/code tags as fallback', async () => {
    let result!: ReturnType<typeof useCodeHighlighter>
    scope.run(() => {
      result = useCodeHighlighter()
    })

    const html = await result.highlight('const x = 1', 'ts')
    expect(html).toBe('<pre><code class="language-ts">const x = 1</code></pre>')
  })
})
