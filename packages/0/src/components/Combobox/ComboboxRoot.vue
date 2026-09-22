/**
 * @module ComboboxRoot
 *
 * @see https://0.vuetifyjs.com/components/forms/combobox
 *
 * @remarks
 * Root component for combobox contexts. Creates and provides combobox context
 * to child Combobox components. Manages selection state, query string, open/close
 * state, virtual focus, and popover positioning. Renderless — delegates all
 * rendering to sub-components via slots.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import ComboboxHiddenInput from './ComboboxHiddenInput.vue'

  // Composables
  import { createCombobox } from '#v0/composables/createCombobox'
  import { createContext } from '#v0/composables/createContext'
  import { useProxyModel } from '#v0/composables/useProxyModel'

  // Utilities
  import { shallowRef, toRef, toValue } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { ComboboxAdapter, ComboboxContext } from '#v0/composables/createCombobox'
  import type { PopoverAdapter } from '#v0/composables/usePopover'
  import type { MaybeArray } from '#v0/types'
  import type { ShallowRef } from 'vue'

  export interface ComboboxRootContext extends ComboboxContext {
    /** Listbox element. Written by Content; Control uses it to skip blur-commit. */
    listEl: ShallowRef<HTMLElement | null>
  }

  export interface ComboboxRootProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
    /** Unique identifier (auto-generated if not provided) */
    id?: string
    /** Form field name — auto-renders hidden input when provided */
    name?: string
    /** Associate with a form by ID */
    form?: string
    /** Disables the entire combobox */
    disabled?: boolean
    /** Enable multi-selection mode */
    multiple?: boolean
    /**
     * Controls mandatory selection behavior:
     * - false (default): No mandatory selection enforcement
     * - true: Prevents deselecting the last selected item
     */
    mandatory?: boolean
    /**
     * Constrains accepted values to registered options.
     * - false (default): confirming (Enter/Tab) typed text with no match commits it as a new value
     * - true: unmatched text is discarded on confirm; only registered options can be selected
     */
    strict?: boolean
    /** Manual error state override — forces invalid regardless of error messages */
    error?: boolean
    /** Manual error messages */
    errorMessages?: MaybeArray<string>
    /** Filtering/loading adapter (client-side or server-side) */
    adapter?: ComboboxAdapter
    /** Positioning engine for the dropdown. @default CSS anchor positioning (`V0PopoverAdapter`) */
    positionAdapter?: PopoverAdapter
    /** Maps selected value to input display text. Defaults to String(value). */
    displayValue?: (value: unknown) => string
  }

  export interface ComboboxRootSlotProps {
    /** Root identifier */
    id: string
    /** Current query string */
    query: string
    /** Whether the dropdown is open */
    isOpen: boolean
    /** Whether filtered results are empty */
    isEmpty: boolean
    /** Whether async loading is in progress */
    isLoading: boolean
    /** Whether the combobox is disabled */
    isDisabled: boolean
    /** Validation error messages */
    errors: string[]
    /** Whether the combobox is valid (null = no opinion) */
    isValid: boolean | null
    /** Open the dropdown */
    open: () => void
    /** Close the dropdown */
    close: () => void
    /** Toggle the dropdown */
    toggle: () => void
    /** Clear query and selection */
    clear: () => void
    /** Commit typed text (exact match or mint when not strict) */
    commit: () => void
  }

  export const [useComboboxRoot, provideComboboxRoot] = createContext<ComboboxRootContext>()
</script>

<script lang="ts" setup generic="T = unknown">
  defineOptions({ name: 'ComboboxRoot' })

  defineSlots<{
    default: (props: ComboboxRootSlotProps) => any
  }>()

  defineEmits<{
    'update:model-value': [value: T | T[]]
  }>()

  const {
    as = null,
    namespace = 'v0:combobox',
    id,
    name,
    form,
    disabled = false,
    multiple = false,
    mandatory = false,
    strict = false,
    error = false,
    errorMessages,
    adapter,
    positionAdapter,
    displayValue,
  } = defineProps<ComboboxRootProps>()

  const model = defineModel<T | T[]>()

  const combobox = createCombobox({
    id,
    name,
    form,
    disabled: toRef(() => disabled),
    multiple: toRef(() => multiple),
    mandatory: toRef(() => mandatory),
    strict: toRef(() => strict),
    error: () => error,
    errorMessages: () => errorMessages,
    adapter,
    positionAdapter,
    displayValue,
  })

  useProxyModel(combobox.selection, model, { multiple: toRef(() => multiple) })

  const listEl = shallowRef<HTMLElement | null>(null)

  provideComboboxRoot(namespace, { ...combobox, listEl })

  const slotProps = toRef((): ComboboxRootSlotProps => ({
    id: combobox.id,
    query: combobox.query.value,
    isOpen: combobox.isOpen.value,
    isEmpty: combobox.isEmpty.value,
    isLoading: combobox.isLoading.value,
    isDisabled: toValue(combobox.disabled),
    errors: combobox.errors.value,
    isValid: combobox.isValid.value,
    open: combobox.open,
    close: combobox.close,
    toggle: combobox.toggle,
    clear: combobox.clear,
    commit: combobox.commit,
  }))
</script>

<template>
  <Atom
    :as
    renderless
  >
    <slot v-bind="slotProps" />
  </Atom>

  <ComboboxHiddenInput v-if="name" />
</template>
