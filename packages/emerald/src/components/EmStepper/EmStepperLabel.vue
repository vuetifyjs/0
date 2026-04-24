<script lang="ts">
  export interface EmStepperLabelProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmStepperLabel' })
</script>

<template>
  <span class="emerald-stepper__label">
    <span class="emerald-stepper__label-title">
      <slot />
    </span>
  </span>
</template>

<style>
.emerald-stepper__label {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: normal;
}

.emerald-stepper__label-title {
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-weight: 700;
  font-size: 12px;
  color: var(--emerald-neutral-600);
}
</style>
