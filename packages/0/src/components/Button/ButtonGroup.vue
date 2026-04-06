/**
 * @module ButtonGroup
 *
 * @see https://0.vuetifyjs.com/components/actions/button
 *
 * @remarks
 * Selection container for toggle button groups. Uses createSelection
 * to manage single or multi-select state across child Button.Root components.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { createContext } from '#v0/composables/createContext'
  import { createSelection } from '#v0/composables/createSelection'
  import { useProxyModel } from '#v0/composables/useProxyModel'

  // Utilities
  import { toRef, toValue } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { SelectionContext, SelectionTicket } from '#v0/composables/createSelection'

  export interface ButtonGroupProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
    /** Disables the entire button group */
    disabled?: boolean
    /** Single (default) or multi-select */
    multiple?: boolean
    /**
     * Controls mandatory selection behavior:
     * - false (default): No mandatory enforcement
     * - true: Prevents deselecting the last selected item
     * - `force`: Automatically selects the first non-disabled item on registration
     */
    mandatory?: boolean | 'force'
    /** Accessible name for the group */
    label?: string
    /** ID of element that labels this group */
    ariaLabelledby?: string
    /** ID of element that describes this group */
    ariaDescribedby?: string
  }

  export interface ButtonGroupSlotProps {
    /** Whether the button group is disabled */
    isDisabled: boolean
    /** Attributes to bind to the root element */
    attrs: {
      'role': 'group'
      'aria-label': string | undefined
      'aria-labelledby': string | undefined
      'aria-describedby': string | undefined
    }
  }

  export const [useButtonGroup, provideButtonGroup] = createContext<SelectionContext<SelectionTicket>>()
</script>

<script lang="ts" setup generic="T = unknown">
  defineOptions({ name: 'ButtonGroup' })

  defineSlots<{
    default: (props: ButtonGroupSlotProps) => any
  }>()

  defineEmits<{
    'update:model-value': [value: T | T[]]
  }>()

  const {
    as = 'div',
    renderless,
    namespace = 'v0:button:group',
    ariaLabelledby,
    ariaDescribedby,
    disabled = false,
    multiple = false,
    mandatory = false,
    label,
  } = defineProps<ButtonGroupProps>()

  const model = defineModel<T | T[]>()

  const selection = createSelection({
    disabled: toRef(() => disabled),
    multiple: toRef(() => multiple),
    mandatory,
    events: true,
  })

  useProxyModel(selection, model, { multiple: toRef(() => multiple) })

  provideButtonGroup(namespace, selection)

  const slotProps = toRef((): ButtonGroupSlotProps => ({
    isDisabled: toValue(selection.disabled),
    attrs: {
      'role': 'group',
      'aria-label': label || undefined,
      'aria-labelledby': ariaLabelledby || undefined,
      'aria-describedby': ariaDescribedby || undefined,
    },
  }))
</script>

<template>
  <Atom
    v-bind="slotProps.attrs"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
