import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Utilities
import { createApp, defineComponent, effectScope, h } from 'vue'

import { createTooltipContext, createTooltipPlugin, useTooltip } from './index'

describe('useTooltip', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  describe('defaults', () => {
    it('should expose default delays', () => {
      const scope = effectScope()
      scope.run(() => {
        const [,, ctx] = createTooltipContext({ namespace: 'v0:test-tooltip' })
        expect(ctx.openDelay.value).toBe(700)
        expect(ctx.closeDelay.value).toBe(150)
        expect(ctx.skipDelay.value).toBe(300)
        expect(ctx.disabled.value).toBe(false)
      })
      scope.stop()
    })

    it('should override defaults from options', () => {
      const scope = effectScope()
      scope.run(() => {
        const [,, ctx] = createTooltipContext({
          namespace: 'v0:test-tooltip',
          openDelay: 500,
          closeDelay: 200,
          skipDelay: 400,
          disabled: true,
        })
        expect(ctx.openDelay.value).toBe(500)
        expect(ctx.closeDelay.value).toBe(200)
        expect(ctx.skipDelay.value).toBe(400)
        expect(ctx.disabled.value).toBe(true)
      })
      scope.stop()
    })
  })

  describe('registry', () => {
    it('should track open tooltips via register / unregister', () => {
      const scope = effectScope()
      scope.run(() => {
        const [,, ctx] = createTooltipContext({ namespace: 'v0:test-tooltip' })
        expect(ctx.isAnyOpen.value).toBe(false)

        const ticket = ctx.register({ id: 't:1' })
        expect(ctx.isAnyOpen.value).toBe(true)

        ctx.unregister(ticket.id)
        expect(ctx.isAnyOpen.value).toBe(false)
      })
      scope.stop()
    })
  })

  describe('skip-window', () => {
    it('should skip open delay when another tooltip is open', () => {
      const scope = effectScope()
      scope.run(() => {
        const [,, ctx] = createTooltipContext({ namespace: 'v0:test-tooltip' })
        const ticket = ctx.register({ id: 't:1' })

        expect(ctx.shouldSkipOpenDelay()).toBe(true)
        ctx.unregister(ticket.id)
      })
      scope.stop()
    })

    it('should skip open delay within skipDelay window after last close', () => {
      const scope = effectScope()
      scope.run(() => {
        const [,, ctx] = createTooltipContext({ namespace: 'v0:test-tooltip', skipDelay: 300 })
        const ticket = ctx.register({ id: 't:1' })
        ctx.unregister(ticket.id)

        vi.advanceTimersByTime(200)
        expect(ctx.shouldSkipOpenDelay()).toBe(true)

        vi.advanceTimersByTime(200) // 400ms total
        expect(ctx.shouldSkipOpenDelay()).toBe(false)
      })
      scope.stop()
    })

    it('should not skip when no tooltips have ever opened', () => {
      const scope = effectScope()
      scope.run(() => {
        const [,, ctx] = createTooltipContext({ namespace: 'v0:test-tooltip', skipDelay: 300 })
        expect(ctx.shouldSkipOpenDelay()).toBe(false)
      })
      scope.stop()
    })

    it('should not skip at exactly the skipDelay boundary', () => {
      const scope = effectScope()
      scope.run(() => {
        const [,, ctx] = createTooltipContext({ namespace: 'v0:test-tooltip', skipDelay: 300 })
        const ticket = ctx.register({ id: 't:1' })
        ctx.unregister(ticket.id)

        vi.advanceTimersByTime(300) // elapsed === skipDelay → boundary is exclusive ('<')
        expect(ctx.shouldSkipOpenDelay()).toBe(false)
      })
      scope.stop()
    })
  })

  describe('plugin install', () => {
    it('should expose useTooltip after app.use(createTooltipPlugin())', () => {
      let captured: ReturnType<typeof useTooltip> | undefined

      const Probe = defineComponent({
        setup () {
          captured = useTooltip()
          return () => h('div')
        },
      })

      const app = createApp(Probe)
      app.use(createTooltipPlugin({ openDelay: 400 }))
      const root = document.createElement('div')
      app.mount(root)

      expect(captured?.openDelay.value).toBe(400)

      app.unmount()
    })

    it('should expose default delays via fallback without plugin install', () => {
      let captured: ReturnType<typeof useTooltip> | undefined

      const Probe = defineComponent({
        setup () {
          captured = useTooltip()
          return () => h('div')
        },
      })

      const app = createApp(Probe)
      const root = document.createElement('div')
      app.mount(root)

      expect(captured?.openDelay.value).toBe(700)

      app.unmount()
    })
  })

  describe('namespace', () => {
    it('should isolate contexts across namespaces', () => {
      const scope = effectScope()
      scope.run(() => {
        const [,, ctxA] = createTooltipContext({ namespace: 'v0:test-tooltip-a', openDelay: 100 })
        const [,, ctxB] = createTooltipContext({ namespace: 'v0:test-tooltip-b', openDelay: 200 })
        expect(ctxA.openDelay.value).toBe(100)
        expect(ctxB.openDelay.value).toBe(200)
        // Confirm registries are independent
        ctxA.register({ id: 'tooltip-a:1' })
        expect(ctxA.isAnyOpen.value).toBe(true)
        expect(ctxB.isAnyOpen.value).toBe(false)
      })
      scope.stop()
    })
  })
})
