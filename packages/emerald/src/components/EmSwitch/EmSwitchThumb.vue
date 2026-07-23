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
  --travel: 8px;
  --sign: -1;
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 16px;
  height: 16px;
  border-radius: var(--emerald-radius-full, 999px);
  background: var(--emerald-neutral-100, #fefefe);
  transform: translate(calc(-50% + var(--sign) * var(--travel)), -50%);
  transition: transform 120ms ease;
  pointer-events: none;
}

.emerald-switch__thumb[data-state="checked"] {
  --sign: 1;
}

[dir="rtl"] .emerald-switch__thumb {
  --sign: 1;
}

[dir="rtl"] .emerald-switch__thumb[data-state="checked"] {
  --sign: -1;
}

.emerald-switch[data-size="sm"] .emerald-switch__thumb {
  --travel: 6px;
  width: 12px;
  height: 12px;
}

.emerald-switch[data-size="lg"] .emerald-switch__thumb {
  --travel: 10px;
  width: 20px;
  height: 20px;
}
</style>
