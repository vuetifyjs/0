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
import { computed, isRef, shallowReactive, toRef, toRaw, toValue } from 'vue'

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
> extends Omit<RegistryContext<Z, E>, 'register'> {
  /**
   * Set of currently selected ticket IDs
   *
   * @remarks Reactive via `shallowReactive(new Set())`. Mutating this Set directly is supported —
   * `selectedItems` and `selectedValues` will update accordingly. Ghost IDs (IDs not in the registry)
   * are silently filtered out by the computed properties.
   *
   * @example
   * ```ts
   * const model = createModel()
   * model.register({ id: 'a', value: 'Apple' })
   * model.select('a')
   * console.log(model.selectedIds.has('a')) // true
   * ```
   */
  selectedIds: Reactive<Set<ID>>
  /**
   * Computed Set of selected ticket instances
   *
   * @remarks Derived from `selectedIds`. Maps each ID to its ticket via `registry.get()` and
   * filters out any IDs that no longer exist in the registry.
   *
   * @example
   * ```ts
   * const model = createModel()
   * model.register({ id: 'a', value: 'Apple' })
   * model.select('a')
   * const items = Array.from(model.selectedItems.value)
   * console.log(items[0].id) // 'a'
   * ```
   */
  selectedItems: ComputedRef<Set<E>>
  /**
   * Computed Set of selected ticket values
   *
   * @remarks Derived from `selectedItems`. Unwraps ref values via `toValue()` — if a ticket's
   * value is `ref('Apple')`, the Set contains `'Apple'`, not the Ref wrapper.
   *
   * @example
   * ```ts
   * import { shallowRef } from 'vue'
   * import { createModel } from '@vuetify/v0'
   *
   * const model = createModel()
   * model.register({ id: 'a', value: shallowRef('Apple') })
   * model.select('a')
   * console.log([...model.selectedValues.value]) // ['Apple']
   * ```
   */
  selectedValues: ComputedRef<Set<E['value']>>
  /**
   * Disabled state for the entire model instance
   *
   * @remarks When truthy, all selection operations (`select`, `unselect`, `toggle`) are silently
   * skipped. Accepts a static boolean or a reactive `MaybeRef<boolean>`.
   *
   * @see https://0.vuetifyjs.com/composables/selection/create-model
   */
  disabled: MaybeRef<boolean>
  /**
   * Clear all selected IDs and the underlying registry
   *
   * @remarks Calls `registry.clear()` and `selectedIds.clear()`. After reset, `size` is 0
   * and all computed properties return empty Sets.
   *
   * @example
   * ```ts
   * const model = createModel()
   * model.register({ id: 'a', value: 'Apple' })
   * model.select('a')
   * model.reset()
   * console.log(model.size) // 0
   * console.log(model.selectedIds.size) // 0
   * ```
   */
  reset: () => void
  /**
   * Select a ticket by ID
   *
   * @param id The ID of the ticket to select.
   * @remarks Single-value semantics: clears `selectedIds` before adding the new ID.
   * No-op if the model instance is disabled, the ticket doesn't exist, or the ticket is disabled.
   *
   * @see https://0.vuetifyjs.com/composables/selection/create-model
   *
   * @example
   * ```ts
   * const model = createModel()
   * model.register({ id: 'a', value: 'Apple' })
   * model.register({ id: 'b', value: 'Banana' })
   * model.select('a')
   * model.select('b') // clears 'a', selects 'b'
   * console.log(model.selectedIds.size) // 1
   * ```
   */
  select: (id: ID) => void
  /**
   * Unselect a ticket by ID
   *
   * @param id The ID of the ticket to unselect.
   * @remarks Removes the ID from `selectedIds`. No-op if the model instance is disabled.
   *
   * @example
   * ```ts
   * model.select('a')
   * model.unselect('a')
   * console.log(model.selectedIds.size) // 0
   * ```
   */
  unselect: (id: ID) => void
  /**
   * Toggle a ticket's selection state
   *
   * @param id The ID of the ticket to toggle.
   * @remarks Calls `select(id)` if not selected, `unselect(id)` if already selected.
   * No-op if the model instance is disabled.
   *
   * @example
   * ```ts
   * model.toggle('a') // selects
   * model.toggle('a') // unselects
   * ```
   */
  toggle: (id: ID) => void
  /**
   * Check if a ticket is currently selected
   *
   * @param id The ID of the ticket to check.
   * @returns `true` if the ID is in `selectedIds`.
   *
   * @example
   * ```ts
   * model.select('a')
   * console.log(model.selected('a')) // true
   * console.log(model.selected('b')) // false
   * ```
   */
  selected: (id: ID) => boolean
  /**
   * Apply external values to the model
   *
   * @param values Array of values to apply. Only `values[0]` is used (single-value store).
   * @param options Options for API compatibility with createSelection. The `multiple` field is accepted but ignored.
   * @remarks Used internally by `useProxyModel` to sync a ref with the model. Executes two steps sequentially:
   * 1. **Ref write**: Writes `values[0]` to any selected ticket whose value is a ref.
   * 2. **Browse resolution**: Clears `selectedIds`, resolves `values[0]` via `registry.browse()`, and selects the match.
   *
   * For ref-valued tickets, browse typically finds no match (the catalog indexes by the ref object,
   * not the unwrapped value), so `selectedIds` will be empty after apply.
   *
   * @see https://0.vuetifyjs.com/composables/selection/create-model
   *
   * @example
   * ```ts
   * import { shallowRef } from 'vue'
   * import { createModel } from '@vuetify/v0'
   *
   * const value = shallowRef('Apple')
   * const model = createModel()
   * model.register({ id: 'fruit', value })
   * model.select('fruit')
   *
   * model.apply(['Banana']) // value.value is now 'Banana'
   * ```
   */
  apply: (values: unknown[], options?: { multiple?: boolean }) => void
  /**
   * Register a new ticket
   *
   * @param ticket Partial ticket data. ID is auto-generated if not provided. Disabled defaults to `false`.
   * @returns The registered ticket with `isSelected` computed ref attached.
   * @remarks Delegates to `registry.register()` after adding model-specific fields (`disabled`, `isSelected`).
   *
   * @see https://0.vuetifyjs.com/composables/selection/create-model
   *
   * @example
   * ```ts
   * import { shallowRef } from 'vue'
   * import { createModel } from '@vuetify/v0'
   *
   * const model = createModel()
   * const ticket = model.register({ id: 'fruit', value: shallowRef('Apple') })
   *
   * console.log(ticket.id) // 'fruit'
   * console.log(ticket.isSelected.value) // false
   * console.log(ticket.disabled) // false
   * ```
   */
  register: (registration?: Partial<Z>) => E
  /**
   * Onboard multiple tickets at once
   *
   * @param registrations An array of partial ticket data to register.
   * @returns The registered tickets with model-specific fields attached.
   * @remarks Delegates to the model's `register` (not the registry's) so each ticket
   * receives `disabled` and `isSelected`. Runs inside `registry.batch()` for performance.
   */
  onboard: (registrations: Partial<Z>[]) => E[]
}

