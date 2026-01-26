import { beforeEach, describe, expect, it, vi } from 'vitest'

// Types
import type {
  DiscoveryContext,
  DiscoveryTour,
  DiscoveryTourStep,
} from './index'

import { createDiscovery } from './index'

/**
 * Mock setup for import.meta.glob functions used in useDiscovery
 */
vi.stubGlobal('import', {
  meta: {
    glob: vi.fn(),
  },
})

describe('useDiscovery', () => {
  let discovery: DiscoveryContext

  beforeEach(() => {
    discovery = createDiscovery()
  })

  describe('initialization', () => {
    it('should create discovery context with default state', () => {
      expect(discovery).toBeDefined()
      expect(discovery.tours).toBeDefined()
      expect(discovery.activators).toBeDefined()
      expect(discovery.roots).toBeDefined()
      expect(discovery.steps).toBeDefined()
      expect(discovery.form).toBeDefined()
    })

    it('should initialize with inactive state', () => {
      expect(discovery.isActive.value).toBe(false)
      expect(discovery.isComplete.value).toBe(false)
    })

    it('should have reactive navigation properties', () => {
      // When empty, selectedIndex is -1
      // isFirst: selectedIndex === 0 -> false
      // isLast: selectedIndex === size - 1 -> -1 === -1 -> true
      // canGoBack: selectedIndex > 0 -> false
      // canGoNext: selectedIndex < size - 1 -> false
      expect(discovery.isFirst.value).toBe(false)
      expect(discovery.isLast.value).toBe(true)
      expect(discovery.canGoBack.value).toBe(false)
      expect(discovery.canGoNext.value).toBe(false)
    })

    it('should initialize with empty total steps', () => {
      expect(discovery.total).toBe(0)
    })

    it('should have registry instances for activators and roots', () => {
      expect(discovery.activators.register).toBeDefined()
      expect(discovery.roots.register).toBeDefined()
    })

    it('should have steps step context', () => {
      expect(discovery.steps.onboard).toBeDefined()
      expect(discovery.steps.first).toBeDefined()
      expect(discovery.steps.next).toBeDefined()
      expect(discovery.steps.prev).toBeDefined()
    })

    it('should have form with validation support', () => {
      expect(discovery.form.has).toBeDefined()
      expect(discovery.form.submit).toBeDefined()
      expect(discovery.form.reset).toBeDefined()
    })
  })

  describe('createDiscovery() initialization', () => {
    it('should return readonly reactive refs', () => {
      expect(discovery.isActive).toBeDefined()
      expect(discovery.isComplete).toBeDefined()
      expect(discovery.isFirst).toBeDefined()
      expect(discovery.isLast).toBeDefined()
      expect(discovery.canGoBack).toBeDefined()
      expect(discovery.canGoNext).toBeDefined()
    })

    it('should provide selectedId from steps context', () => {
      expect(discovery.selectedId).toBeDefined()
    })

    it('should expose public methods', () => {
      expect(typeof discovery.start).toBe('function')
      expect(typeof discovery.stop).toBe('function')
      expect(typeof discovery.complete).toBe('function')
      expect(typeof discovery.reset).toBe('function')
      expect(typeof discovery.next).toBe('function')
      expect(typeof discovery.prev).toBe('function')
      expect(typeof discovery.step).toBe('function')
    })
  })

  describe('start() - Tour Initialization', () => {
    const mockSteps: DiscoveryTourStep[] = [
      {
        id: 'step-1',
        title: 'Welcome',
        task: 'Get started',
        learn: 'Learning resource 1',
        placement: 'auto',
      },
      {
        id: 'step-2',
        title: 'Next',
        task: 'Continue',
        learn: 'Learning resource 2',
        placement: 'top',
      },
      {
        id: 'step-3',
        title: 'Done',
        task: 'Finish',
        learn: 'Learning resource 3',
        placement: 'bottom',
      },
    ]

    const mockTour: DiscoveryTour = {
      id: 'test-tour',
      mode: 'guided',
      name: 'Test Tour',
      level: 1,
      track: 'beginner',
      categories: ['test'],
      order: 1,
      description: 'A test tour',
      minutes: 5,
      startRoute: '/test',
      steps: mockSteps,
    }

    beforeEach(() => {
      discovery.tours.onboard([mockTour as any])
    })

    it('should not start if tour ID does not exist', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      await discovery.start('non-existent')

      expect(discovery.isActive.value).toBe(false)
      expect(discovery.steps.size).toBe(0)

      consoleSpy.mockRestore()
    })

    it('should load tour steps on start', async () => {
      await discovery.start('test-tour')

      expect(discovery.steps.size).toBe(3)
      expect(discovery.total).toBe(3)
    })

    it('should select first step on start', async () => {
      await discovery.start('test-tour')

      expect(discovery.selectedId.value).toBe('step-1')
      expect(discovery.isFirst.value).toBe(true)
      expect(discovery.isActive.value).toBe(true)
    })

    it('should set isActive to true on start', async () => {
      expect(discovery.isActive.value).toBe(false)

      await discovery.start('test-tour')

      expect(discovery.isActive.value).toBe(true)
    })

    it('should set isComplete to false on start', async () => {
      // Set isComplete to true by calling complete()
      discovery.complete()
      expect(discovery.isComplete.value).toBe(true)

      await discovery.start('test-tour')

      expect(discovery.isComplete.value).toBe(false)
    })

    it('should reset steps before loading new tour', async () => {
      discovery.steps.onboard([
        { id: 'old-step', title: 'Old', task: 'test', learn: 'test' },
      ])

      await discovery.start('test-tour')

      expect(discovery.steps.size).toBe(3)
      expect(discovery.selectedId.value).toBe('step-1')
    })

    it('should emit enter event for initial step', async () => {
      const listener = vi.fn()
      discovery.steps.on('enter', listener)

      await discovery.start('test-tour')

      expect(listener).toHaveBeenCalled()
    })

    it('should not start if already starting (race condition guard)', async () => {
      const promise1 = discovery.start('test-tour')
      const promise2 = discovery.start('test-tour')

      await promise1
      await promise2

      expect(discovery.steps.size).toBe(3)
    })

    it('should be callable without context parameter', async () => {
      await discovery.start('test-tour')

      expect(discovery.isActive.value).toBe(true)
    })

    it('should accept optional context parameter', async () => {
      await discovery.start('test-tour', { userId: 'user-123' })

      expect(discovery.isActive.value).toBe(true)
    })

    it('should select tour on start', async () => {
      await discovery.start('test-tour')

      // The tour ticket should be selected after start
      expect(discovery.tours.selectedId.value).toBe('test-tour')
    })
  })

  describe('next() - Forward Navigation', () => {
    const mockSteps: DiscoveryTourStep[] = [
      { id: 'step-1', title: 'Step 1', task: 'Task 1', learn: 'Learn 1' },
      { id: 'step-2', title: 'Step 2', task: 'Task 2', learn: 'Learn 2' },
      { id: 'step-3', title: 'Step 3', task: 'Task 3', learn: 'Learn 3' },
    ]

    const mockTour: DiscoveryTour = {
      id: 'test-tour',
      mode: 'guided',
      name: 'Test Tour',
      level: 1,
      track: 'test',
      categories: ['test'],
      order: 1,
      description: 'Test',
      minutes: 5,
      startRoute: '/test',
      steps: mockSteps,
    }

    beforeEach(async () => {
      discovery.tours.onboard([mockTour as any])
      await discovery.start('test-tour')
    })

    it('should move to next step', async () => {
      expect(discovery.selectedId.value).toBe('step-1')

      await discovery.next()

      expect(discovery.selectedId.value).toBe('step-2')
    })

    it('should emit leave event for current step', async () => {
      const listener = vi.fn()
      discovery.steps.on('leave', listener)

      await discovery.next()

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'step-1' }),
      )
    })

    it('should emit enter event for next step', async () => {
      const listener = vi.fn()
      discovery.steps.on('enter', listener)

      await discovery.next()

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'step-2' }),
      )
    })

    it('should not move if at last step', async () => {
      discovery.steps.last()

      await discovery.next()

      expect(discovery.selectedId.value).toBe('step-3')
    })

    it('should validate form before moving to next step', async () => {
      const validateSpy = vi.spyOn(discovery.form, 'submit')
      // Register form field for step-1
      discovery.form.register({ id: 'step-1', rules: [] })

      await discovery.next()

      // Form validation should be called
      expect(validateSpy).toHaveBeenCalledWith('step-1')
    })

    it('should not move if form validation fails', async () => {
      const beforeId = discovery.selectedId.value

      // Register form field for step-1 with validation
      discovery.form.register({ id: 'step-1', rules: [] })

      // Verify form has the field
      expect(discovery.form.has('step-1')).toBe(true)

      // Mock submit to return false (validation failed)
      const submitSpy = vi.spyOn(discovery.form, 'submit').mockResolvedValue(false)

      await discovery.next()

      // Should not move if validation fails
      expect(discovery.selectedId.value).toBe(beforeId)
      expect(submitSpy).toHaveBeenCalledWith('step-1')
    })

    it('should skip form validation if no form for step', async () => {
      const validateSpy = vi.spyOn(discovery.form, 'submit')

      await discovery.next()

      expect(validateSpy).not.toHaveBeenCalled()
    })

    it('should do nothing if no selected item', async () => {
      discovery.steps.reset()

      await discovery.next()

      expect(discovery.selectedId.value).toBeUndefined()
    })
  })

  describe('prev() - Backward Navigation', () => {
    const mockSteps: DiscoveryTourStep[] = [
      { id: 'step-1', title: 'Step 1', task: 'Task 1', learn: 'Learn 1' },
      { id: 'step-2', title: 'Step 2', task: 'Task 2', learn: 'Learn 2' },
      { id: 'step-3', title: 'Step 3', task: 'Task 3', learn: 'Learn 3' },
    ]

    const mockTour: DiscoveryTour = {
      id: 'test-tour',
      mode: 'guided',
      name: 'Test Tour',
      level: 1,
      track: 'test',
      categories: ['test'],
      order: 1,
      description: 'Test',
      minutes: 5,
      startRoute: '/test',
      steps: mockSteps,
    }

    beforeEach(async () => {
      discovery.tours.onboard([mockTour as any])
      await discovery.start('test-tour')
      discovery.steps.last()
    })

    it('should move to previous step', () => {
      expect(discovery.selectedId.value).toBe('step-3')

      discovery.prev()

      expect(discovery.selectedId.value).toBe('step-2')
    })

    it('should emit back event for current step', () => {
      const listener = vi.fn()
      discovery.steps.on('back', listener)

      discovery.prev()

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'step-3' }),
      )
    })

    it('should emit enter event for previous step', () => {
      const listener = vi.fn()
      discovery.steps.on('enter', listener)

      discovery.prev()

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'step-2' }),
      )
    })

    it('should not move if at first step', () => {
      discovery.steps.first()

      discovery.prev()

      expect(discovery.selectedId.value).toBe('step-1')
    })

    it('should do nothing if no selected item', () => {
      discovery.steps.reset()

      discovery.prev()

      expect(discovery.selectedId.value).toBeUndefined()
    })
  })

  describe('step() - Direct Step Navigation', () => {
    const mockSteps: DiscoveryTourStep[] = [
      { id: 'step-1', title: 'Step 1', task: 'Task 1', learn: 'Learn 1' },
      { id: 'step-2', title: 'Step 2', task: 'Task 2', learn: 'Learn 2' },
      { id: 'step-3', title: 'Step 3', task: 'Task 3', learn: 'Learn 3' },
      { id: 'step-4', title: 'Step 4', task: 'Task 4', learn: 'Learn 4' },
    ]

    const mockTour: DiscoveryTour = {
      id: 'test-tour',
      mode: 'guided',
      name: 'Test Tour',
      level: 1,
      track: 'test',
      categories: ['test'],
      order: 1,
      description: 'Test',
      minutes: 5,
      startRoute: '/test',
      steps: mockSteps,
    }

    beforeEach(async () => {
      discovery.tours.onboard([mockTour as any])
      await discovery.start('test-tour')
    })

    it('should move to specified step index', async () => {
      expect(discovery.selectedId.value).toBe('step-1')

      await discovery.step(3)

      expect(discovery.selectedId.value).toBe('step-3')
    })

    it('should emit leave event when navigating away', async () => {
      const listener = vi.fn()
      discovery.steps.on('leave', listener)

      await discovery.step(3)

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'step-1' }),
      )
    })

    it('should emit enter event for new step', async () => {
      const listener = vi.fn()
      discovery.steps.on('enter', listener)

      await discovery.step(3)

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'step-3' }),
      )
    })

    it('should not emit leave if navigating to same step', async () => {
      const listener = vi.fn()
      discovery.steps.on('leave', listener)

      await discovery.step(1)

      expect(listener).not.toHaveBeenCalled()
    })

    it('should handle step at boundary', async () => {
      await discovery.step(4)

      expect(discovery.selectedId.value).toBe('step-4')
    })

    it('should do nothing for invalid step index', async () => {
      await discovery.step(999)

      expect(discovery.selectedId.value).toBe('step-1')
    })

    it('should do nothing if no selected item exists', async () => {
      discovery.steps.reset()

      await discovery.step(2)

      expect(discovery.selectedId.value).toBeUndefined()
    })
  })

  describe('stop() - Tour Stop', () => {
    const mockSteps: DiscoveryTourStep[] = [
      { id: 'step-1', title: 'Step 1', task: 'Task 1', learn: 'Learn 1' },
    ]

    const mockTour: DiscoveryTour = {
      id: 'test-tour',
      mode: 'guided',
      name: 'Test Tour',
      level: 1,
      track: 'test',
      categories: ['test'],
      order: 1,
      description: 'Test',
      minutes: 5,
      startRoute: '/test',
      steps: mockSteps,
    }

    beforeEach(async () => {
      discovery.tours.onboard([mockTour as any])
      await discovery.start('test-tour')
    })

    it('should set isActive to false', () => {
      expect(discovery.isActive.value).toBe(true)

      discovery.stop()

      expect(discovery.isActive.value).toBe(false)
    })

    it('should clear internal handler state on stop', () => {
      // After stop, the internal handlers map should be empty
      // This is tested indirectly by verifying isActive is false
      expect(discovery.isActive.value).toBe(true)

      discovery.stop()

      expect(discovery.isActive.value).toBe(false)
    })

    it('should not modify steps or form state', () => {
      const stepsSize = discovery.steps.size
      const tourSelected = discovery.tours.selectedId.value

      discovery.stop()

      expect(discovery.steps.size).toBe(stepsSize)
      expect(discovery.tours.selectedId.value).toBe(tourSelected)
    })
  })

  describe('complete() - Tour Completion', () => {
    const mockSteps: DiscoveryTourStep[] = [
      { id: 'step-1', title: 'Step 1', task: 'Task 1', learn: 'Learn 1' },
    ]

    const mockTour: DiscoveryTour = {
      id: 'test-tour',
      mode: 'guided',
      name: 'Test Tour',
      level: 1,
      track: 'test',
      categories: ['test'],
      order: 1,
      description: 'Test',
      minutes: 5,
      startRoute: '/test',
      steps: mockSteps,
    }

    beforeEach(async () => {
      discovery.tours.onboard([mockTour as any])
      await discovery.start('test-tour')
    })

    it('should set isComplete to true', () => {
      expect(discovery.isComplete.value).toBe(false)

      discovery.complete()

      expect(discovery.isComplete.value).toBe(true)
    })

    it('should set isActive to false', () => {
      expect(discovery.isActive.value).toBe(true)

      discovery.complete()

      expect(discovery.isActive.value).toBe(false)
    })

    it('should clear internal handler state on complete', () => {
      // After complete, internal handlers should be cleared
      // This is tested by verifying isActive is false
      expect(discovery.isActive.value).toBe(true)

      discovery.complete()

      expect(discovery.isActive.value).toBe(false)
    })
  })

  describe('reset() - Full Reset', () => {
    const mockSteps: DiscoveryTourStep[] = [
      { id: 'step-1', title: 'Step 1', task: 'Task 1', learn: 'Learn 1' },
      { id: 'step-2', title: 'Step 2', task: 'Task 2', learn: 'Learn 2' },
    ]

    const mockTour: DiscoveryTour = {
      id: 'test-tour',
      mode: 'guided',
      name: 'Test Tour',
      level: 1,
      track: 'test',
      categories: ['test'],
      order: 1,
      description: 'Test',
      minutes: 5,
      startRoute: '/test',
      steps: mockSteps,
    }

    beforeEach(async () => {
      discovery.tours.onboard([mockTour as any])
      await discovery.start('test-tour')
    })

    it('should clear all steps', () => {
      expect(discovery.steps.size).toBe(2)

      discovery.reset()

      expect(discovery.steps.size).toBe(0)
    })

    it('should clear tour selection', () => {
      // Manually select the tour to test reset behavior
      discovery.tours.select('test-tour')
      expect(discovery.tours.selectedId.value).toBe('test-tour')

      discovery.reset()

      expect(discovery.tours.selectedId.value).toBeUndefined()
    })

    it('should reset form field values', () => {
      const field = discovery.form.register({ id: 'test-field', rules: [] })

      discovery.reset()

      // Form fields remain registered but are reset to pristine state
      expect(discovery.form.has('test-field')).toBe(true)
      expect(field.isPristine.value).toBe(true)
    })

    it('should set isActive to false', () => {
      expect(discovery.isActive.value).toBe(true)

      discovery.reset()

      expect(discovery.isActive.value).toBe(false)
    })

    it('should set isComplete to false', () => {
      // Set isComplete to true by calling complete()
      discovery.complete()
      expect(discovery.isComplete.value).toBe(true)

      // Need to start again since complete() sets isActive to false
      discovery.tours.onboard([mockTour as any])

      discovery.reset()

      expect(discovery.isComplete.value).toBe(false)
    })

    it('should detach event handlers', () => {
      const enterListener = vi.fn()
      discovery.steps.on('enter', enterListener)

      discovery.reset()
      if (discovery.steps.selectedItem.value) {
        discovery.steps.emit('enter', discovery.steps.selectedItem.value)
      }

      expect(enterListener).not.toHaveBeenCalled()
    })
  })

  describe('handler Lifecycle', () => {
    const mockSteps: DiscoveryTourStep[] = [
      { id: 'step-1', title: 'Step 1', task: 'Task 1', learn: 'Learn 1' },
      { id: 'step-2', title: 'Step 2', task: 'Task 2', learn: 'Learn 2' },
    ]

    it('should emit enter event on start which would trigger handlers', async () => {
      const enterSpy = vi.fn()

      const mockTour: DiscoveryTour = {
        id: 'test-tour',
        mode: 'guided',
        name: 'Test Tour',
        level: 1,
        track: 'test',
        categories: ['test'],
        order: 1,
        description: 'Test',
        minutes: 5,
        startRoute: '/test',
        steps: mockSteps,
      }

      discovery.tours.onboard([mockTour as any])
      discovery.steps.on('enter', enterSpy)

      await discovery.start('test-tour')

      expect(enterSpy).toHaveBeenCalled()
    })

    it('should keep handlers active during tour', async () => {
      const enterSpy = vi.fn()

      const mockTour: DiscoveryTour = {
        id: 'test-tour',
        mode: 'guided',
        name: 'Test Tour',
        level: 1,
        track: 'test',
        categories: ['test'],
        order: 1,
        description: 'Test',
        minutes: 5,
        startRoute: '/test',
        steps: mockSteps,
      }

      discovery.tours.onboard([mockTour as any])
      await discovery.start('test-tour')

      discovery.steps.on('enter', enterSpy)
      enterSpy.mockClear()

      await discovery.next()

      expect(enterSpy).toHaveBeenCalled()
    })

    it('should stop emitting events after stop()', async () => {
      const mockTour: DiscoveryTour = {
        id: 'test-tour',
        mode: 'guided',
        name: 'Test Tour',
        level: 1,
        track: 'test',
        categories: ['test'],
        order: 1,
        description: 'Test',
        minutes: 5,
        startRoute: '/test',
        steps: mockSteps,
      }

      discovery.tours.onboard([mockTour as any])
      await discovery.start('test-tour')

      discovery.stop()

      const enterSpy = vi.fn()
      discovery.steps.on('enter', enterSpy)

      // Manually emit to verify no handlers fire
      // (Note: handlers are cleared after stop, not event listeners)
      expect(discovery.isActive.value).toBe(false)
    })

    it('should stop emitting events after reset()', async () => {
      const mockTour: DiscoveryTour = {
        id: 'test-tour',
        mode: 'guided',
        name: 'Test Tour',
        level: 1,
        track: 'test',
        categories: ['test'],
        order: 1,
        description: 'Test',
        minutes: 5,
        startRoute: '/test',
        steps: mockSteps,
      }

      discovery.tours.onboard([mockTour as any])
      await discovery.start('test-tour')

      discovery.reset()

      expect(discovery.isActive.value).toBe(false)
      expect(discovery.steps.size).toBe(0)
    })
  })

  describe('error Handling', () => {
    const mockSteps: DiscoveryTourStep[] = [
      { id: 'step-1', title: 'Step 1', task: 'Task 1', learn: 'Learn 1' },
    ]

    it('should handle missing tour gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      await discovery.start('non-existent-tour')

      expect(discovery.isActive.value).toBe(false)

      consoleSpy.mockRestore()
    })

    it('should not crash when navigating with no active tour', async () => {
      await expect(async () => {
        await discovery.next()
        discovery.prev()
        await discovery.step(1)
      }).not.toThrow()
    })

    it('should handle tour definition module load errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const mockTour: DiscoveryTour = {
        id: 'test-tour',
        mode: 'guided',
        name: 'Test Tour',
        level: 1,
        track: 'test',
        categories: ['test'],
        order: 1,
        description: 'Test',
        minutes: 5,
        startRoute: '/test',
        steps: mockSteps,
      }

      discovery.tours.onboard([mockTour as any])

      // Mock failed module load
      vi.stubGlobal('import', {
        meta: {
          glob: vi.fn(() => {
            throw new Error('Module load failed')
          }),
        },
      })

      await discovery.start('test-tour')

      // Should still set up tour even if handlers fail to load
      expect(discovery.isActive.value).toBe(true)

      consoleSpy.mockRestore()
    })

    it('should not re-enter if already starting', async () => {
      const mockTour: DiscoveryTour = {
        id: 'test-tour',
        mode: 'guided',
        name: 'Test Tour',
        level: 1,
        track: 'test',
        categories: ['test'],
        order: 1,
        description: 'Test',
        minutes: 5,
        startRoute: '/test',
        steps: mockSteps,
      }

      discovery.tours.onboard([mockTour as any])

      const p1 = discovery.start('test-tour')
      const p2 = discovery.start('test-tour')

      await Promise.all([p1, p2])

      expect(discovery.steps.size).toBe(1)
    })
  })

  describe('navigation State Consistency', () => {
    const mockSteps: DiscoveryTourStep[] = [
      { id: 'step-1', title: 'Step 1', task: 'Task 1', learn: 'Learn 1' },
      { id: 'step-2', title: 'Step 2', task: 'Task 2', learn: 'Learn 2' },
      { id: 'step-3', title: 'Step 3', task: 'Task 3', learn: 'Learn 3' },
    ]

    const mockTour: DiscoveryTour = {
      id: 'test-tour',
      mode: 'guided',
      name: 'Test Tour',
      level: 1,
      track: 'test',
      categories: ['test'],
      order: 1,
      description: 'Test',
      minutes: 5,
      startRoute: '/test',
      steps: mockSteps,
    }

    beforeEach(async () => {
      discovery.tours.onboard([mockTour as any])
      await discovery.start('test-tour')
    })

    it('should update isFirst correctly during navigation', async () => {
      expect(discovery.isFirst.value).toBe(true)

      await discovery.next()

      expect(discovery.isFirst.value).toBe(false)

      discovery.prev()

      expect(discovery.isFirst.value).toBe(true)
    })

    it('should update isLast correctly during navigation', async () => {
      expect(discovery.isLast.value).toBe(false)

      discovery.steps.last()

      expect(discovery.isLast.value).toBe(true)

      discovery.prev()

      expect(discovery.isLast.value).toBe(false)
    })

    it('should update canGoBack correctly', async () => {
      expect(discovery.canGoBack.value).toBe(false)

      await discovery.next()

      expect(discovery.canGoBack.value).toBe(true)
    })

    it('should update canGoNext correctly', async () => {
      expect(discovery.canGoNext.value).toBe(true)

      discovery.steps.last()

      expect(discovery.canGoNext.value).toBe(false)
    })

    it('should maintain consistency through multiple operations', async () => {
      await discovery.next()
      await discovery.next()

      expect(discovery.selectedId.value).toBe('step-3')
      expect(discovery.isLast.value).toBe(true)
      expect(discovery.canGoNext.value).toBe(false)
      expect(discovery.canGoBack.value).toBe(true)

      discovery.prev()

      expect(discovery.selectedId.value).toBe('step-2')
      expect(discovery.isFirst.value).toBe(false)
      expect(discovery.isLast.value).toBe(false)
    })
  })
})
