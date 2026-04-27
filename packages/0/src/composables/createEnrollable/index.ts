/**
 * @module createEnrollable
 *
 * @internal
 *
 * @remarks
 * Extracts the dual-mode (group or standalone) toggleable-root pattern shared by
 * Checkbox, Switch, Toggle, and similar binary controls. Given a model ref and an
 * optional parent group context, returns reactive state and mutation methods that
 * automatically route through the group ticket when enrolled, or fall back to the
 * model ref when standalone.
 *
 * Responsibilities:
 * - Registers with the group when one is provided, yielding a ticket.
 * - Computes `isChecked`, `isMixed`, and `isDisabled` from whichever source is active.
 * - Routes `toggle` / `select` / `unselect` / `mix` / `unmix` to the ticket or model.
 * - Guards every mutation with the resolved disabled state.
 *
 * Non-responsibilities:
 * - No DOM, no DI, no lifecycle. Callers own `onBeforeUnmount` / `group.unregister`.
 * - Caller resolves the optional group (typically via `useXGroup` inside a try/catch);
 *   `createEnrollable` only accepts the resolved context or `null`.
 *
 * @example
 * ```ts
 * import { createEnrollable } from '@vuetify/v0'
 *
 * let group: GroupContext<GroupTicket> | null = null
 * try { group = useCheckboxGroup(groupNamespace) } catch { }
 *
 * const model = defineModel<boolean>()
 *
 * const enrollable = createEnrollable({
 *   id,
 *   value,
 *   disabled,
 *   indeterminate,
 *   model,
 *   group,
 * })
 * ```
 */

// Utilities
import { toRef, toValue } from 'vue'

// Types
import type { GroupContext, GroupTicket } from '#v0/composables/createGroup'
import type { ID } from '#v0/types'
import type { MaybeRefOrGetter, Ref } from 'vue'

/**
 * Options for {@link createEnrollable}.
 *
 * @template V The type of the underlying value carried by the enrollable.
 *
 * @example
 * ```ts
 * const options: EnrollableOptions<string> = {
 *   id: 'apple',
 *   value: 'apple',
 *   disabled: () => props.disabled,
 *   indeterminate: false,
 *   model: defineModel<boolean>(),
 *   group: null,
 * }
 * ```
 */
export interface EnrollableOptions<V = unknown> {
  /** Unique identifier used for group registration. */
  id: ID
  /** Value associated with this item (only meaningful in group mode). */
  value?: V
  /** Reactive disabled flag. */
  disabled?: MaybeRefOrGetter<boolean>
  /** Reactive indeterminate flag. Standalone mode reads this directly; group mode forwards it to the ticket. */
  indeterminate?: MaybeRefOrGetter<boolean>
  /** Boolean ref from the consumer's `defineModel<boolean>()`. */
  model: Ref<boolean | undefined>
  /**
   * Optional parent group. Pass `null` for standalone mode.
   *
   * @remarks The caller is responsible for resolving the group (typically via a
   * `useXGroup(namespace)` call wrapped in try/catch). `createEnrollable` itself
   * never injects.
   */
  group: GroupContext<GroupTicket> | null
}

/**
 * Context returned by {@link createEnrollable}.
 *
 * @template V The type of the underlying value carried by the enrollable.
 *
 * @example
 * ```ts
 * const enrollable: EnrollableContext<string> = createEnrollable({ ... })
 * enrollable.toggle()
 * enrollable.isChecked.value // reactive
 * ```
 */
export interface EnrollableContext<V = unknown> {
  /** The id passed in options. */
  id: ID
  /** The value passed in options. */
  value: V | undefined
  /** The group ticket when enrolled, `null` when standalone. */
  ticket: GroupTicket | null
  /** Whether the item is currently selected / on. */
  isChecked: Readonly<Ref<boolean>>
  /** Whether the item is in a mixed (indeterminate) state. Always `false` when standalone unless `indeterminate` is truthy. */
  isMixed: Readonly<Ref<boolean>>
  /** Resolved disabled state. Combines own `disabled` with `group.disabled` when enrolled. */
  isDisabled: Readonly<Ref<boolean>>
  /** Select the item. Routes to `ticket.select()` when enrolled, else sets `model.value = true`. */
  select: () => void
  /** Unselect the item. Routes to `ticket.unselect()` when enrolled, else sets `model.value = false`. */
  unselect: () => void
  /** Toggle the item. Routes to `ticket.toggle()` when enrolled, else flips `model.value`. */
  toggle: () => void
  /** Set the item to mixed state. No-op in standalone mode (no mixed state without a group). */
  mix: () => void
  /** Clear the mixed state. No-op in standalone mode. */
  unmix: () => void
}

/**
 * Factory for the dual-mode (group or standalone) toggleable pattern used by
 * Checkbox, Switch, Toggle, and similar binary controls.
 *
 * @param options See {@link EnrollableOptions}.
 * @template V The underlying value type.
 * @returns See {@link EnrollableContext}.
 *
 * @internal
 *
 * @example
 * ```ts
 * import { createEnrollable } from '@vuetify/v0'
 *
 * const model = defineModel<boolean>()
 *
 * const { isChecked, isDisabled, toggle } = createEnrollable({
 *   id: useId(),
 *   model,
 *   group: null,
 * })
 * ```
 */
export function createEnrollable<V = unknown> (options: EnrollableOptions<V>): EnrollableContext<V> {
  const { id, value, disabled, indeterminate, model, group } = options

  const ticket = group?.register({ id, value, disabled, indeterminate }) ?? null

  const isChecked = toRef(() => ticket
    ? toValue(ticket.isSelected)
    : model.value ?? false,
  )

  const isMixed = toRef(() => ticket
    ? toValue(ticket.isMixed)
    : toValue(indeterminate) ?? false,
  )

  const isDisabled = toRef(() => group && ticket
    ? toValue(ticket.disabled) || toValue(group.disabled)
    : toValue(disabled) ?? false,
  )

  function toggle () {
    if (isDisabled.value) return

    if (ticket) ticket.toggle()
    else model.value = !model.value
  }

  function select () {
    if (isDisabled.value) return

    if (ticket) ticket.select()
    else model.value = true
  }

  function unselect () {
    if (isDisabled.value) return

    if (ticket) ticket.unselect()
    else model.value = false
  }

  function mix () {
    if (isDisabled.value || !ticket) return

    ticket.mix()
  }

  function unmix () {
    if (isDisabled.value || !ticket) return

    ticket.unmix()
  }

  return {
    id,
    value,
    ticket,
    isChecked,
    isMixed,
    isDisabled,
    select,
    unselect,
    toggle,
    mix,
    unmix,
  }
}
