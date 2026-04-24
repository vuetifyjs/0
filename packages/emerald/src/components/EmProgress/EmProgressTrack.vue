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
  flex: 1 1 auto;
  width: 100%;
  overflow: clip;
  border-radius: 999px;
  border: 0.5px solid rgb(var(--emerald-neutral-channels, 26 28 30) / 0.1);
  background: var(--emerald-secondary-50, #f4f7f9);
}

.emerald-progress[data-size="md"] .emerald-progress__track {
  height: 16px;
  background: #ffffff;
}

.emerald-progress[data-size="sm"] .emerald-progress__track {
  height: 8px;
}
</style>
