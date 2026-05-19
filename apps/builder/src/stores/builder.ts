import dependencyGraph from '@/data/dependencies.json'
import { resolve } from '@/engine/resolve'

// Utilities
import { defineStore } from 'pinia'
import { shallowRef, toRef } from 'vue'

// Types
import type { DependencyGraph } from '@/data/types'

const graph = dependencyGraph as DependencyGraph

export const useBuilderStore = defineStore('builder', () => {
  const selected = shallowRef<Set<string>>(new Set())

  const resolved = toRef(() => resolve([...selected.value], graph))

  function select (id: string) {
    if (selected.value.has(id)) return
    selected.value = new Set([...selected.value, id])
  }

  function deselect (id: string) {
    if (!selected.value.has(id)) return
    const next = new Set(selected.value)
    next.delete(id)
    selected.value = next
  }

  function toggle (id: string) {
    selected.value.has(id) ? deselect(id) : select(id)
  }

  function isSelected (id: string) {
    return selected.value.has(id)
  }

  function reset () {
    selected.value = new Set()
  }

  return {
    selected,
    resolved,
    select,
    deselect,
    toggle,
    isSelected,
    reset,
  }
})
