<script lang="ts" setup>
  // Composables
  import { useSelection } from '#v0/composables/useSelection'

  // Utilities
  import { onUnmounted, toRef, toValue } from 'vue'

  // Types
  import type { MaybeRef } from 'vue'

  defineOptions({ name: 'ExpansionPanelItem' })

  defineSlots<{
    default: (props: {
      /** Unique identifier (auto-generated if not provided) */
      id: string
      /** Optional display title (passed through to slot, not used in registration) */
      title?: string
      /** Value associated with this panel */
      value: any
      /** Whether this panel is currently selected */
      isSelected: boolean
      /** Disables this specific panel */
      disabled: boolean
      /** ARIA expanded state */
      ariaExpanded: boolean
      /** ARIA disabled state */
      ariaDisabled: boolean
      /** Select this panel */
      select: () => void
      /** Unselect this panel */
      unselect: () => void
      /** Toggle this panel's selection state */
      toggle: () => void
    }) => any

    header: (props: {
      /** Unique identifier for header element */
      id: string
      /** Optional display title */
      title?: string
      /** Whether this panel is currently selected */
      isSelected: boolean
      /** Disables this specific panel */
      disabled: boolean
      /** Toggle this panel's selection state */
      toggle: () => void
      /** ARIA expanded state */
      ariaExpanded: boolean
      /** ARIA controls attribute (references content id) */
      ariaControls: string
      /** ARIA disabled state */
      ariaDisabled: boolean
      /** Role for header element */
      role: 'button'
      /** Tabindex for keyboard navigation */
      tabindex: number
    }) => any

    content: (props: {
      /** Unique identifier for content element */
      id: string
      /** Whether this panel is currently selected */
      isSelected: boolean
      /** ARIA labelledby attribute (references header id) */
      ariaLabelledby: string
      /** Role for content element */
      role: 'region'
    }) => any
  }>()

  const {
    id,
    title,
    value,
    disabled,
    namespace = 'v0:expansion-panel',
  } = defineProps<{
    /** Optional display title (passed through to slot, not used in registration) */
    title?: string
    /** Unique identifier (auto-generated if not provided) */
    id?: string
    /** Disables this specific panel */
    disabled?: MaybeRef<boolean>
    /** Value associated with this panel */
    value?: any
    /** Namespace for dependency injection */
    namespace?: string
  }>()

  const expansion = useSelection(namespace)
  const ticket = expansion.register({ id, value, disabled })
  const isDisabled = toRef(() => ticket.disabled || expansion.disabled)

  onUnmounted(() => {
    expansion.unregister(ticket.id)
  })
</script>

<template>
  <slot
    :id="String(ticket.id)"
    :aria-disabled="toValue(isDisabled)"
    :aria-expanded="toValue(ticket.isSelected)"
    :disabled="toValue(isDisabled)"
    :is-selected="toValue(ticket.isSelected)"
    :select="ticket.select"
    :title
    :toggle="ticket.toggle"
    :unselect="ticket.unselect"
    :value
  >
    <slot
      :id="`${ticket.id}-header`"
      :aria-controls="`${ticket.id}-content`"
      :aria-disabled="toValue(isDisabled)"
      :aria-expanded="toValue(ticket.isSelected)"
      :disabled="toValue(isDisabled)"
      :is-selected="toValue(ticket.isSelected)"
      name="header"
      role="button"
      :tabindex="toValue(isDisabled) ? -1 : 0"
      :title
      :toggle="ticket.toggle"
    />

    <slot
      :id="`${ticket.id}-header`"
      :aria-labelledby="`${ticket.id}-content`"
      :is-selected="toValue(ticket.isSelected)"
      name="content"
      role="region"
    />
  </slot>
</template>
