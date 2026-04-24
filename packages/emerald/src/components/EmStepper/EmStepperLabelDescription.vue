<script lang="ts">
  export interface EmStepperLabelDescriptionProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmStepperLabelDescription' })
</script>

<template>
  <span class="emerald-stepper__label-description">
    <slot />
  </span>
</template>

<style>
.emerald-stepper__label-description {
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-weight: 400;
  font-size: 12px;
  letter-spacing: -0.12px;
  color: var(--emerald-neutral-600);
  opacity: 0.6;
}
</style>
