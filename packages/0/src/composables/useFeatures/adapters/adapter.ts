// Types
import type { ID } from '#v0/types'

export type FeaturesAdapterValue = boolean | { $value?: boolean; $variation?: unknown }

export type FeaturesAdapterFlags = Record<ID, FeaturesAdapterValue>

export interface FeaturesAdapterInterface {
  /**
   * Initialize the adapter and return initial flags.
   *
   * @param onUpdate Callback invoked when flags change.
   * @returns Initial feature flags.
   *
   * @remarks Called during plugin setup. Sets up change listeners
   * and returns the initial flag values.
   */
  setup: (onUpdate: (flags: FeaturesAdapterFlags) => void) => FeaturesAdapterFlags
  /**
   * Cleanup adapter resources.
   *
   * @remarks Called when the plugin is disposed.
   */
  dispose?: () => void
}

export abstract class FeaturesAdapter implements FeaturesAdapterInterface {
  abstract setup (onUpdate: (flags: FeaturesAdapterFlags) => void): FeaturesAdapterFlags
}
