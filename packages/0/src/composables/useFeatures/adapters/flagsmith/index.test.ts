import { describe, expect, it, vi } from 'vitest'

// Types
import type { IFlagsmith } from 'flagsmith'

import { FlagsmithFeatureAdapter } from '.'
const mockFlagsmith = {
  init: vi.fn(),
  getAllFlags: vi.fn(),
  stopListening: vi.fn(),
}

describe('flagsmithFeatureAdapter', () => {
  it('should initialize flagsmith with options', () => {
    const options: any = { environmentID: 'test-env' }
    const adapter = new FlagsmithFeatureAdapter(mockFlagsmith as unknown as IFlagsmith, options)

    adapter.setup(vi.fn())

    expect(mockFlagsmith.init).toHaveBeenCalledWith(expect.objectContaining(options))
  })

  it('should call stopListening on dispose', () => {
    const adapter = new FlagsmithFeatureAdapter(mockFlagsmith as unknown as IFlagsmith, { environmentID: 'test-env' })
    adapter.setup(vi.fn())
    adapter.dispose()
    expect(mockFlagsmith.stopListening).toHaveBeenCalled()
  })

  it('should handle dispose before setup', () => {
    const adapter = new FlagsmithFeatureAdapter(mockFlagsmith as unknown as IFlagsmith, { environmentID: 'test-env' })
    expect(() => adapter.dispose()).not.toThrow()
  })

  it('should call onUpdate when flags change', () => {
    let onChangeCallback: Function | undefined

    mockFlagsmith.init.mockImplementation((options: any) => {
      onChangeCallback = options.onChange
      return Promise.resolve()
    })

    mockFlagsmith.getAllFlags.mockReturnValue({
      'feature-a': { enabled: true, value: 'value-a' } as any,
      'feature-b': { enabled: false, value: null } as any,
    })

    const adapter = new FlagsmithFeatureAdapter(mockFlagsmith as unknown as IFlagsmith, { environmentID: 'test-env' })
    const onUpdate = vi.fn()

    adapter.setup(onUpdate)

    // Simulate flagsmith change
    onChangeCallback?.({}, { isFromServer: true }, { error: null, isFetching: false, isLoading: false, source: 'server' })

    expect(onUpdate).toHaveBeenCalledWith({
      'feature-a': { $value: true, $variation: 'value-a' },
      'feature-b': false,
    })
  })

  it('should return initial flags if available', () => {
    mockFlagsmith.getAllFlags.mockReturnValue({
      'feature-c': { enabled: true, value: 'value-c' } as any,
    })

    const adapter = new FlagsmithFeatureAdapter(mockFlagsmith as unknown as IFlagsmith, { environmentID: 'test-env' })
    const initialFlags = adapter.setup(vi.fn())

    expect(initialFlags).toEqual({
      'feature-c': { $value: true, $variation: 'value-c' },
    })
  })
})
