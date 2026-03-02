/**
 * @module SwitchSelectAll
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

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { SwitchRootContext, SwitchState } from './SwitchRoot.vue'

  export interface SwitchSelectAllProps extends AtomProps {
    label?: string
    disabled?: boolean
    namespace?: string
    groupNamespace?: string
    ariaLabelledby?: string
    ariaDescribedby?: string
  }

  export interface SwitchSelectAllSlotProps {
    label?: string
    isAllSelected: boolean
    isMixed: boolean
    isDisabled: boolean
    selectAll: () => void
    unselectAll: () => void
    toggleAll: () => void
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
  // Components
  import { useSwitchGroup } from './SwitchGroup.vue'
  import { provideSwitchRoot } from './SwitchRoot.vue'

  // Utilities
  import { toRef, toValue, useAttrs, useId } from 'vue'

  defineOptions({ name: 'SwitchSelectAll', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: SwitchSelectAllSlotProps) => any
  }>()

  const props = defineProps<SwitchSelectAllProps>()

  const {
    as = 'button',
    renderless,
    label,
    namespace = 'v0:switch:root',
    groupNamespace = 'v0:switch:group',
  } = props

  const group = useSwitchGroup(groupNamespace)

  const id = useId()

  const isAllSelected = toRef(() => group.isAllSelected.value)
  const isMixed = toRef(() => group.isMixed.value)
  const isDisabled = toRef(() => toValue(props.disabled) || toValue(group.disabled))
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
