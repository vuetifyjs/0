// Utilities
import { toValue, watchEffect } from 'vue'

// Types
import type { MaybeRefOrGetter } from 'vue'

const IN_BROWSER = typeof window !== 'undefined'

export function useScrollLock (condition: MaybeRefOrGetter<boolean>) {
  if (!IN_BROWSER) return

  watchEffect(onCleanup => {
    if (toValue(condition)) {
      document.body.style.overflow = 'hidden'
      onCleanup(() => {
        document.body.style.overflow = ''
      })
    }
  })
}
