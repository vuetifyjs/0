// Utilities
import { shallowRef } from 'vue'

// Types
import type { DSComponent, DSManifest } from '@paper/codex'

const designSystems = shallowRef<DSManifest[]>([])

export function registerDesignSystem (manifest: DSManifest) {
  designSystems.value = [...designSystems.value, manifest]
}

export function useShowcase () {
  function getDS (slug: string): DSManifest | undefined {
    return designSystems.value.find(ds => ds.slug === slug)
  }

  function getComponent (slug: string, name: string): DSComponent | undefined {
    const ds = getDS(slug)
    return ds?.components.find(c => c.name === name)
  }

  function getCategories (slug: string): string[] {
    const ds = getDS(slug)
    if (!ds) return []
    return [...new Set(ds.components.map(c => c.category))]
  }

  return {
    designSystems,
    getDS,
    getComponent,
    getCategories,
    registerDesignSystem,
  }
}
