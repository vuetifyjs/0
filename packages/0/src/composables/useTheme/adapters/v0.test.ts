import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Utilities
import { computed, effectScope, nextTick, ref } from 'vue'

// Types
import type { ThemeAdapterSetupContext } from './adapter'
import type { App } from 'vue'

import { Vuetify0ThemeAdapter } from './v0'

const mockInBrowser = vi.hoisted(() => ({ value: false }))

vi.mock('#v0/constants/globals', () => ({
  get IN_BROWSER () {
    return mockInBrowser.value
  },
}))

function createMockContext (): ThemeAdapterSetupContext {
  return {
    selectedId: ref('light'),
    colors: computed(() => ({
      light: { primary: '#1976d2' },
    })),
    isDark: ref(false),
  }
}

function createMockApp (headMock?: { push: ReturnType<typeof vi.fn> }): App {
  return {
    _context: {
      provides: headMock ? { usehead: headMock } : {},
    },
    _container: null,
  } as unknown as App
}

describe('vuetify0ThemeAdapter', () => {
  describe('constructor', () => {
    it('should use default options', () => {
      const adapter = new Vuetify0ThemeAdapter()

      expect(adapter.cspNonce).toBeUndefined()
    })

    it('should accept custom options', () => {
      const adapter = new Vuetify0ThemeAdapter({
        cspNonce: 'test-nonce',
        stylesheetId: 'custom-styles',
        prefix: 'custom',
      })

      expect(adapter.cspNonce).toBe('test-nonce')
    })
  })

  describe('sSR (non-browser) environment', () => {
    it('should push styles to head when usehead is available', () => {
      mockInBrowser.value = false
      const headMock = { push: vi.fn() }
      const app = createMockApp(headMock)
      const context = createMockContext()
      const adapter = new Vuetify0ThemeAdapter()

      const scope = effectScope()
      scope.run(() => {
        adapter.setup(app, context)
      })

      expect(headMock.push).toHaveBeenCalledWith({
        htmlAttrs: {
          'data-theme': 'light',
        },
        style: [{
          innerHTML: expect.any(String),
          id: expect.any(String),
        }],
      })

      scope.stop()
    })

    it('should use head provider when usehead not available', () => {
      mockInBrowser.value = false
      const headMock = { push: vi.fn() }
      const app = {
        _context: {
          provides: { head: headMock },
        },
      } as unknown as App
      const context = createMockContext()
      const adapter = new Vuetify0ThemeAdapter()

      const scope = effectScope()
      scope.run(() => {
        adapter.setup(app, context)
      })

      expect(headMock.push).toHaveBeenCalled()

      scope.stop()
    })

    it('should handle empty theme id', () => {
      mockInBrowser.value = false
      const headMock = { push: vi.fn() }
      const app = createMockApp(headMock)
      const context = createMockContext()
      context.selectedId.value = ''
      const adapter = new Vuetify0ThemeAdapter()

      const scope = effectScope()
      scope.run(() => {
        adapter.setup(app, context)
      })

      expect(headMock.push).toHaveBeenCalledWith(
        expect.objectContaining({
          htmlAttrs: { 'data-theme': '' },
        }),
      )

      scope.stop()
    })

    it('should not throw when head is not available', () => {
      mockInBrowser.value = false
      const app = createMockApp()
      const context = createMockContext()
      const adapter = new Vuetify0ThemeAdapter()

      const scope = effectScope()
      expect(() => {
        scope.run(() => {
          adapter.setup(app, context)
        })
      }).not.toThrow()

      scope.stop()
    })

    it('should not call update in SSR', () => {
      mockInBrowser.value = false
      const adapter = new Vuetify0ThemeAdapter()

      expect(() => {
        adapter.update({ light: { primary: '#000' } }, false)
      }).not.toThrow()
    })

    it('should not call upsert in SSR', () => {
      mockInBrowser.value = false
      const adapter = new Vuetify0ThemeAdapter()

      expect(() => {
        adapter.upsert(':root { --color: red; }')
      }).not.toThrow()
    })
  })

  describe('browser environment', () => {
    let spy: ReturnType<typeof vi.spyOn>
    let mockStyleSheets: CSSStyleSheet[]

    beforeEach(() => {
      mockInBrowser.value = true
      mockStyleSheets = []
      spy = vi.spyOn(document, 'adoptedStyleSheets', 'get').mockImplementation(() => mockStyleSheets)
      vi.spyOn(document, 'adoptedStyleSheets', 'set').mockImplementation(v => {
        mockStyleSheets = v as CSSStyleSheet[]
      })
    })

    afterEach(() => {
      mockInBrowser.value = false
      spy.mockRestore()
    })

    it('should create and inject stylesheet', () => {
      const adapter = new Vuetify0ThemeAdapter()

      adapter.upsert(':root { --primary: #1976d2; }')

      const styleEls = document.adoptedStyleSheets
      expect(styleEls.length).toBe(1)
      expect(styleEls[0]!.cssRules[0]?.cssText).toContain('--primary: #1976d2')
    })

    it('should update existing stylesheet', () => {
      const adapter = new Vuetify0ThemeAdapter()

      adapter.upsert(':root { --primary: #1976d2; }')
      adapter.upsert(':root { --primary: #2196f3; }')

      const styleEls = document.adoptedStyleSheets
      expect(styleEls.length).toBe(1)
      expect(styleEls[0]!.cssRules[0]?.cssText).toContain('--primary: #2196f3')
    })

    it('should set data-theme attribute on target element', async () => {
      const app = createMockApp()
      const context = createMockContext()
      const adapter = new Vuetify0ThemeAdapter()
      const targetEl = document.createElement('div')
      document.body.append(targetEl)

      const scope = effectScope()
      scope.run(() => {
        adapter.setup(app, context, targetEl)
      })

      expect(targetEl.dataset.theme).toBe('light')

      targetEl.remove()
      scope.stop()
    })

    it('should handle null target gracefully', () => {
      const app = createMockApp()
      const context = createMockContext()
      const adapter = new Vuetify0ThemeAdapter()

      const scope = effectScope()
      expect(() => {
        scope.run(() => {
          adapter.setup(app, context, null)
        })
      }).not.toThrow()

      scope.stop()
    })

    it('should handle string selector for target', () => {
      const app = createMockApp()
      const context = createMockContext()
      const adapter = new Vuetify0ThemeAdapter()
      const targetEl = document.createElement('div')
      targetEl.id = 'test-target'
      document.body.append(targetEl)

      const scope = effectScope()
      scope.run(() => {
        adapter.setup(app, context, '#test-target')
      })

      expect(targetEl.dataset.theme).toBe('light')

      targetEl.remove()
      scope.stop()
    })

    it('should handle missing target selector gracefully', () => {
      const app = createMockApp()
      const context = createMockContext()
      const adapter = new Vuetify0ThemeAdapter()

      const scope = effectScope()
      expect(() => {
        scope.run(() => {
          adapter.setup(app, context, '#nonexistent')
        })
      }).not.toThrow()

      scope.stop()
    })

    it('should not set data-theme when id is falsy', async () => {
      const app = createMockApp()
      const context = createMockContext()
      context.selectedId.value = ''
      const adapter = new Vuetify0ThemeAdapter()
      const targetEl = document.createElement('div')
      document.body.append(targetEl)

      const scope = effectScope()
      scope.run(() => {
        adapter.setup(app, context, targetEl)
      })

      expect(targetEl.dataset.theme).toBeUndefined()

      targetEl.remove()
      scope.stop()
    })

    it('should use adoptedStyleSheets when available', () => {
      const replaceSyncMock = vi.fn()
      const CSSStyleSheetMock = vi.fn(function () {
        return { replaceSync: replaceSyncMock }
      })
      vi.stubGlobal('CSSStyleSheet', CSSStyleSheetMock)

      Object.defineProperty(document, 'adoptedStyleSheets', {
        value: [],
        writable: true,
        configurable: true,
      })

      const adapter = new Vuetify0ThemeAdapter()
      const styles = ':root { --primary: #1976d2; }'

      adapter.upsert(styles)

      expect(CSSStyleSheetMock).toHaveBeenCalled()
      expect(replaceSyncMock).toHaveBeenCalledWith(styles)
      expect((document as unknown as Record<string, unknown>).adoptedStyleSheets).toHaveLength(1)

      vi.unstubAllGlobals()
    })

    it('should generate CSS with data-theme selectors and variables', () => {
      const adapter = new Vuetify0ThemeAdapter()

      const css = adapter.generate(
        { light: { primary: '#1976d2', secondary: '#424242' } },
        false,
      )

      expect(css).toContain('[data-theme="light"]')
      expect(css).toContain('--v0-primary: #1976d2')
      expect(css).toContain('--v0-secondary: #424242')
      expect(css).toContain('color-scheme: light')
    })

    it('should generate dark color-scheme when isDark is true', () => {
      const adapter = new Vuetify0ThemeAdapter()

      const css = adapter.generate(
        { dark: { primary: '#90caf9' } },
        true,
      )

      expect(css).toContain('color-scheme: dark')
    })

    it('should use custom prefix in CSS variables', () => {
      const adapter = new Vuetify0ThemeAdapter({ prefix: 'custom' })

      const css = adapter.generate(
        { light: { primary: '#1976d2' } },
        false,
      )

      expect(css).toContain('--custom-primary: #1976d2')
    })

    it('should update isDark reactively', async () => {
      const app = createMockApp()
      const selectedId = ref<string | null>('light')
      const isDark = ref(false)
      const context: ThemeAdapterSetupContext = {
        selectedId,
        colors: computed(() => ({
          light: { primary: '#1976d2' },
          dark: { primary: '#90caf9' },
        })),
        isDark,
      }
      const adapter = new Vuetify0ThemeAdapter()
      const updateSpy = vi.spyOn(adapter, 'update')

      const scope = effectScope()
      scope.run(() => {
        adapter.setup(app, context, null)
      })

      expect(updateSpy).toHaveBeenCalledWith(
        expect.objectContaining({ light: { primary: '#1976d2' } }),
        false,
      )

      isDark.value = true
      await nextTick()

      expect(updateSpy).toHaveBeenLastCalledWith(
        expect.anything(),
        true,
      )

      scope.stop()
    })

    it('should stop watcher on scope dispose', async () => {
      const app = createMockApp()
      const isDark = ref(false)
      const context: ThemeAdapterSetupContext = {
        selectedId: ref('light'),
        colors: computed(() => ({
          light: { primary: '#1976d2' },
        })),
        isDark,
      }
      const adapter = new Vuetify0ThemeAdapter()
      const updateSpy = vi.spyOn(adapter, 'update')

      const scope = effectScope()
      scope.run(() => {
        adapter.setup(app, context, null)
      })

      const callCount = updateSpy.mock.calls.length

      scope.stop()

      isDark.value = true
      await nextTick()

      expect(updateSpy.mock.calls.length).toBe(callCount)
    })
  })
})
