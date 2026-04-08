/**
 * @module createSelection
 *
 * @see https://0.vuetifyjs.com/composables/selection/create-selection
 *
 * @remarks
 * Selection composable that extends createModel with multi-select,
 * mandatory enforcement, auto-enrollment, and ticket self-methods.
 *
 * Key features:
 * - Set-based selectedIds for O(1) selection checks
 * - Single or multi-select mode
 * - Mandatory selection mode (prevents deselecting last item)
 * - Auto-enrollment option (selects non-disabled items on register)
 * - `MaybeRefOrGetter` support for `mandatory`, `multiple`, and `enroll` options
 * - Disabled item filtering
 * - Computed selectedItems and selectedValues Sets
 * - Ticket self-methods: select(), unselect(), toggle()
 *
 * Extends createModel and serves as the base for createSingle, createGroup, createStep, and useFeatures.
 */

// Composables
import { createContext, useContext } from '#v0/composables/createContext'
import { createModel } from '#v0/composables/createModel'
import { createTrinity } from '#v0/composables/createTrinity'

// Utilities
import { isUndefined, useId } from '#v0/utilities'
import { toRaw, toValue } from 'vue'

// Types
import type { ModelContext, ModelOptions, ModelTicket, ModelTicketInput } from '#v0/composables/createModel'
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { ID } from '#v0/types'
import type { MaybeRefOrGetter } from 'vue'

/**
 * Input type for selection tickets - what users provide to register().
 * Custom ticket types should extend this interface.
 *
 * @template V The type of the ticket value.
 *
 * @example
 * ```ts
 * interface MyTicket extends SelectionTicketInput {
 *   label: string
 *   disabled?: boolean
 *   metadata?: Record<string, unknown>
 * }
 *
 * const selection = createSelection<MyTicket>()
 * selection.register({ label: 'Item 1' })
 * ```
 */
export interface SelectionTicketInput<V = unknown> extends ModelTicketInput<V> {}

/**
 * Output type for selection tickets - what users receive from get().
 * Includes registry-added methods for self-selection.
 *
 * @template Z The input ticket type that extends SelectionTicketInput.
 *
 * @remarks
 * The following properties are automatically added by the registry:
 * - `disabled` - Defaults to `false` if not provided
 * - `isSelected` - Reactive boolean indicating selection state
 * - `select()` - Method to select this ticket
 * - `unselect()` - Method to unselect this ticket
 * - `toggle()` - Method to toggle selection state
 */
export type SelectionTicket<Z extends SelectionTicketInput = SelectionTicketInput> = ModelTicket<Z> & {
  /** Select self */
  select: () => void
  /** Unselect self */
  unselect: () => void
  /** Toggle self on and off */
  toggle: () => void
}

/**
 * Context returned by createSelection.
 *
 * @template Z The input ticket type (what users provide to register).
 * @template E The output ticket type (what users receive from get). Defaults to SelectionTicket<Z>.
 */
export interface SelectionContext<
  Z extends SelectionTicketInput = SelectionTicketInput,
  E extends SelectionTicket<Z> = SelectionTicket<Z>,
> extends Omit<ModelContext<Z, E>, 'register'> {
  /** Whether the selection allows multiple selections */
  multiple: MaybeRefOrGetter<boolean>
  /** Register a new ticket (accepts input type, returns output type) */
  register: (ticket?: Partial<Z>) => E
  /** Onboard multiple tickets at once */
  onboard: (registrations: Partial<Z>[]) => E[]
  /** Mandate selected ID based on "mandatory" option */
  mandate: () => void
  /** Seek for the first/last non-disabled ticket */
  seek: (direction?: 'first' | 'last', from?: number) => E | undefined
}

export interface SelectionOptions extends ModelOptions {
  /**
   * Controls mandatory selection behavior:
   * - `false` (default): No mandatory selection enforcement
   * - `true`: Prevents deselecting the last selected item
   * - `'force'`: Automatically selects the first non-disabled item on registration
   */
  mandatory?: MaybeRefOrGetter<boolean | 'force'>
  /** When true, treats the selection as an array */
  multiple?: MaybeRefOrGetter<boolean>
  /**
   * Auto-select tickets on registration
   *
   * @default false
   * @remarks Overrides createModel's default of `true`. When truthy, newly registered
   * items are automatically selected if not disabled. Respects `multiple` mode.
   */
  enroll?: MaybeRefOrGetter<boolean>
}

