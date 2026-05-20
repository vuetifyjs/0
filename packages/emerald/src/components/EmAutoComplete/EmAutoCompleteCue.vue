<script lang="ts">
  // Framework
  import { ComboboxCue } from '@vuetify/v0'

  export interface EmAutoCompleteCueProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmAutoCompleteCue' })
</script>

<template>
  <ComboboxCue class="emerald-auto-complete__cue">
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </ComboboxCue>
</template>

<style>
.emerald-auto-complete__cue {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: rgb(var(--emerald-neutral-channels, 26 28 30) / 0.6);
  cursor: pointer;
  flex-shrink: 0;
  transition: transform 120ms ease, color 120ms ease;
}

.emerald-auto-complete__cue[data-state="open"] {
  transform: rotate(180deg);
  color: var(--emerald-primary-500);
}
</style>
