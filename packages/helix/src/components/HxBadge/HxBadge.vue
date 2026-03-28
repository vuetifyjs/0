<script lang="ts">
  export interface HxBadgeProps {
    color?: 'primary' | 'success' | 'warning' | 'error' | 'info'
    variant?: 'solid' | 'outlined' | 'subtle'
    size?: 'sm' | 'md'
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'HxBadge' })

  const {
    color = 'primary',
    variant = 'subtle',
    size = 'sm',
  } = defineProps<HxBadgeProps>()
</script>

<template>
  <span
    class="helix-badge"
    :data-color="color"
    :data-size="size"
    :data-variant="variant"
  >
    <slot />
  </span>
</template>

<style scoped>
  .helix-badge {
    display: inline-flex;
    align-items: center;
    border-radius: 9999px;
    font-weight: 500;
    line-height: 1;
    white-space: nowrap;
  }

  .helix-badge[data-size='sm'] {
    padding: 0.125rem 0.5rem;
    font-size: 0.75rem;
  }

  .helix-badge[data-size='md'] {
    padding: 0.25rem 0.625rem;
    font-size: 0.8125rem;
  }
</style>
