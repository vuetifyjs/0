import { describe, expect, it, vi } from 'vitest'

import { createTour } from './index'

// Utilities
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'

vi.mock('#v0/composables/useLogger', () => ({
  useLogger: () => ({
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
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
  })

  describe('stop and complete', () => {
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

      tour.steps.onboard([
        {
          id: 'wait',
          enter (_ctx) {},
        },
        { id: 'next' },
      ])
      tour.start()

      expect(tour.isReady.value).toBe(false)

      await tour.next()
      expect(tour.steps.selectedId.value).toBe('wait')

      tour.ready()
      expect(tour.isReady.value).toBe(true)

      await tour.next()
      expect(tour.steps.selectedId.value).toBe('next')
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
  })
})
