import { describe, expect, it, vi } from 'vitest'

import { V0UnheadThemeAdapter } from './unhead'

// Utilities
import { computed, effectScope, nextTick, ref } from 'vue'

// Types
import type { ThemeAdapterSetupContext } from './adapter'
import type { App } from 'vue'

const mockInBrowser = vi.hoisted(() => ({ value: true }))

vi.mock('#v0/constants/globals', () => ({
  get IN_BROWSER () {
    return mockInBrowser.value
  },
}))

function createMockContext (): ThemeAdapterSetupContext & { selectedId: ReturnType<typeof ref<string | null>>, isDark: ReturnType<typeof ref<boolean>> } {
  const selectedId = ref<string | null>('light')
  const isDark = ref(false)
  return {
    selectedId,
    colors: computed(() => ({
      light: { primary: '#1976d2' },
      dark: { primary: '#90caf9' },
    })),
    isDark,
  }
}

function createMockHead () {
  const patch = vi.fn()
  const push = vi.fn(() => ({ patch }))
  return { push, patch }
}

function createMockApp (head: { push: ReturnType<typeof vi.fn> }): App {
  return {
    _context: {
      provides: { usehead: head },
    },
    _container: null,
  } as unknown as App
}

describe('v0UnheadThemeAdapter', () => {
  describe('setup', () => {
    it('should push both htmlAttrs and style on setup', () => {
      mockInBrowser.value = false
      const head = createMockHead()
      const app = createMockApp(head)
      const context = createMockContext()
      const adapter = new V0UnheadThemeAdapter()

      const scope = effectScope()
      scope.run(() => adapter.setup(app, context))

      expect(head.push).toHaveBeenCalledWith({
        htmlAttrs: { 'data-theme': 'light' },
        style: [{ innerHTML: expect.any(String), id: 'v0-theme-stylesheet' }],
      })

      scope.stop()
      mockInBrowser.value = true
    })

    it('should fall back to provides.head when usehead is missing', () => {
      mockInBrowser.value = false
      const head = createMockHead()
      const app = {
        _context: {
          provides: { head }, // no `usehead` key
        },
        _container: null,
      } as unknown as App
      const context = createMockContext()
      const adapter = new V0UnheadThemeAdapter()

      const scope = effectScope()
      scope.run(() => adapter.setup(app, context))

      expect(head.push).toHaveBeenCalled()

      scope.stop()
      mockInBrowser.value = true
    })

    it('should skip push when no head provider is available', () => {
      mockInBrowser.value = false
      const app = {
        _context: { provides: {} },
        _container: null,
      } as unknown as App
      const context = createMockContext()
      const adapter = new V0UnheadThemeAdapter()

      // Should not throw — early-returns when head is missing
      const scope = effectScope()
      expect(() => scope.run(() => adapter.setup(app, context))).not.toThrow()

      scope.stop()
      mockInBrowser.value = true
    })

    it('should emit empty htmlAttrs when selectedId is null', () => {
      mockInBrowser.value = false
      const head = createMockHead()
      const app = createMockApp(head)
      const context = createMockContext()
      context.selectedId.value = null
      const adapter = new V0UnheadThemeAdapter()

      const scope = effectScope()
      scope.run(() => adapter.setup(app, context))

      expect(head.push).toHaveBeenCalledWith({
        htmlAttrs: { 'data-theme': '' },
        style: [{ innerHTML: expect.any(String), id: 'v0-theme-stylesheet' }],
      })

      scope.stop()
      mockInBrowser.value = true
    })

    it('should accept HTMLElement target', () => {
      const head = createMockHead()
      const app = createMockApp(head)
      const context = createMockContext()
      const adapter = new V0UnheadThemeAdapter()
      const el = document.createElement('div')

      const scope = effectScope()
      scope.run(() => adapter.setup(app, context, el))

      expect(el.dataset.theme).toBe('light')

      scope.stop()
    })

    it('should accept selector string target', () => {
      const head = createMockHead()
      const app = createMockApp(head)
      const context = createMockContext()
      const adapter = new V0UnheadThemeAdapter()

      const el = document.createElement('div')
      el.id = 'theme-target'
      document.body.append(el)

      const scope = effectScope()
      scope.run(() => adapter.setup(app, context, '#theme-target'))

      expect(el.dataset.theme).toBe('light')

      el.remove()
      scope.stop()
    })

    it('should not set data-theme when selectedId is null', async () => {
      const head = createMockHead()
      const app = createMockApp(head)
      const context = createMockContext()
      context.selectedId.value = null
      const adapter = new V0UnheadThemeAdapter()
      const el = document.createElement('div')

      const scope = effectScope()
      scope.run(() => adapter.setup(app, context, el))

      // Without selectedId, dataset.theme stays unset
      expect(el.dataset.theme).toBeUndefined()

      scope.stop()
    })

    it('should fall back through #app and document.body when no target provided', () => {
      const head = createMockHead()
      const app = createMockApp(head)
      const context = createMockContext()
      const adapter = new V0UnheadThemeAdapter()

      const scope = effectScope()
      // No target — falls through app._container (null) → #app (none) → document.body
      scope.run(() => adapter.setup(app, context))

      expect(document.body.dataset.theme).toBe('light')

      delete document.body.dataset.theme
      scope.stop()
    })

    it('should emit empty string for null id in watcher', async () => {
      const head = createMockHead()
      const app = createMockApp(head)
      const context = createMockContext()
      const adapter = new V0UnheadThemeAdapter()

      const scope = effectScope()
      scope.run(() => adapter.setup(app, context))

      head.patch.mockClear()
      // Switch to null — the watcher emits empty string for the id
      context.selectedId.value = null
      await nextTick()

      expect(head.patch).toHaveBeenCalledWith(expect.objectContaining({
        htmlAttrs: { 'data-theme': '' },
      }))

      scope.stop()
    })
  })

  describe('patch atomicity', () => {
    it('should include both htmlAttrs and style in every patch call', async () => {
      const head = createMockHead()
      const app = createMockApp(head)
      const context = createMockContext()
      const adapter = new V0UnheadThemeAdapter()
      const targetEl = document.createElement('div')
      document.body.append(targetEl)

      const scope = effectScope()
      scope.run(() => adapter.setup(app, context, targetEl))

      // Switch theme
      context.selectedId.value = 'dark'
      context.isDark.value = true
      await nextTick()

      const lastCall = head.patch.mock.calls.at(-1)![0]
      expect(lastCall).toHaveProperty('htmlAttrs')
      expect(lastCall).toHaveProperty('style')
      expect(lastCall.htmlAttrs).toEqual({ 'data-theme': 'dark' })
      expect(lastCall.style[0].innerHTML).toContain('[data-theme=')

      targetEl.remove()
      scope.stop()
    })

    it('should not lose style when only selectedId changes', async () => {
      const head = createMockHead()
      const app = createMockApp(head)
      const context = createMockContext()
      const adapter = new V0UnheadThemeAdapter()

      const scope = effectScope()
      scope.run(() => adapter.setup(app, context, null))

      context.selectedId.value = 'dark'
      await nextTick()

      const lastCall = head.patch.mock.calls.at(-1)![0]
      expect(lastCall).toHaveProperty('style')
      expect(lastCall.style[0].innerHTML).toContain('[data-theme=')

      scope.stop()
    })

    it('should not lose htmlAttrs when only isDark changes', async () => {
      const head = createMockHead()
      const app = createMockApp(head)
      const context = createMockContext()
      const adapter = new V0UnheadThemeAdapter()

      const scope = effectScope()
      scope.run(() => adapter.setup(app, context, null))

      context.isDark.value = true
      await nextTick()

      const lastCall = head.patch.mock.calls.at(-1)![0]
      expect(lastCall).toHaveProperty('htmlAttrs')
      expect(lastCall.htmlAttrs).toEqual({ 'data-theme': 'light' })

      scope.stop()
    })

    it('should produce exactly one patch per theme change', async () => {
      const head = createMockHead()
      const app = createMockApp(head)
      const context = createMockContext()
      const adapter = new V0UnheadThemeAdapter()

      const scope = effectScope()
      scope.run(() => adapter.setup(app, context, null))

      head.patch.mockClear()

      // Simultaneously change selectedId + isDark (simulates real theme switch)
      context.selectedId.value = 'dark'
      context.isDark.value = true
      await nextTick()

      expect(head.patch).toHaveBeenCalledTimes(1)

      scope.stop()
    })
  })

  describe('target element', () => {
    it('should set data-theme on target element synchronously', () => {
      const head = createMockHead()
      const app = createMockApp(head)
      const context = createMockContext()
      const adapter = new V0UnheadThemeAdapter()
      const targetEl = document.createElement('div')
      document.body.append(targetEl)

      const scope = effectScope()
      scope.run(() => adapter.setup(app, context, targetEl))

      expect(targetEl.dataset.theme).toBe('light')

      targetEl.remove()
      scope.stop()
    })

    it('should update data-theme on target when theme changes', async () => {
      const head = createMockHead()
      const app = createMockApp(head)
      const context = createMockContext()
      const adapter = new V0UnheadThemeAdapter()
      const targetEl = document.createElement('div')
      document.body.append(targetEl)

      const scope = effectScope()
      scope.run(() => adapter.setup(app, context, targetEl))

      context.selectedId.value = 'dark'
      await nextTick()

      expect(targetEl.dataset.theme).toBe('dark')

      targetEl.remove()
      scope.stop()
    })

    it('should not set data-theme when target is null', () => {
      const head = createMockHead()
      const app = createMockApp(head)
      const context = createMockContext()
      const adapter = new V0UnheadThemeAdapter()

      const scope = effectScope()
      scope.run(() => adapter.setup(app, context, null))

      // No DOM element should have data-theme set
      expect(document.documentElement.dataset.theme).toBeUndefined()

      scope.stop()
    })
  })

  describe('scope disposal', () => {
    it('should stop watcher on scope dispose', async () => {
      const head = createMockHead()
      const app = createMockApp(head)
      const context = createMockContext()
      const adapter = new V0UnheadThemeAdapter()

      const scope = effectScope()
      scope.run(() => adapter.setup(app, context, null))

      head.patch.mockClear()
      scope.stop()

      context.selectedId.value = 'dark'
      await nextTick()

      expect(head.patch).not.toHaveBeenCalled()
    })

    it('should stop watcher and call entry.dispose when adapter.dispose() is called in browser mode', async () => {
      const entryDispose = vi.fn()
      const head = {
        push: vi.fn(() => ({ patch: vi.fn(), dispose: entryDispose })),
      }
      const app = createMockApp(head)
      const context = createMockContext()
      const adapter = new V0UnheadThemeAdapter()

      const scope = effectScope()
      scope.run(() => adapter.setup(app, context, null))

      expect(adapter.dispose).toBeDefined()
      adapter.dispose?.()

      context.selectedId.value = 'dark'
      await nextTick()

      expect(entryDispose).toHaveBeenCalledTimes(1)
    })

    it('should call entry.dispose when adapter.dispose() is called in SSR mode', () => {
      mockInBrowser.value = false

      const entryDispose = vi.fn()
      const head = {
        push: vi.fn(() => ({ patch: vi.fn(), dispose: entryDispose })),
      }
      const app = {
        _context: { provides: { usehead: head } },
        _container: null,
      } as unknown as App
      const context = createMockContext()
      const adapter = new V0UnheadThemeAdapter()

      adapter.setup(app, context, null)

      expect(adapter.dispose).toBeDefined()
      adapter.dispose?.()

      expect(entryDispose).toHaveBeenCalledTimes(1)

      mockInBrowser.value = true
    })

    it('should tolerate entries without patch or dispose', () => {
      mockInBrowser.value = false
      const head = {
        push: vi.fn(() => ({})),
      }
      const app = {
        _context: { provides: { usehead: head } },
        _container: null,
      } as unknown as App
      const context = createMockContext()
      const adapter = new V0UnheadThemeAdapter()

      adapter.setup(app, context, null)

      expect(() => adapter.update(context.colors.value, context.isDark.value)).not.toThrow()
      expect(() => adapter.dispose?.()).not.toThrow()

      mockInBrowser.value = true
    })
  })

  describe('update', () => {
    it('should patch the entry with new colors and isDark', () => {
      const head = createMockHead()
      const app = createMockApp(head)
      const context = createMockContext()
      const adapter = new V0UnheadThemeAdapter()

      const scope = effectScope()
      scope.run(() => adapter.setup(app, context, null))

      head.patch.mockClear()

      adapter.update({ light: { primary: '#000' } }, true)

      expect(head.patch).toHaveBeenCalledTimes(1)
      const call = head.patch.mock.calls[0]![0]
      expect(call).toHaveProperty('style')
      expect(call.style[0].id).toBe('v0-theme-stylesheet')
    })

    it('should be a no-op when no entry was created', () => {
      const adapter = new V0UnheadThemeAdapter()

      // No setup() called — entry is undefined
      expect(() => adapter.update({ light: { primary: '#000' } })).not.toThrow()
    })
  })
})
