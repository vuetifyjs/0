import { describe, expect, it, vi } from 'vitest'

import { createTour, createTourPlugin } from '.'

describe('useTour', () => {
  describe('createTour', () => {
    it('should create tour with default state', () => {
      const tour = createTour()

      expect(tour.isActive.value).toBe(false)
      expect(tour.isComplete.value).toBe(false)
      expect(tour.isReady.value).toBe(true)
      expect(tour.isFirst.value).toBe(false)
      expect(tour.isLast.value).toBe(true)
      expect(tour.canGoBack.value).toBe(false)
      expect(tour.canGoNext.value).toBe(false)
      expect(tour.total).toBe(0)
      expect(tour.selectedId.value).toBeUndefined()
    })

    it('should expose composed primitives', () => {
      const tour = createTour()

      expect(tour.steps).toBeDefined()
      expect(tour.steps.register).toBeDefined()
      expect(tour.activators).toBeDefined()
      expect(tour.activators.register).toBeDefined()
      expect(tour.form).toBeDefined()
      expect(tour.form.has).toBeDefined()
    })

    it('should expose navigation methods', () => {
      const tour = createTour()

      expect(typeof tour.start).toBe('function')
      expect(typeof tour.stop).toBe('function')
      expect(typeof tour.complete).toBe('function')
      expect(typeof tour.reset).toBe('function')
      expect(typeof tour.next).toBe('function')
      expect(typeof tour.prev).toBe('function')
      expect(typeof tour.step).toBe('function')
      expect(typeof tour.ready).toBe('function')
    })
  })

  describe('start', () => {
    it('should activate tour and select first step', () => {
      const tour = createTour()
      tour.steps.onboard([
        { id: 'step-1' },
        { id: 'step-2' },
        { id: 'step-3' },
      ])

      tour.start()

      expect(tour.isActive.value).toBe(true)
      expect(tour.isComplete.value).toBe(false)
      expect(tour.selectedId.value).toBe('step-1')
      expect(tour.isFirst.value).toBe(true)
      expect(tour.total).toBe(3)
    })

    it('should start at specific step', () => {
      const tour = createTour()
      tour.steps.onboard([
        { id: 'step-1' },
        { id: 'step-2' },
      ])

      tour.start({ stepId: 'step-2' })

      expect(tour.selectedId.value).toBe('step-2')
    })
  })

  describe('stop', () => {
    it('should deactivate tour', () => {
      const tour = createTour()
      tour.steps.onboard([{ id: 'step-1' }])
      tour.start()

      tour.stop()

      expect(tour.isActive.value).toBe(false)
      expect(tour.isComplete.value).toBe(false)
    })
  })

  describe('complete', () => {
    it('should mark tour as complete', () => {
      const tour = createTour()
      tour.steps.onboard([{ id: 'step-1' }])
      tour.start()

      tour.complete()

      expect(tour.isActive.value).toBe(false)
      expect(tour.isComplete.value).toBe(true)
    })
  })

  describe('reset', () => {
    it('should clear all state', () => {
      const tour = createTour()
      tour.steps.onboard([{ id: 'step-1' }])
      tour.start()

      tour.reset()

      expect(tour.isActive.value).toBe(false)
      expect(tour.isComplete.value).toBe(false)
      expect(tour.total).toBe(0)
      expect(tour.selectedId.value).toBeUndefined()
    })
  })

  describe('next', () => {
    it('should advance to next step', async () => {
      const tour = createTour()
      tour.steps.onboard([
        { id: 'step-1' },
        { id: 'step-2' },
        { id: 'step-3' },
      ])
      tour.start()

      await tour.next()

      expect(tour.selectedId.value).toBe('step-2')
    })

    it('should not advance past last step', async () => {
      const tour = createTour()
      tour.steps.onboard([{ id: 'step-1' }, { id: 'step-2' }])
      tour.start()
      await tour.next()

      await tour.next()

      expect(tour.selectedId.value).toBe('step-2')
    })

    it('should not advance when not ready', async () => {
      const tour = createTour()
      tour.steps.onboard([
        { id: 'step-1', type: 'wait' },
        { id: 'step-2' },
      ])
      tour.start()

      await tour.next()

      expect(tour.selectedId.value).toBe('step-1')
    })

    it('should advance after ready() on wait step', async () => {
      const tour = createTour()
      tour.steps.onboard([
        { id: 'step-1', type: 'wait' },
        { id: 'step-2' },
      ])
      tour.start()

      tour.ready()
      await tour.next()

      expect(tour.selectedId.value).toBe('step-2')
    })
  })

  describe('prev', () => {
    it('should go to previous step', async () => {
      const tour = createTour()
      tour.steps.onboard([
        { id: 'step-1' },
        { id: 'step-2' },
      ])
      tour.start()
      await tour.next()

      tour.prev()

      expect(tour.selectedId.value).toBe('step-1')
    })

    it('should not go before first step', () => {
      const tour = createTour()
      tour.steps.onboard([{ id: 'step-1' }, { id: 'step-2' }])
      tour.start()

      tour.prev()

      expect(tour.selectedId.value).toBe('step-1')
    })
  })

  describe('step', () => {
    it('should jump to step by index', async () => {
      const tour = createTour()
      tour.steps.onboard([
        { id: 'step-1' },
        { id: 'step-2' },
        { id: 'step-3' },
      ])
      tour.start()

      await tour.step(3)

      expect(tour.selectedId.value).toBe('step-3')
    })

    it('should do nothing for invalid index', async () => {
      const tour = createTour()
      tour.steps.onboard([{ id: 'step-1' }])
      tour.start()

      await tour.step(999)

      expect(tour.selectedId.value).toBe('step-1')
    })
  })

  describe('isReady', () => {
    it('should be true for non-wait steps', () => {
      const tour = createTour()
      tour.steps.onboard([
        { id: 'step-1', type: 'tooltip' },
      ])
      tour.start()

      expect(tour.isReady.value).toBe(true)
    })

    it('should be false for wait steps', () => {
      const tour = createTour()
      tour.steps.onboard([
        { id: 'step-1', type: 'wait' },
      ])
      tour.start()

      expect(tour.isReady.value).toBe(false)
    })

    it('should reset on step change', async () => {
      const tour = createTour()
      tour.steps.onboard([
        { id: 'step-1' },
        { id: 'step-2', type: 'wait' },
      ])
      tour.start()
      expect(tour.isReady.value).toBe(true)

      await tour.next()

      expect(tour.isReady.value).toBe(false)
    })
  })

  describe('validation', () => {
    it('should block next when validation fails', async () => {
      const tour = createTour()
      tour.steps.onboard([
        { id: 'step-1' },
        { id: 'step-2' },
      ])
      tour.start()

      tour.form.register({ id: 'step-1', value: {} as any })
      const submitSpy = vi.spyOn(tour.form, 'submit').mockResolvedValue(false)
      await tour.next()

      expect(tour.selectedId.value).toBe('step-1')
      expect(submitSpy).toHaveBeenCalledWith('step-1')
    })

    it('should allow next when validation passes', async () => {
      const tour = createTour()
      tour.steps.onboard([
        { id: 'step-1' },
        { id: 'step-2' },
      ])
      tour.start()

      tour.form.register({ id: 'step-1', value: {} as any })
      vi.spyOn(tour.form, 'submit').mockResolvedValue(true)

      await tour.next()

      expect(tour.selectedId.value).toBe('step-2')
    })

    it('should skip validation when no form registered for step', async () => {
      const tour = createTour()
      tour.steps.onboard([
        { id: 'step-1' },
        { id: 'step-2' },
      ])
      tour.start()

      const submitSpy = vi.spyOn(tour.form, 'submit')
      await tour.next()

      expect(submitSpy).not.toHaveBeenCalled()
      expect(tour.selectedId.value).toBe('step-2')
    })

    it('should validate before step() jump', async () => {
      const tour = createTour()
      tour.steps.onboard([
        { id: 'step-1' },
        { id: 'step-2' },
        { id: 'step-3' },
      ])
      tour.start()

      tour.form.register({ id: 'step-1', value: {} as any })
      vi.spyOn(tour.form, 'submit').mockResolvedValue(false)

      await tour.step(3)

      expect(tour.selectedId.value).toBe('step-1')
    })
  })

  describe('createTourPlugin', () => {
    it('should create a Vue plugin', () => {
      const plugin = createTourPlugin()
      expect(plugin.install).toBeDefined()
    })
  })
})
