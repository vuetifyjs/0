// Utilities
import { ref, effectScope } from 'vue'

// Types
import type { EffectScope } from 'vue'

export function usePolling (fn: () => void, interval = 1000) {
  const isRunning = ref(false)
  let scope: EffectScope | null = null
  let timer: ReturnType<typeof setInterval> | null = null

  function start () {
    if (isRunning.value) return

    scope = effectScope()

    scope.run(() => {
      timer = setInterval(fn, interval)
    })

    isRunning.value = true
  }

  function stop () {
    if (!isRunning.value) return

    if (timer) {
      clearInterval(timer)
      timer = null
    }

    if (scope) {
      scope.stop()
      scope = null
    }

    isRunning.value = false
  }

  function restart () {
    stop()
    start()
  }

  return { isRunning, start, stop, restart }
}
