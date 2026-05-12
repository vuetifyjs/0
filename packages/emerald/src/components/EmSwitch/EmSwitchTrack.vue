<script lang="ts">
  // Framework
  import { SwitchTrack } from '@vuetify/v0'

  export interface EmSwitchTrackProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmSwitchTrack' })
</script>

<template>
  <SwitchTrack class="emerald-switch__track">
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </SwitchTrack>
</template>

<style>
.emerald-switch__track {
  display: inline-flex;
  align-items: center;
  position: relative;
  box-sizing: border-box;
  width: 36px;
  height: 20px;
  border: 1px solid rgb(var(--emerald-neutral-channels, 26 28 30) / 0.1);
  border-radius: 999px;
  background: rgb(var(--emerald-neutral-channels, 26 28 30) / 0.1);
  box-shadow: 0 1px 2px 0 rgba(5, 0, 18, 0.05);
  transition:
    background-color 120ms ease,
    border-color 120ms ease,
    box-shadow 120ms ease;
  overflow: visible;
}

.emerald-switch[data-size="sm"] .emerald-switch__track {
  width: 28px;
  height: 16px;
}

.emerald-switch[data-size="lg"] .emerald-switch__track {
  width: 44px;
  height: 24px;
}

.emerald-switch:hover .emerald-switch__track[data-state="unchecked"] {
  background: var(--emerald-primary-50, #f5f3ff);
  box-shadow: 0 1px 2px 0 rgba(5, 0, 18, 0.1);
}

.emerald-switch__track[data-state="checked"] {
  background: var(--emerald-primary-500, #7c5cf6);
  border-color: var(--emerald-primary-500, #7c5cf6);
}

.emerald-switch:hover .emerald-switch__track[data-state="checked"] {
  background: var(--emerald-primary-600, #5f3aed);
  border-color: var(--emerald-primary-600, #5f3aed);
  box-shadow: 0 1px 2px 0 rgba(5, 0, 18, 0.1);
}

.emerald-switch[data-disabled] .emerald-switch__track {
  opacity: 0.3;
}
</style>
