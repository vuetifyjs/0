<script lang="ts">
  // Framework
  import { ExpansionPanelCue } from '@vuetify/v0'

  export interface EmAccordionCueProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmAccordionCue' })
</script>

<template>
  <ExpansionPanelCue class="emerald-accordion__cue">
    <template #default="slotProps">
      <slot v-bind="slotProps">
        <svg
          class="emerald-accordion__caret"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            d="M19.5 9L12 16.5L4.5 9"
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
.emerald-accordion__cue {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--emerald-spacing-xl);
  height: var(--emerald-spacing-xl);
  color: var(--emerald-neutral-800);
  flex-shrink: 0;
}

.emerald-accordion__caret {
  width: 100%;
  height: 100%;
  transition: rotate 280ms cubic-bezier(0.4, 0, 0.2, 1);
}

.emerald-accordion__cue[data-state="open"] .emerald-accordion__caret {
  rotate: 180deg;
}
</style>
