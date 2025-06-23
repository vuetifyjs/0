import { describe, it, expect, beforeEach, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { useGroup, type GroupItem } from '../group'

const mockUseGroupContext = vi.fn()
const mockProvideGroupContext = vi.fn()

vi.mock('../context', () => ({
  useContext: vi.fn(() => [mockUseGroupContext, mockProvideGroupContext]),
}))

describe('useGroup', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('basic functionality', () => {
    it('should initialize with empty state', () => {
      const [,provideGroup] = useGroup('test-group')

      provideGroup()

      expect(mockProvideGroupContext).toHaveBeenCalledWith({
        register: expect.any(Function),
        unregister: expect.any(Function),
        reset: expect.any(Function),
        mandate: expect.any(Function),
      })
    })

    it('should register items and assign index', () => {
      const [,provideGroup] = useGroup('test-group')

      provideGroup()

      const context = mockProvideGroupContext.mock.calls[0][0]

      const item1 = { id: 'item1', value: null } as GroupItem
      const item2 = { id: 'item2', value: 'custom' } as GroupItem

      const registered1 = context.register(item1)
      const registered2 = context.register(item2)

      expect(registered1.index.value).toBe(0)
      expect(registered2.index.value).toBe(1)
    })

    it('should unregister items', () => {
      const [,provideGroup] = useGroup('test-group')

      provideGroup()

      const context = mockProvideGroupContext.mock.calls[0][0]

      const item = { id: 'item1', value: null }
      context.register(item)

      context.unregister('item1')

      // After unregistering, registering a new item should start index from 0 again
      const newItem = { id: 'item2', value: null }
      const registered = context.register(newItem)

      expect(registered.index.value).toBe(0)
    })
  })
})
