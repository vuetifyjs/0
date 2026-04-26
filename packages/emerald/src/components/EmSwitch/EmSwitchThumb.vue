<script lang="ts">
  // Framework
  import { useSwitchRoot } from '@vuetify/v0'

  export interface EmSwitchThumbProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmSwitchThumb' })

  const root = useSwitchRoot('v0:switch:root')
</script>

<template>
  <span
    aria-hidden="true"
    class="emerald-switch__thumb"
    :data-disabled="root.isDisabled.value || undefined"
    :data-state="root.isChecked.value ? 'checked' : 'unchecked'"
  />
</template>

<style>
.emerald-switch__thumb {
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 16px;
  height: 16px;
  border-radius: 999px;
  background: #ffffff;
  transform: translate(calc(-50% - 8px), -50%);
  transition: transform 120ms ease;
  pointer-events: none;
}

.emerald-switch__thumb[data-state="checked"] {
  transform: translate(calc(-50% + 8px), -50%);
}

.emerald-switch[data-size="sm"] .emerald-switch__thumb {
  width: 12px;
  height: 12px;
  transform: translate(calc(-50% - 6px), -50%);
}

.emerald-switch[data-size="sm"] .emerald-switch__thumb[data-state="checked"] {
  transform: translate(calc(-50% + 6px), -50%);
}

.emerald-switch[data-size="lg"] .emerald-switch__thumb {
  width: 20px;
  height: 20px;
  transform: translate(calc(-50% - 10px), -50%);
}

.emerald-switch[data-size="lg"] .emerald-switch__thumb[data-state="checked"] {
  transform: translate(calc(-50% + 10px), -50%);
}
</style>
