import flagsmith from 'flagsmith'
import { describe, expect, it, vi } from 'vitest'

import { FlagsmithFeatureAdapter } from './flagsmith'

import { createFeatures } from '../index'

vi.mock('flagsmith', () => ({
  default: {
    init: vi.fn(),
    getAllFlags: vi.fn(),
  },
}))

describe('flagsmithFeatureAdapter', () => {
  it('should initialize flagsmith with options', () => {
    const options = { environmentID: 'test-env' }
    const adapter = new FlagsmithFeatureAdapter(options)
    createFeatures({ adapter })

    expect(flagsmith.init).toHaveBeenCalledWith(expect.objectContaining(options))
  })

  it('should update context when flags change', () => {
    let onChangeCallback: Function | undefined

    vi.mocked(flagsmith.init).mockImplementation((options: any) => {
      onChangeCallback = options.onChange
      return Promise.resolve()
    })

    vi.mocked(flagsmith.getAllFlags).mockReturnValue({
      'feature-a': { enabled: true, value: 'value-a' } as any,
      'feature-b': { enabled: false, value: null } as any,
    })

    const adapter = new FlagsmithFeatureAdapter({ environmentID: 'test-env' })
    const context = createFeatures({ adapter })

    // Simulate flagsmith change
    onChangeCallback?.({}, { isFromServer: true }, { error: null, isFetching: false, isLoading: false, source: 'server' })

    expect(context.has('feature-a')).toBe(true)
    expect(context.selectedIds.has('feature-a')).toBe(true)
    expect(context.variation('feature-a')).toBe('value-a')

    expect(context.has('feature-b')).toBe(true)
    expect(context.selectedIds.has('feature-b')).toBe(false)
  })
})
