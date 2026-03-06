/**
 * @module createModel
 *
 * @remarks
 * Value store layer that extends createRegistry with a reactive Set of
 * selected IDs, disabled guards, and an `apply` bridge for useProxyModel sync.
 *
 * Think of it as a creative way to store a single value — more like
 * `defineModel` than `createSelection`. Selection-specific concepts
 * (mandatory, multiple, enroll) belong in createSelection.
 *
 * Both Selection and Slider extend this layer:
 * - createRegistry → createModel → createSelection → createSingle/createGroup/createStep
 * - createRegistry → createModel → createSlider (values override)
 */

// Composables
import { createRegistry } from '#v0/composables/createRegistry'

// Utilities
import { isUndefined, useId } from '#v0/utilities'
import { computed, shallowReactive, toRef, toRaw, toValue } from 'vue'

// Types
import type { RegistryContext, RegistryOptions, RegistryTicket, RegistryTicketInput } from '#v0/composables/createRegistry'
import type { ID } from '#v0/types'
import type { ComputedRef, MaybeRef, MaybeRefOrGetter, Reactive, Ref } from 'vue'

/**
 * Input type for model tickets - what users provide to register().
 *
 * @template V The type of the ticket value.
 */
export interface ModelTicketInput<V = unknown> extends RegistryTicketInput<V> {
  /** Disabled state of the ticket (optional on input, defaults to false) */
  disabled?: MaybeRef<boolean>
}

/**
 * Output type for model tickets - what users receive from get().
 *
 * @template Z The input ticket type that extends ModelTicketInput.
 */
export type ModelTicket<Z extends ModelTicketInput = ModelTicketInput> = RegistryTicket & Z & {
  /** Disabled state of the ticket (guaranteed to exist on output) */
  disabled: MaybeRef<boolean>
  /** Whether the ticket is currently selected */
  isSelected: Readonly<Ref<boolean, boolean>>
}

/**
 * Context returned by createModel.
 *
 * @template Z The input ticket type (what users provide to register).
 * @template E The output ticket type (what users receive from get). Defaults to ModelTicket<Z>.
 */
export interface ModelContext<
  Z extends ModelTicketInput = ModelTicketInput,
  E extends ModelTicket<Z> = ModelTicket<Z>,
> extends Omit<RegistryContext<Z, E>, 'register' | 'onboard'> {
  /** Set of selected ticket IDs */
  selectedIds: Reactive<Set<ID>>
  /** Set of selected ticket instances */
  selectedItems: ComputedRef<Set<E>>
  /** Set of selected ticket values */
  selectedValues: ComputedRef<Set<E['value']>>
  /** Disable state for the entire model instance */
  disabled: MaybeRef<boolean>
  /** Clear all selected IDs and reindex */
  reset: () => void
  /** Select a ticket by ID (single-value: clears before adding) */
  select: (id: ID) => void
  /** Unselect a ticket by ID */
  unselect: (id: ID) => void
  /** Toggle a ticket ON and OFF by ID */
  toggle: (id: ID) => void
  /** Check if a ticket is selected by ID */
  selected: (id: ID) => boolean
  /** Apply external values to the model (model→registry sync strategy) */
  apply: (values: unknown[], options?: { multiple?: boolean }) => void
  /** Register a new ticket (accepts input type, returns output type) */
  register: (ticket?: Partial<Z>) => E
}

export interface ModelOptions extends RegistryOptions {
  /** When true, the entire model instance is disabled */
  disabled?: MaybeRefOrGetter<boolean>
}

/**
 * Creates a new model instance for storing a single value.
 *
 * Extends createRegistry with value tracking via a reactive Set of selected IDs.
 * Provides the shared model-value concept used by both Selection and Slider.
 *
 * @param options The options for the model instance.
 * @template Z The input ticket type.
 * @template E The output ticket type.
 * @template R The context type.
 * @returns A new model instance.
 */
export function createModel<
  Z extends ModelTicketInput = ModelTicketInput,
  E extends ModelTicket<Z> = ModelTicket<Z>,
  R extends ModelContext<Z, E> = ModelContext<Z, E>,
> (_options: ModelOptions = {}): R {
  const {
    disabled = false,
    ...options
  } = _options

  const registry = createRegistry<E>(options)
  const selectedIds = shallowReactive(new Set<ID>())

  const selectedItems = computed(() => {
    return new Set(
      Array.from(selectedIds)
        .map(id => registry.get(id))
        .filter((item): item is E => !isUndefined(item)),
    )
  })

  const selectedValues = computed(() => {
    return new Set(
      Array.from(selectedItems.value).map(item => item.value),
    )
  })

  function select (id: ID) {
    if (toValue(disabled)) return

    const item = registry.get(id)
    if (!item || toValue(item.disabled)) return

    selectedIds.clear()
    selectedIds.add(id)
  }

  function unselect (id: ID) {
    if (toValue(disabled)) return

    selectedIds.delete(id)
  }

  function toggle (id: ID) {
    if (toValue(disabled)) return

    if (selected(id)) unselect(id)
    else select(id)
  }

  function selected (id: ID) {
    return selectedIds.has(id)
  }

  function apply (values: unknown[], _options?: { multiple?: boolean }): void {
    selectedIds.clear()
    const value = values[0]
    if (isUndefined(value)) return

    const ids = registry.browse(toRaw(value))
    const id = ids?.values().next().value
    if (!isUndefined(id)) selectedIds.add(id)
  }

  function register (registration: Partial<Z> = {}): E {
    const id = registration.id ?? useId()
    const item: Partial<E> = {
      disabled: false,
      ...registration,
      isSelected: toRef(() => selected(id)),
      id,
    } as Partial<E>

    return registry.register(item)
  }

  function unregister (id: ID) {
    selectedIds.delete(id)
    registry.unregister(id)
  }

  function offboard (ids: ID[]) {
    for (const id of ids) {
      selectedIds.delete(id)
    }
    registry.offboard(ids)
  }

  function reset () {
    registry.clear()
    selectedIds.clear()
  }

  return {
    ...registry,
    disabled,
    selectedIds,
    selectedItems,
    selectedValues,
    register,
    unregister,
    offboard,
    reset,
    select,
    unselect,
    toggle,
    selected,
    apply,
    get size () {
      return registry.size
    },
  } as unknown as R
}
