// Composables
import { useLogger } from '#v0/composables/useLogger'

// Utilities
import { computed, watch, ref, nextTick, toRef } from 'vue'
import { isFunction, isArray } from '#v0/utilities'

// Transformers
import { toArray } from '#v0/transformers'

// Types
import type { SelectionContext, SelectionTicket } from '#v0/composables/useSelection'

export function useProxyModel<Z extends SelectionTicket> (
  selection: SelectionContext<Z>,
  _model: Z[] | Z = [],
  _transformIn?: (val: Z[] | Z) => Z[],
  _transformOut?: (val: Z[]) => Z[] | Z,
) {
  const logger = useLogger()
  const internal = ref<Z[] | Z>(_model)
  const isModelArray = toRef(() => isArray(internal.value))
  let isUpdatingModel = false

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

  watch(selection.selectedIds, val => {
    if (isUpdatingModel) return

    if (val.size === 0) {
      model.value = []
      return
    }

    const target = selection.returnObject ? selection.selectedItems : selection.selectedValues

    model.value = Array.from(target.value) as Z[]
  })

  watch(model, val => {
    if (isUpdatingModel) return

    selection.selectedIds.clear()

    for (const value of toArray(val)) {
      const id = selection.browse(value)

      if (id) selection.selectedIds.add(id)
      else logger.warn('Unable to find id for value', value)
    }
  })

  watch([model, selection.selectedItems], async () => {
    isUpdatingModel = true

    await nextTick()

    isUpdatingModel = false
  })

  return model
}
