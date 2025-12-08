// Adapters
import { FeaturesAdapter } from './adapter'

// Utilities
import { isBoolean, isString } from '#v0/utilities'

// Types
import type { FeaturesAdapterFlags } from './adapter'

/**
 * PostHog client interface for feature flags.
 *
 * @see https://posthog.com/docs/feature-flags/adding-feature-flag-code
 */
export interface PostHogClient {
  /**
   * Check if a feature flag is enabled.
   */
  isFeatureEnabled: (key: string) => boolean | undefined
  /**
   * Get the value of a feature flag.
   *
   * @remarks Returns boolean for simple flags, string for multivariate flags.
   */
  getFeatureFlag: (key: string) => boolean | string | undefined
  /**
   * Register a callback for when feature flags are loaded or change.
   *
   * @param callback Called with flag names and variants when flags change.
   */
  onFeatureFlags: (
    callback: (
      flags: string[],
      variants: Record<string, string | boolean>,
      options?: { errorsLoading?: boolean }
    ) => void
  ) => void
  /**
   * Force reload feature flags from the server.
   */
  reloadFeatureFlags?: () => void
}

export interface PostHogFeaturesAdapterOptions {
  /**
   * PostHog client instance.
   */
  client: PostHogClient
  /**
   * Flag keys to track.
   *
   * @remarks If not provided, all flags from onFeatureFlags will be tracked.
   */
  flags?: string[]
}

/**
 * PostHog features adapter implementation.
 *
 * This adapter integrates PostHog feature flags with useFeatures,
 * supporting both boolean and multivariate (string) flag values.
 *
 * @see https://posthog.com/docs/feature-flags
 *
 * @example
 * ```ts
 * import posthog from 'posthog-js'
 * import { createFeaturesPlugin, PostHogFeaturesAdapter } from '@vuetify/v0'
 *
 * const adapter = new PostHogFeaturesAdapter({
 *   client: posthog,
 *   flags: ['new-ui', 'theme-variant'],
 * })
 *
 * app.use(createFeaturesPlugin({ adapter }))
 * ```
 */
export class PostHogFeaturesAdapter extends FeaturesAdapter {
  private client: PostHogClient
  private flags: string[]

  constructor (options: PostHogFeaturesAdapterOptions) {
    super()
    this.client = options.client
    this.flags = options.flags ?? []
  }

  getFlags (): FeaturesAdapterFlags {
    const flags: FeaturesAdapterFlags = {}

    for (const key of this.flags) {
      const value = this.client.getFeatureFlag(key)

      if (isBoolean(value)) {
        flags[key] = value
      } else if (isString(value)) {
        // Multivariate flag - map string value to $variation
        flags[key] = { $value: true, $variation: value }
      }
    }

    return flags
  }

  onChange (callback: (flags: FeaturesAdapterFlags) => void): () => void {
    this.client.onFeatureFlags((flagNames, variants) => {
      const flags: FeaturesAdapterFlags = {}

      // If specific flags were provided, only track those
      const keysToTrack = this.flags.length > 0 ? this.flags : flagNames

      for (const key of keysToTrack) {
        const value = variants[key]

        if (isBoolean(value)) {
          flags[key] = value
        } else if (isString(value)) {
          flags[key] = { $value: true, $variation: value }
        }
      }

      callback(flags)
    })

    // PostHog doesn't provide an unsubscribe mechanism
    return () => {}
  }
}
