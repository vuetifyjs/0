/**
 * @module BreadcrumbsList
 *
 * @remarks
 * Semantic list wrapper for breadcrumb items. Typically renders as an
 * ordered list and contains BreadcrumbsItem, BreadcrumbsDivider, and
 * BreadcrumbsEllipsis components.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface BreadcrumbsListProps extends AtomProps {}

  export interface BreadcrumbsListSlotProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'BreadcrumbsList' })

  defineSlots<{
    default: (props: BreadcrumbsListSlotProps) => unknown
  }>()

  const {
    as = 'ol',
    renderless,
  } = defineProps<BreadcrumbsListProps>()
</script>

<template>
  <Atom :as :renderless role="list">
    <slot />
  </Atom>
</template>
