/**
 * @module BreadcrumbsLink
 *
 * @remarks
 * Navigable breadcrumb link rendered inside a BreadcrumbsItem.
 * Renders as an anchor by default with an href prop. Meant to be used
 * for all breadcrumb items except the current page.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface BreadcrumbsLinkProps extends AtomProps {
    /** The URL to navigate to */
    href?: string
  }

  export interface BreadcrumbsLinkSlotProps {
    /** The resolved href */
    href: string | undefined
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BreadcrumbsLink' })

  defineSlots<{
    default: (props: BreadcrumbsLinkSlotProps) => unknown
  }>()

  const {
    as = 'a',
    renderless,
    href,
  } = defineProps<BreadcrumbsLinkProps>()

  const slotProps = toRef((): BreadcrumbsLinkSlotProps => ({
    href,
  }))
</script>

<template>
  <Atom :as :href :renderless>
    <slot v-bind="slotProps" />
  </Atom>
</template>
