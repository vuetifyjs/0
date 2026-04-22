/**
 * @module PostHogFeatureAdapter
 *
 * @remarks
 * PostHog adapter for feature flags.
 */

// Constants
import { IN_BROWSER } from '#v0/constants/globals'

// Utilities
import { isBoolean, isNullOrUndefined } from '#v0/utilities'

// Types
import type { FeaturesAdapterFlags, FeaturesAdapterInterface } from '../generic'
import type { PostHog } from 'posthog-js'

export class PostHogFeatureAdapter implements FeaturesAdapterInterface {
  constructor (private client: PostHog) {}

  setup (onUpdate: (flags: FeaturesAdapterFlags) => void): FeaturesAdapterFlags {
    if (!IN_BROWSER) return {}

    const collect = (): FeaturesAdapterFlags => {
      const flags: FeaturesAdapterFlags = {}
      const activeFlags = this.client.featureFlags.getFlags()
      if (!activeFlags) return flags

      for (const key of activeFlags) {
        const isEnabled = this.client.isFeatureEnabled(key) ?? false
        const payload = this.client.getFeatureFlagPayload(key)

        if (isNullOrUndefined(payload)) {
          const variant = this.client.getFeatureFlag(key)
          flags[key] = !isBoolean(variant) && !isNullOrUndefined(variant) ? { $value: true, $variation: variant } : isEnabled
        } else {
          flags[key] = { $value: isEnabled, $variation: payload }
        }
      }
      return flags
    }

    // onFeatureFlags may fire the callback synchronously when flags are cached.
    // Use a separate wrapper so only subsequent changes call onUpdate —
    // the initial flags are returned to the caller for a single sync.
    this.disposeFn = this.client.onFeatureFlags(() => onUpdate(collect()))

    return collect()
  }

  dispose () {
    this.disposeFn()
  }

  private disposeFn: () => void = () => {}
}
