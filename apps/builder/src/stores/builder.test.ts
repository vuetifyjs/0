import { beforeEach, describe, expect, it } from 'vitest'

// Framework
import { MemoryStorageAdapter, createStoragePlugin } from '@vuetify/v0'

// Stores
import { useBuilderStore } from '@/stores/builder'

// Utilities
import { createPinia, setActivePinia } from 'pinia'
import { createApp, nextTick } from 'vue'

// Types
import type { App } from 'vue'

// The store calls useStorage(), which only resolves the installed plugin inside an app
// context — a bare Pinia would silently hand it the memory *fallback* instead, and these
// assertions would be testing nothing.
//
// The adapter is injected rather than relying on window.localStorage: happy-dom does not
// implement it, so the production default (`IN_BROWSER ? window.localStorage`) resolves to
// undefined here and every write would no-op. MemoryStorageAdapter is the same interface.
let adapter: MemoryStorageAdapter

function mount (): App {
  const app = createApp({ render: () => null })
  const pinia = createPinia()

  adapter = new MemoryStorageAdapter()

  app.use(pinia)
  app.use(createStoragePlugin({ adapter }))
  setActivePinia(pinia)

  return app
}

function store () {
  return useBuilderStore()
}

async function settle (ticks = 6) {
  for (let i = 0; i < ticks; i++) {
    await nextTick()
    await Promise.resolve()
  }
}

function index () {
  return JSON.parse(adapter.getItem('v0:builder.builds') ?? '{"builds":[]}')
}

function contents (id: string) {
  return JSON.parse(adapter.getItem(`v0:builder.build.${id}`) ?? 'null')
}

describe('builder store — build isolation', () => {
  let app: App

  beforeEach(() => {
    app = mount()
  })

  it('keeps concurrent switches from writing one build into another', async () => {
    await app.runWithContext(async () => {
      const s = store()
      await s.ready
      await settle()

      const a = s.activeId!
      s.selectPlugin('useTheme')
      await settle()

      await s.createBuild()
      await settle()
      const b = s.activeId!
      s.selectPlugin('useLocale')
      await settle()

      // A third build to stand on. Both switches must get past their own guard clause for
      // the interleave to happen at all — starting from a or b makes one of them a no-op.
      await s.createBuild()
      await settle()

      // Build A is seeded with a DRAFT component id so loading it takes the purge-flush
      // branch — the write the token guard has to suppress on a superseded request.
      // NOTE: this assertion does not by itself fail against the unguarded code; the
      // microtask interleave that corrupts A is not deterministic in this harness. The two
      // tests below DO fail without the guard. Kept as an isolation invariant.
      adapter.setItem(`v0:builder.build.${a}`, JSON.stringify({
        selectedPlugins: ['useTheme'],
        pluginConfig: {},
        selectedComponents: ['Dialog', 'Tour'],
        componentConfig: {},
      }))

      await Promise.all([s.switchTo(a), s.switchTo(b)])
      await settle()

      // A keeps its own plugins. The bug wrote B's (['useLocale']) in here.
      expect(contents(a).selectedPlugins).toEqual(['useTheme'])
      expect(contents(b).selectedPlugins).toEqual(['useLocale'])
    })
  })

  it('lands on the last requested build after interleaved switches', async () => {
    await app.runWithContext(async () => {
      const s = store()
      await s.ready
      await settle()

      const a = s.activeId!
      await s.createBuild()
      await settle()
      const b = s.activeId!

      await Promise.all([s.switchTo(a), s.switchTo(b)])
      await settle()

      expect(s.activeId).toBe(b)
    })
  })

  it('does not drop a second switch while the first is still in flight', async () => {
    await app.runWithContext(async () => {
      const s = store()
      await s.ready
      await settle()

      const a = s.activeId!
      await s.createBuild()
      await settle()
      const b = s.activeId!

      // switchTo(a) is in flight (activeId still b) when switchTo(b) is requested. Comparing
      // against activeId would make the second call a no-op and strand the user on a.
      const first = s.switchTo(a)
      const second = s.switchTo(b)
      await Promise.all([first, second])
      await settle()

      expect(s.activeId).toBe(b)
    })
  })
})

describe('builder store — index integrity', () => {
  let app: App

  beforeEach(() => {
    app = mount()
  })

  // The cross-tab replay path is deliberately not covered here. Simulating a second writer
  // needs a storage context this test cannot reach: useStorage() outside a component or
  // store setup resolves the memory *fallback*, not the installed plugin, so a write made
  // from the test lands in a different cache than the store reads. Verified by tracing —
  // see the report. The rev field is still asserted monotonic below.
  it('stamps a monotonic rev on every index write', async () => {
    await app.runWithContext(async () => {
      const s = store()
      await s.ready
      await settle()

      const first = index().rev
      expect(typeof first).toBe('number')

      s.selectPlugin('useTheme')
      await settle()

      expect(index().rev).toBeGreaterThan(first)
    })
  })

  it('reads a pre-rev index written as a bare array', async () => {
    await app.runWithContext(async () => {
      const now = Date.now()
      adapter.setItem('v0:builder.builds', JSON.stringify([
        { id: 'legacy', name: 'Legacy shape', created: now, updated: now, plugins: 0, components: 0 },
      ]))
      adapter.setItem('v0:builder.build.legacy', JSON.stringify({
        selectedPlugins: ['useTheme'], pluginConfig: {}, selectedComponents: [], componentConfig: {},
      }))
      adapter.setItem('v0:builder.active', JSON.stringify('legacy'))

      const s = store()
      await s.ready
      await settle()

      expect(s.builds.map(b => b.name)).toContain('Legacy shape')
      expect([...s.selectedPlugins]).toEqual(['useTheme'])
    })
  })
})
