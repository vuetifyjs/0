/**
 * @module SwitchSelectAll
 *
 * @see https://0.vuetifyjs.com/components/forms/switch
 *
 * @remarks
 * A "select all" switch that binds to its parent Switch.Group's
 * aggregate state. Automatically reflects isAllSelected/isMixed state
 * and calls toggleAll on click. Does NOT register as a group item.
 *
 * Must be used within a Switch.Group component.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useSwitchGroup } from './SwitchGroup.vue'
  import { provideSwitchRoot } from './SwitchRoot.vue'

  // Utilities
  import { useId } from '#v0/utilities'
  import { mergeProps, toRef, toValue, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { SwitchRootContext, SwitchState } from './SwitchRoot.vue'

  export interface SwitchSelectAllProps extends AtomProps {
    /** Accessible label for the select-all toggle */
    label?: string
    /** Disables this toggle */
    disabled?: boolean
    /** Namespace for context provision to children (Track, Thumb) */
    namespace?: string
    /** Namespace for connecting to parent Switch.Group */
    groupNamespace?: string
    /** ID of element that labels this toggle */
    ariaLabelledby?: string
    /** ID of element that describes this toggle */
    ariaDescribedby?: string
  }

  export interface SwitchSelectAllSlotProps {
    /** Accessible label */
    label?: string
    /** Whether all switches in the group are on */
    isAllSelected: boolean
    /** Whether some but not all switches are on */
    isMixed: boolean
    /** Whether this toggle is disabled */
    isDisabled: boolean
    /** Turn on all switches in the group */
    selectAll: () => void
    /** Turn off all switches in the group */
    unselectAll: () => void
    /** Toggle all switches in the group */
    toggleAll: () => void
    /** Pre-computed ARIA and data attributes for the root element */
    attrs: {
      'type': 'button' | undefined
      'role': 'switch'
      'aria-checked': boolean | 'mixed'
      'aria-disabled': boolean | undefined
      'aria-label': string | undefined
      'aria-labelledby': string | undefined
      'aria-describedby': string | undefined
      'tabindex': 0 | undefined
      'data-state': SwitchState
      'data-disabled': true | undefined
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'SwitchSelectAll', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: SwitchSelectAllSlotProps) => any
  }>()

  const {
    as = 'button',
    renderless,
    label,
    disabled,
    namespace = 'v0:switch:root',
    groupNamespace = 'v0:switch:group',
    ariaLabelledby,
    ariaDescribedby,
  } = defineProps<SwitchSelectAllProps>()

  const group = useSwitchGroup(groupNamespace)

  const id = useId()

  const isAllSelected = toRef(() => group.isAllSelected.value)
  const isMixed = toRef(() => group.isMixed.value)
  const isDisabled = toRef(() => toValue(disabled) || toValue(group.disabled))
  const dataState = toRef((): SwitchState => isMixed.value
    ? 'indeterminate'
    : (isAllSelected.value ? 'checked' : 'unchecked'),
  )

  function onClick () {
    if (isDisabled.value) return
    group.toggleAll()
  }

  function onKeydown (e: KeyboardEvent) {
    if (e.key !== ' ') return
    e.preventDefault()
    if (isDisabled.value) return
    group.toggleAll()
  }

  const context: SwitchRootContext<void> = {
    id,
    label,
    value: undefined,
    name: undefined,
    form: undefined,
    isChecked: isAllSelected,
    isMixed,
    isDisabled,
    select: group.selectAll,
    unselect: group.unselectAll,
    toggle: group.toggleAll,
    mix: () => {},
    unmix: () => {},
  }

  provideSwitchRoot(namespace, context)

  const slotProps = toRef((): SwitchSelectAllSlotProps => ({
    label,
    isAllSelected: isAllSelected.value,
    isMixed: isMixed.value,
    isDisabled: isDisabled.value,
    selectAll: group.selectAll,
    unselectAll: group.unselectAll,
    toggleAll: group.toggleAll,
    attrs: {
      'type': as === 'button' ? 'button' : undefined,
      'role': 'switch',
      'aria-checked': isMixed.value ? 'mixed' : isAllSelected.value,
      'aria-disabled': isDisabled.value || undefined,
      'aria-label': label || undefined,
      'aria-labelledby': ariaLabelledby || undefined,
      'aria-describedby': ariaDescribedby || undefined,
      'tabindex': isDisabled.value ? undefined : 0,
      'data-state': dataState.value,
      'data-disabled': isDisabled.value ? true : undefined,
    },
  }))
</script>

<template>
  <Atom
    v-bind="mergeProps(attrs, slotProps.attrs)"
    :as
    :renderless
    @click="onClick"
    @keydown="onKeydown"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
