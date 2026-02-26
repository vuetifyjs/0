import { describe, expect, it, vi } from 'vitest'

// Types
import type { IInitConfig } from 'flagsmith'

import { FlagsmithFeatureAdapter } from '.'

function createMockClient () {
  return {
    init: vi.fn(),
    getAllFlags: vi.fn(),
    stopListening: vi.fn(),
  }
}

describe('flagsmithFeatureAdapter', () => {
  describe('constructor', () => {
    it('should accept options', () => {
      const mockClient = createMockClient()
      const options: IInitConfig = { environmentID: 'test-env' }
      const adapter = new FlagsmithFeatureAdapter(mockClient as never, options)

      expect(adapter).toBeInstanceOf(FlagsmithFeatureAdapter)
    })
  })

  describe('setup', () => {
    it('should register initial flags', () => {
      const mockClient = createMockClient()
      mockClient.getAllFlags.mockReturnValue({
        'feature-c': { enabled: true, value: 'value-c' } as never,
      })

      const adapter = new FlagsmithFeatureAdapter(mockClient as never, { environmentID: 'test-env' })
      const flags = adapter.setup(vi.fn())

      expect(flags).toEqual({
        'feature-c': { $value: true, $variation: 'value-c' },
      })
    })

    it('should subscribe to flag changes', () => {
      const mockClient = createMockClient()
      const options: IInitConfig = { environmentID: 'test-env' }
      const adapter = new FlagsmithFeatureAdapter(mockClient as never, options)

      adapter.setup(vi.fn())

      expect(mockClient.init).toHaveBeenCalledWith(expect.objectContaining(options))
    })
  })

  describe('onChange', () => {
    it('should call onUpdate when flags change', () => {
      const mockClient = createMockClient()
      let onChangeCallback: Function | undefined

      mockClient.init.mockImplementation((options: Record<string, unknown>) => {
        onChangeCallback = options.onChange as Function
        return Promise.resolve()
      })

      mockClient.getAllFlags.mockReturnValue({
        'feature-a': { enabled: true, value: 'value-a' } as never,
        'feature-b': { enabled: false, value: null } as never,
      })

      const adapter = new FlagsmithFeatureAdapter(mockClient as never, { environmentID: 'test-env' })
      const onUpdate = vi.fn()

      adapter.setup(onUpdate)

      onChangeCallback?.({}, { isFromServer: true }, { error: null, isFetching: false, isLoading: false, source: 'server' })

      expect(onUpdate).toHaveBeenCalledWith({
        'feature-a': { $value: true, $variation: 'value-a' },
        'feature-b': false,
      })
    })
  })

  describe('dispose', () => {
    it('should clean up subscriptions', () => {
      const mockClient = createMockClient()
      const adapter = new FlagsmithFeatureAdapter(mockClient as never, { environmentID: 'test-env' })
      adapter.setup(vi.fn())
      adapter.dispose()
      expect(mockClient.stopListening).toHaveBeenCalled()
    })

    it('should handle dispose before setup', () => {
      const mockClient = createMockClient()
      const adapter = new FlagsmithFeatureAdapter(mockClient as never, { environmentID: 'test-env' })
      expect(() => adapter.dispose()).not.toThrow()
    })
  })

  describe('error handling', () => {
    it('should handle init throwing', () => {
      const mockClient = createMockClient()
      mockClient.init.mockImplementation(() => {
        throw new Error('init failed')
      })
      mockClient.getAllFlags.mockReturnValue({})

      const adapter = new FlagsmithFeatureAdapter(mockClient as never, { environmentID: 'test-env' })

      expect(() => adapter.setup(vi.fn())).toThrow('init failed')
    })

    it('should handle null/empty flags gracefully', () => {
      const mockClient = createMockClient()
      mockClient.getAllFlags.mockReturnValue(null)

      const adapter = new FlagsmithFeatureAdapter(mockClient as never, { environmentID: 'test-env' })
      const flags = adapter.setup(vi.fn())

      expect(flags).toEqual({})
    })
  })
})