export interface ModelOptions extends RegistryOptions {
  /**
   * Disabled state for the entire model instance
   *
   * @default false
   * @remarks When truthy, all selection operations are silently skipped. Accepts a static
   * boolean, a ref, or a getter for reactive disabled state.
   *
   * @example
   * ```ts
   * import { createModel } from '@vuetify/v0'
   *
   * // Static
   * const model = createModel({ disabled: true })
   *
   * // Reactive
   * const disabled = ref(false)
   * const model = createModel({ disabled })
   * ```
   */
  disabled?: MaybeRefOrGetter<boolean>
}

/**
 * Creates a new model instance for storing a single value.
 *
 * @param options The options for the model instance.
 * @template Z The input ticket type. Extend {@link ModelTicketInput} to add custom properties.
 * @template E The output ticket type. Automatically includes `disabled` and `isSelected`.
 * @template R The context type. Defaults to {@link ModelContext}<Z, E>.
 * @returns A new model instance with selection tracking and disabled guards.
 *
 * @remarks
 * Extends createRegistry with value tracking via a reactive Set of selected IDs.
 * Provides the shared model-value concept used by both Selection and Slider.
 *
 * **Single-value semantics**: `select()` always clears before adding — only one ticket
 * is active at a time. For multi-value behavior, use `createSelection`.
 *
 * **Apply bridge**: `useProxyModel` calls `apply()` to sync a ref with the model.
 * When the active ticket's value is a ref, `apply` writes to it directly. Otherwise,
 * it resolves via `registry.browse()`.
 *
 * @see https://0.vuetifyjs.com/composables/selection/create-model
 *
 * @example
 * ```ts
 * import { shallowRef } from 'vue'
 * import { createModel, useProxyModel } from '@vuetify/v0'
 *
 * const value = shallowRef('Apple')
 * const model = createModel({ events: true })
 *
 * model.register({ id: 'fruit', value })
 * useProxyModel(model, value)
 *
 * // value and model stay in sync bidirectionally
 * ```
 *
 * @example
 * ```ts
 * // Disabled model — all selection operations are no-ops
 * const model = createModel({ disabled: true })
 * model.register({ id: 'a', value: shallowRef('Apple') })
 * model.select('a') // no-op
 * ```
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

  const registry = createRegistry<Z, E>(options)
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
      Array.from(selectedItems.value).map(item => toValue(item.value)),
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
    const value = values[0]

    // If the selected ticket's value is a ref, update it directly
    for (const id of selectedIds) {
      const item = registry.get(id)
      if (!item || !isRef(item.value)) continue

      item.value.value = value
    }

    // Fallback: browse resolution for static values
    selectedIds.clear()
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

  function onboard (registrations: Partial<Z>[]): E[] {
    return registry.batch(() => registrations.map(r => register(r)))
  }

  function offboard (ids: ID[]) {
    for (const id of ids) {
      selectedIds.delete(id)
    }
    registry.offboard(ids)
  }

  function clear () {
    selectedIds.clear()
    registry.clear()
  }

  function reset () {
    selectedIds.clear()
    registry.clear()
  }

  return {
    ...registry,
    disabled,
    selectedIds,
    selectedItems,
    selectedValues,
    register,
    onboard,
    unregister,
    offboard,
    clear,
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
