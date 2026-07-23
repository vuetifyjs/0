<script lang="ts">
  export interface EmStepperIconProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmStepperIcon' })
</script>

<template>
  <span class="emerald-stepper__icon">
    <span class="emerald-stepper__icon-container">
      <slot>
        <span class="emerald-stepper__icon-indicator" />
      </slot>
    </span>
  </span>
</template>

<style>
.emerald-stepper__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--emerald-spacing-2xs);
  background: var(--emerald-background);
  border: var(--emerald-stroke-s) solid var(--emerald-divider);
  border-radius: var(--emerald-radius-s);
  box-shadow: var(--emerald-shadow-m);
  transition: border-color 120ms ease, box-shadow 120ms ease;
}

.emerald-stepper__icon-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: var(--emerald-neutral-200);
  border-radius: var(--emerald-radius-xs);
  color: var(--emerald-neutral-600);
  transition: background 120ms ease, color 120ms ease;
}

.emerald-stepper__icon-container svg {
  width: 16px;
  height: 16px;
}

.emerald-stepper__icon-indicator {
  width: 8px;
  height: 8px;
  background: currentColor;
  border-radius: var(--emerald-radius-full);
  opacity: 0.6;
}

/* Current step — spec focus-small ring, border/default */
.emerald-stepper__item[data-selected] .emerald-stepper__icon {
  border-color: var(--emerald-border);
  box-shadow:
    0 0 0 2px var(--emerald-primary-alpha-20),
    var(--emerald-shadow-m);
}

/* Done step — green border, tinted icon container, white card */
.emerald-stepper__item[data-completed] .emerald-stepper__icon {
  border-color: var(--emerald-primary-500);
}

.emerald-stepper__item[data-completed] .emerald-stepper__icon-container {
  background: var(--emerald-primary-100);
  color: var(--emerald-success-600);
}
</style>
