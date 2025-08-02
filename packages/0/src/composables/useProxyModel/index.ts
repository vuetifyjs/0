// Utilities
import { computed, watch, ref, nextTick } from 'vue'

// Transformers
import { toArray } from '#v0/transformers'

// Types
import type { SelectionContext, SelectionTicket } from '#v0/composables/useSelection'

export function useProxyModel<Z extends SelectionTicket> (
  selection: SelectionContext<Z>,
  transformIn = (val: any) => val,
  transformOut = (val: any) => val,
) {
  const internal = ref()
  let isUpdatingModel = false

  const model = computed({
    get () {
      return transformIn(internal.value)
    },
    set (val) {
      internal.value = transformOut(val)
    },
  })

  watch(selection.selectedItems, val => {
    if (isUpdatingModel) return

    if (val.size === 0) {
      model.value = undefined
      return
    }

    const array = []

    for (const item of val) {
      array.push(item.value)
    }

    model.value = array
  })

  watch(model, val => {
    if (isUpdatingModel) return

    selection.selectedIds.clear()

    for (const value of toArray(val)) {
      const id = selection.browse(value)

      if (id) selection.selectedIds.add(id)
    }
  })

  watch([model, selection.selectedItems], async () => {
    isUpdatingModel = true

    await nextTick()

    isUpdatingModel = false
  })

  return model
}
