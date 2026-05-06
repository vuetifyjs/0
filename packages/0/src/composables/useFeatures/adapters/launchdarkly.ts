/**
 * @module LaunchDarklyFeaturesAdapter
 *
 * @remarks
 * LaunchDarkly adapter for feature flags.
 */

// Utilities
import { isBoolean } from '#v0/utilities'

// Types
import type { FeaturesAdapterFlags } from './adapter'
import type { LDClient } from 'launchdarkly-js-client-sdk'

// Adapters
import { FeaturesAdapter } from './adapter'

export class LaunchDarklyFeaturesAdapter extends FeaturesAdapter {
  constructor (private client: LDClient) {
    super()
  }

  setup (onUpdate: (flags: FeaturesAdapterFlags) => void): FeaturesAdapterFlags {
    const collect = (): FeaturesAdapterFlags => {
      const allFlags = this.client.allFlags()
      const flags: FeaturesAdapterFlags = {}

      for (const [key, value] of Object.entries(allFlags)) {
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
