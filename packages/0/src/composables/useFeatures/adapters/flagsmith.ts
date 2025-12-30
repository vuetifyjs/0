import flagsmith from 'flagsmith'

// Types
import type { FeaturesAdapterFlags, FeaturesAdapterInterface } from './adapter'
import type { IFlagsmith, IInitConfig } from 'flagsmith'

export class FlagsmithFeatureAdapter implements FeaturesAdapterInterface {
  private flagsmith: IFlagsmith
  private options: IInitConfig

  constructor (flagsmithInstance: IFlagsmith = flagsmith, options: IInitConfig) {
    this.flagsmith = flagsmithInstance
    this.options = options
  }

  setup (onUpdate: (flags: FeaturesAdapterFlags) => void): FeaturesAdapterFlags {
    this.flagsmith.init({
      ...this.options,
      onChange: (oldFlags: any, params: any, loadingState: any) => {
        const flags = this.flagsmith.getAllFlags()
        const adapterFlags: FeaturesAdapterFlags = {}

        for (const [key, flag] of Object.entries(flags) as any) {
          const isEnabled = flag.enabled
          const variation = flag.value

          adapterFlags[key] = (variation !== null && variation !== undefined)
            ? { $value: isEnabled, $variation: variation }
            : isEnabled
        }

        onUpdate(adapterFlags)

        this.options.onChange?.(oldFlags, params, loadingState)
      },
    })

    this.disposeFn = () => this.flagsmith.stopListening()

    return {}
  }

  dispose () {
    this.disposeFn()
  }

  private disposeFn: () => void = () => {}
}
