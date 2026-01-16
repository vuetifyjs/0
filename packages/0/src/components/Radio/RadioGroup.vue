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
  import type { Activation } from '#v0/types'
  import type { MaybeRef, Ref } from 'vue'

  /** Ticket for radio items with element reference for focus management */
  export interface RadioTicket extends SingleTicket {
    /** Element reference for roving tabindex focus management */
    el?: MaybeRef<HTMLElement | null | undefined>
  }

  /** Activation mode alias for Radio component API */
  export type RadioActivation = Activation

  export interface RadioGroupContext extends SingleContext<RadioTicket> {
    /** Form field name shared by all radios in the group */
    name?: string
    /** Activation mode for the group */
    activation: Ref<RadioActivation>
  }

  export interface RadioGroupProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
    /**
     * Disables the entire radio group
     *
     * @example
     * ```vue
     * <template>
     *   <Radio.Group disabled>
     *     <Radio.Root value="a">Option A</Radio.Root>
     *   </Radio.Group>
     * </template>
     * ```
     */
    disabled?: boolean
    /**
     * Auto-selects the first non-disabled item on mount.
     * Radio groups are inherently mandatory (selection can only be changed, not cleared),
     * so `mandatory="force"` is the only meaningful option.
     *
     * @example
     * ```vue
     * <template>
     *   <Radio.Group v-model="selected" mandatory="force">
     *     <Radio.Root value="small">Small</Radio.Root>
     *     <Radio.Root value="medium">Medium</Radio.Root>
     *   </Radio.Group>
     * </template>
     * ```
     */
    mandatory?: boolean | 'force'
    /**
     * Accessible name for the group
     *
     * @example
     * ```vue
     * <template>
     *   <Radio.Group label="Select size">
     *     <Radio.Root value="s">Small</Radio.Root>
     *     <Radio.Root value="m">Medium</Radio.Root>
     *   </Radio.Group>
     * </template>
     * ```
     */
    label?: string
    /** ID of element that labels this group */
    ariaLabelledby?: string
    /** ID of element that describes this group */
    ariaDescribedby?: string
    /** Whether a selection is required before form submission */
    ariaRequired?: boolean
    /**
     * Form field name - enables native form submission for all radios in group
     *
     * @example
     * ```vue
     * <template>
     *   <Radio.Group v-model="size" name="product_size">
     *     <Radio.Root value="small">Small</Radio.Root>
     *     <Radio.Root value="large">Large</Radio.Root>
     *   </Radio.Group>
     * </template>
     * ```
     */
    name?: string
    /**
     * Activation mode controlling when selection occurs:
     * - `automatic` (default): Selection follows focus (arrow keys select)
     * - `manual`: Selection requires explicit Enter/Space key press
     *
     * Per WAI-ARIA APG, radio groups should have selection follow focus by default.
     * Use `manual` for toolbar radio groups or when deliberate selection is preferred.
     *
     * @example
     * ```vue
     * <template>
     *   <Radio.Group v-model="selected" activation="manual">
     *     <Radio.Root value="a">Option A</Radio.Root>
     *     <Radio.Root value="b">Option B</Radio.Root>
     *   </Radio.Group>
     * </template>
     * ```
     */
    activation?: RadioActivation
  }

  export interface RadioGroupSlotProps {
    /** Whether the radio group is disabled */
    isDisabled: boolean
    /** Whether no items are currently selected */
    isNoneSelected: boolean
    /** Current activation mode */
    activation: RadioActivation
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
    /**
     * Default slot with group state and ARIA attributes
     *
     * @example
     * ```vue
     * <template>
     *   <Radio.Group v-slot="{ isNoneSelected, attrs }">
     *     <div v-bind="attrs">
     *       <p v-if="isNoneSelected">Please select an option</p>
     *       <Radio.Root value="a">Option A</Radio.Root>
     *     </div>
     *   </Radio.Group>
     * </template>
     * ```
     */
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
    activation = 'automatic',
  } = defineProps<RadioGroupProps>()

  const model = defineModel<T>()

  const single = createSingle<RadioTicket>({
    disabled: toRef(() => disabled),
    mandatory,
    events: true,
  })

  useProxyModel(single, model, { multiple: false })

  provideRadioGroup(namespace, { ...single, name, activation: toRef(() => activation) })

  const slotProps = toRef((): RadioGroupSlotProps => ({
    isDisabled: toValue(single.disabled),
    isNoneSelected: single.selectedIds.size === 0,
    activation,
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
