import { describe, expect, it } from 'vitest'

import { usePresence } from './index'

// Utilities
import { effectScope, nextTick, ref } from 'vue'

describe('usePresence', () => {
  describe('initial state', () => {
    it('should start unmounted when present is false', () => {
      const scope = effectScope()

      scope.run(() => {
        const present = ref(false)
        const presence = usePresence({ present })

        expect(presence.state.value).toBe('unmounted')
        expect(presence.isMounted.value).toBe(false)
        expect(presence.isPresent.value).toBe(false)
        expect(presence.isLeaving.value).toBe(false)
      })

      scope.stop()
    })

    it('should be present when present starts true', async () => {
      const scope = effectScope()

      await scope.run(async () => {
        const present = ref(true)
        const presence = usePresence({ present })

        // Mounted on first tick
        expect(presence.state.value).toBe('mounted')
        expect(presence.isMounted.value).toBe(true)

        await nextTick()

        expect(presence.state.value).toBe('present')
        expect(presence.isPresent.value).toBe(true)
      })

      scope.stop()
    })
  })

  describe('lifecycle transitions', () => {
    it('should transition unmounted → mounted → present', async () => {
      const scope = effectScope()

      await scope.run(async () => {
        const present = ref(false)
        const presence = usePresence({ present })

        expect(presence.state.value).toBe('unmounted')

        present.value = true
        await nextTick()

        expect(presence.state.value).toBe('mounted')
        expect(presence.isMounted.value).toBe(true)

        await nextTick()

        expect(presence.state.value).toBe('present')
        expect(presence.isPresent.value).toBe(true)
      })

      scope.stop()
    })

    it('should transition present → leaving → unmounted on done()', async () => {
      const scope = effectScope()

      await scope.run(async () => {
        const present = ref(true)
        const presence = usePresence({ present, immediate: false })

        await nextTick()
        await nextTick()

        present.value = false
        await nextTick()

        expect(presence.state.value).toBe('leaving')
        expect(presence.isLeaving.value).toBe(true)
        expect(presence.isMounted.value).toBe(true)

        presence.done()

        expect(presence.state.value).toBe('unmounted')
        expect(presence.isMounted.value).toBe(false)
      })

      scope.stop()
    })
  })

  describe('immediate mode', () => {
    it('should auto-resolve leaving state on next tick by default', async () => {
      const scope = effectScope()

      await scope.run(async () => {
        const present = ref(true)
        const presence = usePresence({ present })

        await nextTick()
        await nextTick()

        present.value = false
        await nextTick()

        expect(presence.state.value).toBe('leaving')

        await nextTick()

        expect(presence.state.value).toBe('unmounted')
      })

      scope.stop()
    })

    it('should not auto-resolve when immediate is false', async () => {
      const scope = effectScope()

      await scope.run(async () => {
        const present = ref(true)
        const presence = usePresence({ present, immediate: false })

        await nextTick()
        await nextTick()

        present.value = false
        await nextTick()
        await nextTick()
        await nextTick()

        expect(presence.state.value).toBe('leaving')
      })

      scope.stop()
    })
  })

  describe('re-entry during leave', () => {
    it('should cancel leave and return to present', async () => {
      const scope = effectScope()

      await scope.run(async () => {
        const present = ref(true)
        const presence = usePresence({ present, immediate: false })

        await nextTick()
        await nextTick()

        present.value = false
        await nextTick()

        expect(presence.state.value).toBe('leaving')

        present.value = true
        await nextTick()

        expect(presence.state.value).toBe('present')
        expect(presence.isMounted.value).toBe(true)
        expect(presence.isLeaving.value).toBe(false)
      })

      scope.stop()
    })
  })

  describe('lazy mounting', () => {
    it('should not mount until present is first true', async () => {
      const scope = effectScope()

      await scope.run(async () => {
        const present = ref(false)
        const presence = usePresence({ present, lazy: true })

        expect(presence.isMounted.value).toBe(false)

        // Toggling false → false should do nothing
        present.value = false
        await nextTick()

        expect(presence.isMounted.value).toBe(false)

        present.value = true
        await nextTick()

        expect(presence.isMounted.value).toBe(true)
      })

      scope.stop()
    })

    it('should stay mounted after leave in lazy mode', async () => {
      const scope = effectScope()

      await scope.run(async () => {
        const present = ref(false)
        const presence = usePresence({ present, lazy: true })

        present.value = true
        await nextTick()
        await nextTick()

        expect(presence.state.value).toBe('present')

        present.value = false
        await nextTick()
        await nextTick()

        // Lazy: stays mounted, not unmounted
        expect(presence.state.value).toBe('mounted')
        expect(presence.isMounted.value).toBe(true)
        expect(presence.isPresent.value).toBe(false)

        // Re-activation goes straight to present (no enter tick)
        present.value = true
        await nextTick()

        expect(presence.state.value).toBe('present')
      })

      scope.stop()
    })
  })

  describe('cleanup', () => {
    it('should clean up on scope disposal', async () => {
      const scope = effectScope()
      let presence: ReturnType<typeof usePresence>

      scope.run(() => {
        const present = ref(true)
        presence = usePresence({ present })
      })

      scope.stop()

      expect(presence!.state.value).toBe('unmounted')
    })
  })
})
