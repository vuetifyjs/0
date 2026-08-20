<script lang="ts">
  // Framework
  import { ExpansionPanel } from '@vuetify/v0'

  // Types
  import type { ExpansionPanelGroupProps } from '@vuetify/v0'

  export interface EmExpansionPanelGroupProps extends Omit<ExpansionPanelGroupProps, 'as' | 'renderless'> {}
</script>

<script lang="ts" setup generic="T = unknown">
  defineOptions({ name: 'EmExpansionPanelGroup' })

  const {
    disabled = false,
    enroll = false,
    mandatory = false,
    multiple = false,
    namespace,
  } = defineProps<EmExpansionPanelGroupProps>()

  const model = defineModel<T | T[]>()
</script>

<template>
  <ExpansionPanel.Group
    v-slot="slotProps"
    v-model="model"
    as="div"
    class="emerald-expansion-panel-group"
    :data-disabled="disabled || undefined"
    :disabled
    :enroll
    :mandatory
    :multiple
    :namespace
  >
    <slot v-bind="slotProps" />
  </ExpansionPanel.Group>
</template>

<style>
  .emerald-expansion-panel-group {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-xs, 8px);
    width: 100%;
    font-family: var(--emerald-font-sans, Manrope, system-ui, sans-serif);
  }
</style>
