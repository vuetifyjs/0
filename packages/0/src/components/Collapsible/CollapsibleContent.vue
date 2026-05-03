/**
 * @module CollapsibleContent
 *
 * @see https://0.vuetifyjs.com/components/disclosure/collapsible
 *
 * @remarks
 * Content container for a collapsible disclosure that displays when open.
 * Consumes the CollapsibleContext via dependency injection and provides
 * ARIA region attributes for accessibility.
 *
 * Automatically manages ARIA labelledby relationship with the trigger element.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useCollapsible } from './CollapsibleRoot.vue'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface CollapsibleContentProps extends AtomProps {
    namespace?: string
  }

  export interface CollapsibleContentSlotProps {
    /** Whether the collapsible is open */
    isOpen: boolean
    /** Attributes to bind to the content element for accessibility */
    attrs: {
      /** Unique ID for the content region */
      'id': string
      /** ARIA role for accessibility */
      'role': 'region'
      /** ARIA labelledby attribute pointing to trigger element */
      'aria-labelledby': string
      /** Whether the content is hidden */
      'hidden': boolean
      /** Data attribute for open/closed state */
      'data-state': 'open' | 'closed'
      /** Data attribute for disabled state */
      'data-disabled': true | undefined
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'CollapsibleContent' })

  defineSlots<{
    default: (props: CollapsibleContentSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    namespace = 'v0:collapsible',
  } = defineProps<CollapsibleContentProps>()

  const context = useCollapsible(namespace)

  const slotProps = toRef((): CollapsibleContentSlotProps => ({
    isOpen: context.open.value,
    attrs: {
      'id': context.contentId.value,
      'role': 'region',
      'aria-labelledby': context.activatorId.value,
      'hidden': !context.open.value,
      'data-state': context.open.value ? 'open' : 'closed',
      'data-disabled': context.disabled.value || undefined,
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
