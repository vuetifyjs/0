/**
 * @module LazyPlaceholder
 *
 * @remarks
 * Placeholder component shown before content intersects the viewport.
 * Consumes the Lazy context and displays when hasContent is false.
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface LazyPlaceholderProps extends AtomProps {
    /** Namespace for retrieving lazy context */
    namespace?: string
  }

  export interface LazyPlaceholderSlotProps {
    /** Whether content is ready (placeholder hides when true) */
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

  defineOptions({ name: 'LazyPlaceholder' })

  defineSlots<{
    default: (props: LazyPlaceholderSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    namespace = 'v0:lazy',
  } = defineProps<LazyPlaceholderProps>()

  const context = useLazyRoot(namespace)

  const slotProps = toRef((): LazyPlaceholderSlotProps => ({
    hasContent: context.hasContent.value,
  }))
</script>

<template>
  <Atom
    v-if="!context.hasContent.value"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
