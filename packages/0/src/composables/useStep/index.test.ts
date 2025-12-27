import { beforeEach, describe, expect, it, vi } from 'vitest'

// Utilities
import { inject, provide } from 'vue'

import { createStep, createStepContext, useStep } from './index'

vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    provide: vi.fn(),
    inject: vi.fn(),
  }
})

const mockProvide = vi.mocked(provide)
const mockInject = vi.mocked(inject)

describe('useStep', () => {
  describe('first', () => {
    it('should select first item', () => {
      const stepper = createStep()

      stepper.onboard([
        { id: 'step-1', value: 'Step 1' },
        { id: 'step-2', value: 'Step 2' },
        { id: 'step-3', value: 'Step 3' },
      ])

      stepper.first()

      expect(stepper.selectedId.value).toBe('step-1')
      expect(stepper.selectedIndex.value).toBe(0)
    })

    it('should skip disabled items and select first non-disabled item', () => {
      const stepper = createStep()

      stepper.onboard([
        { id: 'step-1', value: 'Step 1', disabled: true },
        { id: 'step-2', value: 'Step 2', disabled: true },
        { id: 'step-3', value: 'Step 3' },
      ])

      stepper.first()

      expect(stepper.selectedId.value).toBe('step-3')
      expect(stepper.selectedIndex.value).toBe(2)
    })

    it('should do nothing when all items are disabled', () => {
      const stepper = createStep()

      stepper.onboard([
        { id: 'step-1', value: 'Step 1', disabled: true },
        { id: 'step-2', value: 'Step 2', disabled: true },
      ])

      stepper.first()

      expect(stepper.selectedId.value).toBeUndefined()
    })

    it('should do nothing when registry is empty', () => {
      const stepper = createStep()

      stepper.first()

      expect(stepper.selectedId.value).toBeUndefined()
    })

    it('should change selection from current to first', () => {
      const stepper = createStep()

      stepper.onboard([
        { id: 'step-1', value: 'Step 1' },
        { id: 'step-2', value: 'Step 2' },
        { id: 'step-3', value: 'Step 3' },
      ])

      stepper.select('step-3')
      expect(stepper.selectedId.value).toBe('step-3')

      stepper.first()
      expect(stepper.selectedId.value).toBe('step-1')
    })
  })

  describe('last', () => {
    it('should select last item', () => {
      const stepper = createStep()

      stepper.onboard([
        { id: 'step-1', value: 'Step 1' },
        { id: 'step-2', value: 'Step 2' },
        { id: 'step-3', value: 'Step 3' },
      ])

      stepper.last()

      expect(stepper.selectedId.value).toBe('step-3')
      expect(stepper.selectedIndex.value).toBe(2)
    })

    it('should skip disabled items and select last non-disabled item', () => {
      const stepper = createStep()

      stepper.onboard([
        { id: 'step-1', value: 'Step 1' },
        { id: 'step-2', value: 'Step 2', disabled: true },
        { id: 'step-3', value: 'Step 3', disabled: true },
      ])

      stepper.last()

      expect(stepper.selectedId.value).toBe('step-1')
      expect(stepper.selectedIndex.value).toBe(0)
    })

    it('should do nothing when all items are disabled', () => {
      const stepper = createStep()

      stepper.onboard([
        { id: 'step-1', value: 'Step 1', disabled: true },
        { id: 'step-2', value: 'Step 2', disabled: true },
      ])

      stepper.last()

      expect(stepper.selectedId.value).toBeUndefined()
    })

    it('should do nothing when registry is empty', () => {
      const stepper = createStep()

      stepper.last()

      expect(stepper.selectedId.value).toBeUndefined()
    })

    it('should change selection from current to last', () => {
      const stepper = createStep()

      stepper.onboard([
        { id: 'step-1', value: 'Step 1' },
        { id: 'step-2', value: 'Step 2' },
        { id: 'step-3', value: 'Step 3' },
      ])

      stepper.select('step-1')
      expect(stepper.selectedId.value).toBe('step-1')

      stepper.last()
      expect(stepper.selectedId.value).toBe('step-3')
    })
  })

  describe('next', () => {
    it('should move to next item', () => {
      const stepper = createStep()

      stepper.onboard([
        { id: 'step-1', value: 'Step 1' },
        { id: 'step-2', value: 'Step 2' },
        { id: 'step-3', value: 'Step 3' },
      ])

      stepper.first()
      expect(stepper.selectedId.value).toBe('step-1')

      stepper.next()
      expect(stepper.selectedId.value).toBe('step-2')

      stepper.next()
      expect(stepper.selectedId.value).toBe('step-3')
    })

    it('should not wrap around at end when circular is false (default)', () => {
      const stepper = createStep()

      stepper.onboard([
        { id: 'step-1', value: 'Step 1' },
        { id: 'step-2', value: 'Step 2' },
        { id: 'step-3', value: 'Step 3' },
      ])

      stepper.last()
      expect(stepper.selectedId.value).toBe('step-3')

      stepper.next()
      expect(stepper.selectedId.value).toBe('step-3')
    })

    it('should skip disabled items when moving next', () => {
      const stepper = createStep()

      stepper.onboard([
        { id: 'step-1', value: 'Step 1' },
        { id: 'step-2', value: 'Step 2', disabled: true },
        { id: 'step-3', value: 'Step 3' },
      ])

      stepper.first()
      expect(stepper.selectedId.value).toBe('step-1')

      stepper.next()
      // Should skip step-2 and go to step-3
      expect(stepper.selectedId.value).toBe('step-3')
    })

    it('should do nothing when registry is empty', () => {
      const stepper = createStep()

      stepper.next()
      expect(stepper.selectedId.value).toBeUndefined()
    })

    it('should do nothing when all items are disabled', () => {
      const stepper = createStep()

      stepper.onboard([
        { id: 'step-1', value: 'Step 1', disabled: true },
        { id: 'step-2', value: 'Step 2', disabled: true },
      ])

      stepper.next()
      expect(stepper.selectedId.value).toBeUndefined()
    })

    it('should work when no initial selection', () => {
      const stepper = createStep()

      stepper.onboard([
        { id: 'step-1', value: 'Step 1' },
        { id: 'step-2', value: 'Step 2' },
      ])

      // selectedIndex is -1 when nothing selected
      stepper.next()
      // Should select step-1 (from -1 + 1 = 0)
      expect(stepper.selectedId.value).toBe('step-1')
    })
  })

  describe('prev', () => {
    it('should move to previous item', () => {
      const stepper = createStep()

      stepper.onboard([
        { id: 'step-1', value: 'Step 1' },
        { id: 'step-2', value: 'Step 2' },
        { id: 'step-3', value: 'Step 3' },
      ])

      stepper.last()
      expect(stepper.selectedId.value).toBe('step-3')

      stepper.prev()
      expect(stepper.selectedId.value).toBe('step-2')

      stepper.prev()
      expect(stepper.selectedId.value).toBe('step-1')
    })

    it('should not wrap around at start when circular is false (default)', () => {
      const stepper = createStep()

      stepper.onboard([
        { id: 'step-1', value: 'Step 1' },
        { id: 'step-2', value: 'Step 2' },
        { id: 'step-3', value: 'Step 3' },
      ])

      stepper.first()
      expect(stepper.selectedId.value).toBe('step-1')

      stepper.prev()
      expect(stepper.selectedId.value).toBe('step-1')
    })

    it('should skip disabled items when moving prev', () => {
      const stepper = createStep()

      stepper.onboard([
        { id: 'step-1', value: 'Step 1' },
        { id: 'step-2', value: 'Step 2', disabled: true },
        { id: 'step-3', value: 'Step 3' },
      ])

      stepper.last()
      expect(stepper.selectedId.value).toBe('step-3')

      stepper.prev()
      // Should skip step-2 and go to step-1
      expect(stepper.selectedId.value).toBe('step-1')
    })

    it('should do nothing when registry is empty', () => {
      const stepper = createStep()

      stepper.prev()
      expect(stepper.selectedId.value).toBeUndefined()
    })

    it('should do nothing when all items are disabled', () => {
      const stepper = createStep()

      stepper.onboard([
        { id: 'step-1', value: 'Step 1', disabled: true },
        { id: 'step-2', value: 'Step 2', disabled: true },
      ])

      stepper.prev()
      expect(stepper.selectedId.value).toBeUndefined()
    })
  })

  describe('step', () => {
    it('should step forward by count', () => {
      const stepper = createStep()

      stepper.onboard([
        { id: 'step-1', value: 'Step 1' },
        { id: 'step-2', value: 'Step 2' },
        { id: 'step-3', value: 'Step 3' },
        { id: 'step-4', value: 'Step 4' },
        { id: 'step-5', value: 'Step 5' },
      ])

      stepper.first()
      expect(stepper.selectedId.value).toBe('step-1')

      stepper.step(2)
      expect(stepper.selectedId.value).toBe('step-3')

      stepper.step(2)
      expect(stepper.selectedId.value).toBe('step-5')
    })

    it('should step backward with negative count', () => {
      const stepper = createStep()

      stepper.onboard([
        { id: 'step-1', value: 'Step 1' },
        { id: 'step-2', value: 'Step 2' },
        { id: 'step-3', value: 'Step 3' },
        { id: 'step-4', value: 'Step 4' },
        { id: 'step-5', value: 'Step 5' },
      ])

      stepper.last()
      expect(stepper.selectedId.value).toBe('step-5')

      stepper.step(-2)
      expect(stepper.selectedId.value).toBe('step-3')

      stepper.step(-2)
      expect(stepper.selectedId.value).toBe('step-1')
    })

    it('should not wrap when stepping forward beyond end (circular false)', () => {
      const stepper = createStep()

      stepper.onboard([
        { id: 'step-1', value: 'Step 1' },
        { id: 'step-2', value: 'Step 2' },
        { id: 'step-3', value: 'Step 3' },
      ])

      stepper.select('step-2')
      stepper.step(5)
      // Should stay at step-2 (cannot step beyond boundary)
      expect(stepper.selectedId.value).toBe('step-2')
    })

    it('should not wrap when stepping backward beyond start (circular false)', () => {
      const stepper = createStep()

      stepper.onboard([
        { id: 'step-1', value: 'Step 1' },
        { id: 'step-2', value: 'Step 2' },
        { id: 'step-3', value: 'Step 3' },
      ])

      stepper.first()
      stepper.step(-1)
      expect(stepper.selectedId.value).toBe('step-1')
    })

    it('should skip disabled items when stepping', () => {
      const stepper = createStep()

      stepper.onboard([
        { id: 'step-1', value: 'Step 1' },
        { id: 'step-2', value: 'Step 2', disabled: true },
        { id: 'step-3', value: 'Step 3', disabled: true },
        { id: 'step-4', value: 'Step 4' },
        { id: 'step-5', value: 'Step 5' },
      ])

      stepper.first()
      expect(stepper.selectedId.value).toBe('step-1')

      stepper.step(1)
      // Should skip step-2 and step-3, landing on step-4
      expect(stepper.selectedId.value).toBe('step-4')
    })

    it('should stop at boundary with large step counts (circular false)', () => {
      const stepper = createStep()

      stepper.onboard([
        { id: 'step-1', value: 'Step 1' },
        { id: 'step-2', value: 'Step 2' },
        { id: 'step-3', value: 'Step 3' },
      ])

      stepper.first()
      stepper.step(100)

      // Should stay at step-1 (cannot step beyond boundary)
      expect(stepper.selectedId.value).toBe('step-1')
    })

    it('should handle step count of 0', () => {
      const stepper = createStep()

      stepper.onboard([
        { id: 'step-1', value: 'Step 1' },
        { id: 'step-2', value: 'Step 2' },
      ])

      stepper.first()
      const before = stepper.selectedId.value

      stepper.step(0)
      expect(stepper.selectedId.value).toBe(before)
    })

    it('should do nothing when all items are disabled', () => {
      const stepper = createStep()

      stepper.onboard([
        { id: 'step-1', value: 'Step 1', disabled: true },
        { id: 'step-2', value: 'Step 2', disabled: true },
      ])

      stepper.step(1)
      expect(stepper.selectedId.value).toBeUndefined()
    })

    it('should do nothing when registry is empty', () => {
      const stepper = createStep()

      stepper.step(5)
      expect(stepper.selectedId.value).toBeUndefined()
    })
  })

  describe('circular: true (default behavior in old tests)', () => {
    it('should wrap to first when calling next on last item', () => {
      const stepper = createStep({ circular: true })

      stepper.onboard([
        { id: 'step-1', value: 'Step 1' },
        { id: 'step-2', value: 'Step 2' },
        { id: 'step-3', value: 'Step 3' },
      ])

      stepper.last()
      expect(stepper.selectedId.value).toBe('step-3')

      stepper.next()
      expect(stepper.selectedId.value).toBe('step-1')
    })

    it('should wrap to last when calling prev on first item', () => {
      const stepper = createStep({ circular: true })

      stepper.onboard([
        { id: 'step-1', value: 'Step 1' },
        { id: 'step-2', value: 'Step 2' },
        { id: 'step-3', value: 'Step 3' },
      ])

      stepper.first()
      expect(stepper.selectedId.value).toBe('step-1')

      stepper.prev()
      expect(stepper.selectedId.value).toBe('step-3')
    })

    it('should continuously wrap in forward direction', () => {
      const stepper = createStep({ circular: true })

      stepper.onboard([
        { id: 'step-1', value: 'Step 1' },
        { id: 'step-2', value: 'Step 2' },
        { id: 'step-3', value: 'Step 3' },
      ])

      stepper.first()
      for (let i = 0; i < 10; i++) {
        stepper.next()
      }

      // After 10 next calls from step-1, should be at step-2 (10 % 3 = 1)
      expect(stepper.selectedId.value).toBe('step-2')
    })

    it('should continuously wrap in backward direction', () => {
      const stepper = createStep({ circular: true })

      stepper.onboard([
        { id: 'step-1', value: 'Step 1' },
        { id: 'step-2', value: 'Step 2' },
        { id: 'step-3', value: 'Step 3' },
      ])

      stepper.first()
      for (let i = 0; i < 10; i++) {
        stepper.prev()
      }

      // After 10 prev calls from step-1 (index 0): (0 - 10) % 3 = -10 % 3
      // Using wrapped function: ((-10 % 3) + 3) % 3 = (-1 + 3) % 3 = 2 % 3 = 2
      // So should be at index 2 (step-3)
      expect(stepper.selectedId.value).toBe('step-3')
    })

    it('should wrap when stepping beyond boundaries', () => {
      const stepper = createStep({ circular: true })

      stepper.onboard([
        { id: 'step-1', value: 'Step 1' },
        { id: 'step-2', value: 'Step 2' },
        { id: 'step-3', value: 'Step 3' },
      ])

      stepper.select('step-2')
      stepper.step(5)
      // From index 1, step(5): (1 + 5) % 3 = 6 % 3 = 0
      expect(stepper.selectedId.value).toBe('step-1')

      stepper.first()
      stepper.step(-1)
      expect(stepper.selectedId.value).toBe('step-3')
    })

    it('should skip disabled items when wrapping', () => {
      const stepper = createStep({ circular: true })

      stepper.onboard([
        { id: 'step-1', value: 'Step 1', disabled: true },
        { id: 'step-2', value: 'Step 2' },
        { id: 'step-3', value: 'Step 3' },
      ])

      stepper.last()
      expect(stepper.selectedId.value).toBe('step-3')

      stepper.next()
      // Should wrap to first, but skip disabled step-1, landing on step-2
      expect(stepper.selectedId.value).toBe('step-2')
    })
  })

  describe('circular: false (bounded navigation)', () => {
    it('should not wrap when calling next on last item', () => {
      const stepper = createStep({ circular: false })

      stepper.onboard([
        { id: 'step-1', value: 'Step 1' },
        { id: 'step-2', value: 'Step 2' },
        { id: 'step-3', value: 'Step 3' },
      ])

      stepper.last()
      expect(stepper.selectedId.value).toBe('step-3')

      stepper.next()
      // Should stay at step-3 (no wrapping)
      expect(stepper.selectedId.value).toBe('step-3')
    })

    it('should not wrap when calling prev on first item', () => {
      const stepper = createStep({ circular: false })

      stepper.onboard([
        { id: 'step-1', value: 'Step 1' },
        { id: 'step-2', value: 'Step 2' },
        { id: 'step-3', value: 'Step 3' },
      ])

      stepper.first()
      expect(stepper.selectedId.value).toBe('step-1')

      stepper.prev()
      // Should stay at step-1 (no wrapping)
      expect(stepper.selectedId.value).toBe('step-1')
    })

    it('should stop at boundaries when stepping beyond', () => {
      const stepper = createStep({ circular: false })

      stepper.onboard([
        { id: 'step-1', value: 'Step 1' },
        { id: 'step-2', value: 'Step 2' },
        { id: 'step-3', value: 'Step 3' },
      ])

      stepper.first()
      stepper.step(-5)
      // Should stay at step-1 (cannot go beyond boundary)
      expect(stepper.selectedId.value).toBe('step-1')

      stepper.last()
      stepper.step(5)
      // Should stay at step-3 (cannot go beyond boundary)
      expect(stepper.selectedId.value).toBe('step-3')
    })

    it('should skip disabled items but stop at boundaries', () => {
      const stepper = createStep({ circular: false })

      stepper.onboard([
        { id: 'step-1', value: 'Step 1' },
        { id: 'step-2', value: 'Step 2', disabled: true },
        { id: 'step-3', value: 'Step 3' },
      ])

      stepper.first()
      expect(stepper.selectedId.value).toBe('step-1')

      stepper.next()
      // Should skip step-2 and go to step-3
      expect(stepper.selectedId.value).toBe('step-3')

      stepper.next()
      // Should stay at step-3 (boundary)
      expect(stepper.selectedId.value).toBe('step-3')
    })

    it('should handle multiple next calls at end boundary', () => {
      const stepper = createStep({ circular: false })

      stepper.onboard([
        { id: 'step-1', value: 'Step 1' },
        { id: 'step-2', value: 'Step 2' },
        { id: 'step-3', value: 'Step 3' },
      ])

      stepper.last()
      for (let i = 0; i < 10; i++) {
        stepper.next()
      }

      // Should still be at last item
      expect(stepper.selectedId.value).toBe('step-3')
    })

    it('should handle multiple prev calls at start boundary', () => {
      const stepper = createStep({ circular: false })

      stepper.onboard([
        { id: 'step-1', value: 'Step 1' },
        { id: 'step-2', value: 'Step 2' },
        { id: 'step-3', value: 'Step 3' },
      ])

      stepper.first()
      for (let i = 0; i < 10; i++) {
        stepper.prev()
      }

      // Should still be at first item
      expect(stepper.selectedId.value).toBe('step-1')
    })
  })

  describe('inheritance from useSingle', () => {
    it('should enforce single selection', () => {
      const stepper = createStep()

      stepper.onboard([
        { id: 'step-1', value: 'Step 1' },
        { id: 'step-2', value: 'Step 2' },
      ])

      stepper.select('step-1')
      stepper.select('step-2')

      // Should only have one selected (single selection)
      expect(stepper.selectedIds.size).toBe(1)
      expect(stepper.selectedId.value).toBe('step-2')
    })

    it('should have all useSingle computed properties', () => {
      const stepper = createStep()

      stepper.onboard([
        { id: 'step-1', value: 'Step 1' },
      ])

      stepper.first()

      expect(stepper.selectedId.value).toBe('step-1')
      expect(stepper.selectedItem.value?.id).toBe('step-1')
      expect(stepper.selectedIndex.value).toBe(0)
      expect(stepper.selectedValue.value).toBe('Step 1')
    })
  })

  describe('edge cases', () => {
    it('should handle only one item', () => {
      const stepper = createStep()

      stepper.onboard([
        { id: 'step-1', value: 'Step 1' },
      ])

      stepper.first()
      expect(stepper.selectedId.value).toBe('step-1')

      stepper.next()
      expect(stepper.selectedId.value).toBe('step-1')

      stepper.prev()
      expect(stepper.selectedId.value).toBe('step-1')
    })

    it('should handle only one enabled item among disabled items', () => {
      const stepper = createStep()

      stepper.onboard([
        { id: 'step-1', value: 'Step 1', disabled: true },
        { id: 'step-2', value: 'Step 2' },
        { id: 'step-3', value: 'Step 3', disabled: true },
      ])

      stepper.first()
      expect(stepper.selectedId.value).toBe('step-2')

      stepper.next()
      expect(stepper.selectedId.value).toBe('step-2')

      stepper.prev()
      expect(stepper.selectedId.value).toBe('step-2')
    })

    it('should handle boundaries with multiple disabled items (no wrapping)', () => {
      const stepper = createStep()

      stepper.onboard([
        { id: 'step-1', value: 'Step 1' },
        { id: 'step-2', value: 'Step 2', disabled: true },
        { id: 'step-3', value: 'Step 3', disabled: true },
        { id: 'step-4', value: 'Step 4' },
      ])

      stepper.first()
      expect(stepper.selectedId.value).toBe('step-1')

      stepper.next()
      expect(stepper.selectedId.value).toBe('step-4')

      stepper.next()
      // Should stay at step-4 (boundary, no wrapping)
      expect(stepper.selectedId.value).toBe('step-4')
    })
  })
})

