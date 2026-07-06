<script lang="ts">
  export interface EmStepperLabelProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmStepperLabel' })
</script>

<template>
  <span class="emerald-stepper__label">
    <slot />
  </span>
</template>

<style>
.emerald-stepper__label {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--emerald-spacing-3xs);
  font-size: var(--emerald-text-b2-size);
  line-height: var(--emerald-text-b2-height);
  font-weight: var(--emerald-text-b2-bold-weight);
  color: var(--emerald-on-background);
}

/* Spec: label + description render only on the current step */
.emerald-stepper__item:not([data-selected]) .emerald-stepper__label {
  display: none;
}
</style>
