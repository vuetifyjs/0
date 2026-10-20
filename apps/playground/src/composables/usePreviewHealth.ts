// Framework
import { IN_BROWSER, useTimer } from '@vuetify/v0'

// Components
import { usePlayground } from '@/components/playground/app/PlaygroundApp.vue'

// Utilities
import { onScopeDispose, shallowRef, toRef, watch } from 'vue'

const POLL = 500
const SPECIFIC = 2500
const GENERIC = 6000
const COUNTDOWN = 5_000
const AUTO = 3

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
  let tries = 0
  // User clicked Retry while a countdown was running. Stays for this page
  // load; a refresh clears it and the next failure counts down again.
  let manual = false
  // Bumped by start() and unmount so a HEAD that resolves late cannot
  // fail() a cycle that has already moved on.
  let cycle = 0
  let disposed = false

  function mounted () {
    const app = iframe()?.contentDocument?.querySelector('#app')
    return !!app && app.childElementCount > 0
  }

  function collect () {
    const doc = iframe()?.contentDocument
    const out = new Map<string, string>()
    const map = doc?.querySelector('script[type="importmap"]')
    if (map?.textContent) {
      try {
        const parsed = JSON.parse(map.textContent) as { imports?: Record<string, string> }
        for (const [name, url] of Object.entries(parsed.imports ?? {})) {
          if (/^https?:\/\//.test(url)) out.set(url, name)
        }
      } catch { /* malformed importmap — still probe the shims loader below */ }
    }
    // Derive the es-module-shims loader from the sandbox's own <script> rather than
    // hardcoding @vue/repl's bundled version, which drifts when repl is upgraded.
    const shims = doc?.querySelector<HTMLScriptElement>('script[src*="es-module-shims"]')
    if (shims?.src) out.set(shims.src, 'es-module-shims')
    return out
  }

  async function probe () {
    const out: FailedDep[] = []
    await Promise.all([...collect()].map(async ([url, name]) => {
      try {
        const res = await fetch(url, { method: 'HEAD' })
        if (!res.ok && res.status !== 405) out.push({ url, name })
      } catch {
        out.push({ url, name })
      }
    }))
    return out
  }

  async function tick () {
    // Confirmed mount → healthy. Reset the countdown on EVERY mount: useTimer
    // (repeat) can't be stopped from inside its own handler, and @vue/repl empties
    // #app on every recompile, so without this reset `elapsed` would creep up across
    // ordinary edits and eventually false-trigger the banner over a working preview.
    if (mounted()) {
      countdown.stop()
      tries = 0
      dismissed.value = false
      status.value = 'ok'
      failed.value = []
      elapsed = 0
      probed = false
      return
    }

    // A genuine compile error is already shown by the REPL's own overlay.
    // Stop a countdown that started before the error landed — an edit does
    // not bump filesVersion, so the watch will not call start().
    if (playground.store.errors.length > 0) {
      countdown.stop()
      status.value = 'ok'
      failed.value = []
      return
    }

    elapsed += POLL

    if (!probed && elapsed >= SPECIFIC) {
      probed = true
      const started = cycle
      const bad = await probe()
      if (disposed || started !== cycle || mounted()) return
      if (playground.store.errors.length > 0) {
        countdown.stop()
        status.value = 'ok'
        failed.value = []
        return
      }
      if (bad.length > 0) {
        fail(bad)
        return
      }
    }

    if (elapsed >= GENERIC && !mounted() && status.value !== 'failed') {
      fail([])
    }
  }

  function fail (deps: FailedDep[]) {
    if (disposed) return
    failed.value = deps
    status.value = 'failed'
    if (dismissed.value) return
    beginCountdown()
  }

  function beginCountdown () {
    if (disposed || manual || tries >= AUTO || countdown.isActive.value) return
    countdown.start()
  }

  function onCountdown () {
    tries += 1
    remount()
  }

  const countdown = useTimer(onCountdown, { duration: COUNTDOWN })

  const seconds = toRef(() => {
    if (!countdown.isActive.value) return null
    return Math.max(1, Math.ceil(countdown.remaining.value / 1000))
  })

  const attempt = toRef(() => {
    if (!countdown.isActive.value) return null
    return tries + 1
  })

  const watchdog = useTimer(tick, { duration: POLL, repeat: true })

  function start () {
    cycle += 1
    watchdog.stop()
    countdown.stop()
    elapsed = 0
    probed = false
    status.value = 'ok'
    failed.value = []
    dismissed.value = false
    if (disposed || !IN_BROWSER) return
    watchdog.start()
  }

  function remount () {
    reloadKey.value++
    start()
  }

  function reload () {
    tries = 0
    remount()
  }

  function retry () {
    if (countdown.isActive.value) manual = true
    countdown.stop()
    remount()
  }

  function dismiss () {
    countdown.stop()
    dismissed.value = true
  }

  onScopeDispose(() => {
    disposed = true
    cycle += 1
    countdown.stop()
    watchdog.stop()
  }, true)

  watch(
    () => [playground.isReady.value, playground.filesVersion.value],
    () => {
      if (playground.isReady.value) start()
    },
    { immediate: true },
  )

  return { status, failed, dismissed, reloadKey, reload, retry, dismiss, seconds, attempt }
}
