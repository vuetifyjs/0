import { describe, expect, it, vi } from 'vitest'

import { createTour } from './index'

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
    it('should set isComplete only on complete, not stop', () => {
      const tour = createTour()

      tour.steps.onboard([{ id: 'one' }])
      tour.start()
      tour.stop()

      expect(tour.isActive.value).toBe(false)
      expect(tour.isComplete.value).toBe(false)

      tour.start()
      tour.complete()

      expect(tour.isActive.value).toBe(false)
      expect(tour.isComplete.value).toBe(true)
    })
  })

  describe('reset', () => {
    it('should clear steps and flags', () => {
      const tour = createTour()

      tour.steps.onboard([{ id: 'one' }, { id: 'two' }])
      tour.start()
      tour.complete()
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

      tour.deactivate()

      expect(tour.activators.get('search')).toBeUndefined()
      expect(el.style.getPropertyValue('anchor-name')).toBe('')
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
})
