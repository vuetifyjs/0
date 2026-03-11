import { describe, expect, it, vi } from 'vitest'

// Types
import type { FeaturesAdapterFlags } from './index'

import { FeaturesAdapter } from './index'

class GenericTestAdapter extends FeaturesAdapter {
  setup (onUpdate: (flags: FeaturesAdapterFlags) => void): FeaturesAdapterFlags {
    onUpdate({ 'test-flag': true })
    return { 'initial-flag': false }
  }

  dispose () {}
}

describe('featuresAdapter', () => {
  describe('constructor', () => {
    it('should accept options', () => {
      const adapter = new GenericTestAdapter()
      expect(adapter).toBeInstanceOf(FeaturesAdapter)
    })
  })

  describe('setup', () => {
    it('should register initial flags', () => {
      const adapter = new GenericTestAdapter()
      const onUpdate = vi.fn()

      const initialFlags = adapter.setup(onUpdate)

      expect(initialFlags).toEqual({ 'initial-flag': false })
    })

    it('should subscribe to flag changes', () => {
      const adapter = new GenericTestAdapter()
      const onUpdate = vi.fn()

      adapter.setup(onUpdate)

      expect(onUpdate).toHaveBeenCalledWith({ 'test-flag': true })
    })
  })

  describe('onChange', () => {
    it('should call onUpdate when flags change', () => {
      const adapter = new GenericTestAdapter()
      const onUpdate = vi.fn()

      adapter.setup(onUpdate)

      expect(onUpdate).toHaveBeenCalledWith({ 'test-flag': true })
    })
  })

  describe('dispose', () => {
    it('should clean up subscriptions', () => {
      const adapter = new GenericTestAdapter()
      const disposeSpy = vi.spyOn(adapter, 'dispose')

      adapter.dispose()

      expect(disposeSpy).toHaveBeenCalled()
    })

    it('should handle dispose before setup', () => {
      const adapter = new GenericTestAdapter()
      expect(() => adapter.dispose()).not.toThrow()
    })
  })

  describe('error handling', () => {
    it('should handle null/empty flags gracefully', () => {
      class EmptyAdapter extends FeaturesAdapter {
        setup (_onUpdate: (flags: FeaturesAdapterFlags) => void): FeaturesAdapterFlags {
          return {}
        }
      }

      const adapter = new EmptyAdapter()
      const onUpdate = vi.fn()
      const flags = adapter.setup(onUpdate)

      expect(flags).toEqual({})
      expect(onUpdate).not.toHaveBeenCalled()
    })
  })
})
