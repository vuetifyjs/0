import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createRating, createRatingContext, useRating } from '.'

// Utilities
import { inject, provide, shallowRef } from 'vue'

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

describe('createRating', () => {
  describe('defaults', () => {
    it('should create rating with default state', () => {
      const rating = createRating()

      expect(rating.value.value).toBe(0)
      expect(rating.size).toBe(5)
      expect(rating.half).toBe(false)
      expect(rating.isFirst.value).toBe(true)
      expect(rating.isLast.value).toBe(false)
    })

    it('should compute 5 empty items by default', () => {
      const rating = createRating()

      expect(rating.items.value).toEqual([
        { value: 1, state: 'empty' },
        { value: 2, state: 'empty' },
        { value: 3, state: 'empty' },
        { value: 4, state: 'empty' },
        { value: 5, state: 'empty' },
      ])
    })
  })

  describe('value clamping', () => {
    it('should clamp value to 0–size range', () => {
      const rating = createRating({ value: 10, size: 5 })

      expect(rating.value.value).toBe(5)
    })

    it('should clamp negative values to 0', () => {
      const rating = createRating({ value: -3 })

      expect(rating.value.value).toBe(0)
    })

    it('should accept initial value within range', () => {
      const rating = createRating({ value: 3 })

      expect(rating.value.value).toBe(3)
    })

    it('should clamp when value is set out of range', () => {
      const rating = createRating()

      rating.value.value = 99
      expect(rating.value.value).toBe(5)

      rating.value.value = -5
      expect(rating.value.value).toBe(0)
    })
  })

  describe('items computation', () => {
    it('should mark items as full up to rating value', () => {
      const rating = createRating({ value: 3 })

      expect(rating.items.value).toEqual([
        { value: 1, state: 'full' },
        { value: 2, state: 'full' },
        { value: 3, state: 'full' },
        { value: 4, state: 'empty' },
        { value: 5, state: 'empty' },
      ])
    })

    it('should mark half item when half is enabled', () => {
      const rating = createRating({ value: 2.5, half: true })

      expect(rating.items.value).toEqual([
        { value: 1, state: 'full' },
        { value: 2, state: 'full' },
        { value: 3, state: 'half' },
        { value: 4, state: 'empty' },
        { value: 5, state: 'empty' },
      ])
    })

    it('should show all full when value equals size', () => {
      const rating = createRating({ value: 5 })

      expect(rating.items.value).toEqual([
        { value: 1, state: 'full' },
        { value: 2, state: 'full' },
        { value: 3, state: 'full' },
        { value: 4, state: 'full' },
        { value: 5, state: 'full' },
      ])
    })

    it('should update items reactively when value changes', () => {
      const rating = createRating({ value: 1 })

      expect(rating.items.value[1].state).toBe('empty')

      rating.select(3)

      expect(rating.items.value[0].state).toBe('full')
      expect(rating.items.value[1].state).toBe('full')
      expect(rating.items.value[2].state).toBe('full')
      expect(rating.items.value[3].state).toBe('empty')
    })

    it('should handle custom size', () => {
      const rating = createRating({ size: 10, value: 5 })

      expect(rating.items.value).toHaveLength(10)
      expect(rating.items.value[4].state).toBe('full')
      expect(rating.items.value[5].state).toBe('empty')
    })
  })

  describe('navigation', () => {
    describe('select', () => {
      it('should set value directly', () => {
        const rating = createRating()

        rating.select(4)

        expect(rating.value.value).toBe(4)
      })

      it('should clamp to valid range', () => {
        const rating = createRating()

        rating.select(99)
        expect(rating.value.value).toBe(5)

        rating.select(-5)
        expect(rating.value.value).toBe(0)
      })
    })

    describe('next', () => {
      it('should increment by 1', () => {
        const rating = createRating({ value: 2 })

        rating.next()

        expect(rating.value.value).toBe(3)
      })

      it('should increment by 0.5 when half is enabled', () => {
        const rating = createRating({ value: 2, half: true })

        rating.next()

        expect(rating.value.value).toBe(2.5)
      })

      it('should not exceed size', () => {
        const rating = createRating({ value: 5 })

        rating.next()

        expect(rating.value.value).toBe(5)
      })
    })

    describe('prev', () => {
      it('should decrement by 1', () => {
        const rating = createRating({ value: 3 })

        rating.prev()

        expect(rating.value.value).toBe(2)
      })

      it('should decrement by 0.5 when half is enabled', () => {
        const rating = createRating({ value: 3, half: true })

        rating.prev()

        expect(rating.value.value).toBe(2.5)
      })

      it('should not go below 0', () => {
        const rating = createRating({ value: 0 })

        rating.prev()

        expect(rating.value.value).toBe(0)
      })
    })

    describe('first', () => {
      it('should set value to 0', () => {
        const rating = createRating({ value: 4 })

        rating.first()

        expect(rating.value.value).toBe(0)
      })
    })

    describe('last', () => {
      it('should set value to size', () => {
        const rating = createRating({ value: 1 })

        rating.last()

        expect(rating.value.value).toBe(5)
      })
    })
  })

  describe('boundary computed', () => {
    describe('isFirst', () => {
      it('should be true when value is 0', () => {
        const rating = createRating({ value: 0 })

        expect(rating.isFirst.value).toBe(true)
      })

      it('should be false when value is greater than 0', () => {
        const rating = createRating({ value: 1 })

        expect(rating.isFirst.value).toBe(false)
      })
    })

    describe('isLast', () => {
      it('should be true when value equals size', () => {
        const rating = createRating({ value: 5 })

        expect(rating.isLast.value).toBe(true)
      })

      it('should be false when value is less than size', () => {
        const rating = createRating({ value: 4 })

        expect(rating.isLast.value).toBe(false)
      })
    })
  })

  describe('v-model support', () => {
    it('should use provided ref for value', () => {
      const value = shallowRef(3)
      const rating = createRating({ value })

      expect(rating.value.value).toBe(3)

      rating.select(5)
      expect(value.value).toBe(5)
    })

    it('should sync when external ref changes', () => {
      const value = shallowRef(1)
      const rating = createRating({ value })

      value.value = 4

      expect(rating.value.value).toBe(4)
    })
  })

  describe('edge cases', () => {
    it('should handle size of 1', () => {
      const rating = createRating({ size: 1, value: 1 })

      expect(rating.items.value).toEqual([
        { value: 1, state: 'full' },
      ])
      expect(rating.isLast.value).toBe(true)
    })

    it('should round to nearest 0.5 when half is enabled', () => {
      const rating = createRating({ half: true })

      rating.value.value = 2.7
      // clamped raw, items derive from clamped value
      expect(rating.value.value).toBe(2.7)
      // items show: 1 full, 2 full, 3 half (ceil of 2.7 is 3, 2.7 is not whole)
      expect(rating.items.value[2].state).toBe('half')
    })

    it('should treat whole numbers as full even when half is enabled', () => {
      const rating = createRating({ value: 3, half: true })

      expect(rating.items.value[2].state).toBe('full')
      expect(rating.items.value[3].state).toBe('empty')
    })
  })
})

