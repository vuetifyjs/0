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
  import { toRef, toValue } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { ComboboxAdapterInterface, ComboboxContext } from '#v0/composables/createCombobox'
  import type { MaybeArray, ID } from '#v0/types'

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
    /** Strict mode: reverts query to selected value on close if no match */
    strict?: boolean
    /** Manual error state override — forces invalid regardless of error messages */
    error?: boolean
    /** Manual error messages */
    errorMessages?: MaybeArray<string>
    /** Filtering/loading adapter (client-side or server-side) */
    adapter?: ComboboxAdapterInterface
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
  }

  export const [useComboboxContext, provideComboboxContext] = createContext<ComboboxContext>()
</script>

<script setup lang="ts">
  defineOptions({ name: 'ComboboxRoot' })

  defineSlots<{
    default: (props: ComboboxRootSlotProps) => any
  }>()

  defineEmits<{
    'update:model-value': [value: ID | ID[]]
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
    displayValue,
  } = defineProps<ComboboxRootProps>()

  const model = defineModel<ID | ID[]>()

  const context = createCombobox({
    id,
    name,
    form,
    disabled,
    multiple,
    mandatory,
    strict,
    error: () => error,
    errorMessages: () => errorMessages,
    adapter,
    displayValue,
  })

  useProxyModel(context.selection, model, { multiple })

  provideComboboxContext(namespace, context)

  const slotProps = toRef((): ComboboxRootSlotProps => ({
    id: context.id,
    query: context.query.value,
    isOpen: context.isOpen.value,
    isEmpty: context.isEmpty.value,
    isLoading: context.isLoading.value,
    isDisabled: toValue(context.disabled),
    errors: context.errors.value,
    isValid: context.isValid.value,
    open: context.open,
    close: context.close,
    toggle: context.toggle,
    clear: context.clear,
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
