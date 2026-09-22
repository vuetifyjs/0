/**
 * useProxyRegistry Performance Benchmarks
 *
 * Structure:
 * - READ-ONLY operations use shared fixtures (safe, isolates operation cost)
 * - WARM operations (register, upsert) share a populated registry with the proxy
 *   ATTACHED across iterations — constructing/disposing the scope + proxy per
 *   iteration is the pollution, so it is hoisted and only the registry contents
 *   are reset: register undoes itself with an O(1) tail unregister, upsert
 *   alternates the value (self-inverting, keeps the catalog reassign firing).
 *   Times the mutation + event dispatch, never the O(n) onboard.
 * - FRESH fixtures where the populate IS the op (initialization, bulk
 *   registration) or where a restore would distort the cost (unregister — see
 *   its category comment)
 * - Tests both 1,000 and 10,000 item datasets
 * - Categories: initialization, computed access, mutation operations, bulk registration
 */

import { bench, describe } from 'vitest'

// Framework
import { createRegistry, useProxyRegistry } from '@vuetify/v0/composables'

// Utilities
import { effectScope } from 'vue'

// =============================================================================
// FIXTURES - Created once, reused across read-only benchmarks
// =============================================================================

interface BenchmarkItem {
  id: string
  value: string
}

const ITEMS_1K: BenchmarkItem[] = Array.from({ length: 1000 }, (_, i) => ({
  id: `item-${i}`,
  value: `value-${i}`,
}))

const ITEMS_10K: BenchmarkItem[] = Array.from({ length: 10_000 }, (_, i) => ({
  id: `item-${i}`,
  value: `value-${i}`,
}))

function createFixture (count: number) {
  const scope = effectScope()
  const registry = createRegistry({ events: true })
  const items = count === 1000 ? ITEMS_1K : ITEMS_10K
  registry.onboard(items.slice(0, count))
  const proxy = scope.run(() => useProxyRegistry(registry))!
  return { registry, proxy, dispose: () => scope.stop() }
}

// =============================================================================
// BENCHMARKS
// =============================================================================

