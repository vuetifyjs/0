import type { MaybeRefOrGetter } from 'vue'

export interface GroupItem {
  id: string
  disabled: boolean
  index: number
  value: unknown
  valueIsIndex: boolean
}

export interface GroupContext {
  register: (item: Partial<GroupItem>) => RegisteredGroupItem
  unregister: (id: GroupItem['id']) => void
  reset: () => void
  mandate: () => void
}

export interface RegisteredGroupItem {
  isActive: MaybeRefOrGetter<boolean>
  toggle: () => void
  index: MaybeRefOrGetter<number>
}

export type GroupOptions = {
  mandatory?: boolean | 'force'
  multiple?: boolean
  returnObject?: boolean
}

export function useGroup (namespace: string, options?: GroupOptions) {
  const [useGroupContext, provideGroupContext] = useContext<GroupContext>(namespace)

  const registered = reactive(new Map<GroupItem['id'], GroupItem>())
  const selected = reactive(new Set<string>())

  function mandate () {
    if (!options?.mandatory || selected.size > 0 || registered.size === 0) return

    let first = registered.values().next().value

    while (first?.disabled) {
      const next = registered.values().next().value
      if (next === first) break
      first = next
    }

    if (first) selected.add(first.id)
  }

  function reset () {
    selected.clear()
    reindex()
    mandate()
  }

  function reindex () {
    let index = 0

    for (const [, value] of registered) {
      value.index = index++

      if (value.valueIsIndex) {
        value.value = value.index
      }
    }
  }

  function toggle (ids: GroupItem['id'] | GroupItem['id'][]) {
    for (const id of Array.isArray(ids) ? ids : [ids]) {
      if (!id) continue

      const item = registered.get(id)

      if (!item || item.disabled) continue

      const hasId = selected.has(id)

      if (hasId && options?.mandatory) {
        // For single selection, can't select if it's the only one
        if (!options?.multiple) continue
        // For multiple selection, can't select if it's the last one
        if (selected.size === 1) continue
      }

      if (hasId) {
        selected.delete(id)
      } else {
        // For single selection, clear others first
        if (!options?.multiple) selected.clear()

        selected.add(id)
      }
    }
  }

  function transform (map: Set<string>) {
    const returnObject = options?.returnObject

    if (!options?.multiple) {
      const current = map.values().next().value

      if (!current) return undefined

      const item = registered.get(current)

      return returnObject ? item : item?.value
    }

    const array = []

    for (const id of map) {
      const item = registered.get(id)

      if (!item) continue

      array.push(returnObject ? item : item.value)
    }

    return array
  }

  function register (item: Partial<GroupItem>): RegisteredGroupItem {
    const index = registered.size

    const registrant: GroupItem = reactive({
      id: item.id ?? useId(),
      disabled: item.disabled ?? false,
      index,
      value: item.value ?? index,
      valueIsIndex: item.value == null,
    })

    registered.set(registrant.id, registrant)

    if (options?.mandatory === 'force') mandate()

    return {
      isActive: toRef(() => selected.has(registrant.id)),
      index: toRef(() => registrant.index),
      toggle: () => toggle(registrant.id),
    }
  }

  async function unregister (id: GroupItem['id']) {
    registered.delete(id)
    selected.delete(id)

    reindex()
  }

  return [
    useGroupContext,
    function (model?: MaybeRefOrGetter) {
      let isUpdatingModel = false

      if (model) {
        watch(selected, value => {
          if (isUpdatingModel) return

          isUpdatingModel = true

          model.value = transform(value)
        })

        watch(model, async value => {
          if (isUpdatingModel) return

          isUpdatingModel = true

          const current = transform(selected)

          const values = Array.isArray(value) ? value : [value]

          if (options?.multiple) {
            if (
              values.length === selected.size &&
              values.every(val => selected.has(val))
            ) return
          } else {
            if (value === current) return
          }

          selected.clear()

          for (const val of values) {
            if (!registered.has(val)) continue

            selected.add(val)
          }
        })

        watch(model, async () => {
          await nextTick()

          isUpdatingModel = false
        })
      }

      const context = {
        register,
        unregister,
        reset,
        mandate,
      }

      provideGroupContext(context)

      return context
    },
  ] as const
}
