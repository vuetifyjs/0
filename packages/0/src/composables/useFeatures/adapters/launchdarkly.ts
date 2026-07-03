/**
 * @module LaunchDarklyFeaturesAdapter
 *
 * @remarks
 * LaunchDarkly adapter for feature flags.
 */

// Adapters
import { FeaturesAdapter } from './adapter'

// Utilities
import { isBoolean, UNSAFE_KEYS } from '#v0/utilities'

// Types
import type { FeaturesAdapterFlags } from './adapter'
import type { LDClient } from 'launchdarkly-js-client-sdk'

export class LaunchDarklyFeaturesAdapter extends FeaturesAdapter {
  constructor (private client: LDClient) {
    super()
  }

  setup (onUpdate: (flags: FeaturesAdapterFlags) => void): FeaturesAdapterFlags {
    const collect = (): FeaturesAdapterFlags => {
      const allFlags = this.client.allFlags()
      const flags: FeaturesAdapterFlags = {}

      for (const [key, value] of Object.entries(allFlags)) {
        if (UNSAFE_KEYS.has(key)) continue

        flags[key] = isBoolean(value)
          ? value
          : { $value: true, $variation: value }
      }

      return flags
    }

    function onChange () {
      onUpdate(collect())
    }

    this.client.on('change', onChange)
    this.disposeFn = () => this.client.off('change', onChange)

    return collect()
  }

  dispose () {
    this.disposeFn()
  }

  private disposeFn: () => void = () => {}
}
