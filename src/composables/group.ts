import type { MaybeRefOrGetter } from 'vue'

export interface GroupItem {
  id: string
  disabled?: boolean
  index?: number
  value: unknown
  valueIsIndex?: boolean
}

export interface GroupContext {
  register: (item: GroupItem) => RegisteredGroupItem
  unregister: (id: GroupItem['id']) => void
  reset: () => void
  mandate: () => void
}

export interface RegisteredGroupItem {
  isActive: MaybeRefOrGetter<boolean>
  toggle: () => void
  index: number
}

export type GroupOptions = {
  mandatory?: boolean | 'force'
  multiple?: boolean
}

export function useGroup (namespace: string, options?: GroupOptions) {
  const [useGroupContext, provideGroupContext] = useContext<GroupContext>(namespace)

  const registered = new Map<GroupItem['id'], GroupItem>()
  const selected = reactive(new Set<string>())

  function mandate () {
    if (!options?.mandatory || selected.size > 0 || registered.size === 0) return

    const first = registered.values().next().value?.id

    if (first) selected.add(first)
  }

  function reset () {
    let index = 0

    for (const [, value] of registered) {
      value.index = index++

      if (value.valueIsIndex) {
        value.value = value.index
      }
    }

    mandate()
  }

  function toggle (ids: GroupItem['id'] | GroupItem['id'][]) {
    for (const id of Array.isArray(ids) ? ids : [ids]) {
      const item = registered.get(id)

      if (!item) continue

      if (item?.disabled) continue

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
    return options?.multiple
      ? Array.from(map)
      : map.values().next().value
  }

  function register (item: GroupItem): RegisteredGroupItem {
    const index = registered.size

    if (item.value == null) {
      item.value = index
      item.valueIsIndex = true
    }

    registered.set(item.id, item)

    if (options?.mandatory === 'force') mandate()

    return {
      isActive: toRef(() => selected.has(item.id)),
      toggle: () => toggle(item.id),
      index,
    }
  }

  function unregister (id: GroupItem['id']) {
    registered.delete(id)
    selected.delete(id)

    reset()
  }

  return [
    useGroupContext,
    function (model?: MaybeRefOrGetter) {
      let isUpdatingModel = false

      if (model) {
        watch(selected, value => {
          if (isUpdatingModel) return

          model.value = transform(value)
        })

        watch(model, async value => {
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

      provideGroupContext({
        register,
        unregister,
        reset,
        mandate,
      })
    },
  ] as const
}
