// Framework
import { IN_BROWSER } from '@vuetify/v0'

// Utilities
import { toValue, watchEffect } from 'vue'

// Types
import type { MaybeRefOrGetter } from 'vue'

let lockCount = 0

export function useScrollLock (condition: MaybeRefOrGetter<boolean>): void {
  if (!IN_BROWSER) return

  watchEffect(onCleanup => {
    if (toValue(condition)) {
      if (lockCount++ === 0) {
        document.body.style.overflow = 'hidden'
      }
      onCleanup(() => {
        if (--lockCount === 0) {
          document.body.style.overflow = ''
        }
      })
    }
  })
}
