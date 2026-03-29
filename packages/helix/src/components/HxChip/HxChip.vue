<script lang="ts">
  export interface HxChipProps {
    /** Arbitrary CSS color value applied to the chip text */
    color?: string
    /** Optional display text (overridden by default slot) */
    text?: string
  }
</script>

<script setup lang="ts">
  // Utilities
  import { toRef } from 'vue'

  defineOptions({ name: 'HxChip' })

  const { color, text } = defineProps<HxChipProps>()

  const style = toRef(() => color ? { color } : undefined)
</script>

<template>
  <span class="helix-chip" :style>
    <span v-if="$slots.icon" class="helix-chip__icon">
      <slot name="icon" />
    </span>

    <slot>{{ text }}</slot>
  </span>
</template>

<style scoped>
  .helix-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    border: 1px solid var(--v0-divider);
    border-radius: 1rem;
    background-color: var(--v0-surface);
    font-size: 0.75rem;
    line-height: 1.5;
    cursor: pointer;
    transition: background-color 0.15s;
  }

  .helix-chip:hover {
    background-color: var(--v0-surface-tint);
  }
</style>
