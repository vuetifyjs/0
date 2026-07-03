// Types
import type { App, Ref } from 'vue'

export interface RtlAdapterSetupContext {
  isRtl: Ref<boolean>
  toggle: () => void
}

export abstract class RtlAdapter {
  /**
   * Teardown registered by `setup`. Called once via `app.onUnmount` on the
   * plugin path and available as a reachable handle on standalone paths.
   */
  dispose?: () => void

  abstract setup<T extends RtlAdapterSetupContext>(
    app: App,
    context: T,
    target?: string | HTMLElement | null,
  ): void
}
