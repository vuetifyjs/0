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
  it('should sync flags from LaunchDarkly', () => {
    const mockClient = createMockClient()
    mockClient.allFlags.mockReturnValue({
      'flag-bool': true,
      'flag-json': { color: 'blue' },
      'flag-string': 'variation-a',
    })
    mockClient.on.mockImplementation((event, cb) => {
      if (event === 'change') cb()
    })

    const adapter = new LaunchDarklyFeatureAdapter(mockClient as any)
    const onUpdate = vi.fn()

    const flags = adapter.setup(onUpdate)

    const expected = {
      'flag-bool': true,
      'flag-json': { $value: true, $variation: { color: 'blue' } },
      'flag-string': { $value: true, $variation: 'variation-a' },
    }

    expect(onUpdate).toHaveBeenCalledWith(expected)
    expect(flags).toEqual(expected)

    adapter.dispose()
    expect(mockClient.off).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('should handle dispose before setup', () => {
    const mockClient = createMockClient()
    const adapter = new LaunchDarklyFeatureAdapter(mockClient as any)
    expect(() => adapter.dispose()).not.toThrow()
  })
})
