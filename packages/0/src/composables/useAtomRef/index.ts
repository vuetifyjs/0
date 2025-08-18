// Utilities
import { watchEffect, useTemplateRef, shallowRef, unref } from 'vue'

// Types
import type { Ref } from 'vue'
import type { AtomExpose } from '#v0'

export function useAtomRef (key: string): Ref<HTMLElement | null> {
  const ref = useTemplateRef<HTMLElement | AtomExpose>(key)
  const resolvedRef = shallowRef<HTMLElement | null>(null)

  watchEffect(() => {
    const raw = unref(ref)

    if (!raw) {
      resolvedRef.value = null
      return
    }

    resolvedRef.value = 'element' in raw ? unref(raw.element) ?? null : raw as HTMLElement
  })

  return resolvedRef
}
