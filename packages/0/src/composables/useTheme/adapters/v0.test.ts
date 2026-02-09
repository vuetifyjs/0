import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Utilities
import { computed, effectScope, ref } from 'vue'

// Types
import type { ThemeAdapterSetupContext } from './adapter'
import type { App } from 'vue'

import { Vuetify0ThemeAdapter } from './v0'

// Mock IN_BROWSER - start with false for SSR tests
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
      const app = createMockApp() // no head mock
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

      // Should not throw, just early return
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

      // data-theme should not be set when id is empty
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
      expect((document as any).adoptedStyleSheets).toHaveLength(1)

      vi.unstubAllGlobals()
    })
  })
})
