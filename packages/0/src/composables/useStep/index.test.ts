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
})
