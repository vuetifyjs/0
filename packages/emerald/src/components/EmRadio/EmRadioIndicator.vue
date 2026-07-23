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

<style scoped>
.emerald-radio__box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: var(--emerald-radio-control, 20px);
  height: var(--emerald-radio-control, 20px);
  border: var(--emerald-stroke-s) solid var(--emerald-border);
  border-radius: var(--emerald-radius-full);
  background: var(--emerald-neutral-100);
  box-shadow: var(--emerald-shadow-field);
  transition:
    background-color 120ms ease,
    border-color 120ms ease,
    box-shadow 120ms ease;
  flex-shrink: 0;
}

.emerald-radio:hover .emerald-radio__box[data-state="unchecked"]:not([data-disabled]) {
  background: var(--emerald-neutral-200);
  border-color: var(--emerald-neutral-600);
  box-shadow: var(--emerald-shadow-field-hover);
}

.emerald-radio__box[data-state="checked"] {
  border-color: var(--emerald-secondary-600);
}

.emerald-radio:hover .emerald-radio__box[data-state="checked"]:not([data-disabled]) {
  background: var(--emerald-neutral-200);
  border-color: var(--emerald-secondary-700);
  box-shadow: var(--emerald-shadow-field-hover);
}

/* Spec FocusRing: 1px --border/focus ring (22px around the 20px control) */
.emerald-radio__root:focus-visible .emerald-radio__box {
  outline: var(--emerald-stroke-s) solid var(--emerald-primary-600);
  outline-offset: 1px;
}

.emerald-radio__box[data-disabled] {
  background: var(--emerald-neutral-200);
  border-color: var(--emerald-neutral-300);
  box-shadow: none;
}

.emerald-radio__indicator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
}

.emerald-radio__dot {
  display: block;
  width: var(--emerald-radio-dot, 10px);
  height: var(--emerald-radio-dot, 10px);
  border-radius: var(--emerald-radius-full);
  background: var(--emerald-primary-600);
}

.emerald-radio__box[data-disabled] .emerald-radio__dot {
  background: var(--emerald-neutral-500);
}
</style>
