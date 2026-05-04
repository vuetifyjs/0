/**
 * @module createCombobox
 *
 * @see https://0.vuetifyjs.com/composables/forms/create-combobox
 *
 * @remarks
 * Orchestrator composable that coordinates selection, popover, and virtual focus
 * for a combobox (autocomplete/typeahead) pattern. Does not extend the selection
 * chain — it composes existing primitives instead.
 *
 * Key features:
 * - Adapter-based filtering (client-side or server-side via ClientAdapter/ServerAdapter)
 * - Single or multi-select mode
 * - Virtual focus keyboard navigation (aria-activedescendant pattern)
 * - Strict mode: reverts query to selected value on close if no match
 * - Popover-based dropdown positioning
 * - Context DI via createComboboxContext / useCombobox
 *
 * @example
 * ```ts
 * import { createCombobox } from '@vuetify/v0'
 *
 * const combobox = createCombobox({ strict: true })
 * combobox.selection.register({ value: 'Apple' })
 * combobox.selection.register({ value: 'Banana' })
 * combobox.open()
 * ```
 */

// Composables
import { useContext } from '#v0/composables/createContext'
import { createSelection } from '#v0/composables/createSelection'
import { createTrinity } from '#v0/composables/createTrinity'
import { usePopover } from '#v0/composables/usePopover'
import { useVirtualFocus } from '#v0/composables/useVirtualFocus'

// Adapters
import { ClientAdapter } from './adapters'

// Transformers
import { toArray } from '#v0/composables/toArray'

// Globals
import { IN_BROWSER } from '#v0/constants/globals'

// Utilities
import { isUndefined, useId } from '#v0/utilities'
import { computed, shallowRef, toRef, toValue, watch } from 'vue'

// Types
import type { SelectionContext } from '#v0/composables/createSelection'
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { PopoverReturn } from '#v0/composables/usePopover'
import type { VirtualFocusReturn } from '#v0/composables/useVirtualFocus'
import type { MaybeArray, ID } from '#v0/types'
import type { ComboboxAdapterInterface } from './adapters'
import type { MaybeRefOrGetter, Ref, ShallowRef } from 'vue'

export type { ComboboxAdapterContext, ComboboxAdapterInterface, ComboboxAdapterResult } from './adapters'

export interface ComboboxOptions {
  multiple?: MaybeRefOrGetter<boolean>
  mandatory?: MaybeRefOrGetter<boolean>
  disabled?: MaybeRefOrGetter<boolean>
  strict?: MaybeRefOrGetter<boolean>
  error?: MaybeRefOrGetter<boolean>
  errorMessages?: MaybeRefOrGetter<MaybeArray<string> | undefined>
  adapter?: ComboboxAdapterInterface
  displayValue?: (value: unknown) => string
  id?: string
  name?: string
  form?: string
}

export interface ComboboxContext {
  selection: SelectionContext
  popover: PopoverReturn
  cursor: VirtualFocusReturn
  query: ShallowRef<string>
  display: Readonly<Ref<string>>
  pristine: ShallowRef<boolean>
  filtered: Ref<Set<ID>>
  isEmpty: Ref<boolean>
  isLoading: ShallowRef<boolean>
  isOpen: ShallowRef<boolean>
  id: string
  inputId: string
  listboxId: string
  descriptionId: string
  errorId: string
  hasDescription: ShallowRef<boolean>
  hasError: ShallowRef<boolean>
  errors: Readonly<Ref<string[]>>
  isValid: Readonly<Ref<boolean | null>>
  inputEl: ShallowRef<HTMLElement | null>
  multiple: boolean
  strict: MaybeRefOrGetter<boolean>
  disabled: MaybeRefOrGetter<boolean>
  name: string | undefined
  form: string | undefined
  open: () => void
  close: () => void
  toggle: () => void
  select: (id: ID) => void
  clear: () => void
}

/**
 * Creates a combobox context that orchestrates selection, popover, virtual
 * focus, and adapter-based filtering into a single coordinated state.
 *
 * @param options - Configuration for selection mode, filtering adapter, and behavior.
 * @returns A combobox context with all composed systems and action methods.
 *
 * @see https://0.vuetifyjs.com/composables/forms/create-combobox
 *
 * @example
 * ```ts
 * import { createCombobox } from '@vuetify/v0'
 *
 * const combobox = createCombobox({ strict: true })
 *
 * combobox.selection.register({ id: 'a', value: 'Apple' })
 * combobox.selection.register({ id: 'b', value: 'Banana' })
 *
 * combobox.open()
 * combobox.select('a') // query → 'Apple', dropdown closes
 * ```
 */
