/**
 * @module PaginationEllipsis
 *
 * @remarks
 * Visual indicator for omitted page numbers in pagination. Renders the ellipsis
 * character (default "...") and is hidden from screen readers via aria-hidden.
 * Can override the ellipsis character via prop or inherits from PaginationRoot context.
 */

<script lang="ts">
  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'

  // Components
  import { Atom } from '#v0/components/Atom'

  import { genId } from '#v0/utilities'
  // Utilities
  import { onBeforeUnmount, toRef, useTemplateRef, watch } from 'vue'

  // Composables
  import { usePaginationItems, usePaginationRoot } from './PaginationRoot.vue'

  export interface PaginationEllipsisProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
    /** Ellipsis character to display (overrides context) */
    ellipsis?: string
    /** Unique identifier for registration */
    id?: string
  }

  export interface PaginationEllipsisSlotProps {
    /** Ellipsis character */
    ellipsis: string | false
    /** Attributes to bind to the ellipsis element */
    attrs: {
      'aria-hidden': 'true'
    }
  }

</script>

<script setup lang="ts">
  defineOptions({ name: 'PaginationEllipsis' })

  defineSlots<{
    default: (props: PaginationEllipsisSlotProps) => any
  }>()

  const {
    as = 'span',
    renderless,
    namespace = 'v0:pagination',
    ellipsis,
    id = genId(),
  } = defineProps<PaginationEllipsisProps>()

  const pagination = usePaginationRoot(namespace)
  const items = usePaginationItems(namespace)

  const atom = useTemplateRef<AtomExpose>('atom')

  watch(() => atom.value?.element, el => {
    if (!el) return

    items.register({ id, value: el })
  }, { immediate: true })

  const resolvedEllipsis = toRef(() => ellipsis ?? pagination.ellipsis)

  const slotProps = toRef((): PaginationEllipsisSlotProps => ({
    ellipsis: resolvedEllipsis.value,
    attrs: {
      'aria-hidden': 'true',
    },
  }))

  onBeforeUnmount(() => items.unregister(id))
</script>

<template>
  <Atom
    ref="atom"
    v-bind="slotProps.attrs"
    :as
    :renderless
  >
    <slot v-bind="slotProps">
      {{ resolvedEllipsis }}
    </slot>
  </Atom>
</template>
