/**
 * @module useProxyModel
 *
 * @remarks
 * Proxy composable for bidirectional sync between selection registry and v-model.
 *
 * Key features:
 * - Bidirectional synchronization
 * - Array and single-value modes
 * - Automatic cleanup on scope disposal
 * - Perfect for form controls with selection backing
 *
 * Bridges the gap between selection composables and Vue's v-model.
 */

// Utilities
import { watch, toValue, onScopeDispose } from 'vue'
import { isFunction, isArray, isUndefined } from '#v0/utilities'

// Transformers
import { toArray } from '#v0/composables/toArray'

// Types
import type { Ref } from 'vue'
import type { SelectionContext, SelectionTicket } from '#v0/composables/useSelection'
import type { ID } from '#v0/types'

export interface ProxyModelOptions {
  multiple?: boolean
  transformIn?: (val: unknown) => unknown
  transformOut?: (val: unknown) => unknown
}

/**
 * Syncs a ref with a selection registry bidirectionally.
 *
 * @param registry The selection registry to bind to.
 * @param model The ref to sync.
 * @param options The options for the proxy model.
 * @template Z The type of the selection ticket.
 * @returns A function to stop the sync.
 *
 * @see https://0.vuetifyjs.com/composables/forms/use-proxy-model
 *
 * @example
 * ```ts
 * import { createSelection, useProxyModel } from '@vuetify/v0'
 *
 * const model = ref()
 * const registry = createSelection({ events: true })
 * registry.onboard([
 *   { id: 'item-1', value: 'Item 1' },
 *   { id: 'item-2', value: 'Item 2' },
 * ])
 *
 * const stop = useProxyModel(registry, model)
 * ```
 */
export function useProxyModel<Z extends SelectionTicket = SelectionTicket> (
  registry: SelectionContext<Z>,
  model: Ref<unknown>,
  options?: ProxyModelOptions,
) {
  const multiple = options?.multiple ?? false
  const _transformIn = options?.transformIn
  const _transformOut = options?.transformOut

  function transformIn (val: unknown): unknown[] {
    const value = toValue(val)
    return toArray(isFunction(_transformIn) ? _transformIn(value) : value)
  }

  function transformOut (val: unknown[]) {
    if (isFunction(_transformOut)) return _transformOut(val)
    return multiple ? val : val[0]
  }

  const modelAsArray = transformIn(model)
  const pending = new Set(modelAsArray)

  for (const value of modelAsArray) {
    const ids = registry.browse(value)
    if (isArray(ids)) {
      for (const id of ids) registry.select(id)
      pending.delete(value)
    } else if (ids) {
      registry.select(ids)
      pending.delete(value)
    }
  }

  const registryWatch = watch(registry.selectedValues, val => {
    modelWatch.pause()

    model.value = transformOut(Array.from(toValue(val)))

    modelWatch.resume()
  }, { flush: 'sync' })

  const modelWatch = watch(model, val => {
    registryWatch.pause()

    const currentIds = new Set(toValue(registry.selectedIds))
    const targetIds = new Set<ID>()

    for (const value of transformIn(val)) {
      const ids = registry.browse(value)
      if (isArray(ids)) {
        for (const single of ids) targetIds.add(single)
      } else if (ids) {
        targetIds.add(ids)
      }
    }

    if (multiple) {
      for (const id of currentIds.difference(targetIds)) {
        registry.selectedIds.delete(id)
      }
      for (const id of targetIds.difference(currentIds)) {
        registry.selectedIds.add(id)
      }
    } else {
      const next = targetIds.values().next().value
      const last = currentIds.values().next().value
      if (!isUndefined(last)) registry.unselect(last)
      if (!isUndefined(next)) registry.select(next)
    }

    registryWatch.resume()
  }, { flush: 'sync', deep: multiple })

  function onRegister (ticket: Z) {
    if (!pending.has(ticket.value) || ticket.disabled) return
    registryWatch.pause()
    modelWatch.pause()
    registry.select(ticket.id)
    pending.delete(ticket.value)
    modelWatch.resume()
    registryWatch.resume()
  }

  registry.on('register:ticket', onRegister)

  function stop () {
    registryWatch()
    modelWatch()
    registry.off('register:ticket', onRegister)
  }

  onScopeDispose(stop, true)

  return stop
}
