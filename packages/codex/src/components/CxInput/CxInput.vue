<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Framework
  import { InputControl, InputRoot } from '@vuetify/v0'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxInputProps extends V0PaperProps {
    placeholder?: string
    disabled?: boolean
    type?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxInput' })

  const {
    placeholder,
    disabled = false,
    type = 'text',
    ...paperProps
  } = defineProps<CxInputProps>()

  const model = defineModel<string>({ default: '' })
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="div"
    class="codex-input"
    :data-disabled="disabled || undefined"
  >
    <InputRoot
      v-model="model"
      :disabled
      :type
    >
      <InputControl
        class="codex-input__control"
        :placeholder
      />
    </InputRoot>
  </V0Paper>
</template>

<style scoped>
.codex-input__control {
  border: none;
  outline: none;
  background: transparent;
  font: inherit;
  width: 100%;
}

.codex-input[data-disabled] {
  cursor: not-allowed;
  pointer-events: none;
}
</style>
