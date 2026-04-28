<script lang="ts">
  // Framework
  import { RadioIndicator, useRadioRoot } from '@vuetify/v0'

  export interface EmRadioIndicatorProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmRadioIndicator' })

  const root = useRadioRoot('v0:radio:root')
</script>

<template>
  <span
    aria-hidden="true"
    class="emerald-radio__box"
    :data-disabled="root.isDisabled.value || undefined"
    :data-state="root.isChecked.value ? 'checked' : 'unchecked'"
  >
    <RadioIndicator class="emerald-radio__indicator">
      <template #default>
        <span class="emerald-radio__dot" />
      </template>
    </RadioIndicator>
  </span>
</template>

<style>
.emerald-radio__box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 20px;
  height: 20px;
  border: 1px solid rgb(var(--emerald-neutral-channels, 26 28 30) / 0.25);
  border-radius: 50%;
  background: transparent;
  transition:
    background-color 120ms ease,
    border-color 120ms ease,
    box-shadow 120ms ease;
  flex-shrink: 0;
}

.emerald-radio[data-size="sm"] .emerald-radio__box {
  width: 16px;
  height: 16px;
}

.emerald-radio[data-size="lg"] .emerald-radio__box {
  width: 24px;
  height: 24px;
}

.emerald-radio:hover .emerald-radio__box[data-state="unchecked"]:not([data-disabled]) {
  border-color: rgb(var(--emerald-primary-500-channels, 124 92 246) / 0.5);
}

.emerald-radio__box[data-state="checked"] {
  border: 2px solid var(--emerald-primary-500, #7c5cf6);
}

.emerald-radio:hover .emerald-radio__box[data-state="checked"]:not([data-disabled]) {
  border-color: var(--emerald-primary-700, #5f3aed);
}

.emerald-radio__box[data-disabled] {
  background: transparent;
  border-color: rgb(var(--emerald-neutral-channels, 26 28 30) / 0.15);
  box-shadow: none;
}

.emerald-radio__box[data-disabled][data-state="checked"] {
  border-color: rgb(var(--emerald-neutral-channels, 26 28 30) / 0.25);
}

.emerald-radio__indicator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
}

.emerald-radio__dot {
  display: block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--emerald-primary-500, #7c5cf6);
}

.emerald-radio[data-size="sm"] .emerald-radio__dot {
  width: 8px;
  height: 8px;
}

.emerald-radio[data-size="lg"] .emerald-radio__dot {
  width: 12px;
  height: 12px;
}

.emerald-radio:hover .emerald-radio__box[data-state="checked"]:not([data-disabled]) .emerald-radio__dot {
  background: var(--emerald-primary-600, #5f3aed);
}

.emerald-radio__box[data-disabled] .emerald-radio__dot {
  background: rgb(var(--emerald-neutral-channels, 26 28 30) / 0.3);
}
</style>
