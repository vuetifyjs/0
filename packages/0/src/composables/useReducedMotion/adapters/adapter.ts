// Types
import type { App, ComputedRef, Ref } from 'vue'

export interface ReducedMotionAdapterSetupContext {
  mode: Ref<'system' | 'always' | 'never'>
  reduced: Readonly<ComputedRef<boolean>>
  current: Readonly<ComputedRef<'no-preference' | 'reduce'>>
  /** @internal — written by the adapter to feed the system media query result */
  _systemReduced: Ref<boolean>
}

export abstract class ReducedMotionAdapter {
  abstract setup<T extends ReducedMotionAdapterSetupContext>(
    app: App,
    context: T,
  ): void
}
