// Framework
import { IN_BROWSER, useTimer } from '@vuetify/v0'

// Components
import { usePlayground } from '@/components/playground/app/PlaygroundApp.vue'

// Utilities
import { shallowRef, watch } from 'vue'

const SHIMS = 'https://cdn.jsdelivr.net/npm/es-module-shims@1.5.18/dist/es-module-shims.wasm.js'
const POLL = 500
const SPECIFIC = 2500
const GENERIC = 6000

export interface FailedDep {
  url: string
  name: string
}

export function usePreviewHealth (iframe: () => HTMLIFrameElement | null | undefined) {
  const playground = usePlayground()

  const status = shallowRef<'ok' | 'failed'>('ok')
  const failed = shallowRef<FailedDep[]>([])
  const dismissed = shallowRef(false)
  const reloadKey = shallowRef(0)

  let elapsed = 0
  let probed = false

  function mounted () {
    const app = iframe()?.contentDocument?.querySelector('#app')
    return !!app && app.childElementCount > 0
  }

  function collect () {
    const out = new Map<string, string>()
    const script = iframe()?.contentDocument?.querySelector('script[type="importmap"]')
    if (script?.textContent) {
      try {
        const map = JSON.parse(script.textContent) as { imports?: Record<string, string> }
        for (const [name, url] of Object.entries(map.imports ?? {})) {
          if (/^https?:\/\//.test(url)) out.set(url, name)
        }
      } catch { /* malformed importmap — still probe the shims loader below */ }
    }
    out.set(SHIMS, 'es-module-shims')
    return out
  }

  async function probe () {
    const out: FailedDep[] = []
    await Promise.all([...collect()].map(async ([url, name]) => {
      try {
        const res = await fetch(url, { method: 'HEAD', mode: 'cors' })
        if (!res.ok && res.status !== 405) out.push({ url, name })
      } catch {
        out.push({ url, name })
      }
    }))
    return out
  }

  async function tick () {
    if (mounted()) {
      status.value = 'ok'
      failed.value = []
      watchdog.stop()
      return
    }
    // A genuine compile error is already shown by the REPL's own overlay.
    if (playground.store.errors.length > 0) return

    elapsed += POLL

    if (!probed && elapsed >= SPECIFIC) {
      probed = true
      const bad = await probe()
      if (bad.length > 0 && !mounted()) {
        failed.value = bad
        status.value = 'failed'
        return
      }
    }

    if (elapsed >= GENERIC && !mounted()) {
      status.value = 'failed' // failed stays [] → generic message
    }
  }

  const watchdog = useTimer(tick, { duration: POLL, repeat: true })

  function start () {
    watchdog.stop()
    elapsed = 0
    probed = false
    status.value = 'ok'
    failed.value = []
    dismissed.value = false
    if (!IN_BROWSER) return
    watchdog.start()
  }

  function retry () {
    reloadKey.value++
    start()
  }

  function dismiss () {
    dismissed.value = true
  }

  watch(
    () => [playground.isReady.value, playground.filesVersion.value],
    () => {
      if (playground.isReady.value) start()
    },
    { immediate: true },
  )

  return { status, failed, dismissed, reloadKey, retry, dismiss }
}
