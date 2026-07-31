// Types
import type { ReducedMotionMode } from '..'
import type { App, Ref, ShallowRef } from 'vue'

export interface ReducedMotionAdapterSetupContext {
  selectedMode: Readonly<ShallowRef<ReducedMotionMode>>
  isReduced: Readonly<Ref<boolean>>
}

export abstract class ReducedMotionAdapter {
  /**
   * Teardown for any side-effects started in `setup`. The plugin registers this on
   * `app.onUnmount`, so adapter effects are cleaned up even though `setup` runs
   * outside an effect scope (where `onScopeDispose` would silently no-op). It is
   * read lazily at app unmount, so adapters may assign it at any point during or
   * after `setup`.
   */
  dispose?: () => void

  abstract setup<T extends ReducedMotionAdapterSetupContext> (app: App, context: T): void
}
