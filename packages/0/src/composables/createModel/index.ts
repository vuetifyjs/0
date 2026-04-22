/**
 * @module createModel
 *
 * @see https://0.vuetifyjs.com/composables/selection/create-model
 *
 * @remarks
 * Value store layer that extends createRegistry with a reactive Set of
 * selected IDs, disabled guards, and an `apply` bridge for useProxyModel sync.
 *
 * Think of it as a creative way to store a single value — more like
 * `defineModel` than `createSelection`. Selection-specific concepts
 * (mandatory) belong in createSelection. The `multiple` option here
 * controls whether `select()` accumulates or replaces. The `enroll` option
 * auto-selects items on register.
 *
 * Both Selection and Slider extend this layer:
 * - createRegistry → createModel → createSelection → createSingle/createGroup/createStep
 * - createRegistry → createModel → createSlider (values override)
 *
 * @example
 * ```ts
 * import { createModel } from '@vuetify/v0'
 *
 * const model = createModel({ multiple: false })
 * model.register({ value: 'apple' })
 * model.select(model.values()[0]!.id)
 * ```
 */

// Composables
import { createRegistry } from '#v0/composables/createRegistry'

// Utilities
import { isUndefined, resolveIds, useId } from '#v0/utilities'
import { computed, isRef, shallowReactive, toRef, toRaw, toValue } from 'vue'

// Types
import type { RegistryContext, RegistryOptions, RegistryTicket, RegistryTicketInput } from '#v0/composables/createRegistry'
import type { ID } from '#v0/types'
import type { ComputedRef, MaybeRefOrGetter, Reactive, Ref } from 'vue'

/**
 * Input type for model tickets - what users provide to register().
 *
 * @template V The type of the ticket value.
 */
export interface ModelTicketInput<V = unknown> extends RegistryTicketInput<V> {
  /** Disabled state of the ticket (optional on input, defaults to false) */
  disabled?: MaybeRefOrGetter<boolean>
}

/**
 * Output type for model tickets - what users receive from get().
 *
 * @template Z The input ticket type that extends ModelTicketInput.
 */
export type ModelTicket<Z extends ModelTicketInput = ModelTicketInput> = RegistryTicket & Z & {
  /** Disabled state of the ticket (guaranteed to exist on output) */
  disabled: MaybeRefOrGetter<boolean>
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
   * console.log(model.selectedIds.has('a')) // true (enrolled on register)
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
  selectedValues: ComputedRef<Set<E['value'] extends Ref<infer U> ? U : E['value']>>
  /**
   * Disabled state for the entire model instance
   *
   * @remarks When truthy, all selection operations (`select`, `unselect`, `toggle`) are silently
   * skipped. Accepts a static boolean, a ref, or a getter for reactive disabled state.
   *
   * @see https://0.vuetifyjs.com/composables/selection/create-model
   */
  disabled: MaybeRefOrGetter<boolean>
  /**
   * Reset selection state without destroying the registry
   *
   * @remarks Clears `selectedIds` only — registered tickets are preserved.
   * Use `clear()` to destroy both selection state and the registry.
   *
   * @example
   * ```ts
   * const model = createModel()
   * model.register({ id: 'a', value: 'Apple' })
   * model.select('a')
   * model.reset()
   * console.log(model.size) // 1 (tickets preserved)
   * console.log(model.selectedIds.size) // 0
   * ```
   */
  reset: () => void
  /**
   * Select a ticket by ID
   *
   * @param id The ID of the ticket to select.
   * @remarks When `multiple` is `false` (default), clears `selectedIds` before adding the new ID.
   * When `multiple` is `true`, accumulates without clearing.
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
   * @param options Optional. Accepted for interface compatibility with `createSelection`; ignored at this layer.
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
   * model.register({ id: 'fruit', value }) // enrolled automatically
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
   * console.log(ticket.isSelected.value) // true (enrolled by default)
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
  /**
   * Auto-select tickets on registration
   *
   * @default true
   * @remarks When truthy, newly registered tickets are automatically selected via `select()`,
   * subject to disabled guards (both instance-level and ticket-level). With single-value
   * semantics, only the most recently registered ticket remains active.
   *
   * `createSelection` overrides this to `false` and handles enrollment with its own
   * `multiple`-aware logic.
   */
  enroll?: MaybeRefOrGetter<boolean>
  /**
   * Allow multiple tickets to be selected simultaneously
   *
   * @default false
   * @remarks When `true`, `select()` accumulates IDs instead of clearing before adding.
   * Used by createSlider where all thumbs must stay selected.
   */
  multiple?: MaybeRefOrGetter<boolean>
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
 * **Enrollment**: Tickets are auto-selected on registration by default (`enroll: true`).
 * With single-value semantics, only the most recently registered ticket is active.
 * Pass `enroll: false` to opt out. `createSelection` overrides this to `false`.
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
    enroll = true,
    multiple = false,
    ...options
  } = _options

  const registry = createRegistry<Z, E>(options)
  const selectedIds = shallowReactive(new Set<ID>())

  const selectedItems = computed(() => new Set(resolveIds(selectedIds, registry.get)))

  const selectedValues = computed(() => {
    return new Set(
      Array.from(selectedItems.value).map(item => toValue(item.value)),
    )
  })

  function select (id: ID) {
    if (toValue(disabled)) return

    const item = registry.get(id)
    if (!item || toValue(item.disabled)) return

    if (!toValue(multiple)) selectedIds.clear()
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
    if (!toValue(multiple)) selectedIds.clear()
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

    const ticket = registry.register(item)

    if (toValue(enroll) && !toValue(disabled) && !toValue(ticket.disabled)) {
      select(id)
    }

    return ticket
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

  function reset () {
    selectedIds.clear()
  }

  function clear () {
    reset()
    registry.clear()
  }

  function dispose () {
    reset()
    registry.dispose()
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
    dispose,
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
