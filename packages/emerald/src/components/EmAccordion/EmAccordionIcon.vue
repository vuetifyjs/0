<script lang="ts">
  // Framework
  import { ExpansionPanelCue } from '@vuetify/v0'

  export interface EmAccordionIconProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmAccordionIcon' })
</script>

<template>
  <ExpansionPanelCue class="emerald-accordion__icon">
    <template #default="slotProps">
      <slot v-bind="slotProps">
        <svg
          class="emerald-accordion__state"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
            stroke="currentColor"
            stroke-miterlimit="10"
            stroke-width="2"
          />

          <path
            d="M8.25 12H15.75"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          />

          <path
            class="emerald-accordion__state-bar"
            d="M12 8.25V15.75"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          />
        </svg>
      </slot>
    </template>
  </ExpansionPanelCue>
</template>

<style>
.emerald-accordion__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--emerald-spacing-xl);
  height: var(--emerald-spacing-xl);
  color: var(--emerald-primary-600);
  flex-shrink: 0;
}

.emerald-accordion__state {
  width: 100%;
  height: 100%;
}

.emerald-accordion__state-bar {
  transition: opacity 280ms cubic-bezier(0.4, 0, 0.2, 1);
}

.emerald-accordion__icon[data-state="open"] .emerald-accordion__state-bar {
  opacity: 0;
}
</style>
