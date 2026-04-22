import tips from 'virtual:tips'

// Types
import type { CompiledTip } from '@build/generate-tips'

// Module-scoped so "already served" persists across SPA navigation within a single page load.
// A full page reload resets the Set — that is the intentional freshness window.
const served = new Set<string>()

function pickRandom (pool: CompiledTip[]): CompiledTip {
  return pool[Math.floor(Math.random() * pool.length)]
}

export function useTips () {
  function take (exclude: Set<string> = served): CompiledTip | undefined {
    if (tips.length === 0) return undefined
    const eligible = tips.filter(t => !exclude.has(t.id))
    if (eligible.length === 0) {
      // Pool exhausted — reset and allow repeats. A repeat beats an empty callout.
      served.clear()
      const pick = pickRandom(tips)
      served.add(pick.id)
      return pick
    }
    const pick = pickRandom(eligible)
    served.add(pick.id)
    return pick
  }

  function takeAnother (currentId: string): CompiledTip | undefined {
    return take(new Set([...served, currentId]))
  }

  return { take, takeAnother, size: tips.length }
}
