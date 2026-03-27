<script lang="ts">
  export interface CxChipProps {
    /** Optional display text (overridden by default slot) */
    text?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxChip' })

  const { text } = defineProps<CxChipProps>()
</script>

<template>
  <span class="codex-chip">
    <span v-if="$slots.icon" class="codex-chip__icon">
      <slot name="icon" />
    </span>

    <slot>{{ text }}</slot>
  </span>
</template>

<style scoped>
  .codex-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    cursor: pointer;
  }
</style>
