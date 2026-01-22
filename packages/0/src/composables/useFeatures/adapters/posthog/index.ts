// Types
import type { FeaturesAdapterFlags, FeaturesAdapterInterface } from '../generic'
import type { PostHog } from 'posthog-js'

export class PostHogFeatureAdapter implements FeaturesAdapterInterface {
  constructor (private client: PostHog) {}

  setup (onUpdate: (flags: FeaturesAdapterFlags) => void): FeaturesAdapterFlags {
    const updateFlags = () => {
      const flags: FeaturesAdapterFlags = {}
      const activeFlags = this.client.featureFlags.getFlags()

      if (activeFlags) {
        for (const key of activeFlags) {
          const isEnabled = this.client.isFeatureEnabled(key) ?? false
          const payload = this.client.getFeatureFlagPayload(key)

          if (payload !== undefined && payload !== null) {
            flags[key] = { $value: isEnabled, $variation: payload }
          } else {
            const variant = this.client.getFeatureFlag(key)
            flags[key] = variant !== true && variant !== false && variant !== undefined && variant !== null ? { $value: true, $variation: variant } : isEnabled
          }
        }
        onUpdate(flags)
        return flags
      }
      return {}
    }

    this.client.onFeatureFlags(updateFlags)

    return updateFlags()
  }
}
