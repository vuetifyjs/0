<script lang="ts">
  export interface HxChipProps {
    /** Optional display text (overridden by default slot) */
    text?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'HxChip' })

  const { text } = defineProps<HxChipProps>()
</script>

<template>
  <span class="helix-chip">
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
