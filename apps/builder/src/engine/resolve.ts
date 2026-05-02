// Types
import type { DependencyGraph, ResolvedSet, Warning } from '@/data/types'

export function resolve (selected: string[], graph: DependencyGraph): ResolvedSet {
  const selectedSet = new Set(selected)
  const allDeps = new Set<string>()
  const reasons: Record<string, string> = {}
  const warnings: Warning[] = []

  const allFeatures = { ...graph.composables, ...graph.components }

  function walk (id: string, parent?: string) {
    if (allDeps.has(id)) return

    const deps = allFeatures[id]
    if (!deps) {
      warnings.push({
        featureId: id,
        type: 'missing',
        message: `Feature "${id}" not found in dependency graph`,
      })
      return
    }

    allDeps.add(id)

    // Track why this dep was pulled in (only for non-selected)
    if (parent && !selectedSet.has(id) && !reasons[id]) {
      reasons[id] = parent
    }

    for (const dep of deps) {
      walk(dep, id)
    }
  }

  for (const id of selected) {
    walk(id)
  }

  const autoIncluded = [...allDeps]
    .filter(id => !selectedSet.has(id))
    .toSorted()

  return {
    selected: [...selected],
    autoIncluded,
    reasons,
    warnings,
  }
}