export interface SelectionContextOptions extends SelectionOptions {
  namespace?: string
}

/**
 * Creates a new selection instance for managing multiple selected items.
 *
 * Extends `createModel` with multi-select, mandatory enforcement,
 * auto-enrollment, and ticket self-methods.
 * Supports disabled items, mandatory selection enforcement, and auto-enrollment.
 *
 * @param options The options for the selection instance.
 * @template Z The input ticket type - what users provide to register(). Extend SelectionTicketInput to add custom properties.
 * @template E The output ticket type - what users receive from get(). Automatically includes selection methods.
 * @template R The context type. Defaults to SelectionContext<Z, E>.
 * @returns A new selection instance with selection management methods.
 *
 * @remarks
 * **Key Features:**
 * - Multi-selection support (unlike `createSingle` which enforces single selection)
 * - Set-based `selectedIds` tracking for efficient lookups
 * - Computed `selectedItems` and `selectedValues` for reactive access
 * - Each ticket gets `isSelected`, `select()`, `unselect()`, and `toggle()` methods
 * - Disabled items cannot be selected
 * - Mandatory mode prevents deselecting the last item
 * - Force mode auto-selects first non-disabled item on registration
 * - Enroll option auto-selects all non-disabled items on registration
 *
 * **Inheritance Chain:**
 * `createRegistry` → `createModel` → `createSelection` → `createSingle`/`createGroup` → `createStep`
 *
 * @see https://0.vuetifyjs.com/composables/selection/create-selection
 *
 * @example
 * ```ts
 * import { createSelection } from '@vuetify/v0'
 *
 * // Basic usage
 * const selection = createSelection({ mandatory: true })
 *
 * selection.onboard([
 *   { id: 'item-1', value: 'Item 1' },
 *   { id: 'item-2', value: 'Item 2', disabled: true },
 *   { id: 'item-3', value: 'Item 3' },
 * ])
 *
 * selection.select('item-1')
 * selection.select('item-3')
 *
 * console.log(selection.selectedIds) // Set { 'item-1', 'item-3' }
 * console.log(Array.from(selection.selectedValues.value)) // ['Item 1', 'Item 3']
 * ```
 *
 * @example
 * ```ts
 * // With custom ticket type
 * interface MyTicket extends SelectionTicketInput {
 *   label: string
 *   icon?: string
 * }
 *
 * const tabs = createSelection<MyTicket>()
 *
 * tabs.register({ label: 'Home', icon: 'mdi-home' })
 * tabs.register({ label: 'Settings' })
 *
 * const ticket = tabs.get('...')
 * // ticket has: label, icon, isSelected, select(), unselect(), toggle()
 * ```
 */
export function createSelection<
  Z extends SelectionTicketInput = SelectionTicketInput,
  E extends SelectionTicket<Z> = SelectionTicket<Z>,
  R extends SelectionContext<Z, E> = SelectionContext<Z, E>,
