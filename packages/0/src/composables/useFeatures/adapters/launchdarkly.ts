// Adapters
import { FeaturesAdapter } from './adapter'

// Utilities
import { isBoolean } from '#v0/utilities'

// Types
import type { FeaturesAdapterFlags } from './adapter'

/**
 * LaunchDarkly client interface for feature flags.
 *
 * @see https://launchdarkly.com/docs/sdk/client-side/javascript
 */
export interface LaunchDarklyClient {
  /**
   * Get the value of a feature flag.
   *
   * @param key The flag key.
   * @param defaultValue The default value if the flag is not found.
   */
  variation: (key: string, defaultValue: unknown) => unknown
  /**
   * Get all feature flags.
   *
   * @remarks Returns a record of all flag keys to their values.
   */
  allFlags: () => Record<string, unknown>
  /**
   * Register an event listener.
   *
   * @param event Event name ('ready', 'change', 'change:flag-key').
   * @param callback Event handler.
   */
  on: (event: string, callback: (...args: unknown[]) => void) => void
  /**
   * Deregister an event listener.
   *
   * @param event Event name.
   * @param callback Event handler to remove.
   */
  off: (event: string, callback?: (...args: unknown[]) => void) => void
  /**
   * Wait for the client to initialize.
   *
   * @param timeout Timeout in seconds.
   */
  waitForInitialization?: (timeout?: number) => Promise<void>
}

export interface LaunchDarklyFeaturesAdapterOptions {
  /**
   * LaunchDarkly client instance.
   */
  client: LaunchDarklyClient
  /**
   * Flag keys to track with their default values.
   *
   * @remarks If not provided, all flags from allFlags() will be tracked.
   */
  flags?: Record<string, unknown>
  /**
   * Initialization timeout in seconds.
   *
   * @default 5
   */
  timeout?: number
}

/**
 * LaunchDarkly features adapter implementation.
 *
 * This adapter integrates LaunchDarkly feature flags with useFeatures,
 * supporting boolean, string, number, and JSON flag values.
 *
 * @see https://launchdarkly.com/docs/sdk/client-side/javascript
 *
 * @example
 * ```ts
 * import * as LDClient from 'launchdarkly-js-client-sdk'
 * import { createFeaturesPlugin, LaunchDarklyFeaturesAdapter } from '@vuetify/v0'
 *
 * const ldClient = LDClient.initialize('client-side-id', { kind: 'user', key: 'user-123' })
 *
 * const adapter = new LaunchDarklyFeaturesAdapter({
 *   client: ldClient,
 *   flags: {
 *     'new-ui': false,
 *     'theme-variant': 'default',
 *   },
 * })
 *
 * app.use(createFeaturesPlugin({ adapter }))
 * ```
 */
export class LaunchDarklyFeaturesAdapter extends FeaturesAdapter {
  private client: LaunchDarklyClient
  private flags: Record<string, unknown>
  private timeout: number
  private changeHandler: (() => void) | null = null

  constructor (options: LaunchDarklyFeaturesAdapterOptions) {
    super()
    this.client = options.client
    this.flags = options.flags ?? {}
    this.timeout = options.timeout ?? 5
  }

  async init (): Promise<void> {
    if (this.client.waitForInitialization) {
      await this.client.waitForInitialization(this.timeout)
    }
  }

  getFlags (): FeaturesAdapterFlags {
    const flags: FeaturesAdapterFlags = {}

    // If specific flags were provided, use those with defaults
    if (Object.keys(this.flags).length > 0) {
      for (const [key, defaultValue] of Object.entries(this.flags)) {
        const value = this.client.variation(key, defaultValue)
        flags[key] = this.normalizeValue(value)
      }
    } else {
      // Otherwise, get all flags
      const allFlags = this.client.allFlags()

      for (const [key, value] of Object.entries(allFlags)) {
        flags[key] = this.normalizeValue(value)
      }
    }

    return flags
  }

  onChange (callback: (flags: FeaturesAdapterFlags) => void): () => void {
    const handler = () => {
      callback(this.getFlags())
    }

    this.changeHandler = handler
    this.client.on('change', handler)

    return () => {
      if (this.changeHandler) {
        this.client.off('change', this.changeHandler)
        this.changeHandler = null
      }
    }
  }

  dispose (): void {
    if (this.changeHandler) {
      this.client.off('change', this.changeHandler)
      this.changeHandler = null
    }
  }

  private normalizeValue (value: unknown): boolean | { $value?: boolean; $variation?: unknown } {
    if (isBoolean(value)) {
      return value
    }

    // Non-boolean values are treated as variations
    return { $value: true, $variation: value }
  }
}
