import { describe, expect, it, vi } from 'vitest'

// Composables
import { createHydrationPlugin, useHydration } from '#v0/composables/useHydration'

import { createTour, createTourContext, createTourPlugin, useTour } from './index'

// Utilities
import { mount } from '@vue/test-utils'
import { createApp, defineComponent, h, nextTick } from 'vue'

// Types
import type { ShallowRef } from 'vue'

const { warn } = vi.hoisted(() => ({
  warn: vi.fn(),
}))

vi.mock('#v0/composables/useLogger', () => ({
  useLogger: () => ({
    debug: vi.fn(),
    info: vi.fn(),
    warn,
    error: vi.fn(),
    trace: vi.fn(),
    fatal: vi.fn(),
    level: vi.fn(),
    current: vi.fn(),
    enabled: vi.fn(),
    enable: vi.fn(),
    disable: vi.fn(),
  }),
}))

function write (flag: Readonly<ShallowRef<boolean>>, value: boolean) {
  (flag as ShallowRef<boolean>).value = value
}

describe('createTour', () => {
  describe('factory', () => {
    it('should start empty and inactive', () => {
      const tour = createTour()

      expect(tour.isActive.value).toBe(false)
      expect(tour.total).toBe(0)
    })

    it('should expose total as a number getter, not a ref', () => {
      const tour = createTour()

      expect(typeof tour.total).toBe('number')
      expect(tour.total).toBe(0)

      tour.steps.onboard([{ id: 'a' }, { id: 'b' }])

      expect(tour.total).toBe(2)
    })
  })

  describe('start', () => {
    it('should select the first step and set isActive after onboard', () => {
      const tour = createTour()

      tour.steps.onboard([{ id: 'one' }, { id: 'two' }])
      tour.start()

      expect(tour.steps.selectedId.value).toBe('one')
      expect(tour.isActive.value).toBe(true)
    })

    it('should select the given stepId', () => {
      const tour = createTour()

      tour.steps.onboard([{ id: 'one' }, { id: 'two' }, { id: 'three' }])
      tour.start({ stepId: 'two' })

      expect(tour.steps.selectedId.value).toBe('two')
      expect(tour.isActive.value).toBe(true)
    })

    it('should not activate when start is called with zero steps', () => {
      const tour = createTour()

      tour.start()

      expect(tour.isActive.value).toBe(false)
      expect(tour.steps.size).toBe(0)
    })
  })

  describe('navigation', () => {
    it('should advance with next and prev, and no-op at boundaries', async () => {
      const tour = createTour()

      tour.steps.onboard([{ id: 'one' }, { id: 'two' }, { id: 'three' }])
      tour.start()

      expect(tour.steps.selectedId.value).toBe('one')

      await tour.prev()
      expect(tour.steps.selectedId.value).toBe('one')

      await tour.next()
      expect(tour.steps.selectedId.value).toBe('two')

      await tour.next()
      expect(tour.steps.selectedId.value).toBe('three')

      await tour.next()
      expect(tour.steps.selectedId.value).toBe('three')
    })

    it('should ignore next from an enter that resolves after stop', async () => {
      const tour = createTour()
      function hold () {}
      let release = hold

      tour.steps.onboard([
        {
          id: 'a',
          enter (ctx) {
            return new Promise<void>(resolve => {
              release = function fire () {
                void ctx.next()
                resolve()
              }
            })
          },
        },
        { id: 'b' },
      ])
      tour.start()
      expect(tour.steps.selectedId.value).toBe('a')

      tour.stop()
      release()
      await Promise.resolve()

      expect(tour.steps.selectedId.value).toBe('a')
      expect(tour.isActive.value).toBe(false)
    })

    it('should ignore next from an earlier visit', async () => {
      const tour = createTour()
      function hold () {}
      let stale = hold

      tour.steps.onboard([
        {
          id: 'a',
          enter (ctx) {
            stale = function fire () {
              void ctx.next()
            }
            ctx.done()
          },
        },
        { id: 'b' },
        { id: 'c' },
      ])
      tour.start()
      await tour.next()

      expect(tour.steps.selectedId.value).toBe('b')

      stale()
      await Promise.resolve()

      expect(tour.steps.selectedId.value).toBe('b')
    })

    it('should not advance when a leave hook stops the tour', async () => {
      const tour = createTour()

      tour.steps.onboard([
        {
          id: 'a',
          leave () {
            tour.stop()
          },
        },
        { id: 'b' },
      ])
      tour.start()
      await tour.next()

      expect(tour.steps.selectedId.value).toBe('a')
      expect(tour.isActive.value).toBe(false)
    })

    it('should run completed when a leave hook completes during prev', async () => {
      const tour = createTour()
      const completed = vi.fn()

      tour.steps.onboard([
        { id: 'a' },
        {
          id: 'b',
          completed,
          leave () {
            void tour.complete()
          },
        },
      ])
      tour.start()
      await tour.next()
      await tour.prev()

      expect(completed).toHaveBeenCalledTimes(1)
      expect(tour.steps.selectedId.value).toBe('b')
      expect(tour.isActive.value).toBe(false)
      expect(tour.isComplete.value).toBe(true)
    })

    it('should ignore start called from a leave hook', async () => {
      const tour = createTour()

      tour.steps.onboard([
        { id: 'a' },
        {
          id: 'b',
          leave () {
            tour.start({ stepId: 'a' })
          },
        },
        { id: 'c' },
      ])
      tour.start()
      await tour.next()
      await tour.next()

      expect(tour.steps.selectedId.value).toBe('c')
      expect(tour.isActive.value).toBe(true)
    })

    it('should not move off the current step when a leave hook calls prev', async () => {
      const tour = createTour()
      let during: string | number | undefined

      tour.steps.onboard([
        { id: 'a' },
        { id: 'b' },
        {
          id: 'c',
          leave () {
            void tour.prev()
            during = tour.steps.selectedId.value
          },
        },
      ])
      tour.start()
      await tour.next()
      await tour.next()
      expect(tour.steps.selectedId.value).toBe('c')

      await tour.prev()

      expect(during).toBe('c')
      expect(tour.steps.selectedId.value).toBe('b')
      expect(tour.isActive.value).toBe(true)
    })
  })

  describe('stop and complete', () => {
    it('should start again after stop', async () => {
      const tour = createTour()
      let once = true

      tour.steps.onboard([
        {
          id: 'a',
          leave () {
            if (!once) return
            once = false
            void tour.complete()
            tour.stop()
          },
        },
        { id: 'b' },
      ])
      tour.start()
      await tour.next()
      tour.start()

      expect(tour.isActive.value).toBe(true)
      expect(tour.isComplete.value).toBe(false)

      await tour.next()

      expect(tour.isActive.value).toBe(true)
      expect(tour.isComplete.value).toBe(false)
      expect(tour.steps.selectedId.value).toBe('b')
    })

    it('should set isComplete only on complete, not stop', async () => {
      const tour = createTour()

      tour.steps.onboard([{ id: 'one' }])
      tour.start()
      tour.stop()

      expect(tour.isActive.value).toBe(false)
      expect(tour.isComplete.value).toBe(false)

      tour.start()
      await tour.complete()

      expect(tour.isActive.value).toBe(false)
      expect(tour.isComplete.value).toBe(true)
    })
  })

  describe('reset', () => {
    it('should clear steps and flags', async () => {
      const tour = createTour()

      tour.steps.onboard([{ id: 'one' }, { id: 'two' }])
      tour.start()
      await tour.complete()
      tour.reset()

      expect(tour.total).toBe(0)
      expect(tour.isActive.value).toBe(false)
      expect(tour.isComplete.value).toBe(false)
      expect(tour.isReady.value).toBe(false)
    })
  })

  describe('isReady', () => {
    it('should start unready when enter captures done, no-op next, then advance after done', async () => {
      const tour = createTour()
      let done: (() => void) | undefined

      tour.steps.onboard([
        {
          id: 'wait',
          enter (ctx) {
            done = ctx.done
          },
        },
        { id: 'next' },
      ])
      tour.start()

      expect(tour.isReady.value).toBe(false)
      expect(tour.steps.selectedId.value).toBe('wait')

      await tour.next()
      expect(tour.steps.selectedId.value).toBe('wait')

      done?.()
      expect(tour.isReady.value).toBe(true)

      await tour.next()
      expect(tour.steps.selectedId.value).toBe('next')
    })

    it('should advance after ready when enter waits on ctx', async () => {
      const tour = createTour()
      let visit = 0

      tour.steps.onboard([
        {
          id: 'wait',
          enter (ctx) {
            visit = ctx.visit
          },
        },
        { id: 'next' },
      ])
      tour.start()

      expect(tour.isReady.value).toBe(false)

      await tour.next()
      expect(tour.steps.selectedId.value).toBe('wait')

      tour.ready('wait', visit)
      expect(tour.isReady.value).toBe(true)

      await tour.next()
      expect(tour.steps.selectedId.value).toBe('next')
    })

    it('should ignore ready from an earlier visit or a different step', () => {
      const tour = createTour()
      let visit = 0

      tour.steps.onboard([
        {
          id: 'wait',
          enter (ctx) {
            visit = ctx.visit
          },
        },
      ])
      tour.start()
      const first = visit

      tour.stop()
      tour.ready('wait', first)
      expect(tour.isReady.value).toBe(false)

      tour.start()
      tour.ready('wait', first)
      expect(tour.isReady.value).toBe(false)

      tour.ready('other', visit)
      expect(tour.isReady.value).toBe(false)

      tour.ready('wait', visit)
      expect(tour.isReady.value).toBe(true)
    })
  })

  describe('form gate', () => {
    it('should block next when form.submit returns false, then advance when true', async () => {
      const tour = createTour()

      tour.steps.onboard([{ id: 'form' }, { id: 'after' }])
      tour.start()

      vi.spyOn(tour.form, 'has').mockReturnValue(true)
      const submit = vi.spyOn(tour.form, 'submit')
      submit.mockResolvedValueOnce(false)
      submit.mockResolvedValueOnce(true)

      await tour.next()
      expect(tour.steps.selectedId.value).toBe('form')

      await tour.next()
      expect(tour.steps.selectedId.value).toBe('after')
    })

    it('should advance one step when next is called twice during validation', async () => {
      const tour = createTour()

      tour.steps.onboard([{ id: 'a' }, { id: 'b' }, { id: 'c' }])
      tour.start()

      function hold (_value: boolean) {}
      let release: (value: boolean) => void = hold

      vi.spyOn(tour.form, 'has').mockReturnValue(true)
      vi.spyOn(tour.form, 'submit').mockImplementation(() => new Promise(resolve => {
        release = resolve
      }))

      const first = tour.next()
      const second = tour.next()

      release(true)
      await first
      await second

      expect(tour.steps.selectedId.value).toBe('b')
    })

    it('should complete instead of advancing when complete is called during validation', async () => {
      const tour = createTour()

      tour.steps.onboard([{ id: 'a' }, { id: 'b' }])
      tour.start()

      function hold (_value: boolean) {}
      let release: (value: boolean) => void = hold

      vi.spyOn(tour.form, 'has').mockReturnValue(true)
      vi.spyOn(tour.form, 'submit').mockImplementation(() => new Promise(resolve => {
        release = resolve
      }))

      const pending = tour.next()
      const completing = tour.complete()

      release(true)
      await pending
      await completing

      expect(tour.steps.selectedId.value).toBe('a')
      expect(tour.isActive.value).toBe(false)
      expect(tour.isComplete.value).toBe(true)
    })

    it('should resolve complete after an in-flight next ends the tour', async () => {
      const tour = createTour()

      tour.steps.onboard([{ id: 'a' }, { id: 'b' }])
      tour.start()

      function hold (_value: boolean) {}
      let release: (value: boolean) => void = hold

      vi.spyOn(tour.form, 'has').mockReturnValue(true)
      vi.spyOn(tour.form, 'submit').mockImplementation(() => new Promise(resolve => {
        release = resolve
      }))

      void tour.next()
      const completing = tour.complete()

      release(true)
      await completing

      expect(tour.isActive.value).toBe(false)
      expect(tour.isComplete.value).toBe(true)
    })

    it('should leave the tour incomplete when an in-flight gate rejects complete', async () => {
      const tour = createTour()

      tour.steps.onboard([{ id: 'a' }, { id: 'b' }])
      tour.start()

      function hold (_value: boolean) {}
      let release: (value: boolean) => void = hold

      vi.spyOn(tour.form, 'has').mockReturnValue(true)
      vi.spyOn(tour.form, 'submit').mockImplementation(() => new Promise(resolve => {
        release = resolve
      }))

      void tour.next()
      const completing = tour.complete()

      release(false)
      await completing

      expect(tour.isActive.value).toBe(true)
      expect(tour.isComplete.value).toBe(false)
    })

    it('should not end the tour on the next advance after a rejected second complete', async () => {
      const tour = createTour()

      tour.steps.onboard([{ id: 'a' }, { id: 'b' }])
      tour.start()

      function hold (_value: boolean) {}
      let release: (value: boolean) => void = hold

      vi.spyOn(tour.form, 'has').mockReturnValue(true)
      vi.spyOn(tour.form, 'submit').mockImplementation(() => new Promise(resolve => {
        release = resolve
      }))

      const first = tour.complete()
      void tour.complete()

      release(false)
      await first

      const pending = tour.next()
      release(true)
      await pending

      expect(tour.steps.selectedId.value).toBe('b')
      expect(tour.isActive.value).toBe(true)
      expect(tour.isComplete.value).toBe(false)
    })

    it('should finish the tour when submit awaits complete', async () => {
      const tour = createTour()

      tour.steps.onboard([{ id: 'a' }, { id: 'b' }])
      tour.start()

      vi.spyOn(tour.form, 'has').mockReturnValue(true)
      vi.spyOn(tour.form, 'submit').mockImplementation(async () => {
        await tour.complete()
        return true
      })

      await tour.next()

      expect(tour.steps.selectedId.value).toBe('a')
      expect(tour.isActive.value).toBe(false)
      expect(tour.isComplete.value).toBe(true)
    })

    it('should not advance when the tour stops during validation', async () => {
      const tour = createTour()

      tour.steps.onboard([{ id: 'a' }, { id: 'b' }])
      tour.start()

      function hold (_value: boolean) {}
      let release: (value: boolean) => void = hold

      vi.spyOn(tour.form, 'has').mockReturnValue(true)
      vi.spyOn(tour.form, 'submit').mockImplementation(() => new Promise(resolve => {
        release = resolve
      }))

      const pending = tour.next()

      tour.stop()
      release(true)
      await pending

      expect(tour.isActive.value).toBe(false)
      expect(tour.steps.selectedId.value).toBe('a')
    })

    it('should not submit again when leave calls complete during stop', async () => {
      const tour = createTour()
      let calls = 0

      tour.steps.onboard([
        {
          id: 'a',
          leave () {
            void tour.complete()
          },
        },
        { id: 'b' },
      ])
      tour.start()

      vi.spyOn(tour.form, 'has').mockReturnValue(true)
      vi.spyOn(tour.form, 'submit').mockImplementation(() => {
        calls++
        return Promise.resolve(true)
      })

      const pending = tour.next()

      tour.stop()
      await pending

      expect(calls).toBe(1)
      expect(tour.isActive.value).toBe(false)
      expect(tour.isComplete.value).toBe(false)
    })

    it('should navigate a tour restarted during validation', async () => {
      const tour = createTour()

      tour.steps.onboard([{ id: 'a' }, { id: 'b' }])
      tour.start()

      function hold (_value: boolean) {}
      let release: (value: boolean) => void = hold
      let calls = 0

      vi.spyOn(tour.form, 'has').mockReturnValue(true)
      vi.spyOn(tour.form, 'submit').mockImplementation(async () => {
        calls++
        if (calls > 1) return true
        return new Promise(resolve => {
          release = resolve
        })
      })

      const pending = tour.next()

      tour.stop()
      tour.start()
      await tour.next()

      expect(tour.steps.selectedId.value).toBe('b')
      expect(tour.isActive.value).toBe(true)

      release(true)
      await pending

      expect(tour.steps.selectedId.value).toBe('b')
      expect(tour.isComplete.value).toBe(false)
    })

    it('should complete a tour restarted during validation', async () => {
      const tour = createTour()

      tour.steps.onboard([{ id: 'a' }, { id: 'b' }])
      tour.start()

      function hold (_value: boolean) {}
      let release: (value: boolean) => void = hold
      let calls = 0

      vi.spyOn(tour.form, 'has').mockReturnValue(true)
      vi.spyOn(tour.form, 'submit').mockImplementation(async () => {
        calls++
        if (calls > 1) return true
        return new Promise(resolve => {
          release = resolve
        })
      })

      const pending = tour.next()

      tour.stop()
      tour.start()
      await tour.complete()

      expect(tour.isActive.value).toBe(false)
      expect(tour.isComplete.value).toBe(true)

      release(true)
      await pending

      expect(tour.isActive.value).toBe(false)
      expect(tour.isComplete.value).toBe(true)
    })

    it('should complete a restarted tour when the older gate resolves first', async () => {
      const tour = createTour()

      tour.steps.onboard([{ id: 'a' }, { id: 'b' }])
      tour.start()

      function hold (_value: boolean) {}
      let releaseStale: (value: boolean) => void = hold
      let releaseNext: (value: boolean) => void = hold
      let calls = 0

      vi.spyOn(tour.form, 'has').mockReturnValue(true)
      vi.spyOn(tour.form, 'submit').mockImplementation(() => {
        calls++
        return new Promise(resolve => {
          if (calls === 1) releaseStale = resolve
          else releaseNext = resolve
        })
      })

      const stale = tour.next()

      tour.stop()
      tour.start()

      const pending = tour.next()
      void tour.complete()

      releaseStale(true)
      await stale
      releaseNext(true)
      await pending

      expect(tour.steps.selectedId.value).toBe('a')
      expect(tour.isActive.value).toBe(false)
      expect(tour.isComplete.value).toBe(true)
    })

    it('should complete a restarted tour when the older submit fails first', async () => {
      const tour = createTour()

      tour.steps.onboard([{ id: 'a' }, { id: 'b' }])
      tour.start()

      function hold (_value: boolean) {}
      let releaseStale: (value: boolean) => void = hold
      let releaseNext: (value: boolean) => void = hold
      let calls = 0

      vi.spyOn(tour.form, 'has').mockReturnValue(true)
      vi.spyOn(tour.form, 'submit').mockImplementation(() => {
        calls++
        return new Promise(resolve => {
          if (calls === 1) releaseStale = resolve
          else releaseNext = resolve
        })
      })

      const stale = tour.complete()

      tour.stop()
      tour.start()

      const pending = tour.next()
      void tour.complete()

      releaseStale(false)
      await stale
      releaseNext(true)
      await pending

      expect(tour.steps.selectedId.value).toBe('a')
      expect(tour.isActive.value).toBe(false)
      expect(tour.isComplete.value).toBe(true)
    })
  })

  describe('activate', () => {
    it('should register under the current step id, set anchor-name, and unregister on deactivate', () => {
      const tour = createTour()
      const el = document.createElement('div')

      tour.steps.onboard([{ id: 'search' }])
      tour.start()
      tour.activate(el, { padding: 8, scroll: false })

      expect(tour.activators.get('search')).toMatchObject({
        id: 'search',
        element: el,
        padding: 8,
      })
      expect(el.style.getPropertyValue('anchor-name')).toBe('--tour-search')
      expect(el.style.scrollMarginTop).toBe('100px')
      expect(el.style.scrollMarginBottom).toBe('100px')

      tour.deactivate()

      expect(tour.activators.get('search')).toBeUndefined()
      expect(el.style.getPropertyValue('anchor-name')).toBe('')
      expect(el.style.scrollMarginTop).toBe('')
      expect(el.style.scrollMarginBottom).toBe('')
    })

    it('should clean the programmatic activator on stop', () => {
      const tour = createTour()
      const el = document.createElement('button')

      tour.steps.onboard([{ id: 'target' }])
      tour.start()
      tour.activate(el, { scroll: false })

      expect(tour.activators.get('target')).toMatchObject({
        id: 'target',
        element: el,
      })

      tour.stop()

      expect(tour.activators.get('target')).toBeUndefined()
      expect(el.style.getPropertyValue('anchor-name')).toBe('')
    })

    it('should ignore activate from an enter that resolves after stop', async () => {
      const tour = createTour()
      const el = document.createElement('div')
      function hold () {}
      let release = hold

      tour.steps.onboard([{
        id: 'late',
        enter (ctx) {
          return new Promise<void>(resolve => {
            release = function fire () {
              ctx.activate(el)
              resolve()
            }
          })
        },
      }])

      tour.start()
      tour.stop()
      release()
      await Promise.resolve()

      expect(el.style.getPropertyValue('anchor-name')).toBe('')
      expect(tour.isActive.value).toBe(false)
    })

    it('should ignore activate from an earlier visit', async () => {
      const tour = createTour()
      const el = document.createElement('div')
      function hold () {}
      let stale = hold

      tour.steps.onboard([
        {
          id: 'a',
          enter (ctx) {
            stale = function fire () {
              ctx.activate(el, { scroll: false })
            }
            ctx.done()
          },
        },
        { id: 'b' },
      ])
      tour.start()
      await tour.next()
      stale()

      expect(tour.steps.selectedId.value).toBe('b')
      expect(el.style.getPropertyValue('anchor-name')).toBe('')
      expect(tour.activators.size).toBe(0)
    })
  })

  describe('events and handlers', () => {
    it('should emit completed once on successful next, not on prev', async () => {
      const tour = createTour()
      const completed = vi.fn()

      tour.steps.onboard([{ id: 'one' }, { id: 'two' }])
      tour.steps.on('completed', completed)
      tour.start()

      await tour.next()
      expect(completed).toHaveBeenCalledTimes(1)

      await tour.prev()
      expect(completed).toHaveBeenCalledTimes(1)
    })

    it('should run leave before stopping the enter scope on next', async () => {
      const tour = createTour()
      const left = vi.fn()

      tour.steps.onboard([
        { id: 'one', leave: left },
        { id: 'two' },
      ])
      tour.start()
      await tour.next()

      expect(left).toHaveBeenCalledTimes(1)
      expect(tour.steps.selectedId.value).toBe('two')
    })

    it('should preserve ticket enter function identity through onboard', () => {
      const tour = createTour()

      function enter () {}

      tour.steps.onboard([{ id: 'one', enter }])
      tour.start()

      expect(tour.steps.selectedItem.value?.enter).toBe(enter)
    })
  })

  describe('complete', () => {
    it('should not complete the last step when its form rejects', async () => {
      const tour = createTour()

      tour.steps.onboard([{ id: 'only' }])
      tour.start()

      vi.spyOn(tour.form, 'has').mockReturnValue(true)
      vi.spyOn(tour.form, 'submit').mockResolvedValue(false)

      await tour.complete()

      expect(tour.isActive.value).toBe(true)
      expect(tour.isComplete.value).toBe(false)
    })
  })

  describe('step', () => {
    it('should jump by a 1-based index', async () => {
      const tour = createTour()

      tour.steps.onboard([{ id: 'a' }, { id: 'b' }, { id: 'c' }])
      tour.start()

      await tour.step(3)

      expect(tour.steps.selectedId.value).toBe('c')
    })
  })

  describe('focus', () => {
    it('should restore the opener when the tour stops', () => {
      const opener = document.createElement('button')
      document.body.append(opener)
      opener.focus()

      const other = document.createElement('button')
      document.body.append(other)

      const tour = createTour()
      tour.steps.onboard([{ id: 'a' }])
      tour.start()
      other.focus()

      tour.stop()

      expect(document.activeElement).toBe(opener)
      opener.remove()
      other.remove()
    })
  })

  describe('hydration', () => {
    it('should defer start until the host is mounted', () => {
      let tour: ReturnType<typeof createTour> | undefined
      let duringSetup = true

      const Host = defineComponent({
        setup () {
          tour = createTour()
          tour.steps.onboard([{ id: 'a' }])
          tour.start()
          duringSetup = tour.isActive.value
          return () => h('div')
        },
      })

      const wrapper = mount(Host)

      expect(duringSetup).toBe(false)
      expect(tour!.isActive.value).toBe(true)
      wrapper.unmount()
    })

    it('should not start when stop is called before the host mounts', () => {
      let tour: ReturnType<typeof createTour> | undefined

      const Host = defineComponent({
        setup () {
          tour = createTour()
          tour.steps.onboard([{ id: 'a' }])
          tour.start()
          tour.stop()
          return () => h('div')
        },
      })

      const wrapper = mount(Host)

      expect(tour!.isActive.value).toBe(false)
      wrapper.unmount()
    })

    it('should not start when reset is called before the host mounts', () => {
      let tour: ReturnType<typeof createTour> | undefined

      const Host = defineComponent({
        setup () {
          tour = createTour()
          tour.steps.onboard([{ id: 'a' }])
          tour.start()
          tour.reset()
          return () => h('div')
        },
      })

      const wrapper = mount(Host)

      expect(tour!.isActive.value).toBe(false)
      expect(tour!.steps.size).toBe(0)
      wrapper.unmount()
    })

    it('should stay complete when complete cancels a start queued before mount', async () => {
      let tour: ReturnType<typeof createTour> | undefined

      const Host = defineComponent({
        setup () {
          tour = createTour()
          tour.steps.onboard([{ id: 'a' }])
          tour.start()
          void tour.complete()
          return () => h('div')
        },
      })

      const wrapper = mount(Host)

      expect(tour!.isActive.value).toBe(false)
      expect(tour!.isComplete.value).toBe(true)
      wrapper.unmount()
    })

    it('should start when a second start replaces one cancelled before mount', () => {
      let tour: ReturnType<typeof createTour> | undefined

      const Host = defineComponent({
        setup () {
          tour = createTour()
          tour.steps.onboard([{ id: 'a' }])
          tour.start()
          tour.stop()
          tour.start()
          return () => h('div')
        },
      })

      const wrapper = mount(Host)

      expect(tour!.isActive.value).toBe(true)
      expect(tour!.steps.selectedId.value).toBe('a')
      wrapper.unmount()
    })

    it('should defer a no-instance start until hydration', async () => {
      const app = createApp({ render: () => null })
      app.use(createHydrationPlugin())

      let tour!: ReturnType<typeof createTour>

      app.runWithContext(() => {
        tour = createTour()
        tour.steps.onboard([{ id: 'a' }])
        tour.start()
        expect(tour.isActive.value).toBe(false)
        expect(useHydration().isHydrated.value).toBe(false)
      })

      app.runWithContext(() => {
        useHydration().hydrate()
      })
      await nextTick()

      expect(tour.isActive.value).toBe(true)
      tour.stop()
    })

    it('should not start a deferred hydration start after stop', async () => {
      const app = createApp({ render: () => null })
      app.use(createHydrationPlugin())

      let tour!: ReturnType<typeof createTour>

      app.runWithContext(() => {
        tour = createTour()
        tour.steps.onboard([{ id: 'a' }])
        tour.start()
        tour.stop()
        useHydration().hydrate()
      })

      await nextTick()

      expect(tour.isActive.value).toBe(false)
    })

    it('should start immediately when no hydration plugin is installed', () => {
      const app = createApp({ render: () => null })

      app.runWithContext(() => {
        const tour = createTour()
        tour.steps.onboard([{ id: 'a' }])
        tour.start()
        expect(tour.isActive.value).toBe(true)
        tour.stop()
      })
    })

    it('should keep the latest queued step when start runs twice before hydration', async () => {
      const app = createApp({ render: () => null })
      app.use(createHydrationPlugin())

      let tour!: ReturnType<typeof createTour>

      app.runWithContext(() => {
        tour = createTour()
        tour.steps.onboard([{ id: 'a' }, { id: 'b' }])
        tour.start()
        tour.start({ stepId: 'b' })
        useHydration().hydrate()
      })

      await nextTick()

      expect(tour.isActive.value).toBe(true)
      expect(tour.steps.selectedId.value).toBe('b')
      tour.stop()
    })
  })

  describe('branch coverage', () => {
    it('should warn and ignore activate without a selected step', () => {
      warn.mockClear()
      const tour = createTour()
      const el = document.createElement('div')

      write(tour.isActive, true)
      tour.activate(el, { scroll: false })

      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn).toHaveBeenCalledWith('createTour: activate() requires a selected step')
      expect(el.style.getPropertyValue('anchor-name')).toBe('')
    })

    it('should warn when activate cannot resolve a target', () => {
      warn.mockClear()
      const tour = createTour()

      tour.steps.onboard([{ id: 'a' }])
      tour.steps.select('a')
      write(tour.isActive, true)
      tour.activate(null)

      expect(warn).toHaveBeenCalledWith('createTour: activate() target not found')
      expect(tour.activators.size).toBe(0)
    })

    it('should ignore activate while the tour is inactive', () => {
      const tour = createTour()
      const el = document.createElement('div')

      tour.steps.onboard([{ id: 'a' }])
      tour.steps.select('a')
      tour.activate(el, { scroll: false })

      expect(tour.activators.size).toBe(0)
    })

    it('should anchor an svg element and reject a math element', () => {
      warn.mockClear()
      const tour = createTour()
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
      const math = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'math')

      tour.steps.onboard([{ id: 'a' }])
      tour.start()
      tour.activate(svg, { scroll: false })

      expect(svg.style.getPropertyValue('anchor-name')).toBe('--tour-a')

      tour.activate(math, { scroll: false })

      expect(warn).toHaveBeenCalledWith('createTour: activate() target not found')
      expect(math.getAttribute('style')).toBeNull()
    })

    it('should scroll the target unless scroll is false', () => {
      const tour = createTour()
      const el = document.createElement('div')
      const scroll = vi.spyOn(el, 'scrollIntoView').mockImplementation(() => {})

      tour.steps.onboard([{ id: 'a' }])
      tour.start()
      tour.activate(el)

      expect(scroll).toHaveBeenCalledTimes(1)
      expect(scroll).toHaveBeenCalledWith({ block: 'center', behavior: 'instant' })

      scroll.mockClear()
      tour.activate(el, { scroll: false })

      expect(scroll).not.toHaveBeenCalled()
    })

    it('should restore a pre-existing anchor name and keep a registered activator', () => {
      const tour = createTour()
      const el = document.createElement('div')
      const held = document.createElement('span')

      tour.steps.onboard([{ id: 'a' }])
      tour.start()
      tour.activators.register({ id: 'a', element: held })
      el.style.setProperty('anchor-name', '--kept')
      tour.activate(el, { scroll: false })
      tour.deactivate()

      expect(el.style.getPropertyValue('anchor-name')).toBe('--kept')
      expect(tour.activators.get('a')?.element).toBe(held)
    })

    it('should activate and deactivate from the current enter context', () => {
      const tour = createTour()
      const el = document.createElement('div')

      tour.steps.onboard([{
        id: 'a',
        enter (ctx) {
          ctx.activate(el, { scroll: false })
          ctx.deactivate()
        },
      }])
      tour.start()

      expect(el.style.getPropertyValue('anchor-name')).toBe('')
      expect(tour.activators.size).toBe(0)
    })

    it('should ignore a stale deactivate from an earlier visit', () => {
      const tour = createTour()
      const el = document.createElement('div')
      function hold () {}
      let release = hold

      tour.steps.onboard([{
        id: 'a',
        enter (ctx) {
          ctx.activate(el, { scroll: false })
          release = () => {
            ctx.deactivate()
          }
        },
      }])
      tour.start()
      const stale = release

      tour.stop()
      tour.start()

      expect(el.style.getPropertyValue('anchor-name')).toBe('--tour-a')

      stale()

      expect(el.style.getPropertyValue('anchor-name')).toBe('--tour-a')
      expect(tour.activators.size).toBe(1)
    })

    it('should call next from enter after the step is ready', async () => {
      const tour = createTour()

      tour.steps.onboard([
        {
          id: 'a',
          enter (ctx) {
            ctx.done()
            void ctx.next()
          },
        },
        { id: 'b' },
      ])
      tour.start()
      await nextTick()

      expect(tour.steps.selectedId.value).toBe('b')
    })

    it('should mark the step ready when enter rejects', async () => {
      warn.mockClear()
      const tour = createTour()

      tour.steps.onboard([{
        id: 'a',
        enter: () => Promise.reject(new Error('nope')),
      }])
      tour.start()
      await nextTick()
      await Promise.resolve()

      expect(warn).toHaveBeenCalledWith('createTour: enter rejected', expect.any(Error))
      expect(tour.isReady.value).toBe(true)
      expect(tour.isActive.value).toBe(true)
    })

    it('should mark the step ready when enter throws', () => {
      warn.mockClear()
      const tour = createTour()

      tour.steps.onboard([{
        id: 'a',
        enter () {
          throw new Error('boom')
        },
      }])
      tour.start()

      expect(warn).toHaveBeenCalledWith('createTour: enter threw', expect.any(Error))
      expect(tour.isReady.value).toBe(true)
    })

    it('should warn and stay when form submit throws', async () => {
      warn.mockClear()
      const tour = createTour()

      tour.steps.onboard([{ id: 'a' }, { id: 'b' }])
      tour.start()
      vi.spyOn(tour.form, 'has').mockReturnValue(true)
      vi.spyOn(tour.form, 'submit').mockImplementation(() => {
        throw new Error('sync')
      })

      await tour.next()

      expect(warn).toHaveBeenCalledWith('createTour: form submit failed', expect.any(Error))
      expect(tour.steps.selectedId.value).toBe('a')
    })

    it('should warn and stay when form submit rejects', async () => {
      warn.mockClear()
      const tour = createTour()

      tour.steps.onboard([{ id: 'a' }, { id: 'b' }])
      tour.start()
      vi.spyOn(tour.form, 'has').mockReturnValue(true)
      vi.spyOn(tour.form, 'submit').mockRejectedValue(new Error('async'))

      await tour.next()

      expect(warn).toHaveBeenCalledWith('createTour: form submit failed', expect.any(Error))
      expect(tour.steps.selectedId.value).toBe('a')
    })

    it('should leave and go inactive when start runs with no steps', () => {
      const tour = createTour()
      const opener = document.createElement('button')
      document.body.append(opener)
      opener.focus()

      tour.steps.onboard([{ id: 'a' }])
      tour.start()
      tour.steps.clear()
      tour.start()

      expect(tour.isActive.value).toBe(false)
      expect(tour.total).toBe(0)
      opener.remove()
    })

    it('should leave the current step when start runs again', () => {
      const tour = createTour()
      const left = vi.fn()

      tour.steps.onboard([
        { id: 'a', leave: left },
        { id: 'b' },
      ])
      tour.start()
      tour.start({ stepId: 'b' })

      expect(left).toHaveBeenCalledTimes(1)
      expect(tour.steps.selectedId.value).toBe('b')
      expect(tour.isActive.value).toBe(true)
    })

    it('should remember the opener only on the first start', () => {
      const opener = document.createElement('button')
      const other = document.createElement('button')
      document.body.append(opener, other)
      opener.focus()

      const tour = createTour()
      tour.steps.onboard([{ id: 'a' }, { id: 'b' }])
      tour.start()
      other.focus()
      tour.start({ stepId: 'b' })
      tour.stop()

      expect(document.activeElement).toBe(opener)
      opener.remove()
      other.remove()
    })

    it('should not complete when the tour stops during complete', async () => {
      const tour = createTour()

      tour.steps.onboard([{ id: 'a' }])
      tour.start()
      vi.spyOn(tour.form, 'has').mockReturnValue(true)
      vi.spyOn(tour.form, 'submit').mockImplementation(() => {
        tour.stop()
        return Promise.resolve(true)
      })

      await tour.complete()

      expect(tour.isActive.value).toBe(false)
      expect(tour.isComplete.value).toBe(false)
    })

    it('should not advance when the current step becomes last during next', async () => {
      const tour = createTour()

      tour.steps.onboard([{ id: 'a' }, { id: 'b' }])
      tour.start()
      vi.spyOn(tour.form, 'has').mockReturnValue(true)
      vi.spyOn(tour.form, 'submit').mockImplementation(() => {
        tour.steps.select('b')
        return Promise.resolve(true)
      })

      await tour.next()

      expect(tour.steps.selectedId.value).toBe('b')
      expect(tour.isActive.value).toBe(true)
      expect(tour.isComplete.value).toBe(false)
    })

    it('should end the tour when completed calls complete during next', async () => {
      const tour = createTour()

      tour.steps.onboard([
        {
          id: 'a',
          completed () {
            void tour.complete()
          },
        },
        { id: 'b' },
      ])
      tour.start()
      await tour.next()

      expect(tour.isActive.value).toBe(false)
      expect(tour.isComplete.value).toBe(true)
    })

    it('should stop when completed calls stop during next', async () => {
      const tour = createTour()

      tour.steps.onboard([
        {
          id: 'a',
          completed () {
            tour.stop()
          },
        },
        { id: 'b' },
      ])
      tour.start()
      await tour.next()

      expect(tour.isActive.value).toBe(false)
      expect(tour.isComplete.value).toBe(false)
      expect(tour.steps.selectedId.value).toBe('a')
    })

    it('should not complete when completed calls stop', async () => {
      const tour = createTour()
      const left = vi.fn()

      tour.steps.onboard([{
        id: 'a',
        leave: left,
        completed () {
          tour.stop()
        },
      }])
      tour.start()
      await tour.complete()

      expect(left).toHaveBeenCalledTimes(1)
      expect(tour.isActive.value).toBe(false)
      expect(tour.isComplete.value).toBe(false)
    })

    it('should end the tour when leave calls complete during next', async () => {
      const tour = createTour()

      tour.steps.onboard([
        {
          id: 'a',
          leave () {
            void tour.complete()
          },
        },
        { id: 'b' },
      ])
      tour.start()
      await tour.next()

      expect(tour.isActive.value).toBe(false)
      expect(tour.isComplete.value).toBe(true)
    })

    it('should stop when leave calls stop during prev', async () => {
      const tour = createTour()

      tour.steps.onboard([
        { id: 'a' },
        {
          id: 'b',
          leave () {
            tour.stop()
          },
        },
      ])
      tour.start()
      await tour.next()
      await tour.prev()

      expect(tour.isActive.value).toBe(false)
      expect(tour.isComplete.value).toBe(false)
      expect(tour.steps.selectedId.value).toBe('b')
    })

    it('should skip dismiss when completed stops during prev', async () => {
      const tour = createTour()
      const left = vi.fn(() => {
        void tour.complete()
      })

      tour.steps.onboard([
        { id: 'a' },
        {
          id: 'b',
          leave: left,
          completed () {
            tour.stop()
          },
        },
      ])
      tour.start()
      await tour.next()
      await tour.prev()

      expect(left).toHaveBeenCalledTimes(1)
      expect(tour.isActive.value).toBe(false)
      expect(tour.isComplete.value).toBe(false)
      expect(tour.steps.selectedId.value).toBe('b')
    })

    it('should no-op step while unready, on the same index, or past the end', async () => {
      const tour = createTour()

      tour.steps.onboard([
        {
          id: 'a',
          enter (ctx) {
            void ctx
          },
        },
        { id: 'b' },
      ])
      await tour.step(2)
      tour.start()
      await tour.step(2)
      expect(tour.steps.selectedId.value).toBe('a')
      expect(tour.isReady.value).toBe(false)

      tour.ready('a', 1)
      await tour.step(1)
      await tour.step(9)

      expect(tour.steps.selectedId.value).toBe('a')
      expect(tour.isActive.value).toBe(true)
    })

    it('should stay when step validation fails', async () => {
      const tour = createTour()

      tour.steps.onboard([{ id: 'a' }, { id: 'b' }, { id: 'c' }])
      tour.start()
      vi.spyOn(tour.form, 'has').mockReturnValue(true)
      vi.spyOn(tour.form, 'submit').mockResolvedValue(false)

      await tour.step(3)

      expect(tour.steps.selectedId.value).toBe('a')
    })

    it('should not jump when the tour stops during step validation', async () => {
      const tour = createTour()

      tour.steps.onboard([{ id: 'a' }, { id: 'b' }])
      tour.start()
      vi.spyOn(tour.form, 'has').mockReturnValue(true)
      vi.spyOn(tour.form, 'submit').mockImplementation(() => {
        tour.stop()
        return Promise.resolve(true)
      })

      await tour.step(2)

      expect(tour.isActive.value).toBe(false)
      expect(tour.isComplete.value).toBe(false)
    })

    it('should stay when validation selects the requested step', async () => {
      const tour = createTour()

      tour.steps.onboard([{ id: 'a' }, { id: 'b' }, { id: 'c' }])
      tour.start()
      vi.spyOn(tour.form, 'has').mockReturnValue(true)
      vi.spyOn(tour.form, 'submit').mockImplementation(() => {
        tour.steps.select('c')
        return Promise.resolve(true)
      })

      await tour.step(3)

      expect(tour.steps.selectedId.value).toBe('c')
      expect(tour.isActive.value).toBe(true)
      expect(tour.isComplete.value).toBe(false)
    })

    it('should stay when validation clears ready during step', async () => {
      const tour = createTour()

      tour.steps.onboard([{ id: 'a' }, { id: 'b' }])
      tour.start()
      vi.spyOn(tour.form, 'has').mockReturnValue(true)
      vi.spyOn(tour.form, 'submit').mockImplementation(() => {
        write(tour.isReady, false)
        return Promise.resolve(true)
      })

      await tour.step(2)

      expect(tour.steps.selectedId.value).toBe('a')
      expect(tour.isReady.value).toBe(false)
      expect(tour.isActive.value).toBe(true)
    })

    it('should finish when complete runs during step validation', async () => {
      const tour = createTour()

      tour.steps.onboard([{ id: 'a' }, { id: 'b' }, { id: 'c' }])
      tour.start()
      vi.spyOn(tour.form, 'has').mockReturnValue(true)
      vi.spyOn(tour.form, 'submit').mockImplementation(() => {
        void tour.complete()
        return Promise.resolve(true)
      })

      await tour.step(3)

      expect(tour.isActive.value).toBe(false)
      expect(tour.isComplete.value).toBe(true)
    })

    it('should dismiss when completed calls complete during step', async () => {
      const tour = createTour()

      tour.steps.onboard([
        {
          id: 'a',
          completed () {
            void tour.complete()
          },
        },
        { id: 'b' },
      ])
      tour.start()
      await tour.step(2)

      expect(tour.isActive.value).toBe(false)
      expect(tour.isComplete.value).toBe(true)
    })

    it('should dismiss when leave calls complete during step', async () => {
      const tour = createTour()

      tour.steps.onboard([
        {
          id: 'a',
          leave () {
            void tour.complete()
          },
        },
        { id: 'b' },
      ])
      tour.start()
      await tour.step(2)

      expect(tour.isActive.value).toBe(false)
      expect(tour.isComplete.value).toBe(true)
    })

    it('should stop jumping when completed selects the destination', async () => {
      const tour = createTour()

      tour.steps.onboard([
        {
          id: 'a',
          completed () {
            tour.steps.select('c')
          },
        },
        { id: 'b' },
        { id: 'c' },
      ])
      tour.start()
      await tour.step(3)

      expect(tour.steps.selectedId.value).toBe('c')
      expect(tour.isActive.value).toBe(true)
      expect(tour.isComplete.value).toBe(false)
    })

    it('should stop jumping when completed stops the tour', async () => {
      const tour = createTour()

      tour.steps.onboard([
        {
          id: 'a',
          completed () {
            tour.stop()
          },
        },
        { id: 'b' },
      ])
      tour.start()
      await tour.step(2)

      expect(tour.isActive.value).toBe(false)
      expect(tour.isComplete.value).toBe(false)
    })

    it('should stop jumping when leave stops the tour', async () => {
      const tour = createTour()

      tour.steps.onboard([
        {
          id: 'a',
          leave () {
            tour.stop()
          },
        },
        { id: 'b' },
      ])
      tour.start()
      await tour.step(2)

      expect(tour.isActive.value).toBe(false)
      expect(tour.steps.selectedId.value).toBe('a')
    })

    it('should finish with no ticket after the steps are cleared', async () => {
      const tour = createTour()

      tour.steps.onboard([{ id: 'a' }])
      tour.start()
      tour.steps.clear()
      await tour.complete()

      expect(tour.isActive.value).toBe(false)
      expect(tour.isComplete.value).toBe(true)
    })

    it('should stop with no selected ticket', () => {
      const tour = createTour()

      tour.steps.onboard([{ id: 'a' }])
      tour.start()
      tour.steps.clear()
      tour.stop()

      expect(tour.isActive.value).toBe(false)
    })
  })
})

