/**
 * @module LaunchDarklyFeatureAdapter
 *
 * @remarks
 * LaunchDarkly adapter for feature flags.
 */

// Types
import type { FeaturesAdapterFlags, FeaturesAdapterInterface } from '../generic'
import type { LDClient } from 'launchdarkly-js-client-sdk'

export class LaunchDarklyFeatureAdapter implements FeaturesAdapterInterface {
  constructor (private client: LDClient) {}

  setup (onUpdate: (flags: FeaturesAdapterFlags) => void): FeaturesAdapterFlags {
    const collect = (): FeaturesAdapterFlags => {
      const allFlags = this.client.allFlags()
      const flags: FeaturesAdapterFlags = {}

      for (const [key, value] of Object.entries(allFlags)) {
        flags[key] = typeof value === 'boolean'
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
