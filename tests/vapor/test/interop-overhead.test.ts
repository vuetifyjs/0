import { describe, expect, it } from 'vitest'

// Utilities
import { createVaporApp, vaporInteropPlugin } from '@vue/runtime-vapor'
import { createApp } from 'vue'

// Fixtures
import Checklist from '../src/bench/Checklist.vue'
import ChecklistBridge from '../src/bench/ChecklistBridge.vue'
import ChecklistVapor from '../src/bench/ChecklistVapor.vue'

// Interop overhead measurement, NOT a parity test: mounts the same 200
// compound checkboxes three ways and reports mount time + retained heap.
// Gated behind VAPOR_BENCH so `pnpm test:vapor` / CI never pay for it:
//
//   VAPOR_BENCH=1 NODE_OPTIONS=--expose-gc \
//     pnpm --filter=@vuetify-private/vapor-tests exec vitest run test/interop-overhead.test.ts
//
// happy-dom timings are comparative (pure JS, no layout) — trust the ratios,
// not the absolute milliseconds.

const COUNT = 200
const ROUNDS = 20
const WARMUP = 5
const HEAP_APPS = 5

type Mounted = { host: HTMLElement, unmount: () => void }

function mountClassic (component: any, props: Record<string, unknown>): Mounted {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp(component, props)
  app.mount(host)
  return {
    host,
    unmount: () => {
      app.unmount()
      host.remove()
    },
  }
}

function mountVaporRoot (component: any, props: Record<string, unknown>): Mounted {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createVaporApp(component, props)
  app.use(vaporInteropPlugin)
  app.mount(host)
  return {
    host,
    unmount: () => {
      app.unmount()
      host.remove()
    },
  }
}

const VARIANTS: Array<{ name: string, mount: () => Mounted }> = [
  { name: 'vdom-root', mount: () => mountClassic(Checklist, { count: COUNT }) },
  { name: 'vapor-inline', mount: () => mountVaporRoot(ChecklistVapor, { count: COUNT }) },
  { name: 'vapor-bridge', mount: () => mountVaporRoot(ChecklistBridge, { count: COUNT }) },
]

function median (values: number[]): number {
  const sorted = values.toSorted((a, b) => a - b)
  return sorted[Math.floor(sorted.length / 2)]!
}

describe.runIf(process.env.VAPOR_BENCH)('interop overhead (200 compound checkboxes)', () => {
  it('should measure mount time and retained heap per variant', () => {
    const times = new Map<string, number[]>(VARIANTS.map(v => [v.name, []]))

    for (const variant of VARIANTS) {
      const probe = variant.mount()
      expect(probe.host.querySelectorAll('button').length).toBe(COUNT)
      probe.unmount()
    }

    for (let round = 0; round < WARMUP + ROUNDS; round++) {
      for (let offset = 0; offset < VARIANTS.length; offset++) {
        const variant = VARIANTS[(round + offset) % VARIANTS.length]!
        const start = performance.now()
        const mounted = variant.mount()
        const elapsed = performance.now() - start
        mounted.unmount()
        if (round >= WARMUP) times.get(variant.name)!.push(elapsed)
      }
    }

    const gc = (globalThis as any).gc as (() => void) | undefined
    const heap = new Map<string, number>()

    if (gc) {
      for (const variant of VARIANTS) {
        gc()
        gc()
        const before = process.memoryUsage().heapUsed
        const apps = Array.from({ length: HEAP_APPS }, () => variant.mount())
        gc()
        gc()
        heap.set(variant.name, (process.memoryUsage().heapUsed - before) / HEAP_APPS)
        for (const app of apps) app.unmount()
      }
    }

    const base = median(times.get('vdom-root')!)
    const baseHeap = heap.get('vdom-root')

    for (const variant of VARIANTS) {
      const ms = median(times.get(variant.name)!)
      const retained = heap.get(variant.name)
      console.log([
        variant.name.padEnd(14),
        `mount ${ms.toFixed(2)}ms`,
        `(${(ms / base * 100 - 100).toFixed(0).padStart(4)}% vs vdom)`,
        retained && baseHeap
          ? `retained ${(retained / 1024).toFixed(0)}KB (${(retained / baseHeap * 100 - 100).toFixed(0)}% vs vdom)`
          : 'retained n/a (run with --expose-gc)',
      ].join('  '))
    }
  })
})