describe('createTourPlugin', () => {
  it('should share one tour across the app', () => {
    let starter: ReturnType<typeof useTour> | undefined
    let reader: ReturnType<typeof useTour> | undefined

    const Reader = defineComponent({
      setup () {
        reader = useTour()
        return () => null
      },
    })

    const Root = defineComponent({
      setup () {
        starter = useTour()
        return () => h(Reader)
      },
    })

    const app = createApp(Root)
    app.use(createTourPlugin())
    const root = document.createElement('div')
    app.mount(root)

    starter!.steps.onboard([{ id: 'search' }])

    expect(reader).toBe(starter)
    expect(reader!.steps.has('search')).toBe(true)

    app.unmount()
  })

  it('should let a local provide shadow the plugin', () => {
    let outside: ReturnType<typeof useTour> | undefined
    let inside: ReturnType<typeof useTour> | undefined
    let local: ReturnType<typeof useTour> | undefined

    const Child = defineComponent({
      setup () {
        inside = useTour()
        return () => null
      },
    })

    const Parent = defineComponent({
      setup () {
        const [, provideTour, tour] = createTourContext()
        provideTour()
        local = tour
        return () => h(Child)
      },
    })

    const Host = defineComponent({
      setup () {
        outside = useTour()
        return () => h(Parent)
      },
    })

    const app = createApp(Host)
    app.use(createTourPlugin())
    const root = document.createElement('div')
    app.mount(root)

    outside!.steps.register({ id: 'layout' })

    expect(inside).toBe(local)
    expect(inside).not.toBe(outside)
    expect(inside!.steps.has('layout')).toBe(false)

    app.unmount()
  })

  it('should read a custom namespace', () => {
    let seen: ReturnType<typeof useTour> | undefined

    const Probe = defineComponent({
      setup () {
        seen = useTour('app:tour')
        return () => null
      },
    })

    const app = createApp(Probe)
    app.use(createTourPlugin({ namespace: 'app:tour' }))
    const root = document.createElement('div')
    app.mount(root)

    expect(seen).toBeDefined()
    expect(seen!.total).toBe(0)

    app.unmount()
  })

  it('should throw when no tour is provided', () => {
    const Probe = defineComponent({
      setup () {
        useTour()
        return () => null
      },
    })

    const app = createApp(Probe)
    using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    expect(() => app.mount(document.createElement('div'))).toThrow(/v0:tour/)
    expect(warn).toHaveBeenCalled()
  })
})
