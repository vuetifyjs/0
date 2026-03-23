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

  // Composables
  import { createContext } from '#v0/composables/createContext'
  import { createGroup } from '#v0/composables/createGroup'
  import { useProxyModel } from '#v0/composables/useProxyModel'

  // Utilities
  import { toRef, toValue } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { GroupContext, GroupTicket } from '#v0/composables/createGroup'
  import type { ID } from '#v0/types'

  export interface SwitchGroupProps extends AtomProps {
    /** Namespace for context provision to children */
    namespace?: string
    /** Disables all switches in the group */
    disabled?: boolean
    /** Auto-select items on registration */
    enroll?: boolean
    /** Require at least one switch to be on. `'force'` prevents deselecting the last item */
    mandatory?: boolean | 'force'
    /** Accessible group label */
    label?: string
    /** ID of element that labels this group */
    ariaLabelledby?: string
    /** ID of element that describes this group */
    ariaDescribedby?: string
  }

  export interface SwitchGroupSlotProps {
    /** Whether the group is disabled */
    isDisabled: boolean
    /** Whether no switches are on */
    isNoneSelected: boolean
    /** Whether all switches are on */
    isAllSelected: boolean
    /** Whether some but not all switches are on */
    isMixed: boolean
    /** Turn on specific switches by ID */
    select: (id: ID | ID[]) => void
    /** Turn off specific switches by ID */
    unselect: (id: ID | ID[]) => void
    /** Toggle specific switches by ID */
    toggle: (id: ID | ID[]) => void
    /** Turn on all switches */
    selectAll: () => void
    /** Turn off all switches */
    unselectAll: () => void
    /** Toggle all switches */
    toggleAll: () => void
    /** Pre-computed ARIA attributes for the group element */
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
