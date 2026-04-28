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
  gap: 2px;
  line-height: 1.3;
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-weight: 700;
  font-size: 12px;
  color: var(--emerald-neutral-700, #4b5563);
}
</style>
