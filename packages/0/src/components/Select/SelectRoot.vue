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
  import { useVirtualFocus } from '#v0/composables/useVirtualFocus'

  // Globals
  import { IN_BROWSER } from '#v0/constants/globals'

  // Utilities
  import { isUndefined, useId } from '#v0/utilities'
  import { nextTick, shallowRef, toRef, toValue, watch } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { SelectionContext } from '#v0/composables/createSelection'
  import type { PopoverReturn } from '#v0/composables/usePopover'
  import type { VirtualFocusReturn } from '#v0/composables/useVirtualFocus'
  import type { ID } from '#v0/types'
  import type { MaybeRefOrGetter, Ref } from 'vue'

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
    selection: SelectionContext
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
    /** Raw model value for fallback display before items register */
    modelValue: Ref<ID | ID[] | undefined>
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

<script setup lang="ts">
  defineOptions({ name: 'SelectRoot' })

  defineSlots<{
    default: (props: SelectRootSlotProps) => any
  }>()

  defineEmits<{
    'update:model-value': [value: ID | ID[]]
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
  } = defineProps<SelectRootProps>()

  const model = defineModel<ID | ID[]>()

  const id = _id ?? useId()
  const listboxId = `${id}-listbox`
  const activatorId = `${id}-activator`

  const selection = createSelection({
    multiple,
    mandatory,
    disabled: toRef(() => disabled),
    events: true,
  })

  useProxyModel(selection, model, { multiple })

  const selectedId = toRef(() => selection.selectedIds.values().next().value)

  const popover = usePopover({ id })
  const isOpen = popover.isOpen

  const activatorEl = shallowRef<HTMLElement | null>(null)

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

  watch(isOpen, open => {
    if (!open) {
      virtualFocus.clear()
      return
    }

    nextTick(() => {
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
