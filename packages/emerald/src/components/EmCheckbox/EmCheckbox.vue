<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Framework
  import { CheckboxRoot } from '@vuetify/v0'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'
  import type { MaybeRefOrGetter } from 'vue'

  export type EmCheckboxSize = 'sm' | 'md' | 'lg'

  export interface EmCheckboxProps extends V0PaperProps {
    disabled?: MaybeRefOrGetter<boolean>
    indeterminate?: MaybeRefOrGetter<boolean>
    name?: string
    value?: unknown
    label?: string
    size?: EmCheckboxSize
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmCheckbox' })

  const {
    disabled = false,
    indeterminate = false,
    name,
    value,
    label,
    size = 'md',
    ...paperProps
  } = defineProps<EmCheckboxProps>()

  const model = defineModel<boolean>({ default: false })
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="label"
    class="emerald-checkbox"
    :data-disabled="disabled || undefined"
    :data-size="size"
  >
    <CheckboxRoot
      v-model="model"
      as="span"
      class="emerald-checkbox__root"
      :disabled
      :indeterminate
      :label
      :name
      :value
    >
      <template #default="slotProps">
        <slot v-bind="slotProps" />
      </template>
    </CheckboxRoot>
  </V0Paper>
</template>

<style>
.emerald-checkbox {
  display: inline-flex;
  align-items: center;
  gap: var(--emerald-spacing-2xs);
  font-family: var(--emerald-font-sans);
  color: var(--emerald-on-background);
  font-size: var(--emerald-text-b1-size);
  font-weight: var(--emerald-text-b1-weight);
  line-height: var(--emerald-text-b1-height);
  cursor: pointer;
  user-select: none;
}

.emerald-checkbox[data-disabled] {
  cursor: not-allowed;
}

.emerald-checkbox__root {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: transparent;
  border: 0;
  padding: 0;
  margin: 0;
  outline: none;
  flex-shrink: 0;
}
</style>
