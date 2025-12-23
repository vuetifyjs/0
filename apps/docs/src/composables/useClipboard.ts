// Utilities
import { shallowRef } from 'vue'

export function useClipboard (timeout = 2000) {
  const copied = shallowRef(false)
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  function reset () {
    copied.value = false
    if (timeoutId) clearTimeout(timeoutId)
  }

  async function copy (text: string) {
    reset()
    try {
      await navigator.clipboard.writeText(text)
      copied.value = true
      timeoutId = setTimeout(reset, timeout)
      return true
    } catch (error) {
      console.error('Failed to copy:', error)
      return false
    }
  }

  return { copied, copy, reset }
}
