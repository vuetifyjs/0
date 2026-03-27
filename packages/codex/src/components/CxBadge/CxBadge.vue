<script lang="ts">
  export interface CxBadgeProps {
    color?: 'primary' | 'success' | 'warning' | 'error' | 'info'
    variant?: 'solid' | 'outlined' | 'subtle'
    size?: 'sm' | 'md'
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxBadge' })

  const {
    color = 'primary',
    variant = 'subtle',
    size = 'sm',
  } = defineProps<CxBadgeProps>()
</script>

<template>
  <span
    class="codex-badge"
    :data-color="color"
    :data-size="size"
    :data-variant="variant"
  >
    <slot />
  </span>
</template>

<style scoped>
  .codex-badge {
    display: inline-flex;
    align-items: center;
    border-radius: 9999px;
    font-weight: 500;
    line-height: 1;
    white-space: nowrap;
  }

  .codex-badge[data-size='sm'] {
    padding: 0.125rem 0.5rem;
    font-size: 0.75rem;
  }

  .codex-badge[data-size='md'] {
    padding: 0.25rem 0.625rem;
    font-size: 0.8125rem;
  }
</style>
