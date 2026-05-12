<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Framework
  import { InputRoot } from '@vuetify/v0'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'
  import type { FormValidationRule, ValidateOn } from '@vuetify/v0'
  import type { MaybeRefOrGetter } from 'vue'

  export interface EmTextareaProps extends V0PaperProps {
    disabled?: MaybeRefOrGetter<boolean>
    readonly?: MaybeRefOrGetter<boolean>
    required?: boolean
    name?: string
    label?: string
    rules?: FormValidationRule[]
    validateOn?: ValidateOn
    error?: boolean
    errorMessages?: string | string[]
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTextarea' })

  const {
    disabled = false,
    readonly: _readonly = false,
    required = false,
    name,
    label,
    rules = [],
    validateOn = 'blur',
    error = false,
    errorMessages,
    ...paperProps
  } = defineProps<EmTextareaProps>()

  const model = defineModel<string>({ default: '' })
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="div"
    class="emerald-textarea"
    :data-disabled="disabled || undefined"
    :data-error="error || undefined"
  >
    <InputRoot
      v-model="model"
      :disabled
      :error
      :error-messages
      :label
      :name
      :readonly="_readonly"
      :required
      :rules
      :validate-on
    >
      <template #default="slotProps">
        <slot v-bind="slotProps" />
      </template>
    </InputRoot>
  </V0Paper>
</template>

<style>
.emerald-textarea {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-family: Manrope, system-ui, -apple-system, sans-serif;
}

.emerald-textarea[data-error] .emerald-textarea__label {
  color: var(--emerald-error-700, #b8302a);
}

.emerald-textarea[data-disabled] {
  pointer-events: none;
}
</style>
