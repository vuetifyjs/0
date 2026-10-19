/**
 * @module SelectRoot
 *
 * @see https://0.vuetifyjs.com/components/forms/select
 *
 * @remarks
 * Root component for select contexts. Creates and provides select context
 * to child Select components. Manages selection state, open/close state,
 * virtual focus, and popover positioning. Renderless — delegates all
 * rendering to sub-components via slots.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import SelectHiddenInput from './SelectHiddenInput.vue'

  // Composables
  import { createContext } from '#v0/composables/createContext'
  import { createSelection } from '#v0/composables/createSelection'
  import { usePopover } from '#v0/composables/usePopover'
  import { useProxyModel } from '#v0/composables/useProxyModel'
  import { useTypeahead } from '#v0/composables/useTypeahead'
  import { useVirtualFocus } from '#v0/composables/useVirtualFocus'

  // Globals
  import { IN_BROWSER } from '#v0/constants/globals'

  // Utilities
  import { isUndefined, useId } from '#v0/utilities'
  import { nextTick, shallowRef, toRef, toValue, watch } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { SelectionContext, SelectionTicketInput } from '#v0/composables/createSelection'
  import type { PopoverAdapter, PopoverReturn } from '#v0/composables/usePopover'
  import type { VirtualFocusReturn } from '#v0/composables/useVirtualFocus'
  import type { ID } from '#v0/types'
  import type { MaybeRefOrGetter, Ref } from 'vue'

  export interface SelectTicketInput<V = unknown> extends SelectionTicketInput<V> {
    /** Option text read on each typeahead key */
    text: () => string
  }

  export interface SelectContext {
    /** Whether the dropdown is open */
    isOpen: Ref<boolean>
    /** Whether the entire select is disabled */
    disabled: MaybeRefOrGetter<boolean>
    /** Whether multiple selection is enabled */
    multiple: boolean
    /** Root identifier */
    id: string
    /** ID for the listbox element */
    listboxId: string
    /** ID for the activator element */
    activatorId: string
    /** Form field name */
    name: string | undefined
    /** Associated form ID */
    form: string | undefined
    /** Reference to the activator DOM element */
    activatorEl: Ref<HTMLElement | null>
    /** Selection context for managing selected items */
    selection: SelectionContext<SelectTicketInput>
    /** Virtual focus for keyboard navigation */
    virtualFocus: VirtualFocusReturn
    /** Popover for dropdown positioning */
    popover: PopoverReturn
    /** Open the dropdown */
    open: () => void
    /** Close the dropdown */
    close: () => void
    /** Toggle the dropdown */
    toggle: () => void
    /** Select an item by ID, closing dropdown in single-select mode */
    select: (id: ID) => void
    /** Handle one typed character */
    onTypeahead: (char: string) => void
    /** Raw model value for fallback display before items register. Carries ticket values (type-erased at the compound boundary) */
    modelValue: Ref<unknown>
  }

  export interface SelectRootProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
    /** Unique identifier (auto-generated if not provided) */
    id?: string
    /** Form field name — auto-renders hidden input when provided */
    name?: string
    /** Associate with a form by ID */
    form?: string
    /** Disables the entire select */
    disabled?: boolean
    /** Enable multi-selection mode */
    multiple?: boolean
    /**
     * Controls mandatory selection behavior:
     * - false (default): No mandatory selection enforcement
     * - true: Prevents deselecting the last selected item
     * - `force`: Automatically selects the first non-disabled item
     */
    mandatory?: boolean | 'force'
    /** Positioning engine. @default CSS anchor positioning (`V0PopoverAdapter`) */
    adapter?: PopoverAdapter
  }

  export interface SelectRootSlotProps {
    /** Root identifier */
    id: string
    /** Whether the dropdown is open */
    isOpen: boolean
    /** Whether the select is disabled */
    isDisabled: boolean
    /** Open the dropdown */
    open: () => void
    /** Close the dropdown */
    close: () => void
    /** Toggle the dropdown */
    toggle: () => void
  }

  export const [useSelectContext, provideSelectContext] = createContext<SelectContext>()
