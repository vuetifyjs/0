/**
 * @module BreadcrumbsPage
 *
 * @remarks
 * Current page indicator for breadcrumb navigation. Renders as a span
 * by default with aria-current="page" to indicate the current location
 * within the breadcrumb trail. Should be used for the last (current) item.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface BreadcrumbsPageProps extends AtomProps {}

  export interface BreadcrumbsPageSlotProps {
    /** Attributes to bind to the page element */
    attrs: {
      'aria-current': 'page'
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BreadcrumbsPage' })

  defineSlots<{
    default: (props: BreadcrumbsPageSlotProps) => unknown
  }>()

  const {
    as = 'span',
    renderless,
  } = defineProps<BreadcrumbsPageProps>()

  const slotProps = toRef((): BreadcrumbsPageSlotProps => ({
    attrs: {
      'aria-current': 'page',
    },
  }))
</script>

<template>
  <Atom
    :as
    :renderless
    v-bind="slotProps.attrs"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
