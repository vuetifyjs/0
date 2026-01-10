// Framework
import { IN_BROWSER } from '@vuetify/v0'

// Utilities
import { toValue, watchEffect } from 'vue'

// Types
import type { MaybeRefOrGetter } from 'vue'

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
