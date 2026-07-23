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
  display: block;
  font-size: var(--emerald-text-b2-size);
  line-height: var(--emerald-text-b2-height);
  font-weight: var(--emerald-text-b2-weight);
  color: var(--emerald-on-background);
  opacity: 0.6;
}
</style>
