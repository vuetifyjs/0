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
  border: 1px solid var(--emerald-neutral-400, #aeb6be);
  border-radius: var(--emerald-radius-full, 999px);
  background: var(--emerald-neutral-200, #ebf0f4);
  box-shadow: var(--emerald-shadow-field, 0 1px 2px 0 rgba(5, 0, 18, 0.05));
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

.emerald-switch__track[data-state="checked"] {
  background: var(--emerald-primary-600, #1fae60);
  border-color: var(--emerald-primary-600, #1fae60);
  box-shadow: none;
}

.emerald-switch:not([data-disabled]):hover .emerald-switch__track[data-state="unchecked"] {
  background: var(--emerald-neutral-400, #aeb6be);
  border-color: var(--emerald-neutral-600, #939dac);
  box-shadow: var(--emerald-shadow-field-hover, 0 1px 2px 0 rgba(5, 0, 18, 0.1));
}

.emerald-switch:not([data-disabled]):hover .emerald-switch__track[data-state="checked"] {
  background: var(--emerald-primary-700, #027d4c);
  border-color: var(--emerald-primary-700, #027d4c);
  box-shadow: var(--emerald-shadow-field-hover, 0 1px 2px 0 rgba(5, 0, 18, 0.1));
}

.emerald-switch[data-disabled] .emerald-switch__track[data-state="unchecked"] {
  background: var(--emerald-neutral-200, #ebf0f4);
  border-color: var(--emerald-neutral-300, #ccd6e7);
  opacity: 0.8;
}

.emerald-switch[data-disabled] .emerald-switch__track[data-state="checked"] {
  background: var(--emerald-neutral-400, #aeb6be);
  border-color: var(--emerald-neutral-600, #939dac);
  opacity: 0.5;
}
</style>
