/**
 * @module LazyContent
 *
 * @remarks
 * Content component shown after the element intersects the viewport.
 * Consumes the Lazy context and displays when hasContent is true.
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface LazyContentProps extends AtomProps {
    /** Namespace for retrieving lazy context */
    namespace?: string
  }

  export interface LazyContentSlotProps {
    /** Whether this content is currently visible */
    hasContent: boolean
  }
</script>

<script lang="ts" setup>
  // Components
  import { Atom } from '#v0/components/Atom'
  // Composables
  import { useLazyRoot } from './LazyRoot.vue'

  // Utilities
  import { toRef } from 'vue'

  defineOptions({ name: 'LazyContent' })

  defineSlots<{
    default: (props: LazyContentSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    namespace = 'v0:lazy',
  } = defineProps<LazyContentProps>()

  const context = useLazyRoot(namespace)

  const slotProps = toRef((): LazyContentSlotProps => ({
    hasContent: context.hasContent.value,
  }))
</script>

<template>
  <Atom
    v-if="context.hasContent.value"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
