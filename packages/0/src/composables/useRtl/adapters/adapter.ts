// Types
import type { App, Ref } from 'vue'

export interface RtlAdapterSetupContext {
  isRtl: Ref<boolean>
  toggle: () => void
}

export interface RtlAdapter {
  setup: <T extends RtlAdapterSetupContext>(
    app: App,
    context: T,
    target?: string | HTMLElement | null,
  ) => void
}
