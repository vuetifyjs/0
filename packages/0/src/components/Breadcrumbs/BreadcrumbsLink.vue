/**
 * @module BreadcrumbsLink
 *
 * @remarks
 * Navigable breadcrumb link rendered inside a BreadcrumbsItem.
 * Renders as an anchor by default. All attributes (href, to, etc.)
 * fall through to the underlying element via Atom.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export type BreadcrumbsLinkProps = AtomProps
</script>

<script setup lang="ts">
  defineOptions({ name: 'BreadcrumbsLink' })

  const {
    as = 'a',
    renderless,
  } = defineProps<BreadcrumbsLinkProps>()
</script>

<template>
  <Atom :as :renderless>
    <slot />
  </Atom>
</template>
