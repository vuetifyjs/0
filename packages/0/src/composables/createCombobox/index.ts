/**
 * @module createCombobox
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
 */

// Composables
import { createContext } from '#v0/composables/createContext'
import { createSelection } from '#v0/composables/createSelection'
import { createTrinity } from '#v0/composables/createTrinity'
import { usePopover } from '#v0/composables/usePopover'
import { useVirtualFocus } from '#v0/composables/useVirtualFocus'

// Utilities
import { isUndefined, useId } from '#v0/utilities'
import { nextTick, shallowRef, toRef, toValue, watch } from 'vue'

// Types
import type { SelectionContext } from '#v0/composables/createSelection'
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { PopoverReturn } from '#v0/composables/usePopover'
import type { VirtualFocusReturn } from '#v0/composables/useVirtualFocus'
import type { ID } from '#v0/types'
import type { ComboboxAdapterInterface } from './adapters'
import type { App, MaybeRefOrGetter, Ref, ShallowRef } from 'vue'

export type { ComboboxAdapterContext, ComboboxAdapterInterface, ComboboxAdapterResult } from './adapters'

export interface ComboboxOptions {
  multiple?: MaybeRefOrGetter<boolean>
  mandatory?: MaybeRefOrGetter<boolean>
  disabled?: MaybeRefOrGetter<boolean>
  strict?: MaybeRefOrGetter<boolean>
  adapter?: ComboboxAdapterInterface
  id?: string
  name?: string
  form?: string
}

export interface ComboboxContext {
  selection: SelectionContext
  popover: PopoverReturn
  virtualFocus: VirtualFocusReturn
  query: ShallowRef<string>
  filtered: Ref<Set<ID>>
  isEmpty: Ref<boolean>
  isLoading: ShallowRef<boolean>
  isOpen: ShallowRef<boolean>
  id: string
  inputId: string
  listboxId: string
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

export function createCombobox (options: ComboboxOptions = {}): ComboboxContext {
  const {
    multiple = false,
    mandatory = false,
    disabled = false,
    strict = false,
    adapter,
    id: _id,
    name,
    form,
  } = options

  const id = _id ?? useId()
  const inputId = `${id}-input`
  const listboxId = `${id}-listbox`

  const selection = createSelection({
    multiple,
    mandatory,
    disabled: toRef(() => toValue(disabled)),
    events: true,
  })

  const query = shallowRef('')
  const inputEl = shallowRef<HTMLElement | null>(null)

  // items ref for the adapter — derived from selection.values()
  const items = toRef(() => [...selection.values()])

  // Setup adapter (defaults to pass-through if none provided)
  const adapterResult = adapter
    ? adapter.setup({ query, items })
    : {
        filtered: toRef(() => new Set<ID>(selection.values().map(t => t.id))),
        isLoading: shallowRef(false),
        isEmpty: toRef(() => selection.size === 0),
      }

  const { filtered, isLoading, isEmpty } = adapterResult

  const popover = usePopover({ id })
  const isOpen = popover.isOpen

  const virtualFocus = useVirtualFocus(
    () => selection.values()
      .filter(ticket => filtered.value.has(ticket.id) && !toValue(ticket.disabled))
      .map(ticket => ({
        id: ticket.id,
        el: () => document.querySelector<HTMLElement>(`#${CSS.escape(`${id}-option-${ticket.id}`)}`),
        disabled: ticket.disabled,
      })),
    {
      control: inputEl,
      target: () => null,
      orientation: 'vertical',
    },
  )

  const selectedId = toRef(() => selection.selectedIds.values().next().value as ID | undefined)

  function getSelectedLabel (): string {
    const id = selectedId.value
    if (isUndefined(id)) return ''
    const ticket = selection.get(id)
    if (!ticket) return ''
    return String(ticket.value ?? '')
  }

  function open () {
    if (!isOpen.value && !toValue(disabled)) {
      isOpen.value = true
    }
  }

  function close () {
    if (toValue(strict) && !toValue(multiple as MaybeRefOrGetter<boolean>)) {
      const label = getSelectedLabel()
      query.value = selection.selectedIds.size > 0 ? label : ''
    }
    isOpen.value = false
  }

  function toggle () {
    if (isOpen.value) close()
    else open()
  }

  function select (itemId: ID) {
    if (toValue(multiple as MaybeRefOrGetter<boolean>)) {
      selection.toggle(itemId)
      query.value = ''
    } else {
      selection.select(itemId)
      query.value = getSelectedLabel()
      close()
    }
  }

  function clear () {
    query.value = ''
    for (const id of Array.from(selection.selectedIds)) {
      selection.unselect(id)
    }
  }

  watch(isOpen, open => {
    if (!open) {
      virtualFocus.clear()
      return
    }

    nextTick(() => {
      const selected = selectedId.value
      if (isUndefined(selected)) {
        virtualFocus.first()
      } else {
        virtualFocus.highlight(String(selected))
      }
    })
  }, { flush: 'post' })

  return {
    selection,
    popover,
    virtualFocus,
    query,
    filtered,
    isEmpty,
    isLoading,
    isOpen,
    id,
    inputId,
    listboxId,
    inputEl,
    multiple: toValue(multiple as MaybeRefOrGetter<boolean>),
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

export function createComboboxContext (
  options: ComboboxOptions & { namespace?: string } = {},
): ContextTrinity<ComboboxContext> {
  const { namespace = 'v0:combobox', ...rest } = options
  const [_useCombobox, _provideCombobox] = createContext<ComboboxContext>(namespace)
  const context = createCombobox(rest)

  function provideCombobox (_context: ComboboxContext = context, app?: App): ComboboxContext {
    return _provideCombobox(_context, app)
  }

  return createTrinity<ComboboxContext>(_useCombobox, provideCombobox, context)
}

export function useCombobox (namespace = 'v0:combobox'): ComboboxContext {
  const [_useCombobox] = createContext<ComboboxContext>(namespace)
  return _useCombobox()
}
