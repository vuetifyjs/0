<script lang="ts">
  export interface BBreadcrumbItemProps {
    /** Last crumb. Sets `aria-current="page"` on the item. */
    current?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BBreadcrumbItem' })

  defineSlots<{
    default?: () => any
  }>()

  const { current = false } = defineProps<BBreadcrumbItemProps>()
</script>

<template>
  <li
    :aria-current="current ? 'page' : undefined"
    class="breadcrumb-item"
  >
    <slot />
  </li>
</template>
