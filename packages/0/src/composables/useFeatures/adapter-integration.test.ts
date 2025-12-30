import { describe, expect, it } from 'vitest'

// Utilities
import { createApp } from 'vue'

// Types
import type { FeaturesAdapterFlags, FeaturesAdapterInterface } from './adapters'

import { createFeaturesPlugin, useFeatures } from './index'

describe('createFeaturesPlugin with adapter', () => {
  it('should sync initial flags from adapter', () => {
    const mockAdapter: FeaturesAdapterInterface = {
      setup: () => {
        return {
          'feature-a': true,
          'feature-b': { $value: true, $variation: 'test' },
        }
      },
    }

    const app = createApp({})
    app.use(createFeaturesPlugin({ adapter: mockAdapter }))

    const context = app.runWithContext(() => useFeatures())

    expect(context.get('feature-a')?.value).toBe(true)
    expect(context.selectedIds.has('feature-a')).toBe(true)

    expect(context.get('feature-b')?.value).toEqual({ $value: true, $variation: 'test' })
    expect(context.variation('feature-b')).toBe('test')
  })

  it('should sync updated flags from adapter', () => {
    let updateCallback: ((flags: FeaturesAdapterFlags) => void) | undefined

    const mockAdapter: FeaturesAdapterInterface = {
      setup: onUpdate => {
        updateCallback = onUpdate
        return {}
      },
    }

    const app = createApp({})
    app.use(createFeaturesPlugin({ adapter: mockAdapter }))

    const context = app.runWithContext(() => useFeatures())

    // Initial state
    expect(context.has('feature-new')).toBe(false)

    // Update
    updateCallback?.({
      'feature-new': true,
    })

    expect(context.has('feature-new')).toBe(true)
    expect(context.selectedIds.has('feature-new')).toBe(true)
  })
})