describe('createStepContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return a trinity tuple', () => {
    const result = createStepContext()

    expect(Array.isArray(result)).toBe(true)
    expect(result).toHaveLength(3)
    expect(typeof result[0]).toBe('function') // useStepContext
    expect(typeof result[1]).toBe('function') // provideStepContext
    expect(result[2]).toBeDefined() // default context
  })

  it('should create context with default namespace', () => {
    const [, provideStepContext, context] = createStepContext()

    provideStepContext(context)

    expect(mockProvide).toHaveBeenCalledWith('v0:step', context)
  })

  it('should create context with custom namespace', () => {
    const [, provideStepContext, context] = createStepContext({
      namespace: 'my-wizard',
    })

    provideStepContext(context)

    expect(mockProvide).toHaveBeenCalledWith('my-wizard', context)
  })

  it('should create a functional step context with navigation', () => {
    const [,, context] = createStepContext()

    context.onboard([
      { id: 'step-1', value: 'Step 1' },
      { id: 'step-2', value: 'Step 2' },
      { id: 'step-3', value: 'Step 3' },
    ])

    context.first()
    expect(context.selectedId.value).toBe('step-1')

    context.next()
    expect(context.selectedId.value).toBe('step-2')

    context.last()
    expect(context.selectedId.value).toBe('step-3')

    context.prev()
    expect(context.selectedId.value).toBe('step-2')
  })

  it('should allow providing custom context', () => {
    const [, provideStepContext] = createStepContext()
    const customContext = createStep({ circular: true })

    provideStepContext(customContext)

    expect(mockProvide).toHaveBeenCalledWith('v0:step', customContext)
  })

  it('should provide context at app level when app is passed', () => {
    const mockApp = {
      provide: vi.fn(),
    } as any
    const [, provideStepContext, context] = createStepContext()

    provideStepContext(context, mockApp)

    expect(mockApp.provide).toHaveBeenCalledWith('v0:step', context)
    expect(mockProvide).not.toHaveBeenCalled()
  })

  it('should pass options to createStep', () => {
    const [,, context] = createStepContext({
      circular: true,
    })

    context.onboard([
      { id: 'step-1', value: 'Step 1' },
      { id: 'step-2', value: 'Step 2' },
    ])

    context.last()
    context.next()

    // Should wrap to first due to circular
    expect(context.selectedId.value).toBe('step-1')
  })
})

describe('useStep consumer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should inject context with default namespace', () => {
    const mockContext = createStep()
    mockInject.mockReturnValue(mockContext)

    const result = useStep()

    expect(mockInject).toHaveBeenCalledWith('v0:step', undefined)
    expect(result).toBe(mockContext)
  })

  it('should inject context with custom namespace', () => {
    const mockContext = createStep()
    mockInject.mockReturnValue(mockContext)

    const result = useStep('my-wizard')

    expect(mockInject).toHaveBeenCalledWith('my-wizard', undefined)
    expect(result).toBe(mockContext)
  })

  it('should throw when context is not provided', () => {
    mockInject.mockReturnValue(undefined)

    expect(() => useStep()).toThrow(
      'Context "v0:step" not found. Ensure it\'s provided by an ancestor.',
    )
  })

  it('should throw with custom namespace in error message', () => {
    mockInject.mockReturnValue(undefined)

    expect(() => useStep('custom-stepper')).toThrow(
      'Context "custom-stepper" not found. Ensure it\'s provided by an ancestor.',
    )
  })
})
