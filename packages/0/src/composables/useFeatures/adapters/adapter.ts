/**
 * @module FeaturesAdapter
 *
 * @remarks
 * Abstract base class for feature flag adapters.
 */

// Types
import type { ID } from '#v0/types'

export type FeaturesAdapterValue = boolean | { $value?: boolean, $variation?: unknown }

export type FeaturesAdapterFlags = Record<ID, FeaturesAdapterValue>

export abstract class FeaturesAdapter {
  /**
   * Initialize the adapter and return initial flags.
   *
   * @param onUpdate Callback invoked when flags change.
   * @returns Initial feature flags.
   *
   * @remarks Called during plugin setup. Sets up change listeners
   * and returns the initial flag values.
   */
  abstract setup (onUpdate: (flags: FeaturesAdapterFlags) => void): FeaturesAdapterFlags

  /**
   * Cleanup adapter resources.
   *
   * @remarks Called when the plugin is disposed.
   */
  dispose? (): void
}
