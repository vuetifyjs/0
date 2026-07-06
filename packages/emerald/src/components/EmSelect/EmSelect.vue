<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Framework
  import { SelectRoot } from '@vuetify/v0'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'
  import type { ID } from '@vuetify/v0'

  export interface EmSelectProps extends V0PaperProps {
    disabled?: boolean
    multiple?: boolean
    mandatory?: boolean | 'force'
    name?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmSelect' })

  const {
    disabled = false,
    multiple = false,
    mandatory = false,
    name,
    ...paperProps
  } = defineProps<EmSelectProps>()

  const model = defineModel<ID | ID[] | undefined>()
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="div"
    class="emerald-select"
    :data-disabled="disabled || undefined"
  >
    <SelectRoot
      v-model="model"
      :disabled
      :mandatory
      :multiple
      :name
    >
      <template #default="slotProps">
        <slot v-bind="slotProps" />
      </template>
    </SelectRoot>
  </V0Paper>
</template>

<style>
.emerald-select {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  gap: 0;
  font-family: var(--emerald-font-sans);
  font-size: var(--emerald-text-b1-size);
  font-weight: var(--emerald-text-b1-weight);
  line-height: var(--emerald-text-b1-height);
  color: var(--emerald-on-surface);
}

.emerald-select[data-disabled] {
  opacity: 0.5;
  pointer-events: none;
}
</style>
