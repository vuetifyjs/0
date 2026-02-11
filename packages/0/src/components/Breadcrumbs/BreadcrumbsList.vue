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

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface BreadcrumbsListProps extends AtomProps {}

  export interface BreadcrumbsListSlotProps {
    attrs: {
      role: 'list'
    }
  }
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

  const slotProps = toRef((): BreadcrumbsListSlotProps => ({
    attrs: {
      role: 'list',
    },
  }))
</script>

<template>
  <Atom :as :renderless v-bind="slotProps.attrs">
    <slot v-bind="slotProps" />
  </Atom>
</template>
