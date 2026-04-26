// Framework
import { IN_BROWSER } from '@vuetify/v0'

// Utilities
import { onScopeDispose, shallowRef } from 'vue'

// Types
import type { ShallowRef } from 'vue'

export interface UseClipboardReturn {
  copied: ShallowRef<boolean>
  copy: (text: string) => Promise<boolean>
  reset: () => void
}

export function useClipboard (timeout = 2000): UseClipboardReturn {
  const copied = shallowRef(false)
  let timer: ReturnType<typeof setTimeout> | undefined

  function reset () {
    copied.value = false
    if (timer) clearTimeout(timer)
  }

  async function copy (text: string) {
    if (!IN_BROWSER) return false

    reset()
    try {
      await navigator.clipboard.writeText(text)
      copied.value = true
      timer = setTimeout(reset, timeout)
      return true
    } catch {
      return false
    }
  }

  onScopeDispose(() => {
    if (timer) clearTimeout(timer)
  }, true)

  return { copied, copy, reset }
}
