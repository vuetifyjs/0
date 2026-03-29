<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Framework
  import { InputControl, InputRoot } from '@vuetify/v0'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface HxInputProps extends V0PaperProps {
    placeholder?: string
    disabled?: boolean
    type?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'HxInput' })

  const {
    placeholder,
    disabled = false,
    type = 'text',
    ...paperProps
  } = defineProps<HxInputProps>()

  const model = defineModel<string>({ default: '' })
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="div"
    class="helix-input"
    :data-disabled="disabled || undefined"
  >
    <InputRoot
      v-model="model"
      :disabled
      :type
    >
      <InputControl
        class="helix-input__control"
        :placeholder
      />
    </InputRoot>
  </V0Paper>
</template>

<style scoped>
.helix-input {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--v0-divider);
  border-radius: 0.375rem;
  background-color: var(--v0-surface);
  transition: border-color 0.15s;
}

.helix-input:focus-within {
  border-color: var(--v0-primary);
  outline: 1px solid var(--v0-primary);
}

.helix-input__control {
  border: none;
  outline: none;
  background: transparent;
  font: inherit;
  color: var(--v0-on-surface);
  width: 100%;
}

.helix-input__control::placeholder {
  color: var(--v0-on-surface-variant);
  opacity: 0.6;
}

.helix-input[data-disabled] {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
</style>
