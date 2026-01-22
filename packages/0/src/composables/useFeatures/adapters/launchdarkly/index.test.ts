import { describe, expect, it, vi } from 'vitest'

import { LaunchDarklyFeatureAdapter } from '.'

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
      off: vi.fn(),
    }

    const adapter = new LaunchDarklyFeatureAdapter(mockLDClient as any)
    const onUpdate = vi.fn()

    adapter.setup(onUpdate)

    expect(onUpdate).toHaveBeenCalledWith({
      'flag-bool': true,
      'flag-json': { $value: true, $variation: { color: 'blue' } },
      'flag-string': { $value: true, $variation: 'variation-a' },
    })

    adapter.dispose()
    expect(mockLDClient.off).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('should handle dispose before setup', () => {
    const mockLDClient = {
      allFlags: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
    }
    const adapter = new LaunchDarklyFeatureAdapter(mockLDClient as any)
    expect(() => adapter.dispose()).not.toThrow()
  })
})
