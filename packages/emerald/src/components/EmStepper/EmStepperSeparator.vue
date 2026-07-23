<script lang="ts">
  export interface EmStepperSeparatorProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmStepperSeparator' })
</script>

<template>
  <span
    aria-hidden="true"
    class="emerald-stepper__separator"
  />
</template>

<style>
.emerald-stepper__separator {
  height: var(--emerald-stroke-m);
  flex: 1 0 64px;
  background: var(--emerald-divider);
}
</style>
