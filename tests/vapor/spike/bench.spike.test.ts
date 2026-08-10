import { describe, expect, it } from 'vitest'

// Context
// Fixtures
import ListClassicAtom from './ListClassicAtom.vue'
import ListClassicClassic from './ListClassicClassic.vue'
import ListVaporAtom from './ListVaporAtom.vue'

// Utilities
import { createVaporApp, vaporInteropPlugin } from '@vue/runtime-vapor'
import { createApp } from 'vue'

// Spike bench: does a vapor-compiled Atom delete the interop crossing tax?
// 400 Atoms per variant. happy-dom — trust ratios, not milliseconds.

const COUNT = 400
const ROUNDS = 20
const WARMUP = 5

type Mounted = { host: HTMLElement, unmount: () => void }

function mountClassic (component: any): Mounted {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp(component, { count: COUNT })
  app.mount(host)
  return {
    host,
    unmount: () => {
      app.unmount()
      host.remove()
    },
  }
}

function mountVaporRoot (component: any): Mounted {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createVaporApp(component, { count: COUNT })
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
  { name: 'classic-baseline', mount: () => mountClassic(ListClassicClassic) },
  { name: 'classic-atom-inline', mount: () => mountVaporRoot(ListClassicAtom) },
  { name: 'vapor-atom', mount: () => mountVaporRoot(ListVaporAtom) },
]

function median (values: number[]): number {
  const sorted = values.toSorted((a, b) => a - b)
  return sorted[Math.floor(sorted.length / 2)]!
}

describe('vapor Atom crossing tax (spike)', () => {
  it('should measure mount time per variant', () => {
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

    const base = median(times.get('classic-baseline')!)

    for (const variant of VARIANTS) {
      const ms = median(times.get(variant.name)!)
      console.log([
        variant.name.padEnd(20),
        `mount ${ms.toFixed(2)}ms`,
        `(${(ms / base * 100 - 100).toFixed(0).padStart(4)}% vs classic baseline)`,
      ].join('  '))
    }
  })
})
