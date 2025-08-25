// Utilities
import { watchEffect, useTemplateRef, shallowRef, unref } from 'vue'

// Types
import type { ShallowRef } from 'vue'
import type { AtomExpose } from '#v0'

export function useAtomRef (key: string): ShallowRef<HTMLElement | null> {
  const ref = useTemplateRef<HTMLElement | AtomExpose>(key)
  const resolvedRef = shallowRef<HTMLElement | null>(null)

  watchEffect(() => {
    const raw = unref(ref)

    if (!raw || !('element' in raw)) {
      resolvedRef.value = null
      return
    }

    resolvedRef.value = unref(raw.element)
  })

  return resolvedRef
}
