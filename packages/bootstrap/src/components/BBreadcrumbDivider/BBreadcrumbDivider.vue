<script setup lang="ts">
  defineOptions({ name: 'BBreadcrumbDivider' })

  defineSlots<{
    default?: () => any
  }>()
</script>

<template>
  <li class="breadcrumb-divider">
    <slot />
  </li>
</template>