export function createCombobox (options: ComboboxOptions = {}): ComboboxContext {
  const {
    multiple = false,
    mandatory = false,
    disabled = false,
    strict = false,
    error = false,
    errorMessages,
    adapter,
    displayValue = v => String(v ?? ''),
    id: _id,
    name,
    form,
  } = options

  const id = _id ?? useId()
  const inputId = `${id}-input`
  const listboxId = `${id}-listbox`
  const descriptionId = `${id}-description`
  const errorId = `${id}-error`
  const hasDescription = shallowRef(false)
  const hasError = shallowRef(false)

  const errors = computed(() => {
    const messages = toValue(errorMessages)
    return messages ? toArray(messages) : []
  })

  const isValid = toRef((): boolean | null => {
    if (toValue(error)) return false
    if (errors.value.length > 0) return false
    return null
  })

  const selection = createSelection({
    multiple,
    mandatory,
    disabled: toRef(() => toValue(disabled)),
    events: true,
  })

  const query = shallowRef('')
  const pristine = shallowRef(true)
  const inputEl = shallowRef<HTMLElement | null>(null)

  // items for the adapter — track registration events to trigger reactivity
  // since selection.values() is not natively reactive
  const version = shallowRef(0)
  selection.on('register:ticket', () => {
    version.value++
  })
  selection.on('unregister:ticket', () => {
    version.value++
  })
  const items = computed(() => {
    void version.value
    return [...selection.values()]
  })

  // Setup adapter (defaults to ClientAdapter for local filtering)
  const { filtered, isLoading, isEmpty } = (adapter ?? new ClientAdapter()).setup({ query, items })

  const popover = usePopover({ id })
  const isOpen = popover.isOpen

  const cursor = useVirtualFocus(
    () => selection.values()
      .filter(ticket => filtered.value.has(ticket.id) && !toValue(ticket.disabled))
      .map(ticket => ({
        id: ticket.id,
        el: () => IN_BROWSER ? document.querySelector<HTMLElement>(`#${CSS.escape(`${id}-option-${ticket.id}`)}`) : null,
        disabled: ticket.disabled,
      })),
    {
      control: inputEl,
      target: () => null,
      orientation: 'vertical',
    },
  )

  const selectedId = toRef(() => selection.selectedIds.values().next().value as ID | undefined)

  const display = toRef(() => {
    if (!pristine.value) return query.value
    if (toValue(multiple)) return query.value
    const ticket = isUndefined(selectedId.value) ? undefined : selection.get(selectedId.value)
    return ticket ? displayValue(ticket.value) : ''
  })

  function open () {
    if (!isOpen.value && !toValue(disabled)) {
      isOpen.value = true
    }
  }

  function close () {
    query.value = ''
    pristine.value = true
    isOpen.value = false
  }

  function toggle () {
    if (isOpen.value) close()
    else open()
  }

  function select (itemId: ID) {
    if (toValue(multiple)) {
      selection.toggle(itemId)
      query.value = ''
      pristine.value = true
      cursor.highlight(itemId)
      inputEl.value?.focus()
    } else {
      selection.select(itemId)
      query.value = ''
      pristine.value = true
      close()
    }
  }

  function clear () {
    query.value = ''
    pristine.value = true
    for (const id of Array.from(selection.selectedIds)) {
      selection.unselect(id)
    }
  }

  watch(isOpen, open => {
    if (!open) {
      cursor.clear()
    }
  })

  return {
    selection,
    popover,
    cursor,
    query,
    display,
    pristine,
    filtered,
    isEmpty,
    isLoading,
    isOpen,
    id,
    inputId,
    listboxId,
    descriptionId,
    errorId,
    hasDescription,
    hasError,
    errors,
    isValid,
    inputEl,
    multiple: toValue(multiple),
    strict,
    disabled,
    name,
    form,
    open,
    close,
    toggle,
    select,
    clear,
  }
}

/**
 * Creates a combobox context with dependency injection support.
 *
 * @param options - Combobox options plus an optional namespace for DI.
 * @returns A context trinity: `[useCombobox, provideCombobox, defaultCombobox]`.
 *
 * @see https://0.vuetifyjs.com/composables/forms/create-combobox
 *
 * @example
 * ```ts
 * import { createComboboxContext } from '@vuetify/v0'
 *
 * const [useCombobox, provideCombobox, combobox] = createComboboxContext({
 *   namespace: 'my-combobox',
 *   strict: true,
 * })
 * ```
 */
export function createComboboxContext (
  options: ComboboxOptions & { namespace?: string } = {},
): ContextTrinity<ComboboxContext> {
  const { namespace = 'v0:combobox', ...rest } = options
  const context = createCombobox(rest)

  return createTrinity<ComboboxContext>(namespace, context)
}

/**
 * Injects the current combobox context from a parent provider.
 *
 * @param namespace - DI namespace. Defaults to `'v0:combobox'`.
 * @returns The combobox context from the nearest provider.
 *
 * @see https://0.vuetifyjs.com/composables/forms/create-combobox
 *
 * @example
 * ```ts
 * import { useCombobox } from '@vuetify/v0'
 *
 * const combobox = useCombobox()
 * combobox.query.value = 'search term'
 * ```
 */
export function useCombobox (namespace = 'v0:combobox'): ComboboxContext {
  return useContext<ComboboxContext>(namespace)
}

// Re-export adapters with namespaced names to avoid conflicts with DataTable adapters
export { ClientAdapter as ComboboxClientAdapter } from './adapters'
export type { ClientAdapterOptions as ComboboxClientAdapterOptions } from './adapters'
export { ServerAdapter as ComboboxServerAdapter } from './adapters'
