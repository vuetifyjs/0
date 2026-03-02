/**
 * @module SwitchGroup
 *
 * @remarks
 * Group component for managing multiple switches with tri-state support.
 * Provides group context to child Switch.Root components. Supports batch
 * operations (selectAll, unselectAll, toggleAll) and mixed/indeterminate states.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Foundational
  import { createContext } from '#v0/composables/createContext'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { GroupContext, GroupTicket } from '#v0/composables/createGroup'
  import type { ID } from '#v0/types'

  export interface SwitchGroupProps extends AtomProps {
    namespace?: string
    disabled?: boolean
    enroll?: boolean
    mandatory?: boolean | 'force'
    label?: string
    ariaLabelledby?: string
    ariaDescribedby?: string
  }

  export interface SwitchGroupSlotProps {
    isDisabled: boolean
    isNoneSelected: boolean
    isAllSelected: boolean
    isMixed: boolean
    select: (id: ID | ID[]) => void
    unselect: (id: ID | ID[]) => void
    toggle: (id: ID | ID[]) => void
    selectAll: () => void
    unselectAll: () => void
    toggleAll: () => void
    attrs: {
      'role': 'group'
      'aria-label': string | undefined
      'aria-labelledby': string | undefined
      'aria-describedby': string | undefined
    }
  }

  export const [useSwitchGroup, provideSwitchGroup] = createContext<GroupContext<GroupTicket>>()
</script>

<script setup lang="ts" generic="T = unknown">
  // Composables
  import { createGroup } from '#v0/composables/createGroup'
  import { useProxyModel } from '#v0/composables/useProxyModel'

  // Utilities
  import { toRef, toValue } from 'vue'

  defineOptions({ name: 'SwitchGroup' })

  defineSlots<{
    default: (props: SwitchGroupSlotProps) => any
  }>()

  defineEmits<{
    'update:model-value': [value: T | T[]]
  }>()

  const {
    as = 'div',
    renderless,
    namespace = 'v0:switch:group',
    ariaLabelledby,
    ariaDescribedby,
    disabled = false,
    enroll = false,
    mandatory = false,
    label,
  } = defineProps<SwitchGroupProps>()

  const model = defineModel<T | T[]>()

  const group = createGroup({
    disabled: toRef(() => disabled),
    enroll,
    mandatory,
    events: true,
  })

  useProxyModel(group, model, { multiple: true })

  provideSwitchGroup(namespace, group)

  const slotProps = toRef((): SwitchGroupSlotProps => ({
    isDisabled: toValue(group.disabled),
    isNoneSelected: group.isNoneSelected.value,
    isAllSelected: group.isAllSelected.value,
    isMixed: group.isMixed.value,
    select: group.select,
    unselect: group.unselect,
    toggle: group.toggle,
    selectAll: group.selectAll,
    unselectAll: group.unselectAll,
    toggleAll: group.toggleAll,
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
