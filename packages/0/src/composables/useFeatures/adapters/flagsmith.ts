/**
 * @module FlagsmithFeaturesAdapter
 *
 * @remarks
 * Flagsmith adapter for feature flags.
 */

// Adapters
import { FeaturesAdapter } from './adapter'

// Utilities
import { isNullOrUndefined, UNSAFE_KEYS } from '#v0/utilities'

// Types
import type { FeaturesAdapterFlags } from './adapter'
import type { IFlagsmith, IInitConfig, IFlags, LoadingState, IRetrieveInfo } from '@flagsmith/flagsmith'

export class FlagsmithFeaturesAdapter extends FeaturesAdapter {
  private client: IFlagsmith
  private options: IInitConfig

  constructor (client: IFlagsmith, options: IInitConfig) {
    super()
    this.client = client
    this.options = options
  }

  setup (onUpdate: (flags: FeaturesAdapterFlags) => void): FeaturesAdapterFlags {
    const updateFlags = () => {
      const flags = this.client.getAllFlags()
      const adapterFlags: FeaturesAdapterFlags = {}

      if (flags) {
        for (const [key, flag] of Object.entries(flags)) {
          if (UNSAFE_KEYS.has(key)) continue

          const isEnabled = flag.enabled
          const variation = flag.value

          adapterFlags[key] = isNullOrUndefined(variation)
            ? isEnabled
            : { $value: isEnabled, $variation: variation }
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
