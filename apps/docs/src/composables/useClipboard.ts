// Framework
import { IN_BROWSER, useLogger } from '@vuetify/v0'

// Utilities
import { shallowRef, type ShallowRef } from 'vue'

export interface UseClipboardReturn {
  copied: ShallowRef<boolean>
  copy: (text: string) => Promise<boolean>
  reset: () => void
}

export function useClipboard (timeout = 2000): UseClipboardReturn {
  const logger = useLogger()
  const copied = shallowRef(false)
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  function reset () {
    copied.value = false
    if (timeoutId) clearTimeout(timeoutId)
  }

  async function copy (text: string) {
    if (!IN_BROWSER) return false

    reset()
    try {
      await navigator.clipboard.writeText(text)
      copied.value = true
      timeoutId = setTimeout(reset, timeout)
      return true
    } catch (error) {
      logger.error('Failed to copy', error)
      return false
    }
  }

  return { copied, copy, reset }
}
