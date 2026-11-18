<script setup lang="ts">
  defineOptions({ name: 'BNavItem' })

  defineSlots<{
    default?: () => any
  }>()
</script>

<template>
  <li class="nav-item">
    <slot />
  </li>
</template>
