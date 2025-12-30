import flagsmith from 'flagsmith'

// Types
import type { FeatureContext } from '../index'
import type { FeatureAdapter } from './adapter'
import type { IInitConfig } from 'flagsmith'

export class FlagsmithFeatureAdapter implements FeatureAdapter {
  constructor (private options: IInitConfig) {}

  init (context: FeatureContext<any>) {
    flagsmith.init({
      ...this.options,
      onChange: (oldFlags, params, loadingState) => {
        const flags = flagsmith.getAllFlags()

        for (const [key, flag] of Object.entries(flags)) {
          const isEnabled = flag.enabled
          const variation = flag.value
          const value: any = (variation !== null && variation !== undefined)
            ? { $value: isEnabled, $variation: variation }
            : isEnabled

          context.upsert(key, { value })

          if (isEnabled) {
            context.select(key)
          } else {
            context.unselect(key)
          }
        }

        this.options.onChange?.(oldFlags, params, loadingState)
      },
    })
  }
}
