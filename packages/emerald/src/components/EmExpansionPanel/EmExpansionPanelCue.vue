<script lang="ts">
  // Framework
  import { ExpansionPanel } from '@vuetify/v0'

  export interface EmExpansionPanelCueProps {
    namespace?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmExpansionPanelCue' })

  const { namespace } = defineProps<EmExpansionPanelCueProps>()
</script>

<template>
  <ExpansionPanel.Cue v-slot="slotProps" class="emerald-expansion-panel__cue" :namespace>
    <slot v-bind="slotProps">
      <svg
        aria-hidden="true"
        class="emerald-expansion-panel__chevron"
        fill="none"
        height="16"
        viewBox="0 0 24 24"
        width="16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6 9l6 6 6-6"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
        />
      </svg>
    </slot>
  </ExpansionPanel.Cue>
</template>

<style>
  .emerald-expansion-panel__cue {
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    color: var(--emerald-neutral-700, #757e85);
    transition: transform var(--emerald-motion-duration-base, 180ms)
      var(--emerald-motion-ease-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .emerald-expansion-panel__cue[data-state='open'] {
    transform: rotate(180deg);
  }

  .emerald-expansion-panel__chevron {
    display: block;
  }
</style>
