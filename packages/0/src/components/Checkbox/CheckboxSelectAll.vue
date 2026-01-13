/**
 * @module CheckboxSelectAll
 *
 * @remarks
 * A "select all" checkbox that binds to its parent Checkbox.Group's
 * aggregate state. Automatically reflects isAllSelected/isMixed state
 * and calls toggleAll on click. Does NOT register as a group item.
 *
 * Must be used within a Checkbox.Group component.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { CheckboxRootContext, CheckboxState } from './CheckboxRoot.vue'

  export interface CheckboxSelectAllProps extends AtomProps {
    /** Optional display label (passed through to slot and aria-label) */
    label?: string
    /** Disables this checkbox */
    disabled?: boolean
    /** Namespace for context provision to children (Indicator) */
    namespace?: string
    /** Namespace for connecting to parent Checkbox.Group */
    groupNamespace?: string
    /** ID of element that labels this checkbox */
    ariaLabelledby?: string
    /** ID of element that describes this checkbox */
    ariaDescribedby?: string
  }

  export interface CheckboxSelectAllSlotProps {
    /** Optional display label */
    label?: string
    /** Whether all selectable items are selected */
    isAllSelected: boolean
    /** Whether some but not all selectable items are selected */
    isMixed: boolean
    /** Whether this checkbox is disabled */
    isDisabled: boolean
    /** Select all selectable items */
    selectAll: () => void
    /** Unselect all items */
    unselectAll: () => void
    /** Toggle between all selected and none selected */
    toggleAll: () => void
    /** Attributes to bind to the checkbox element */
    attrs: {
      'type': 'button' | undefined
      'role': 'checkbox'
      'aria-checked': boolean | 'mixed'
      'aria-disabled': boolean | undefined
      'aria-label': string | undefined
      'aria-labelledby': string | undefined
      'aria-describedby': string | undefined
      'tabindex': 0 | undefined
      'data-state': CheckboxState
      'data-disabled': true | undefined
    }
  }
</script>

<script setup lang="ts">
  // Components
  import { useCheckboxGroup } from './CheckboxGroup.vue'
  import { provideCheckboxRoot } from './CheckboxRoot.vue'

  // Utilities
  import { genId } from '#v0/utilities'
  import { computed, toRef, toValue, useAttrs } from 'vue'

  defineOptions({ name: 'CheckboxSelectAll', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: CheckboxSelectAllSlotProps) => any
  }>()

  const props = defineProps<CheckboxSelectAllProps>()

  const {
    as = 'button',
    renderless,
    label,
    namespace = 'v0:checkbox:root',
    groupNamespace = 'v0:checkbox:group',
  } = props

  // Must be inside a Checkbox.Group
  const group = useCheckboxGroup(groupNamespace)

  const id = genId()

  const isAllSelected = computed(() => group.isAllSelected.value)
  const isMixed = computed(() => group.isMixed.value)
  const isDisabled = computed(() => toValue(props.disabled) || toValue(group.disabled))

  const dataState = computed((): CheckboxState => {
    if (isMixed.value) return 'indeterminate'
    return isAllSelected.value ? 'checked' : 'unchecked'
  })

  function onClick () {
    if (isDisabled.value) return
    group.toggleAll()
  }

  function onKeydown (e: KeyboardEvent) {
    if (e.key === ' ') {
      e.preventDefault()
      if (isDisabled.value) return
      group.toggleAll()
    }
  }

  // Provide context for Checkbox.Indicator
  // SelectAll doesn't register as group item, so mix/unmix are no-ops.
  // These satisfy CheckboxRootContext contract for Indicator children.
  const context: CheckboxRootContext<void> = {
    id,
    label,
    value: undefined,
    name: undefined,
    form: undefined,
    isChecked: isAllSelected,
    isMixed,
    isDisabled,
    check: group.selectAll,
    uncheck: group.unselectAll,
    toggle: group.toggleAll,
    mix: () => {},
    unmix: () => {},
  }

  provideCheckboxRoot(namespace, context)

  const slotProps = toRef((): CheckboxSelectAllSlotProps => ({
    label,
    isAllSelected: isAllSelected.value,
    isMixed: isMixed.value,
    isDisabled: isDisabled.value,
    selectAll: group.selectAll,
    unselectAll: group.unselectAll,
    toggleAll: group.toggleAll,
    attrs: {
      'type': as === 'button' ? 'button' : undefined,
      'role': 'checkbox',
      'aria-checked': isMixed.value ? 'mixed' : isAllSelected.value,
      'aria-disabled': isDisabled.value || undefined,
      'aria-label': label || undefined,
      'aria-labelledby': props.ariaLabelledby || undefined,
      'aria-describedby': props.ariaDescribedby || undefined,
      'tabindex': isDisabled.value ? undefined : 0,
      'data-state': dataState.value,
      'data-disabled': isDisabled.value ? true : undefined,
    },
  }))
</script>

<template>
  <Atom
    v-bind="{ ...attrs, ...slotProps.attrs }"
    :as
    :renderless
    @click="onClick"
    @keydown="onKeydown"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
