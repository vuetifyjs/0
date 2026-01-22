/**
 * @module FlagsmithFeatureAdapter
 *
 * @remarks
 * Flagsmith adapter for feature flags.
 */

import flagsmith from 'flagsmith'

// Types
import type { FeaturesAdapterFlags, FeaturesAdapterInterface } from '../generic'
import type { IFlagsmith, IInitConfig, IFlags, LoadingState, IRetrieveInfo } from 'flagsmith'

export class FlagsmithFeatureAdapter implements FeaturesAdapterInterface {
  private client: IFlagsmith
  private options: IInitConfig

  constructor (client: IFlagsmith = flagsmith, options: IInitConfig) {
    this.client = client
    this.options = options
  }

  setup (onUpdate: (flags: FeaturesAdapterFlags) => void): FeaturesAdapterFlags {
    const updateFlags = () => {
      const flags = this.client.getAllFlags()
      const adapterFlags: FeaturesAdapterFlags = {}

      if (flags) {
        for (const [key, flag] of Object.entries(flags)) {
          const isEnabled = flag.enabled
          const variation = flag.value

          adapterFlags[key] = (variation !== null && variation !== undefined)
            ? { $value: isEnabled, $variation: variation }
            : isEnabled
        }
      }

      return adapterFlags
    }

    this.client.init({
      ...this.options,
      onChange: (oldFlags: IFlags | null, params: IRetrieveInfo, loadingState: LoadingState) => {
        onUpdate(updateFlags())

        this.options.onChange?.(oldFlags, params, loadingState)
      },
    })

    this.disposeFn = () => this.client.stopListening()

    return updateFlags()
  }

  dispose () {
    this.disposeFn()
  }

  private disposeFn: () => void = () => {}
}