describe('useProxyRegistry benchmarks', () => {
  // ===========================================================================
  // INITIALIZATION - Measures proxy creation + initial read + event listener setup
  // Fresh fixture per iteration (required - we're measuring creation itself)
  // ===========================================================================
  describe('initialization', () => {
    bench('Create empty proxy', () => {
      const scope = effectScope()
      const registry = createRegistry({ events: true })
      scope.run(() => useProxyRegistry(registry))
      scope.stop()
    })

    bench('Create proxy (1,000 items)', () => {
      const { dispose } = createFixture(1000)
      dispose()
    })

    bench('Create proxy (10,000 items)', () => {
      const { dispose } = createFixture(10_000)
      dispose()
    })
  })

  // ===========================================================================
  // COMPUTED ACCESS - registry.keys() vs proxy.keys
  // Shared fixture (safe - read-only, no state changes)
  // Measures: direct registry cache-hit vs Vue reactive getter on same data
  // ===========================================================================
  describe('computed access', () => {
    const fixture1k = createFixture(1000)
    const fixture10k = createFixture(10_000)

    bench('registry.keys() (1,000 items)', () => {
      fixture1k.registry.keys()
    })

    bench('proxy.keys (1,000 items)', () => {
      void fixture1k.proxy.keys
    })

    bench('registry.keys() (10,000 items)', () => {
      fixture10k.registry.keys()
    })

    bench('proxy.keys (10,000 items)', () => {
      void fixture10k.proxy.keys
    })

    bench('registry.values() (1,000 items)', () => {
      fixture1k.registry.values()
    })

    bench('proxy.values (1,000 items)', () => {
      void fixture1k.proxy.values
    })

    bench('registry.values() (10,000 items)', () => {
      fixture10k.registry.values()
    })

    bench('proxy.values (10,000 items)', () => {
      void fixture10k.proxy.values
    })

    bench('registry.entries() (1,000 items)', () => {
      fixture1k.registry.entries()
    })

    bench('proxy.entries (1,000 items)', () => {
      void fixture1k.proxy.entries
    })

    bench('registry.entries() (10,000 items)', () => {
      fixture10k.registry.entries()
    })

    bench('proxy.entries (10,000 items)', () => {
      void fixture10k.proxy.entries
    })

    bench('proxy.size (1,000 items)', () => {
      void fixture1k.proxy.size
    })

    bench('proxy.size (10,000 items)', () => {
      void fixture10k.proxy.size
    })
  })

  // ===========================================================================
  // MUTATION OPERATIONS - Single item changes that trigger event → proxy update()
  // Measures: registry mutation + event dispatch to the attached proxy (update()
  //   bumps a version; the O(n) snapshot rebuild is lazy and never read here).
  // WARM (register, upsert): shared registry+proxy per size, proxy stays attached.
  //   register appends 'new-item' then unregisters it (O(1) tail splice) to restore
  //   size; upsert alternates the value so the catalog reassign fires every
  //   iteration and item-500 oscillates back to its original value (no drift).
  // FRESH (unregister): a restore would have to re-register, which appends at the
  //   TAIL (fixture values are explicit → indexDependentCount is 0 → no reindex
  //   cascade), so the removed item lands at the end and subsequent iterations
  //   measure an O(1) tail splice instead of the O(n) mid-list splice the name
  //   implies. Keeping it fresh preserves the honest mid-list cost.
  // ===========================================================================
  describe('mutation operations', () => {
    const warm1k = createFixture(1000)
    const warm10k = createFixture(10_000)

    let upsertValue1k = 'updated'
    let upsertValue10k = 'updated'

    bench('Register single item (1,000 items)', () => {
      warm1k.registry.register({ id: 'new-item', value: 'new' })
      warm1k.registry.unregister('new-item')
    })

    bench('Register single item (10,000 items)', () => {
      warm10k.registry.register({ id: 'new-item', value: 'new' })
      warm10k.registry.unregister('new-item')
    })

    bench('Unregister single item (1,000 items)', () => {
      const { registry, dispose } = createFixture(1000)
      registry.unregister('item-500')
      dispose()
    })

    bench('Unregister single item (10,000 items)', () => {
      const { registry, dispose } = createFixture(10_000)
      registry.unregister('item-5000')
      dispose()
    })

    bench('Upsert single item (1,000 items)', () => {
      warm1k.registry.upsert('item-500', { value: upsertValue1k })
      upsertValue1k = upsertValue1k === 'updated' ? 'value-500' : 'updated'
    })

    bench('Upsert single item (10,000 items)', () => {
      warm10k.registry.upsert('item-5000', { value: upsertValue10k })
      upsertValue10k = upsertValue10k === 'updated' ? 'value-5000' : 'updated'
    })
  })

  // ===========================================================================
  // BULK REGISTRATION - load many items while the proxy is ALREADY listening
  // Fresh fixture per iteration (required - mutations change state)
  // onboard() is batched: the registry replays events after the collection is
  //   stable and values() is cached, so even the eager path was O(n). The lazy
  //   rewrite is a constant-factor win here.
  // register() one-by-one is unbatched: each call invalidates the cache and
  //   dispatches immediately, so the eager path rebuilt a growing snapshot per
  //   call (O(n^2)). The lazy rewrite makes it O(n). This is the regression
  //   sentinel — a revert to eager rebuilds tanks the 10,000 case by ~300x.
  // ===========================================================================
  describe('bulk registration', () => {
    bench('Onboard 1,000 items (proxy attached)', () => {
      const scope = effectScope()
      const registry = createRegistry({ events: true })
      scope.run(() => useProxyRegistry(registry))
      registry.onboard(ITEMS_1K)
      scope.stop()
    })

    bench('Onboard 10,000 items (proxy attached)', () => {
      const scope = effectScope()
      const registry = createRegistry({ events: true })
      scope.run(() => useProxyRegistry(registry))
      registry.onboard(ITEMS_10K)
      scope.stop()
    })

    bench('Register 1,000 items one-by-one (proxy attached)', () => {
      const scope = effectScope()
      const registry = createRegistry({ events: true })
      scope.run(() => useProxyRegistry(registry))
      for (const item of ITEMS_1K) registry.register(item)
      scope.stop()
    })

    bench('Register 10,000 items one-by-one (proxy attached)', () => {
      const scope = effectScope()
      const registry = createRegistry({ events: true })
      scope.run(() => useProxyRegistry(registry))
      for (const item of ITEMS_10K) registry.register(item)
      scope.stop()
    })
  })
})
