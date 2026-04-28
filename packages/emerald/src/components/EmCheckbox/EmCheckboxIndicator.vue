<script lang="ts">
  // Framework
  import { CheckboxIndicator, useCheckboxRoot } from '@vuetify/v0'

  export interface EmCheckboxIndicatorProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmCheckboxIndicator' })

  const root = useCheckboxRoot('v0:checkbox:root')
</script>

<template>
  <span
    aria-hidden="true"
    class="emerald-checkbox__box"
    :data-disabled="root.isDisabled.value || undefined"
    :data-state="root.isMixed.value ? 'indeterminate' : (root.isChecked.value ? 'checked' : 'unchecked')"
  >
    <CheckboxIndicator class="emerald-checkbox__indicator">
      <template #default="{ isMixed }">
        <svg
          v-if="isMixed"
          class="emerald-checkbox__glyph"
          fill="none"
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 8h10"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-width="2.25"
          />
        </svg>
        <svg
          v-else
          class="emerald-checkbox__glyph"
          fill="none"
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 8.5L6.5 12L13 4.5"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.25"
          />
        </svg>
      </template>
    </CheckboxIndicator>
  </span>
</template>

<style>
.emerald-checkbox__box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 20px;
  height: 20px;
  border: 1px solid rgb(var(--emerald-neutral-channels, 26 28 30) / 0.25);
  border-radius: 3px;
  background: transparent;
  color: #ffffff;
  transition:
    background-color 120ms ease,
    border-color 120ms ease,
    box-shadow 120ms ease;
  flex-shrink: 0;
}

.emerald-checkbox[data-size="sm"] .emerald-checkbox__box {
  width: 16px;
  height: 16px;
}

.emerald-checkbox[data-size="lg"] .emerald-checkbox__box {
  width: 24px;
  height: 24px;
}

.emerald-checkbox:hover .emerald-checkbox__box[data-state="unchecked"]:not([data-disabled]) {
  border-color: rgb(var(--emerald-primary-500-channels, 124 92 246) / 0.5);
}

.emerald-checkbox__box[data-state="checked"],
.emerald-checkbox__box[data-state="indeterminate"] {
  background: var(--emerald-primary-500, #7c5cf6);
  border: 2px solid var(--emerald-primary-700, #5f3aed);
}

.emerald-checkbox:hover .emerald-checkbox__box[data-state="checked"]:not([data-disabled]),
.emerald-checkbox:hover .emerald-checkbox__box[data-state="indeterminate"]:not([data-disabled]) {
  background: var(--emerald-primary-600, #5f3aed);
  border-color: var(--emerald-primary-800);
}

.emerald-checkbox__box[data-disabled] {
  background: transparent;
  border-color: rgb(var(--emerald-neutral-channels, 26 28 30) / 0.15);
  box-shadow: none;
}

.emerald-checkbox__box[data-disabled][data-state="checked"],
.emerald-checkbox__box[data-disabled][data-state="indeterminate"] {
  background: rgb(var(--emerald-neutral-channels, 26 28 30) / 0.15);
  border: 1px solid rgb(var(--emerald-neutral-channels, 26 28 30) / 0.2);
}

.emerald-checkbox__indicator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: inherit;
  line-height: 0;
}

.emerald-checkbox__glyph {
  width: 16px;
  height: 16px;
  color: #ffffff;
}

.emerald-checkbox[data-size="sm"] .emerald-checkbox__glyph {
  width: 12px;
  height: 12px;
}

.emerald-checkbox[data-size="lg"] .emerald-checkbox__glyph {
  width: 20px;
  height: 20px;
}

.emerald-checkbox__box[data-disabled] .emerald-checkbox__glyph {
  color: rgb(var(--emerald-neutral-channels, 26 28 30) / 0.45);
}
</style>
