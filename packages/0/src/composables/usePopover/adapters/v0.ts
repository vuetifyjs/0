// Adapters
import { PopoverAdapter } from './adapter'

// Utilities
import { toRef } from 'vue'

// Types
import type { PopoverAdapterContext } from './adapter'
import type { Ref } from 'vue'

/**
 * Default positioning adapter. Emits CSS anchor positioning
 * (`position-area` / `position-try-fallbacks`) - no JS measurement, no
 * runtime dependency, works with the native popover API's own layout.
 */
export class V0PopoverAdapter extends PopoverAdapter {
  setup (context: PopoverAdapterContext): Readonly<Ref<Record<string, string>>> {
    return toRef(() => ({
      'position': 'fixed',
      'margin': 'unset',
      'inset-area': context.placement.value.raw,
      'position-area': context.placement.value.raw,
      'position-anchor': context.anchorName,
      'position-try-fallbacks': context.positionTry.value,
    }))
  }
}
