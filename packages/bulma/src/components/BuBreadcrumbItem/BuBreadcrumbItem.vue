/**
 * @module BuBreadcrumbItem
 *
 * @remarks
 * A single `li > a` crumb. Set `current` on the last item for `is-active` and
 * `aria-current="page"` — composition is explicit; the root does not infer it.
 */

<script lang="ts">
  export interface BuBreadcrumbItemProps {
    /** Link target */
    href?: string
    /** Marks this crumb as the current page */
    current?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BuBreadcrumbItem' })

  defineSlots<{
    /** Anchor children — text, icons, or both */
    default?: () => any
  }>()

  const { href, current = false } = defineProps<BuBreadcrumbItemProps>()
</script>

<template>
  <li :class="{ 'is-active': current }">
    <a
      :aria-current="current ? 'page' : undefined"
      :href
    >
      <slot />
    </a>
  </li>
</template>
