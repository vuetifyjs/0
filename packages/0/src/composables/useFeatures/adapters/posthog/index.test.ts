import { describe, expect, it, vi } from 'vitest'

import { PostHogFeatureAdapter } from '.'

describe('postHogFeatureAdapter', () => {
  it('should sync flags from PostHog', () => {
    const mockPostHog = {
      featureFlags: {
        getFlags: vi.fn().mockReturnValue(['flag-1', 'flag-2', 'flag-3', 'flag-4']),
      },
      isFeatureEnabled: vi.fn(key => {
        if (key === 'flag-1') return true
        if (key === 'flag-4') return undefined // Test ?? false
        return false
      }),
      getFeatureFlagPayload: vi.fn(key => key === 'flag-2' ? 'payload-2' : undefined),
      getFeatureFlag: vi.fn(key => key === 'flag-3' ? 'variant-3' : undefined),
      onFeatureFlags: vi.fn(cb => cb()),
    }

    const adapter = new PostHogFeatureAdapter(mockPostHog as any)
    const onUpdate = vi.fn()

    adapter.setup(onUpdate)

    expect(onUpdate).toHaveBeenCalledWith({
      'flag-1': true,
      'flag-2': { $value: false, $variation: 'payload-2' },
      'flag-3': { $value: true, $variation: 'variant-3' },
      'flag-4': false,
    })
  })

  it('should dispose listener', () => {
    const unsubscribeMock = vi.fn()
    const mockPostHog = {
      featureFlags: {
        getFlags: vi.fn().mockReturnValue([]),
      },
      isFeatureEnabled: vi.fn(),
      getFeatureFlagPayload: vi.fn(),
      getFeatureFlag: vi.fn(),
      onFeatureFlags: vi.fn().mockReturnValue(unsubscribeMock),
    }

    const adapter = new PostHogFeatureAdapter(mockPostHog as any)
    adapter.setup(vi.fn())
    adapter.dispose()

    expect(unsubscribeMock).toHaveBeenCalled()
  })

  it('should handle dispose before setup', () => {
    const mockPostHog = {
      featureFlags: {
        getFlags: vi.fn().mockReturnValue([]),
      },
      isFeatureEnabled: vi.fn(),
      getFeatureFlagPayload: vi.fn(),
      getFeatureFlag: vi.fn(),
      onFeatureFlags: vi.fn(),
    }

    const adapter = new PostHogFeatureAdapter(mockPostHog as any)
    expect(() => adapter.dispose()).not.toThrow()
  })

  it('should handle null active flags', () => {
    const mockPostHog = {
      featureFlags: {
        getFlags: vi.fn().mockReturnValue(null),
      },
      isFeatureEnabled: vi.fn(),
      getFeatureFlagPayload: vi.fn(),
      getFeatureFlag: vi.fn(),
      onFeatureFlags: vi.fn(),
    }

    const adapter = new PostHogFeatureAdapter(mockPostHog as any)
    const onUpdate = vi.fn()

    const flags = adapter.setup(onUpdate)
    expect(flags).toEqual({})
  })
})
