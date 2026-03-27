<script lang="ts">
  export interface CxChipProps {
    /** Optional icon identifier */
    icon?: string
    /** Optional display text (overridden by default slot) */
    text?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxChip' })

  const { icon, text } = defineProps<CxChipProps>()
</script>

<template>
  <span class="codex-chip">
    <CxIcon
      v-if="icon"
      class="codex-chip__icon"
      :icon
    />

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
