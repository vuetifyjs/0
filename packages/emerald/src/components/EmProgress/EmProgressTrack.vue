<script lang="ts">
  export interface EmProgressTrackProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmProgressTrack' })
</script>

<template>
  <div class="emerald-progress__track">
    <slot />
  </div>
</template>

<style>
.emerald-progress__track {
  position: relative;
  width: 100%;
  overflow: clip;
  border-radius: var(--emerald-radius-full, 999px);
  /* TODO(token): spec hairline is 0.5px; stroke scale starts at 1px (--emerald-stroke-s) */
  border: 0.5px solid var(--emerald-divider, #ccd6e7);
  background: var(--emerald-background, #fefefe);
}

.emerald-progress[data-size="md"] .emerald-progress__track {
  height: var(--emerald-spacing-m, 16px);
  background: var(--emerald-surface, #ffffff);
}

.emerald-progress[data-size="sm"] .emerald-progress__track {
  height: var(--emerald-spacing-xs, 8px);
}
</style>
