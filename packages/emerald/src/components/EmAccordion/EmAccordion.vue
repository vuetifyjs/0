<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Framework
  import { ExpansionPanelGroup } from '@vuetify/v0'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface EmAccordionProps extends V0PaperProps {
    disabled?: boolean
    multiple?: boolean
    mandatory?: boolean | 'force'
  }
</script>

<script setup lang="ts" generic="T">
  defineOptions({ name: 'EmAccordion' })

  const {
    disabled = false,
    multiple = false,
    mandatory = false,
    ...paperProps
  } = defineProps<EmAccordionProps>()

  const model = defineModel<T | T[]>()
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="div"
    class="emerald-accordion"
    :data-disabled="disabled || undefined"
  >
    <ExpansionPanelGroup
      v-model="model"
      :disabled
      :mandatory
      :multiple
    >
      <template #default="slotProps">
        <slot v-bind="slotProps" />
      </template>
    </ExpansionPanelGroup>
  </V0Paper>
</template>

<style>
.emerald-accordion {
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  color: #000000;
}
</style>
