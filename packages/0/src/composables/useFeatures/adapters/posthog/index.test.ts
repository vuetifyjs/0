import { describe, expect, it, vi } from 'vitest'

const mockInBrowser = vi.hoisted(() => ({ value: true }))

vi.mock('#v0/constants/globals', () => ({
  get IN_BROWSER () {
    return mockInBrowser.value
  },
}))

import { PostHogFeatureAdapter } from '.'

function createMockClient () {
  return {
    featureFlags: {
      getFlags: vi.fn().mockReturnValue([]),
    },
    isFeatureEnabled: vi.fn(),
    getFeatureFlagPayload: vi.fn(),
    getFeatureFlag: vi.fn(),
    onFeatureFlags: vi.fn(),
  }
}

describe('postHogFeatureAdapter', () => {
  describe('constructor', () => {
    it('should accept options', () => {
      const mockClient = createMockClient()
      const adapter = new PostHogFeatureAdapter(mockClient as never)

      expect(adapter).toBeInstanceOf(PostHogFeatureAdapter)
    })
  })

  describe('setup', () => {
    it('should register initial flags', () => {
      mockInBrowser.value = true
      const mockClient = createMockClient()
      mockClient.featureFlags.getFlags.mockReturnValue(['flag-1', 'flag-2'])
      mockClient.isFeatureEnabled.mockReturnValue(true)
      mockClient.getFeatureFlagPayload.mockImplementation((key: string) => key === 'flag-2' ? 'payload-2' : undefined)
      mockClient.getFeatureFlag.mockReturnValue(true)
      mockClient.onFeatureFlags.mockImplementation((cb: Function) => cb())

      const adapter = new PostHogFeatureAdapter(mockClient as never)
      const onUpdate = vi.fn()

      const flags = adapter.setup(onUpdate)

      expect(flags).toEqual({
        'flag-1': true,
        'flag-2': { $value: true, $variation: 'payload-2' },
      })
    })

    it('should subscribe to flag changes', () => {
      mockInBrowser.value = true
      const mockClient = createMockClient()
      mockClient.featureFlags.getFlags.mockReturnValue(['flag-1', 'flag-2', 'flag-3', 'flag-4'])
      mockClient.isFeatureEnabled.mockImplementation((key: string) => {
        if (key === 'flag-1') return true
        if (key === 'flag-4') return undefined
        return false
      })
      mockClient.getFeatureFlagPayload.mockImplementation((key: string) => key === 'flag-2' ? 'payload-2' : undefined)
      mockClient.getFeatureFlag.mockImplementation((key: string) => key === 'flag-3' ? 'variant-3' : undefined)
      mockClient.onFeatureFlags.mockImplementation((cb: Function) => cb())

      const adapter = new PostHogFeatureAdapter(mockClient as never)
      const onUpdate = vi.fn()

      adapter.setup(onUpdate)

      const expected = {
        'flag-1': true,
        'flag-2': { $value: false, $variation: 'payload-2' },
        'flag-3': { $value: true, $variation: 'variant-3' },
        'flag-4': false,
      }

      expect(onUpdate).toHaveBeenCalledWith(expected)
    })
  })

  describe('onChange', () => {
    it('should call onUpdate when flags change', () => {
      mockInBrowser.value = true
      const mockClient = createMockClient()
      let flagsCallback: Function | undefined
      mockClient.featureFlags.getFlags.mockReturnValue(['flag-1'])
      mockClient.isFeatureEnabled.mockReturnValue(true)
      mockClient.getFeatureFlagPayload.mockReturnValue(undefined)
      mockClient.getFeatureFlag.mockReturnValue(true)
      mockClient.onFeatureFlags.mockImplementation((cb: Function) => {
        flagsCallback = cb
        return vi.fn()
      })

      const adapter = new PostHogFeatureAdapter(mockClient as never)
      const onUpdate = vi.fn()

      adapter.setup(onUpdate)

      mockClient.isFeatureEnabled.mockReturnValue(false)
      flagsCallback?.()

      expect(onUpdate).toHaveBeenCalledTimes(2)
    })
  })

  describe('dispose', () => {
    it('should clean up subscriptions', () => {
      mockInBrowser.value = true
      const mockClient = createMockClient()
      const unsubscribeMock = vi.fn()
      mockClient.onFeatureFlags.mockReturnValue(unsubscribeMock)

      const adapter = new PostHogFeatureAdapter(mockClient as never)
      adapter.setup(vi.fn())
      adapter.dispose()

      expect(unsubscribeMock).toHaveBeenCalled()
    })

    it('should handle dispose before setup', () => {
      const mockClient = createMockClient()
      const adapter = new PostHogFeatureAdapter(mockClient as never)
      expect(() => adapter.dispose()).not.toThrow()
    })
  })

  describe('error handling', () => {
    it('should handle null/empty flags gracefully', () => {
      mockInBrowser.value = true
      const mockClient = createMockClient()
      mockClient.featureFlags.getFlags.mockReturnValue(null)

      const adapter = new PostHogFeatureAdapter(mockClient as never)
      const onUpdate = vi.fn()

      const flags = adapter.setup(onUpdate)
      expect(flags).toEqual({})
    })
  })

  describe('sSR (non-browser) environment', () => {
    it('should return empty flags when not in browser', () => {
      mockInBrowser.value = false
      const mockClient = createMockClient()

      const adapter = new PostHogFeatureAdapter(mockClient as never)
      const onUpdate = vi.fn()
      const flags = adapter.setup(onUpdate)

      expect(flags).toEqual({})
      expect(onUpdate).not.toHaveBeenCalled()
      expect(mockClient.onFeatureFlags).not.toHaveBeenCalled()

      mockInBrowser.value = true
    })
  })
})
