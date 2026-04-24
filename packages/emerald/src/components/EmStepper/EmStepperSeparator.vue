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
  height: 2px;
  width: 64px;
  border-radius: 8px;
  background: rgb(var(--emerald-neutral-channels) / 0.1);
  flex-shrink: 0;
  transition: background 120ms ease;
}

/* Separator turns green when it follows a completed step */
.emerald-stepper__item[data-completed] + .emerald-stepper__separator {
  background: var(--emerald-success-100);
}
</style>
