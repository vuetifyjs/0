/**
 * @module useProxyModel
 *
 * @remarks
 * Proxy composable for bidirectional sync between selection registry and v-model.
 *
 * Key features:
 * - Bidirectional synchronization
 * - Array and single-value modes
 * - Watcher pause to prevent infinite loops
 * - Automatic cleanup on scope disposal
 * - Perfect for form controls with selection backing
 *
 * Bridges the gap between selection composables and Vue's v-model.
 */

// Utilities
import { computed, watch, ref, toValue, shallowRef, onScopeDispose } from 'vue'
import { isFunction, isArray } from '#v0/utilities'

// Transformers
import { toArray } from '#v0/composables/toArray'

// Types
import type { SelectionContext, SelectionTicket } from '#v0/composables/useSelection'
import type { ID } from '#v0/types'

export interface ProxyModelOptions {
  /** Whether to use deep reactivity for the model */
  deep?: boolean
}

/**
 * Creates a proxy model that can be used to bind to a selection.
 *
 * @param registry The selection registry to bind to.
 * @param initial The initial value of the model.
 * @param options The options for the proxy model.
 * @param transformIn A function to transform the value before setting it.
 * @param transformOut A function to transform the value before getting it.
 * @template Z The type of the selection ticket.
 * @returns A proxy model that can be used to bind to a selection.
 *
 * @see https://0.vuetifyjs.com/composables/forms/use-proxy-model
 *
 * @example
 * ```ts
 * import { createSelection, useProxyModel } from '@vuetify/v0'
 *
 * const registry = createSelection({ events: true })
 * registry.onboard([
 *   { id: 'item-1', value: 'Item 1' },
 *   { id: 'item-2', value: 'Item 2' },
 * ])
 *
 * const model = useProxyModel(registry, 'Item 1')
 * ```
 */
export function useProxyModel<Z extends SelectionTicket> (
  registry: SelectionContext<Z>,
  initial?: unknown | unknown[],
  options?: ProxyModelOptions,
  _transformIn?: (val: unknown[] | unknown) => unknown[],
  _transformOut?: (val: unknown[]) => unknown | unknown[],
) {
  const reactivity = options?.deep ? ref : shallowRef
  const internal = reactivity<unknown[]>(initial ? toArray<unknown>(initial) : [])
  const isModelArray = isArray(initial)

  function transformIn (val: unknown | unknown[]) {
    return (isFunction(_transformIn) ? _transformIn(val) : toArray(val))
  }

  function transformOut (val: unknown[]) {
    if (isFunction(_transformOut)) return _transformOut(val)

    return isModelArray ? val : val[0]
  }

  const model = computed({
    get () {
      return transformOut(internal.value)
    },
    set (val: unknown | unknown[]) {
      internal.value = transformIn(val)
    },
  })

  const registryWatcher = watch(registry.selectedValues, val => {
    modelWatcher.pause()
    model.value = Array.from(toValue(val))
    modelWatcher.resume()
  })

  const modelWatcher = watch(model, val => {
    const currentIds = new Set(toValue(registry.selectedIds))
    const targetIds = new Set<ID>()

    for (const value of toArray(val)) {
      const ids = registry.browse(value)
      if (isArray(ids)) {
        for (const single of ids) targetIds.add(single)
      } else if (ids) {
        targetIds.add(ids)
      }
    }

    registryWatcher.pause()

    if (isModelArray) {
      for (const id of currentIds.difference(targetIds)) {
        registry.selectedIds.delete(id)
      }

      for (const id of targetIds.difference(currentIds)) {
        registry.selectedIds.add(id)
      }
    } else {
      const next = targetIds.values().next().value
      const last = currentIds.values().next().value
      if (last !== undefined) registry.unselect(last)
      if (next !== undefined) registry.select(next)
    }

    registryWatcher.resume()
  })

  function onRegister (ticket: Z) {
    if (!internal.value.includes(ticket.value)) return

    registryWatcher.pause()
    modelWatcher.pause()
    registry.select(ticket.id)
    registryWatcher.resume()
    modelWatcher.resume()
  }

  function onUnregister (ticket: Z) {
    if (!internal.value.includes(ticket.value)) return

    registryWatcher.pause()
    modelWatcher.pause()
    registry.unselect(ticket.id)
    registryWatcher.resume()
    modelWatcher.resume()
  }

  function onUpdate (ticket: Z) {
    const hasValue = internal.value.includes(ticket.value)
    const isSelected = toValue(registry.selectedIds).has(ticket.id)
    if (!hasValue && isSelected) {
      onUnregister(ticket)
    } else if (hasValue && !isSelected) {
      onRegister(ticket)
    }
  }

  function onClear () {
    registryWatcher.pause()
    modelWatcher.pause()
    registry.selectedIds.clear()
    registryWatcher.resume()
    modelWatcher.resume()
  }

  registry.on('register:ticket', onRegister)
  registry.on('unregister:ticket', onUnregister)
  registry.on('update:ticket', onUpdate)
  registry.on('clear:registry', onClear)

  onScopeDispose(() => {
    registryWatcher()
    modelWatcher()
    registry.off('register:item', onRegister)
    registry.off('unregister:ticket', onUnregister)
    registry.off('update:ticket', onUpdate)
    registry.off('clear:registry', onClear)
  }, true)

  return model
}
