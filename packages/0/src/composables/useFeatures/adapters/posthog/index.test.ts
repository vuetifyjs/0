import { describe, expect, it, vi } from 'vitest'

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
  it('should sync flags from PostHog', () => {
    const mockClient = createMockClient()
    mockClient.featureFlags.getFlags.mockReturnValue(['flag-1', 'flag-2', 'flag-3', 'flag-4'])
    mockClient.isFeatureEnabled.mockImplementation(key => {
      if (key === 'flag-1') return true
      if (key === 'flag-4') return undefined // Test ?? false
      return false
    })
    mockClient.getFeatureFlagPayload.mockImplementation(key => key === 'flag-2' ? 'payload-2' : undefined)
    mockClient.getFeatureFlag.mockImplementation(key => key === 'flag-3' ? 'variant-3' : undefined)
    mockClient.onFeatureFlags.mockImplementation(cb => cb())

    const adapter = new PostHogFeatureAdapter(mockClient as any)
    const onUpdate = vi.fn()

    const flags = adapter.setup(onUpdate)

    const expected = {
      'flag-1': true,
      'flag-2': { $value: false, $variation: 'payload-2' },
      'flag-3': { $value: true, $variation: 'variant-3' },
      'flag-4': false,
    }

    expect(onUpdate).toHaveBeenCalledWith(expected)
    expect(flags).toEqual(expected)
  })

  it('should dispose listener', () => {
    const mockClient = createMockClient()
    const unsubscribeMock = vi.fn()
    mockClient.onFeatureFlags.mockReturnValue(unsubscribeMock)

    const adapter = new PostHogFeatureAdapter(mockClient as any)
    adapter.setup(vi.fn())
    adapter.dispose()

    expect(unsubscribeMock).toHaveBeenCalled()
  })

  it('should handle dispose before setup', () => {
    const mockClient = createMockClient()
    const adapter = new PostHogFeatureAdapter(mockClient as any)
    expect(() => adapter.dispose()).not.toThrow()
  })

  it('should handle null active flags', () => {
    const mockClient = createMockClient()
    mockClient.featureFlags.getFlags.mockReturnValue(null)

    const adapter = new PostHogFeatureAdapter(mockClient as any)
    const onUpdate = vi.fn()

    const flags = adapter.setup(onUpdate)
    expect(flags).toEqual({})
  })
})
