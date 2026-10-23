<script lang="ts">
  export interface BBreadcrumbLinkProps {
    href?: string
    /** Last crumb link. Adds `.active`. */
    active?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BBreadcrumbLink' })

  defineSlots<{
    default?: () => any
  }>()

  const {
    href = '#',
    active = false,
  } = defineProps<BBreadcrumbLinkProps>()
</script>

<template>
  <a
    class="breadcrumb-link"
    :class="{ active }"
    :href
  >
    <slot />
  </a>
</template>
