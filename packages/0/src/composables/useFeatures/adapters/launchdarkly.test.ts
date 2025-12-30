import { describe, expect, it, vi } from 'vitest'

import { LaunchDarklyFeatureAdapter } from './launchdarkly'

describe('launchDarklyFeatureAdapter', () => {
  it('should sync flags from LaunchDarkly', () => {
    const mockLDClient = {
      allFlags: vi.fn().mockReturnValue({
        'flag-bool': true,
        'flag-json': { color: 'blue' },
        'flag-string': 'variation-a',
      }),
      on: vi.fn((event, cb) => {
        if (event === 'change') cb()
      }),
    }

    const adapter = new LaunchDarklyFeatureAdapter(mockLDClient as any)
    const onUpdate = vi.fn()

    adapter.setup(onUpdate)

    expect(onUpdate).toHaveBeenCalledWith({
      'flag-bool': true,
      'flag-json': { $value: true, $variation: { color: 'blue' } },
      'flag-string': { $value: true, $variation: 'variation-a' },
    })
  })
})