</script>

<script lang="ts" setup generic="T = unknown">
  defineOptions({ name: 'SelectRoot' })

  defineSlots<{
    default: (props: SelectRootSlotProps) => any
  }>()

  defineEmits<{
    'update:model-value': [value: T | T[]]
  }>()

  const {
    as = null,
    namespace = 'v0:select',
    id: _id,
    name,
    form,
    disabled = false,
    multiple = false,
    mandatory = false,
    adapter,
  } = defineProps<SelectRootProps>()

  const model = defineModel<T | T[]>()

  const id = _id ?? useId()
  const listboxId = `${id}-listbox`
  const activatorId = `${id}-activator`

  const selection = createSelection<SelectTicketInput>({
    multiple: toRef(() => multiple),
    mandatory: toRef(() => mandatory),
    disabled: toRef(() => disabled),
    events: true,
  })

  useProxyModel(selection, model, { multiple: toRef(() => multiple) })

  const selectedId = toRef(() => selection.selectedIds.values().next().value)

  const popover = usePopover({ id, adapter })
  const isOpen = popover.isOpen

  const activatorEl = shallowRef<HTMLElement | null>(null)
  popover.attachAnchor(activatorEl)

  const virtualFocus = useVirtualFocus(
    () => selection.values().map(ticket => ({
      id: ticket.id,
      el: () => IN_BROWSER ? document.querySelector<HTMLElement>(`#${CSS.escape(`${id}-option-${ticket.id}`)}`) : null,
      disabled: ticket.disabled,
    })),
    {
      control: activatorEl,
      target: () => null,
      orientation: 'vertical',
    },
  )

  const lookup = useTypeahead(
    () => selection.values(),
    {
      text: item => item.text(),
    },
  )

  let pending: string | undefined

  function onTypeahead (char: string) {
    if (toValue(disabled)) return

    if (selection.size === 0) {
      pending = char
      open()
      return
    }

    const result = lookup.typeahead(char)
    if (isUndefined(result)) return

    if (multiple && !isOpen.value) return

    if (isOpen.value) virtualFocus.highlight(result.item.id)

    if (!multiple && !toValue(result.item.disabled)) selection.select(result.item.id)
  }

  watch(isOpen, opened => {
    if (!opened) {
      virtualFocus.clear()
      pending = undefined
      return
    }

    nextTick(() => {
      if (!isOpen.value) return

      if (!isUndefined(pending)) {
        const char = pending
        pending = undefined
        onTypeahead(char)
        return
      }

      const selected = selectedId.value
      if (!isUndefined(selected)) {
        virtualFocus.highlight(String(selected))
      }
    })
  }, { flush: 'post' })

  function open () {
    if (!isOpen.value && !toValue(disabled)) isOpen.value = true
  }

  function close () {
    isOpen.value = false
  }

  function toggle () {
    if (isOpen.value) close()
    else open()
  }

  function select (itemId: ID) {
    if (multiple) {
      selection.toggle(itemId)
    } else {
      selection.select(itemId)
      close()
    }
  }

  provideSelectContext(namespace, {
    isOpen,
    disabled: toRef(() => disabled),
    multiple,
    id,
    listboxId,
    activatorId,
    name,
    form,
    activatorEl,
    selection,
    virtualFocus,
    popover,
    open,
    close,
    toggle,
    select,
    onTypeahead,
    modelValue: model,
  })

  const slotProps = toRef((): SelectRootSlotProps => ({
    id,
    isOpen: isOpen.value,
    isDisabled: toValue(disabled),
    open,
    close,
    toggle,
  }))
</script>

<template>
  <Atom
    :as
    renderless
  >
    <slot v-bind="slotProps" />
  </Atom>

  <SelectHiddenInput v-if="name" />
</template>
