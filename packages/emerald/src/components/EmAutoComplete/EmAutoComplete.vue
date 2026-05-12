<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Framework
  import { ComboboxRoot } from '@vuetify/v0'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'
  import type { ID } from '@vuetify/v0'

  export interface EmAutoCompleteProps extends V0PaperProps {
    disabled?: boolean
    multiple?: boolean
    mandatory?: boolean
    strict?: boolean
    error?: boolean
    errorMessages?: string | string[]
    name?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmAutoComplete' })

  const {
    disabled = false,
    multiple = false,
    mandatory = false,
    strict = false,
    error = false,
    errorMessages,
    name,
    ...paperProps
  } = defineProps<EmAutoCompleteProps>()

  const model = defineModel<ID | ID[]>()
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="div"
    class="emerald-auto-complete"
    :data-disabled="disabled || undefined"
    :data-error="error || undefined"
  >
    <ComboboxRoot
      v-model="model"
      :disabled
      :error
      :error-messages
      :mandatory
      :multiple
      :name
      :strict
    >
      <template #default="slotProps">
        <slot v-bind="slotProps" />
      </template>
    </ComboboxRoot>
  </V0Paper>
</template>

<style>
.emerald-auto-complete {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  gap: 4px;
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-size: 12px;
  line-height: 20px;
  color: #000000;
}

.emerald-auto-complete[data-disabled] {
  opacity: 0.5;
  pointer-events: none;
}
</style>
