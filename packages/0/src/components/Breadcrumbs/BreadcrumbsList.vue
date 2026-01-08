/**
 * @module BreadcrumbsList
 *
 * @remarks
 * Semantic list wrapper for breadcrumb items. Typically renders as an
 * ordered list and contains BreadcrumbsItem, BreadcrumbsDivider, and
 * BreadcrumbsEllipsis components.
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface BreadcrumbsListProps extends AtomProps {}

  export interface BreadcrumbsListSlotProps {}
</script>

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  // Composables
  import { useBreadcrumbsRoot } from './BreadcrumbsRoot.vue'

  defineOptions({ name: 'BreadcrumbsList' })

  defineSlots<{
    default: (props: BreadcrumbsListSlotProps) => unknown
  }>()

  const {
    as = 'ol',
    namespace = 'v0:breadcrumbs',
    renderless,
  } = defineProps<BreadcrumbsListProps & { namespace?: string }>()

  const breadcrumbs = useBreadcrumbsRoot(namespace)
</script>

<template>
  <Atom
    :as
    class="flex list-none m-0 p-0"
    :renderless
    :style="{ gap: `${breadcrumbs.gap.value}px` }"
  >
    <slot />
  </Atom>
</template>
