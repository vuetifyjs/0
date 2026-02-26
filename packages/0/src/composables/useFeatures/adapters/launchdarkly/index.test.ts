import { describe, expect, it, vi } from 'vitest'

import { LaunchDarklyFeatureAdapter } from '.'

function createMockClient () {
  return {
    allFlags: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  }
}

describe('launchDarklyFeatureAdapter', () => {
  describe('constructor', () => {
    it('should accept options', () => {
      const mockClient = createMockClient()
      const adapter = new LaunchDarklyFeatureAdapter(mockClient as never)

      expect(adapter).toBeInstanceOf(LaunchDarklyFeatureAdapter)
    })
  })

  describe('setup', () => {
    it('should register initial flags', () => {
      const mockClient = createMockClient()
      mockClient.allFlags.mockReturnValue({
        'flag-bool': true,
        'flag-json': { color: 'blue' },
        'flag-string': 'variation-a',
      })

      const adapter = new LaunchDarklyFeatureAdapter(mockClient as never)
      const onUpdate = vi.fn()

      const flags = adapter.setup(onUpdate)

      expect(flags).toEqual({
        'flag-bool': true,
        'flag-json': { $value: true, $variation: { color: 'blue' } },
        'flag-string': { $value: true, $variation: 'variation-a' },
      })
    })

    it('should subscribe to flag changes', () => {
      const mockClient = createMockClient()
      mockClient.allFlags.mockReturnValue({})

      const adapter = new LaunchDarklyFeatureAdapter(mockClient as never)
      adapter.setup(vi.fn())

      expect(mockClient.on).toHaveBeenCalledWith('change', expect.any(Function))
    })
  })

  describe('onChange', () => {
    it('should call onUpdate when flags change', () => {
      const mockClient = createMockClient()
      mockClient.allFlags.mockReturnValue({
        'flag-bool': true,
      })
      mockClient.on.mockImplementation((_event: string, cb: Function) => {
        cb()
      })

      const adapter = new LaunchDarklyFeatureAdapter(mockClient as never)
      const onUpdate = vi.fn()

      adapter.setup(onUpdate)

      expect(onUpdate).toHaveBeenCalledWith(expect.objectContaining({
        'flag-bool': true,
      }))
    })
  })

  describe('dispose', () => {
    it('should clean up subscriptions', () => {
      const mockClient = createMockClient()
      mockClient.allFlags.mockReturnValue({})

      const adapter = new LaunchDarklyFeatureAdapter(mockClient as never)
      adapter.setup(vi.fn())
      adapter.dispose()

      expect(mockClient.off).toHaveBeenCalledWith('change', expect.any(Function))
    })

    it('should handle dispose before setup', () => {
      const mockClient = createMockClient()
      const adapter = new LaunchDarklyFeatureAdapter(mockClient as never)
      expect(() => adapter.dispose()).not.toThrow()
    })
  })

  describe('error handling', () => {
    it('should handle setup throwing', () => {
      const mockClient = createMockClient()
      mockClient.allFlags.mockImplementation(() => {
        throw new Error('allFlags failed')
      })

      const adapter = new LaunchDarklyFeatureAdapter(mockClient as never)

      expect(() => adapter.setup(vi.fn())).toThrow('allFlags failed')
    })

    it('should handle null/empty flags gracefully', () => {
      const mockClient = createMockClient()
      mockClient.allFlags.mockReturnValue({})

      const adapter = new LaunchDarklyFeatureAdapter(mockClient as never)
      const onUpdate = vi.fn()
      const flags = adapter.setup(onUpdate)

      expect(flags).toEqual({})
    })
  })
})
