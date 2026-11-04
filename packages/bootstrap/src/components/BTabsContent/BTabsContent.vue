<script setup lang="ts">
  defineOptions({ name: 'BTabsContent' })

  defineSlots<{
    /** `BTabs.Panel` elements. Direct children, so `.tab-content > .active` can show one. */
    default?: () => any
  }>()
</script>

<template>
  <div class="tab-content">
    <slot />
  </div>
</template>
