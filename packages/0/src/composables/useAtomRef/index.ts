// Utilities
import { computed, useTemplateRef, unref } from 'vue'

// Types
import type { ShallowRef } from 'vue'
import type { AtomExpose } from '#v0'

export function useAtomRef (key: string): ShallowRef<HTMLElement | null> {
  const ref = useTemplateRef<HTMLElement | AtomExpose>(key)

  return computed(() => {
    if (!ref || !('element' in ref)) {
      return null
    }
    return unref(ref.element)
  }) as ShallowRef<HTMLElement | null>
}
