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
  })
})
