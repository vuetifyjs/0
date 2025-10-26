// Composables
import { useStep } from './index'

// Utilities
import { describe, it, expect } from 'vitest'

describe('useStep', () => {
  describe('first', () => {
    it('should select first item', () => {
      const stepper = useStep()

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
      const stepper = useStep()

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
      const stepper = useStep()

      stepper.onboard([
        { id: 'step-1', value: 'Step 1', disabled: true },
        { id: 'step-2', value: 'Step 2', disabled: true },
      ])

      stepper.first()

      expect(stepper.selectedId.value).toBeUndefined()
    })

    it('should do nothing when registry is empty', () => {
      const stepper = useStep()

      stepper.first()

      expect(stepper.selectedId.value).toBeUndefined()
    })

    it('should change selection from current to first', () => {
      const stepper = useStep()

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
      const stepper = useStep()

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
      const stepper = useStep()

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
      const stepper = useStep()

      stepper.onboard([
        { id: 'step-1', value: 'Step 1', disabled: true },
        { id: 'step-2', value: 'Step 2', disabled: true },
      ])

      stepper.last()

      expect(stepper.selectedId.value).toBeUndefined()
    })

    it('should do nothing when registry is empty', () => {
      const stepper = useStep()

      stepper.last()

      expect(stepper.selectedId.value).toBeUndefined()
    })

    it('should change selection from current to last', () => {
      const stepper = useStep()

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
      const stepper = useStep()

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

    it('should wrap around to first item at end', () => {
      const stepper = useStep()

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

    it('should skip disabled items when moving next', () => {
      const stepper = useStep()

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
      const stepper = useStep()

      stepper.next()
      expect(stepper.selectedId.value).toBeUndefined()
    })

    it('should do nothing when all items are disabled', () => {
      const stepper = useStep()

      stepper.onboard([
        { id: 'step-1', value: 'Step 1', disabled: true },
        { id: 'step-2', value: 'Step 2', disabled: true },
      ])

      stepper.next()
      expect(stepper.selectedId.value).toBeUndefined()
    })

    it('should work when no initial selection', () => {
      const stepper = useStep()

      stepper.onboard([
        { id: 'step-1', value: 'Step 1' },
        { id: 'step-2', value: 'Step 2' },
      ])

      // selectedIndex is -1 when nothing selected
      stepper.next()
      // Should select step-1 (wrapping from -1 + 1 = 0)
      expect(stepper.selectedId.value).toBe('step-1')
    })
  })

  describe('prev', () => {
    it('should move to previous item', () => {
      const stepper = useStep()

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

    it('should wrap around to last item at start', () => {
      const stepper = useStep()

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

    it('should skip disabled items when moving prev', () => {
      const stepper = useStep()

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
      const stepper = useStep()

      stepper.prev()
      expect(stepper.selectedId.value).toBeUndefined()
    })

    it('should do nothing when all items are disabled', () => {
      const stepper = useStep()

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
      const stepper = useStep()

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
      const stepper = useStep()

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

    it('should wrap around when stepping forward beyond end', () => {
      const stepper = useStep()

      stepper.onboard([
        { id: 'step-1', value: 'Step 1' },
        { id: 'step-2', value: 'Step 2' },
        { id: 'step-3', value: 'Step 3' },
      ])

      stepper.select('step-2')
      stepper.step(5)
      // From index 1 (step-2), step(5): (1 + 5) % 3 = 6 % 3 = 0, so should be at index 0 (step-1)
      expect(stepper.selectedId.value).toBe('step-1')
    })

    it('should wrap around when stepping backward beyond start', () => {
      const stepper = useStep()

      stepper.onboard([
        { id: 'step-1', value: 'Step 1' },
        { id: 'step-2', value: 'Step 2' },
        { id: 'step-3', value: 'Step 3' },
      ])

      stepper.first()
      stepper.step(-1)
      expect(stepper.selectedId.value).toBe('step-3')
    })

    it('should skip disabled items when stepping', () => {
      const stepper = useStep()

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

    it('should handle large step counts', () => {
      const stepper = useStep()

      stepper.onboard([
        { id: 'step-1', value: 'Step 1' },
        { id: 'step-2', value: 'Step 2' },
        { id: 'step-3', value: 'Step 3' },
      ])

      stepper.first()
      stepper.step(100)

      // 100 % 3 = 1, so should be at index 1 (step-2)
      expect(stepper.selectedId.value).toBe('step-2')
    })

    it('should handle step count of 0', () => {
      const stepper = useStep()

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
      const stepper = useStep()

      stepper.onboard([
        { id: 'step-1', value: 'Step 1', disabled: true },
        { id: 'step-2', value: 'Step 2', disabled: true },
      ])

      stepper.step(1)
      expect(stepper.selectedId.value).toBeUndefined()
    })

    it('should do nothing when registry is empty', () => {
      const stepper = useStep()

      stepper.step(5)
      expect(stepper.selectedId.value).toBeUndefined()
    })
  })

  describe('circular navigation', () => {
    it('should continuously wrap in forward direction', () => {
      const stepper = useStep()

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
      const stepper = useStep()

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
  })

  describe('inheritance from useSingle', () => {
    it('should enforce single selection', () => {
      const stepper = useStep()

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
      const stepper = useStep()

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
      const stepper = useStep()

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
      const stepper = useStep()

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

    it('should handle wrapping with multiple disabled items', () => {
      const stepper = useStep()

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
      expect(stepper.selectedId.value).toBe('step-1')
    })
  })
})
