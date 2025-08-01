// Factories
import { createTrinity } from '#v0/factories/createTrinity'
import { createContext } from '#v0/factories/createContext'

// Composables
import { useSelection } from '#v0/composables/useSelection'

// Utilities
import { computed, getCurrentInstance, nextTick, onMounted, ref, toValue, watch } from 'vue'
import { genId } from '#v0/utilities'

// Types
import type { ID } from '#v0/types'
import type { App, ComputedRef, Reactive, Ref } from 'vue'
import type { SelectionContext, SelectionOptions, SelectionTicket } from '#v0/composables/useSelection'
import type { ContextTrinity } from '#v0/factories/createTrinity'

export interface SingleTicket extends SelectionTicket {}

export interface SingleContext<Z extends SingleTicket> extends SelectionContext<Z> {
  selectedId: ComputedRef<ID | undefined>
  selectedIndex: ComputedRef<number>
  selectedItem: ComputedRef<Z | undefined>
  selectedValue: ComputedRef<unknown>
  select: (id: ID) => void
  mandate: () => void
}

export interface SingleOptions extends SelectionOptions {}

/**
 * Creates a single selection context for managing collections where only one item can be selected.
 * This function extends the selection functionality with single-selection constraints.
 *
 * @param options Optional configuration for single selection behavior.
 * @param namespace Optional namespace for context sharing.
 * @template Z The type of items managed by the single selection.
 * @template E The type of the single selection context.
 * @returns The single selection context object.
 */
export function useSingle<
  Z extends SingleTicket = SingleTicket,
  E extends SingleContext<Z> = SingleContext<Z>,
> (
  model?: Ref<unknown>,
  options?: SingleOptions,
): E {
  const registry = useSelection<Z, E>(options)
  const mandatory = options?.mandatory ?? false
  let initialValue: unknown = toValue(model)

  const selectedId = computed(() => registry.selectedIds.values().next().value)
  const selectedItem = computed(() => selectedId.value ? registry.find(selectedId.value) : undefined)
  const selectedIndex = computed(() => selectedItem.value ? selectedItem.value.index : -1)
  const selectedValue = computed(() => selectedItem.value ? selectedItem.value.value : undefined)

  function mandate () {
    if (!mandatory || registry.selectedIds.size > 0 || registry.collection.size === 0) return

    const firstId = registry.lookup(0)
    if (firstId) registry.select(firstId)
  }

  function register (registrant: Partial<Z> = {}): Reactive<Z> {
    const id = registrant.id ?? genId()
    const item: Partial<Z> = {
      ...registrant,
      id,
      toggle: () => registry.select(id),
    }

    const ticket = registry.register(item) as Reactive<Z>

    if (initialValue != null && initialValue === ticket.value) {
      registry.select(id)
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
    selectedId,
    selectedItem,
    selectedIndex,
    selectedValue,
    mandate,
    register,
  } as unknown as E

  return context
}

/**
 * Creates a single selection context with full injection/provision control.
 * Returns the complete trinity for advanced usage scenarios.
 *
 * @param namespace The namespace for the single selection context.
 * @param options Optional configuration for single selection behavior.
 * @template Z The type of items managed by the single selection.
 * @template E The type of the single selection context.
 * @returns A tuple containing the inject function, provide function, and the single selection context.
 */
export function createSingleContext<
  Z extends SingleTicket = SingleTicket,
  E extends SingleContext<Z> = SingleContext<Z>,
> (
  namespace = 'v0:single',
  options?: SingleOptions,
): ContextTrinity<E> {
  const [useSingleContext, _provideSingleContext] = createContext<E>(namespace)

  const model = ref(undefined) as Ref<unknown>
  const context = useSingle<Z, E>(model, options)

  function provideSingleContext (
    model?: Ref<unknown>,
    _context: E = context,
    app?: App,
  ): E {
    let isUpdatingModel = false

    if (model) {
      const returnObject = options?.returnObject ?? false
      watch(_context.selectedId, id => {
        if (isUpdatingModel) return

        const target = returnObject ? _context.selectedItem : _context.selectedValue

        model.value = id ? target.value : null
      })

      watch(model, value => {
        if (isUpdatingModel) return

        const id = _context.browse(value)

        if (!id || _context.selectedId.value === id) return

        _context.select(id)
      })

      watch([model, _context.selectedId], async () => {
        isUpdatingModel = true

        await nextTick()

        isUpdatingModel = false
      })
    }

    return _provideSingleContext(_context, app)
  }

  return createTrinity<E>(useSingleContext, provideSingleContext, context)
}
