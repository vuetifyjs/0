import { describe, expect, it, vi } from 'vitest'

// Types
import type { FeaturesAdapterFlags } from './index'

import { FeaturesAdapter } from './index'

class GenericTestAdapter extends FeaturesAdapter {
  setup (onUpdate: (flags: FeaturesAdapterFlags) => void): FeaturesAdapterFlags {
    // Simulate immediate update
    onUpdate({ 'test-flag': true })
    return { 'initial-flag': false }
  }

  dispose () {
    // Cleanup
  }
}

describe('featuresAdapter', () => {
  it('should be extendable', () => {
    const adapter = new GenericTestAdapter()
    expect(adapter).toBeInstanceOf(FeaturesAdapter)
  })

  it('should implement setup method contract', () => {
    const adapter = new GenericTestAdapter()
    const onUpdate = vi.fn()

    const initialFlags = adapter.setup(onUpdate)

    expect(initialFlags).toEqual({ 'initial-flag': false })
    expect(onUpdate).toHaveBeenCalledWith({ 'test-flag': true })
  })

  it('should support dispose method', () => {
    const adapter = new GenericTestAdapter()
    const disposeSpy = vi.spyOn(adapter, 'dispose')

    adapter.dispose()

    expect(disposeSpy).toHaveBeenCalled()
  })
})
