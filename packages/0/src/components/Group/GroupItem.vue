<script lang="ts" setup>
  // Composables
  import { useGroup } from '#v0/composables/useGroup'

  // Utilities
  import { onUnmounted, toRef, toValue } from 'vue'

  // Types
  import type { MaybeRef } from 'vue'

  defineOptions({ name: 'GroupItem' })

  defineSlots<{
    default: (props: {
      /** Unique identifier (auto-generated if not provided) */
      id: string
      /** Optional display label (passed through to slot, not used in registration) */
      label?: string
      /** Value associated with this item */
      value: any
      /** Whether this item is currently selected */
      isSelected: boolean
      /** Disables this specific item */
      disabled: boolean
      /** ARIA disabled state */
      ariaSelected: boolean
      /** ARIA selected state */
      ariaDisabled: boolean
      /** Select this item */
      select: () => void
      /** Unselect this item */
      unselect: () => void
      /** Toggle this item's group state */
      toggle: () => void
    }) => any
  }>()

  const {
    id,
    label,
    value,
    disabled,
    namespace = 'v0:group',
  } = defineProps<{
    /** Optional display label (passed through to slot, not used in registration) */
    label?: string
    /** Unique identifier (auto-generated if not provided) */
    id?: string
    /** Disables this specific item */
    disabled?: MaybeRef<boolean>
    /** Value associated with this item */
    value?: any
    /** Namespace for dependency injection */
    namespace?: string
  }>()

  const group = useGroup(namespace)
  const ticket = group.register({ id, value, disabled })
  const isDisabled = toRef(() => ticket.disabled || group.disabled)

  onUnmounted(() => {
    group.unregister(ticket.id)
  })
</script>

<template>
  <slot
    :id="String(ticket.id)"
    :aria-disabled="toValue(isDisabled)"
    :aria-selected="toValue(ticket.isSelected)"
    :disabled="toValue(isDisabled)"
    :is-selected="toValue(ticket.isSelected)"
    :label
    :select="ticket.select"
    :toggle="ticket.toggle"
    :unselect="ticket.unselect"
    :value
  />
</template>
