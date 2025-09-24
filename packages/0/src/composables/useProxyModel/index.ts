// Composables
import { useLogger } from '#v0/composables/useLogger'

// Utilities
import { computed, watch, ref, toValue, toRaw, shallowRef } from 'vue'
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
 * Creates a proxy model for two-way binding with a selection context.
 *
 * @param registry SelectionContext | GroupContext | SingleContext | StepContext
 * @template Z The type of items managed by the selection.
 * @template E The type of the selection context.
 * @returns The proxy model for two-way binding with the selection context.
 *
 * @see https://0.vuetifyjs.com/composables/pluginforms/use-proxy-model
 */
export function useProxyModel<Z extends SelectionTicket> (
  registry: SelectionContext<Z>,
  initial?: Z | Z[],
  options?: ProxyModelOptions,
  _transformIn?: (val: Z[] | Z) => Z[],
  _transformOut?: (val: Z[]) => Z | Z[],
) {
  const logger = useLogger()
  const reactivity = options?.deep ? ref : shallowRef
  const internal = reactivity<Z[]>(initial ? toArray<Z>(initial) : [])
  const isModelArray = isArray(initial)

  function transformIn (val: Z | Z[]): Z[] {
    if (isFunction(_transformIn)) return _transformIn(val)

    return toArray(val)
  }

  function transformOut (val: Z[]): Z | Z[] | undefined {
    if (isFunction(_transformOut)) return _transformOut(val)

    return isModelArray ? val : val[0]
  }

  const model = computed({
    get () {
      return transformOut(internal.value as Z[])
    },
    set (val: Z[]) {
      internal.value = transformIn(val)
    },
  })

  const watcher = watch(registry.selectedIds, (val, oldVal) => {
    if (toRaw(val).symmetricDifference(toRaw(oldVal)).size === 0) return

    if (val.size === 0) {
      model.value = []
      return
    }

    model.value = Array.from(registry.selectedValues.value) as Z[]
  })

  watch(model, val => {
    const currentIds = new Set(toValue(registry.selectedIds))
    const targetIds = new Set<ID>()

    for (const value of toArray(val)) {
      const ids = registry.browse(value)
      if (isArray(ids)) {
        for (const single of ids) targetIds.add(single)
      } else if (ids) {
        targetIds.add(ids)
      } else {
        logger.warn('Unable to find id for value', value)
      }
    }

    watcher.pause()

    if (isModelArray) {
      for (const id of currentIds.difference(targetIds)) {
        registry.selectedIds.delete(id)
      }

      for (const id of targetIds.difference(currentIds)) {
        registry.selectedIds.add(id)
      }
    } else {
      const next = targetIds.values().next().value as ID
      const last = currentIds.values().next().value as ID
      registry.selectedIds.delete(last)
      registry.selectedIds.add(next)
    }

    watcher.resume()
  })

  return model
}
