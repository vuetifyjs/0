<script lang="ts">
  export interface HxIconProps {
    size?: string | number
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'HxIcon' })

  const { size = 18 } = defineProps<HxIconProps>()
</script>

<template>
  <i
    class="helix-icon"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <slot />
  </i>
</template>

<style scoped>
  .helix-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    line-height: 1;
    flex-shrink: 0;
  }
</style>
