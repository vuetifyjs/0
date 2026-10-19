// Framework
import { useEventListener } from '@vuetify/v0'

// Utilities
import { pinCollapsedControl } from '@/utilities/pinCollapsedControl'

// Types
import type { MaybeRefOrGetter } from 'vue'

/**
 * Pin collapse controls inside `root` so hiding an expanded example does not
 * leave the reader at whatever scroll offset the shorter page clamped to.
 */
export function useCollapseAnchor (
  root: MaybeRefOrGetter<HTMLElement | null | undefined>,
): void {
  useEventListener(root, 'click', pinCollapsedControl, { capture: true })
}
