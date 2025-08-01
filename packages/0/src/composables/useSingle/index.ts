// Factories
import { createTrinity } from '#v0/factories/createTrinity'

// Composables
import { useSelection } from '#v0/composables/useSelection'

// Utilities
import { computed, getCurrentInstance, nextTick, onMounted, toValue, watch } from 'vue'
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
}

export interface SingleOptions extends SelectionOptions {}

/**
 * Creates a single-selection registry for managing selections within a specific namespace.
 * This function provides a way to register, unregister, and manage single selections,
 * allowing for dynamic single selection management in applications.
 *
 * Built on top of useSelection with single-selection constraints.
 *
 * @param namespace The namespace for the single context.
 * @param options Optional configuration for the single behavior.
 * @template Z The type of the single items managed by the registry.
 * @template E The type of the single context.
 * @returns A tuple containing the inject function, provide function, and the single context.
 */
export function useSingle<
  Z extends SingleTicket = SingleTicket,
  E extends SingleContext<Z> = SingleContext<Z>,
> (
  namespace: string,
  options?: SingleOptions,
): ContextTrinity<E> {
  const [useRegistryContext, provideRegistryContext, registry] = useSelection<Z, E>(namespace)

  const mandatory = options?.mandatory ?? false
  const returnObject = options?.returnObject ?? false

  let initialValue: unknown | unknown[] = null

  const selectedId = computed(() => registry.selectedIds.values().next().value)
  const selectedItem = computed(() => selectedId.value ? registry.find(selectedId.value) : undefined)
  const selectedIndex = computed(() => selectedItem.value ? selectedItem.value.index : -1)
  const selectedValue = computed(() => selectedItem.value ? selectedItem.value.value : undefined)

  function mandate () {
    if (!mandatory || registry.selectedIds.size > 0 || registry.collection.size === 0) return

    const firstId = registry.lookup(0)
    if (firstId) select(firstId)
  }

  function select (id: ID) {
    const item = registry.find(id)

    if (!item || item.disabled) return

    if (registry.selectedIds.has(id)) {
      if (!mandatory || registry.selectedIds.size > 1) {
        registry.selectedIds.delete(id)
      }
    } else {
      registry.selectedIds.clear()
      registry.selectedIds.add(id)
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

    if (initialValue != null && initialValue === ticket.value) {
      select(id)
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
    select,
    mandate,
    register,
  } as E

  function provideSingleContext (
    model?: Ref<unknown>,
    _context: E = context,
    app?: App,
  ) {
    let isUpdatingModel = false

    if (model) {
      initialValue = toValue(model)

      watch(selectedId, id => {
        if (isUpdatingModel) return

        const target = returnObject ? selectedItem : selectedValue

        model.value = id ? target.value : null
      })

      watch(model, async value => {
        if (isUpdatingModel) return

        const id = registry.browse(value)

        if (!id || selectedId.value === id) return

        select(id)
      })

      watch([model, selectedId], async () => {
        isUpdatingModel = true

        await nextTick()

        isUpdatingModel = false
      })
    }

    return provideRegistryContext(model, _context, app)
  }

  return createTrinity<E>(useRegistryContext, provideSingleContext, context)
}
