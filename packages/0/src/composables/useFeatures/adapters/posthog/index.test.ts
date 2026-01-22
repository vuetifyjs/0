import { describe, expect, it, vi } from 'vitest'

import { PostHogFeatureAdapter } from '.'

describe('postHogFeatureAdapter', () => {
  it('should sync flags from PostHog', () => {
    const mockPostHog = {
      featureFlags: {
        getFlags: vi.fn().mockReturnValue(['flag-1', 'flag-2']),
      },
      isFeatureEnabled: vi.fn(key => key === 'flag-1'),
      getFeatureFlagPayload: vi.fn(key => key === 'flag-2' ? 'payload-2' : undefined),
      getFeatureFlag: vi.fn(),
      onFeatureFlags: vi.fn(cb => cb()),
    }

    const adapter = new PostHogFeatureAdapter(mockPostHog as any)
    const onUpdate = vi.fn()

    adapter.setup(onUpdate)

    expect(onUpdate).toHaveBeenCalledWith({
      'flag-1': true,
      'flag-2': { $value: false, $variation: 'payload-2' },
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
})
