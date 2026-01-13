/**
 * @module RadioGroup
 *
 * @remarks
 * Group component for managing radio buttons with single-selection behavior.
 * Provides group context to child Radio.Root components. Only one item
 * can be selected at a time within the group.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Foundational
  import { createContext } from '#v0/composables/createContext'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { SingleContext, SingleTicket } from '#v0/composables/createSingle'

  export interface RadioGroupContext extends SingleContext<SingleTicket> {
    /** Form field name shared by all radios in the group */
    name?: string
  }

  export interface RadioGroupProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
    /** Disables the entire radio group */
    disabled?: boolean
    /**
     * Controls mandatory radio behavior:
     * - false (default): No mandatory enforcement
     * - true: Prevents deselecting the selected item
     * - `force`: Automatically selects the first non-disabled item on registration
     */
    mandatory?: boolean | 'force'
    /** Accessible name for the group */
    label?: string
    /** ID of element that labels this group */
    ariaLabelledby?: string
    /** ID of element that describes this group */
    ariaDescribedby?: string
    /** Whether a selection is required before form submission */
    ariaRequired?: boolean
    /** Form field name - applies to all radios in group */
    name?: string
  }

  export interface RadioGroupSlotProps {
    /** Whether the radio group is disabled */
    isDisabled: boolean
    /** Whether no items are currently selected */
    isNoneSelected: boolean
    /** Attributes to bind to the root element */
    attrs: {
      'role': 'radiogroup'
      'aria-label': string | undefined
      'aria-labelledby': string | undefined
      'aria-describedby': string | undefined
      'aria-required': boolean | undefined
    }
  }

  export const [useRadioGroup, provideRadioGroup] = createContext<RadioGroupContext>()
</script>

<script setup lang="ts" generic="T = unknown">
  // Composables
  import { createSingle } from '#v0/composables/createSingle'
  import { useProxyModel } from '#v0/composables/useProxyModel'

  // Utilities
  import { toRef, toValue } from 'vue'

  defineOptions({ name: 'RadioGroup' })

  defineSlots<{
    default: (props: RadioGroupSlotProps) => any
  }>()

  defineEmits<{
    'update:model-value': [value: T]
  }>()

  const {
    as = 'div',
    renderless,
    namespace = 'v0:radio:group',
    ariaLabelledby,
    ariaDescribedby,
    ariaRequired,
    disabled = false,
    mandatory = false,
    label,
    name,
  } = defineProps<RadioGroupProps>()

  const model = defineModel<T>()

  const single = createSingle({
    disabled: toRef(() => disabled),
    mandatory,
    events: true,
  })

  useProxyModel(single, model, { multiple: false })

  provideRadioGroup(namespace, { ...single, name })

  const slotProps = toRef((): RadioGroupSlotProps => ({
    isDisabled: toValue(single.disabled),
    isNoneSelected: single.selectedIds.size === 0,
    attrs: {
      'role': 'radiogroup',
      'aria-label': label || undefined,
      'aria-labelledby': ariaLabelledby || undefined,
      'aria-describedby': ariaDescribedby || undefined,
      'aria-required': ariaRequired || undefined,
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
