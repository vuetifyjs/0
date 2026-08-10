<script lang="ts">
  // Framework
  import { ExpansionPanel } from '@vuetify/v0'

  // Components
  import EmIcon from '../EmIcon/EmIcon.vue'

  // Types
  import type { ExpansionPanelCueProps } from '@vuetify/v0'

  export interface EmExpansionPanelCueProps extends Omit<ExpansionPanelCueProps, 'as' | 'renderless'> {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmExpansionPanelCue' })

  const { namespace } = defineProps<EmExpansionPanelCueProps>()
</script>

<template>
  <ExpansionPanel.Cue v-slot="slotProps" class="emerald-expansion-panel__cue" :namespace>
    <slot v-bind="slotProps">
      <EmIcon class="emerald-expansion-panel__chevron" name="chevron-down" />
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
    --emerald-icon-size: 16px;
    --emerald-icon-stroke: 2;
  }
</style>
