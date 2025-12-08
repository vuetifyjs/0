// Types
import type { ID } from '#v0/types'

export type FeaturesAdapterValue = boolean | { $value?: boolean; $variation?: unknown }

export type FeaturesAdapterFlags = Record<ID, FeaturesAdapterValue>

export interface FeaturesAdapterInterface {
  /**
   * Initialize the adapter connection.
   *
   * @remarks Called during plugin setup. Can be async for remote services.
   */
  init?: () => Promise<void> | void
  /**
   * Get all feature flags.
   *
   * @remarks Returns the current flag values from the adapter source.
   */
  getFlags: () => FeaturesAdapterFlags
  /**
   * Subscribe to flag changes.
   *
   * @param callback Called when flags change with the updated flags.
   * @returns Unsubscribe function to stop listening for changes.
   */
  onChange?: (callback: (flags: FeaturesAdapterFlags) => void) => () => void
  /**
   * Cleanup adapter resources.
   *
   * @remarks Called when the plugin is disposed.
   */
  dispose?: () => void
}

export abstract class FeaturesAdapter implements FeaturesAdapterInterface {
  abstract getFlags (): FeaturesAdapterFlags
}
