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
  gap: 10px;
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  color: var(--emerald-on-background);
  font-size: 14px;
  line-height: 1.4;
  cursor: pointer;
  user-select: none;
  border-radius: 6px;
  padding: 2px 6px 2px 2px;
  transition: box-shadow 120ms ease;
}

.emerald-checkbox[data-disabled] {
  cursor: not-allowed;
  opacity: 0.6;
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

/* Focus ring on the whole label (control + text) */
.emerald-checkbox:has(.emerald-checkbox__root:focus-visible) {
  box-shadow: 0 0 0 2px rgb(var(--emerald-primary-500-channels, 124 92 246) / 0.35);
}
</style>
