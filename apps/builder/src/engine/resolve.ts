// Types
import type { DependencyGraph, ResolvedSet, Warning } from '@/data/types'

export function resolve (selected: string[], graph: DependencyGraph): ResolvedSet {
  const selectedSet = new Set(selected)
  const allDeps = new Set<string>()
  const warnings: Warning[] = []

  const allFeatures = { ...graph.composables, ...graph.components }

  function walk (id: string) {
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
    for (const dep of deps) {
      walk(dep)
    }
  }

  for (const id of selected) {
    walk(id)
  }

  const autoIncluded = [...allDeps]
    .filter(id => !selectedSet.has(id))
    .sort()

  return {
    selected: [...selected],
    autoIncluded,
    warnings,
  }
}
