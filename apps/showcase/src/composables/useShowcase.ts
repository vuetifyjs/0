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

  function getComposable (slug: string, name: string) {
    const ds = getDS(slug)
    return ds?.composables?.find(c => c.name === name)
  }

  function getComposableCategories (slug: string): string[] {
    const ds = getDS(slug)
    if (!ds?.composables) return []
    return [...new Set(ds.composables.map(c => c.category))]
  }

  return {
    designSystems,
    getDS,
    getComponent,
    getCategories,
    getComposable,
    getComposableCategories,
    registerDesignSystem,
  }
}
