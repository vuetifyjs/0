/**
 * @module PaginationEllipsis
 *
 * @remarks
 * Visual indicator for omitted page numbers in pagination. Renders the ellipsis
 * character (default "...") and is hidden from screen readers via aria-hidden.
 * Can override the ellipsis character via prop or inherits from PaginationRoot context.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { usePagination } from '#v0/composables/usePagination'
  import { usePaginationItems } from './PaginationRoot.vue'

  // Utilities
  import { onBeforeUnmount, toRef, useTemplateRef, watch } from 'vue'
  import { genId } from '#v0/utilities'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'

  export interface PaginationEllipsisProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
    /** Ellipsis character to display (overrides context) */
    ellipsis?: string
    /** Unique identifier for registration */
    id?: string
  }

  export interface PaginationEllipsisSlots {
    default: (props: {
      /** Ellipsis character */
      ellipsis: string | false
    }) => any
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'PaginationEllipsis' })

  defineSlots<PaginationEllipsisSlots>()

  const {
    as = 'span',
    renderless,
    namespace = 'v0:pagination',
    ellipsis,
    id = genId(),
  } = defineProps<PaginationEllipsisProps>()

  const pagination = usePagination(namespace)
  const items = usePaginationItems(namespace)

  const atom = useTemplateRef<AtomExpose>('atom')

  watch(() => atom.value?.element, el => {
    if (!el) return

    items.register({ id, value: el })
  }, { immediate: true })

  onBeforeUnmount(() => items.unregister(id))

  const resolvedEllipsis = toRef(() => ellipsis ?? pagination.ellipsis)

  const slotProps = toRef(() => ({
    ariaHidden: 'true',
    ellipsis: resolvedEllipsis.value,
  }))
</script>

<template>
  <Atom
    ref="atom"
    :aria-hidden="slotProps.ariaHidden"
    :as
    :renderless
  >
    <slot v-bind="slotProps">
      {{ resolvedEllipsis }}
    </slot>
  </Atom>
</template>
