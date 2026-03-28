<script lang="ts">
  export interface HxProgressBarProps {
    /** Progress value (0-100) */
    value: number
    /** Color variant */
    color?: 'primary' | 'success' | 'warning' | 'error'
    /** Size variant */
    size?: 'sm' | 'md'
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'HxProgressBar' })

  const {
    value,
    color = 'primary',
    size = 'sm',
  } = defineProps<HxProgressBarProps>()
</script>

<template>
  <div class="helix-progress-bar">
    <div
      aria-valuemax="100"
      aria-valuemin="0"
      :aria-valuenow="Math.round(value)"
      class="helix-progress-bar__track"
      :class="size === 'sm' ? 'helix-progress-bar__track--sm' : 'helix-progress-bar__track--md'"
      role="progressbar"
    >
      <div
        class="helix-progress-bar__fill"
        :class="`bg-${color}`"
        :style="{ width: `${Math.min(100, Math.max(0, value))}%` }"
      />
    </div>

    <slot />
  </div>
</template>

<style scoped>
  .helix-progress-bar {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .helix-progress-bar__track {
    flex: 1;
    border-radius: 9999px;
    overflow: hidden;
  }

  .helix-progress-bar__track--sm {
    height: 0.5rem;
  }

  .helix-progress-bar__track--md {
    height: 0.75rem;
  }

  .helix-progress-bar__fill {
    height: 100%;
    border-radius: 9999px;
    transition: width 300ms ease;
  }
</style>
