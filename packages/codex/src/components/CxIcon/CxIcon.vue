<script lang="ts">
  export interface CxIconProps {
    size?: string | number
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxIcon' })

  const { size = 18 } = defineProps<CxIconProps>()
</script>

<template>
  <i
    class="codex-icon"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <slot />
  </i>
</template>

<style scoped>
  .codex-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    line-height: 1;
    flex-shrink: 0;
  }
</style>