> (_options: SelectionOptions = {}): R {
  const {
    enroll = false,
    mandatory = false,
    multiple = false,
    ...options
  } = _options

  const model = createModel<Z, E>({ ...options, multiple, enroll: false })

  function seek (direction: 'first' | 'last' = 'first', from?: number): E | undefined {
    return model.seek(direction, from, (ticket: E) => !toValue(ticket.disabled))
  }

  function mandate () {
    if (!toValue(mandatory) || model.size === 0 || model.selectedIds.size > 0) return

    const ticket = seek('first')

    if (ticket) model.select(ticket.id)
  }

  function unselect (id: ID) {
    if (toValue(model.disabled)) return
    if (toValue(mandatory) && model.selectedIds.size === 1) return

    model.selectedIds.delete(id)
  }

  function toggle (id: ID) {
    if (toValue(model.disabled)) return

    if (model.selectedIds.has(id)) unselect(id)
    else model.select(id)
  }

  function apply (values: unknown[], options?: { multiple?: boolean }): void {
    const isMultiple = options?.multiple ?? toValue(multiple)
    const currentIds = new Set(model.selectedIds)
    const targetIds = new Set<ID>()

    for (const value of values) {
      const ids = model.browse(toRaw(value))
      if (ids) {
        for (const id of ids) targetIds.add(id)
      }
    }

    if (isMultiple) {
      for (const id of currentIds.difference(targetIds)) {
        model.selectedIds.delete(id)
      }
      for (const id of targetIds.difference(currentIds)) {
        model.selectedIds.add(id)
      }
    } else {
      const next = targetIds.values().next().value
      const last = currentIds.values().next().value
      if (!isUndefined(last)) unselect(last)
      if (!isUndefined(next)) model.select(next)
    }
  }

  function register (registration: Partial<Z> = {}): E {
    const id = registration.id ?? useId()
    const decorated: Partial<Z> = {
      select: () => model.select(id),
      unselect: () => unselect(id),
      toggle: () => toggle(id),
      ...registration,
      id,
    } as Partial<Z>

    const ticket = model.register(decorated)

    if (toValue(enroll) && !toValue(model.disabled) && !toValue(ticket.disabled)) {
      model.select(ticket.id)
    }
    if (toValue(mandatory) === 'force') mandate()

    return ticket
  }

  function onboard (registrations: Partial<Z>[]): E[] {
    const tickets = model.batch(() => registrations.map(registration => register(registration)))
    if (toValue(mandatory) === 'force') mandate()
    return tickets
  }

  return {
    ...model,
    multiple,
    register,
    onboard,
    unselect,
    toggle,
    apply,
    mandate,
    seek,
    get size () {
      return model.size
    },
  } as R
}

/**
 * Creates a new selection context.
 *
 * @param options The options for the selection context.
 * @template Z The input ticket type - what users provide to register().
 * @template E The output ticket type - what users receive from get().
 * @template R The context type. Defaults to SelectionContext<Z, E>.
 * @returns A new selection context.
 *
 * @see https://0.vuetifyjs.com/composables/selection/create-selection
 *
 * @example
 * ```ts
 * import { createSelectionContext } from '@vuetify/v0'
 *
 * // With default namespace 'v0:selection'
 * export const [useCheckboxes, provideCheckboxes, checkboxes] = createSelectionContext()
 *
 * // Or with custom namespace
 * export const [useCheckboxes, provideCheckboxes, checkboxes] = createSelectionContext({ namespace: 'checkboxes' })
 *
 * // In a parent component:
 * provideCheckboxes()
 *
 * // In a child component:
 * const checkboxes = useCheckboxes()
 * checkboxes.select('checkbox-1')
 * ```
 *
 * @example
 * ```ts
 * // With custom ticket type
 * interface TabTicket extends SelectionTicketInput {
 *   label: string
 *   icon?: string
 * }
 *
 * export const [useTabs, provideTabs, tabs] = createSelectionContext<TabTicket>()
 * ```
 */
export function createSelectionContext<
  Z extends SelectionTicketInput = SelectionTicketInput,
  E extends SelectionTicket<Z> = SelectionTicket<Z>,
  R extends SelectionContext<Z, E> = SelectionContext<Z, E>,
> (_options: SelectionContextOptions = {}): ContextTrinity<R> {
  const { namespace = 'v0:selection', ...options } = _options
  const [useSelectionContext, provideSelectionContext] = createContext<R>(namespace)
  const context = createSelection<Z, E, R>(options)

  return createTrinity<R>(useSelectionContext, provideSelectionContext, context)
}

/**
 * Returns the current selection instance.
 *
 * @param namespace The namespace for the selection context. Defaults to `'v0:selection'`.
 * @template Z The input ticket type.
 * @template E The output ticket type.
 * @template R The context type.
 * @returns The current selection instance.
 *
 * @see https://0.vuetifyjs.com/composables/selection/create-selection
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { useSelection } from '@vuetify/v0'
 *
 *   const selection = useSelection()
 * </script>
 *
 * <template>
 *   <div>
 *     <p>Selected: {{ selection.selectedIds.size }}</p>
 *   </div>
 * </template>
 * ```
 */
export function useSelection<
  Z extends SelectionTicketInput = SelectionTicketInput,
  E extends SelectionTicket<Z> = SelectionTicket<Z>,
  R extends SelectionContext<Z, E> = SelectionContext<Z, E>,
> (namespace = 'v0:selection'): R {
  return useContext<R>(namespace)
}
