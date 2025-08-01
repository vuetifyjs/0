// Factories
import { createTrinity } from '#v0/factories/createTrinity'
import { createContext, useContext } from '#v0/factories/createContext'

// Composables
import { useSelection } from '#v0/composables/useSelection'

// Utilities
import { computed, getCurrentInstance, nextTick, onMounted, ref, toValue, watch } from 'vue'
import { genId } from '#v0/utilities/helpers'

// Transformers
import { toArray } from '#v0/transformers'

// Types
import type { App, ComputedRef, Reactive, Ref } from 'vue'
import type { ID } from '#v0/types'
import type { SelectionContext, SelectionOptions, SelectionTicket } from '#v0/composables/useSelection'
import type { ContextTrinity } from '#v0/factories/createTrinity'

export interface GroupTicket extends SelectionTicket {}

export interface GroupContext<Z extends GroupTicket> extends SelectionContext<Z> {
  selectedItems: ComputedRef<Set<Z | undefined>>
  selectedIndexes: ComputedRef<Set<number>>
  selectedValues: ComputedRef<Set<unknown>>
  select: (ids: ID | ID[]) => void
  mandate: () => void
}

export interface GroupOptions extends SelectionOptions {}

export function useGroup<
  Z extends GroupTicket = GroupTicket,
  E extends GroupContext<Z> = GroupContext<Z>,
> (
  model?: Ref<unknown[]>,
  options?: GroupOptions,
): E {
  const registry = useSelection<Z, E>(options)
  const mandatory = options?.mandatory ?? false
  let initialValue: unknown | unknown[] = toValue(model)

  const selectedIndexes = computed(() => {
    return new Set(
      Array.from(registry.selectedIds).map(id => registry.find(id)?.index),
    )
  })

  const selectedItems = computed(() => {
    return new Set(
      Array.from(registry.selectedIds).map(id => registry.find(id)),
    )
  })

  const selectedValues = computed(() => {
    return new Set(
      Array.from(selectedItems.value).map(item => item?.value),
    )
  })

  function mandate () {
    if (!mandatory || registry.selectedIds.size > 0 || registry.collection.size === 0) return
    for (const item of registry.collection.values()) {
      if (item.disabled) continue
      select(item.id)
      break
    }
  }

  function reset () {
    registry.reset()
    mandate()
  }

  function select (ids: ID | ID[]) {
    for (const id of toArray(ids)) {
      const item = registry.find(id)
      if (!item || item.disabled) continue

      const hasId = registry.selectedIds.has(id)

      if (hasId) {
        if (mandatory && registry.selectedIds.size === 1) {
          continue
        }

        registry.selectedIds.delete(id)
      } else {
        registry.selectedIds.clear()
        registry.selectedIds.add(id)
      }
    }
  }

  function register (registrant: Partial<Z> = {}): Reactive<Z> {
    const id = registrant.id ?? genId()
    const item: Partial<Z> = {
      ...registrant,
      id,
      toggle: () => select(id),
    }

    const ticket = registry.register(item) as Reactive<Z>

    if (initialValue != null) {
      const shouldSelect = Array.isArray(initialValue)
        ? initialValue.includes(ticket.value)
        : initialValue === ticket.value

      if (shouldSelect) select(id)
    }

    if (mandatory === 'force') mandate()

    return ticket
  }

  if (getCurrentInstance()) {
    onMounted(() => {
      initialValue = undefined
    })
  }

  const context = {
    ...registry,
    selectedItems,
    selectedIndexes,
    selectedValues,
    register,
    mandate,
    select,
    reset,
  } as unknown as E

  return context
}

export function createGroupContext<
  Z extends GroupTicket = GroupTicket,
  E extends GroupContext<Z> = GroupContext<Z>,
> (
  namespace = 'v0:group',
  options?: GroupOptions,
): ContextTrinity<E> {
  const [useGroupContext, _provideGroupContext] = createContext<E>(namespace)

  const model = ref([]) as Ref<unknown[]>
  const context = useGroup<Z, E>(model, options)

  function provideGroupContext (
    model?: Ref<unknown | unknown[]>,
    _context: E = context,
    app?: App,
  ): E {
    let isUpdatingModel = false

    if (model) {
      const returnObject = options?.returnObject ?? false

      watch(_context.selectedIds, () => {
        if (isUpdatingModel) return

        const target = returnObject ? _context.selectedItems : _context.selectedValues

        model.value = Array.from(target.value)
      })

      watch(model, async value => {
        if (isUpdatingModel) return

        const values = new Set(toArray(value))

        if ((_context.selectedValues.value.symmetricDifference(values)).size === 0) return

        _context.selectedIds.clear()

        for (const value of values) {
          const id = _context.browse(value)

          if (!id) continue

          _context.selectedIds.add(id)
        }
      })

      watch([model, _context.selectedIds], async () => {
        isUpdatingModel = true

        await nextTick()

        isUpdatingModel = false
      })
    }

    return _provideGroupContext(_context, app)
  }

  return createTrinity<E>(useGroupContext, provideGroupContext, context)
}
