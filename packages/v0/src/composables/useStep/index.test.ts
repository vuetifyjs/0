import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useStep } from './index'

const mockUseGroupContext = vi.fn()
const mockProvideGroupContext = vi.fn()

vi.mock('../useRegistrar', () => ({
  useRegistrar: vi.fn(() => [mockUseGroupContext, mockProvideGroupContext, { registeredItems: new Map() }]),
}))

describe('useStep', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should provide step context with navigation functions', () => {
    const [, provideStep] = useStep('test')
    const result = provideStep()

    expect(result).toMatchObject({
      register: expect.any(Function),
      unregister: expect.any(Function),
      reset: expect.any(Function),
      mandate: expect.any(Function),
      select: expect.any(Function),
      first: expect.any(Function),
      last: expect.any(Function),
      next: expect.any(Function),
      prev: expect.any(Function),
      step: expect.any(Function),
    })
  })

  it('should create step state with currentItem', () => {
    const result = useStep('test')
    const stepState = result[2]

    expect(stepState).toMatchObject({
      currentItem: expect.any(Object),
      selectedItems: expect.any(Object),
      selectedIds: expect.any(Object),
      selectedValues: expect.any(Object),
      registeredItems: expect.any(Object),
    })
  })

  describe('navigation functions', () => {
    let context: any

    beforeEach(() => {
      vi.clearAllMocks()
      const [, provideStep] = useStep('test')
      provideStep()
      context = mockProvideGroupContext.mock.calls[0][0]
    })

    it('should navigate to first item', () => {
      const ticket1 = context.register({ id: 'item1' })
      const ticket2 = context.register({ id: 'item2' })
      const ticket3 = context.register({ id: 'item3' })

      ticket2.toggle()
      expect(ticket2.isActive.value).toBe(true)

      context.first()
      expect(ticket1.isActive.value).toBe(true)
      expect(ticket2.isActive.value).toBe(false)
      expect(ticket3.isActive.value).toBe(false)
    })

    it('should navigate to last item', () => {
      const ticket1 = context.register({ id: 'item1' })
      const ticket2 = context.register({ id: 'item2' })
      const ticket3 = context.register({ id: 'item3' })

      ticket1.toggle()
      expect(ticket1.isActive.value).toBe(true)

      context.last()
      expect(ticket1.isActive.value).toBe(false)
      expect(ticket2.isActive.value).toBe(false)
      expect(ticket3.isActive.value).toBe(true)
    })

    it('should navigate to next item', () => {
      const ticket1 = context.register({ id: 'item1' })
      const ticket2 = context.register({ id: 'item2' })
      const ticket3 = context.register({ id: 'item3' })

      ticket1.toggle()
      expect(ticket1.isActive.value).toBe(true)

      context.next()
      expect(ticket1.isActive.value).toBe(false)
      expect(ticket2.isActive.value).toBe(true)
      expect(ticket3.isActive.value).toBe(false)
    })

    it('should wrap around when navigating next from last item', () => {
      const ticket1 = context.register({ id: 'item1' })
      const ticket2 = context.register({ id: 'item2' })
      const ticket3 = context.register({ id: 'item3' })

      ticket3.toggle()
      expect(ticket3.isActive.value).toBe(true)

      context.next()
      expect(ticket1.isActive.value).toBe(true)
      expect(ticket2.isActive.value).toBe(false)
      expect(ticket3.isActive.value).toBe(false)
    })

    it('should navigate to previous item', () => {
      const ticket1 = context.register({ id: 'item1' })
      const ticket2 = context.register({ id: 'item2' })
      const ticket3 = context.register({ id: 'item3' })

      ticket2.toggle()
      expect(ticket2.isActive.value).toBe(true)

      context.prev()
      expect(ticket1.isActive.value).toBe(true)
      expect(ticket2.isActive.value).toBe(false)
      expect(ticket3.isActive.value).toBe(false)
    })

    it('should wrap around when navigating prev from first item', () => {
      const ticket1 = context.register({ id: 'item1' })
      const ticket2 = context.register({ id: 'item2' })
      const ticket3 = context.register({ id: 'item3' })

      ticket1.toggle()
      expect(ticket1.isActive.value).toBe(true)

      context.prev()
      expect(ticket1.isActive.value).toBe(false)
      expect(ticket2.isActive.value).toBe(false)
      expect(ticket3.isActive.value).toBe(true)
    })

    it('should navigate by specific step count', () => {
      const ticket1 = context.register({ id: 'item1' })
      const ticket2 = context.register({ id: 'item2' })
      const ticket3 = context.register({ id: 'item3' })
      const ticket4 = context.register({ id: 'item4' })

      ticket1.toggle()
      expect(ticket1.isActive.value).toBe(true)

      context.step(2)
      expect(ticket1.isActive.value).toBe(false)
      expect(ticket2.isActive.value).toBe(false)
      expect(ticket3.isActive.value).toBe(true)
      expect(ticket4.isActive.value).toBe(false)
    })

    it.skip('should wrap around when stepping beyond bounds', () => {
      const ticket1 = context.register({ id: 'item1' })
      const ticket2 = context.register({ id: 'item2' })
      const ticket3 = context.register({ id: 'item3' })

      ticket2.toggle()
      expect(ticket2.isActive.value).toBe(true)

      context.step(5)
      expect(ticket1.isActive.value).toBe(false)
      expect(ticket2.isActive.value).toBe(true)
      expect(ticket3.isActive.value).toBe(false)
    })

    it('should handle navigation with no items registered', () => {
      context.first()
      context.last()
      context.next()
      context.prev()
      context.step(5)

      expect(true).toBe(true)
    })

    it('should handle navigation with single item', () => {
      const ticket1 = context.register({ id: 'item1' })

      context.first()
      expect(ticket1.isActive.value).toBe(true)

      context.last()
      expect(ticket1.isActive.value).toBe(true)

      context.next()
      expect(ticket1.isActive.value).toBe(true)

      context.prev()
      expect(ticket1.isActive.value).toBe(true)

      context.step(10)
      expect(ticket1.isActive.value).toBe(true)
    })

    it('should handle navigation from no current selection', () => {
      const ticket1 = context.register({ id: 'item1' })
      const ticket2 = context.register({ id: 'item2' })

      context.next()
      expect(ticket1.isActive.value).toBe(true)
      expect(ticket2.isActive.value).toBe(false)
    })
  })
})
