import { describe, expect, it, vi } from 'vitest'

// Types
import { FlagsmithFeatureAdapter } from '.'

function createMockClient () {
  return {
    init: vi.fn(),
    getAllFlags: vi.fn(),
    stopListening: vi.fn(),
  }
}

describe('flagsmithFeatureAdapter', () => {
  it('should initialize flagsmith with options', () => {
    const mockClient = createMockClient()
    const options: any = { environmentID: 'test-env' }
    const adapter = new FlagsmithFeatureAdapter(mockClient as any, options)

    adapter.setup(vi.fn())

    expect(mockClient.init).toHaveBeenCalledWith(expect.objectContaining(options))
  })

  it('should call stopListening on dispose', () => {
    const mockClient = createMockClient()
    const adapter = new FlagsmithFeatureAdapter(mockClient as any, { environmentID: 'test-env' })
    adapter.setup(vi.fn())
    adapter.dispose()
    expect(mockClient.stopListening).toHaveBeenCalled()
  })

  it('should handle dispose before setup', () => {
    const mockClient = createMockClient()
    const adapter = new FlagsmithFeatureAdapter(mockClient as any, { environmentID: 'test-env' })
    expect(() => adapter.dispose()).not.toThrow()
  })

  it('should call onUpdate when flags change', () => {
    const mockClient = createMockClient()
    let onChangeCallback: Function | undefined

    mockClient.init.mockImplementation((options: any) => {
      onChangeCallback = options.onChange
      return Promise.resolve()
    })

    mockClient.getAllFlags.mockReturnValue({
      'feature-a': { enabled: true, value: 'value-a' } as any,
      'feature-b': { enabled: false, value: null } as any,
    })

    const adapter = new FlagsmithFeatureAdapter(mockClient as any, { environmentID: 'test-env' })
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
    const mockClient = createMockClient()
    mockClient.getAllFlags.mockReturnValue({
      'feature-c': { enabled: true, value: 'value-c' } as any,
    })

    const adapter = new FlagsmithFeatureAdapter(mockClient as any, { environmentID: 'test-env' })
    const flags = adapter.setup(vi.fn())

    expect(flags).toEqual({
      'feature-c': { $value: true, $variation: 'value-c' },
    })
  })
})
