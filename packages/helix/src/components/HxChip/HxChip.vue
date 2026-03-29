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
    cursor: pointer;
  }
</style>
