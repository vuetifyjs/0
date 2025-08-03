// Composables
import { useLogger } from '#v0/composables/useLogger'

// Utilities
import { computed, watch, ref, toRef, toValue } from 'vue'
import { isFunction, isArray } from '#v0/utilities'

// Transformers
import { toArray } from '#v0/transformers'

// Types
import type { SelectionContext, SelectionTicket } from '#v0/composables/useSelection'
import type { ID } from '#v0/types'

/**
 * Creates a proxy model for two-way binding with a selection context.
 *
 * @param registry SelectionContext | GroupContext | SingleContext | StepContext
 * @template Z The type of items managed by the selection.
 * @template E The type of the selection context.
 * @returns The proxy model for two-way binding with the selection context.
 */
export function useProxyModel<Z extends SelectionTicket> (
  registry: SelectionContext<Z>,
  _model: Z[] | Z = [],
  _transformIn?: (val: Z[] | Z) => Z[],
  _transformOut?: (val: Z[]) => Z[] | Z,
) {
  const logger = useLogger()
  const internal = ref<Z[] | Z>(_model)
  const isModelArray = toRef(() => isArray(internal.value))

  function transformIn (val: Z[] | Z): Z[] {
    if (isFunction(_transformIn)) return _transformIn(val)

    return toArray(val)
  }

  function transformOut (val: Z[]): Z[] | (Z | undefined) {
    if (isFunction(_transformOut)) return _transformOut(val)

    if (isModelArray.value) return val
    if (val.length === 0) return undefined
    if (val.length === 1) return val[0]
    return val
  }

  const model = computed({
    get () {
      return transformIn(internal.value)
    },
    set (val) {
      internal.value = transformOut(val)
    },
  })

  const watcher = watch(registry.selectedIds, val => {
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
      const id = registry.browse(value)
      if (id) targetIds.add(id)
      else logger.warn('Unable to find id for value', value)
    }

    watcher.pause()

    for (const id of currentIds.difference(targetIds)) {
      registry.selectedIds.delete(id)
    }

    for (const id of targetIds.difference(currentIds)) {
      registry.selectedIds.add(id)
    }

    watcher.resume()
  })

  return model
}
