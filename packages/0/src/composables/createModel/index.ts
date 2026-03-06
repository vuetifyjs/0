/**
 * @module createModel
 *
 * @remarks
 * Selection state layer that extends createRegistry with a reactive Set of
 * selected IDs, mandatory selection enforcement, and an `apply` bridge for
 * useProxyModel sync.
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
  /** Whether the model allows multiple selections */
  multiple: MaybeRefOrGetter<boolean>
  /** Clear all selected IDs and reindex */
  reset: () => void
  /** Select a ticket by ID (Toggle ON) */
  select: (id: ID) => void
  /** Unselect a ticket by ID (Toggle OFF) */
  unselect: (id: ID) => void
  /** Toggle a ticket ON and OFF by ID */
  toggle: (id: ID) => void
  /** Check if a ticket is selected by ID */
  selected: (id: ID) => boolean
  /** Mandate selected ID based on "mandatory" option */
  mandate: () => void
  /** Apply external values to the model (model→registry sync strategy) */
  apply: (values: unknown[], options?: { multiple?: boolean }) => void
  /** Register a new ticket (accepts input type, returns output type) */
  register: (ticket?: Partial<Z>) => E
  /** Onboard multiple tickets at once */
  onboard: (registrations: Partial<Z>[]) => E[]
}

export interface ModelOptions extends RegistryOptions {
  /** When true, treats the model as an array */
  multiple?: MaybeRefOrGetter<boolean>
  /**
   * Controls mandatory selection behavior:
   * - `false` (default): No mandatory selection enforcement
   * - `true`: Prevents deselecting the last selected item
   * - `'force'`: Automatically selects the first non-disabled item on registration
   */
  mandatory?: MaybeRefOrGetter<boolean | 'force'>
  /** When true, the entire model instance is disabled */
  disabled?: MaybeRefOrGetter<boolean>
}

/**
 * Creates a new model instance for managing selected items in a collection.
 *
 * Extends createRegistry with selection tracking via a reactive Set of selected IDs.
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
    mandatory = false,
    multiple = false,
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

  function seek (direction: 'first' | 'last' = 'first', from?: number): E | undefined {
    return registry.seek(direction, from, (ticket: E) => !toValue(ticket.disabled))
  }

  function mandate () {
    if (!toValue(mandatory) || registry.size === 0 || selectedIds.size > 0) return

    const ticket = seek('first')

    if (ticket) select(ticket.id)
  }

  function select (id: ID) {
    if (toValue(disabled)) return

    const item = registry.get(id)
    if (!item || toValue(item.disabled)) return

    if (!toValue(multiple)) selectedIds.clear()
    selectedIds.add(id)
  }

  function unselect (id: ID) {
    if (toValue(disabled)) return
    if (toValue(mandatory) && selectedIds.size === 1) return

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

  function apply (values: unknown[], options?: { multiple?: boolean }): void {
    const isMultiple = options?.multiple ?? toValue(multiple)
    const currentIds = new Set(selectedIds)
    const targetIds = new Set<ID>()

    for (const value of values) {
      const ids = registry.browse(toRaw(value))
      if (ids) {
        for (const id of ids) targetIds.add(id)
      }
    }

    if (isMultiple) {
      for (const id of currentIds.difference(targetIds)) {
        selectedIds.delete(id)
      }
      for (const id of targetIds.difference(currentIds)) {
        selectedIds.add(id)
      }
    } else {
      const next = targetIds.values().next().value
      const last = currentIds.values().next().value
      if (!isUndefined(last)) unselect(last)
      if (!isUndefined(next)) select(next)
    }
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

  function onboard (registrations: Partial<Z>[]): E[] {
    return registry.batch(() => registrations.map(registration => register(registration)))
  }

  function reset () {
    registry.clear()
    selectedIds.clear()
  }

  return {
    ...registry,
    disabled,
    multiple,
    selectedIds,
    selectedItems,
    selectedValues,
    register,
    unregister,
    onboard,
    offboard,
    reset,
    mandate,
    seek,
    select,
    unselect,
    toggle,
    selected,
    apply,
    get size () {
      return registry.size
    },
  } as R
}
