// Types
import type { FeaturesAdapterFlags, FeaturesAdapterInterface } from '../generic'
import type { LDClient } from 'launchdarkly-js-client-sdk'

export class LaunchDarklyFeatureAdapter implements FeaturesAdapterInterface {
  constructor (private client: LDClient) {}

  setup (onUpdate: (flags: FeaturesAdapterFlags) => void): FeaturesAdapterFlags {
    const updateFlags = () => {
      const allFlags = this.client.allFlags()
      const flags: FeaturesAdapterFlags = {}

      for (const [key, value] of Object.entries(allFlags)) {
        flags[key] = typeof value === 'boolean'
          ? value
          : { $value: true, $variation: value }
      }

      onUpdate(flags)
      return flags
    }

    this.client.on('change', updateFlags)
    this.disposeFn = () => this.client.off('change', updateFlags)

    return updateFlags()
  }

  dispose () {
    this.disposeFn()
  }

  private disposeFn: () => void = () => {}
}