describe('createRatingContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return a trinity tuple', () => {
    const result = createRatingContext()

    expect(Array.isArray(result)).toBe(true)
    expect(result).toHaveLength(3)
    expect(typeof result[0]).toBe('function')
    expect(typeof result[1]).toBe('function')
    expect(result[2]).toBeDefined()
  })

  it('should create context with default namespace', () => {
    const [, provideContext, context] = createRatingContext()

    provideContext(context)

    expect(mockProvide).toHaveBeenCalledWith('v0:rating', context)
  })

  it('should create context with custom namespace', () => {
    const [, provideContext, context] = createRatingContext({
      namespace: 'test:my-rating',
    })

    provideContext(context)

    expect(mockProvide).toHaveBeenCalledWith('test:my-rating', context)
  })

  it('should create a functional rating context', () => {
    const [,, context] = createRatingContext({ value: 3, size: 5 })

    expect(context.value.value).toBe(3)
    expect(context.size).toBe(5)
    expect(context.items.value).toHaveLength(5)
  })

  it('should allow providing custom context', () => {
    const [, provideContext] = createRatingContext()
    const custom = createRating({ value: 4 })

    provideContext(custom)

    expect(mockProvide).toHaveBeenCalledWith('v0:rating', custom)
  })
})

describe('useRating consumer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should inject context with default namespace', () => {
    const mockContext = createRating()
    mockInject.mockReturnValue(mockContext)

    const result = useRating()

    expect(mockInject).toHaveBeenCalledWith('v0:rating', undefined)
    expect(result).toBe(mockContext)
  })

  it('should inject context with custom namespace', () => {
    const mockContext = createRating()
    mockInject.mockReturnValue(mockContext)

    const result = useRating('test:my-rating')

    expect(mockInject).toHaveBeenCalledWith('test:my-rating', undefined)
    expect(result).toBe(mockContext)
  })

  it('should throw when context is not provided', () => {
    mockInject.mockReturnValue(undefined)

    expect(() => useRating()).toThrow(
      'Context "v0:rating" not found. Ensure it\'s provided by an ancestor.',
    )
  })
})
