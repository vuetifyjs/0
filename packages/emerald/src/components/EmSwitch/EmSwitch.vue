<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Framework
  import { SwitchRoot } from '@vuetify/v0'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'
  import type { MaybeRefOrGetter } from 'vue'

  export type EmSwitchSize = 'sm' | 'md' | 'lg'

  export interface EmSwitchProps extends V0PaperProps {
    disabled?: MaybeRefOrGetter<boolean>
    name?: string
    value?: unknown
    label?: string
    size?: EmSwitchSize
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmSwitch' })

  const {
    disabled = false,
    name,
    value,
    label,
    size = 'md',
    ...paperProps
  } = defineProps<EmSwitchProps>()

  const model = defineModel<boolean>({ default: false })
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="label"
    class="emerald-switch"
    :data-disabled="disabled || undefined"
    :data-size="size"
  >
    <SwitchRoot
      v-model="model"
      class="emerald-switch__root"
      :disabled
      :label
      :name
      :value
    >
      <template #default="slotProps">
        <slot v-bind="slotProps" />
      </template>
    </SwitchRoot>

    <span v-if="label" class="emerald-switch__label">{{ label }}</span>
  </V0Paper>
</template>

<style>
.emerald-switch {
  display: inline-flex;
  align-items: center;
  gap: var(--emerald-spacing-xs, 8px);
  font-family: var(--emerald-font-sans, Manrope, system-ui, -apple-system, sans-serif);
  color: var(--emerald-on-background);
  cursor: pointer;
  user-select: none;
}

.emerald-switch[data-disabled] {
  cursor: not-allowed;
}

.emerald-switch__root {
  display: inline-flex;
  align-items: center;
  position: relative;
  background: transparent;
  border: 0;
  padding: 0;
  margin: 0;
  outline: none;
  flex-shrink: 0;
  font: inherit;
  color: inherit;
  cursor: inherit;
}

.emerald-switch__label {
  font-size: var(--emerald-text-b1-size, 16px);
  line-height: var(--emerald-text-b1-height, 24px);
  font-weight: var(--emerald-text-b1-bold-weight, 700);
  color: var(--emerald-on-surface, #2b2d2e);
}

.emerald-switch__root:focus-visible::after {
  content: '';
  position: absolute;
  inset: -1px -2px;
  border: 1px solid var(--emerald-primary-600, #1fae60);
  border-radius: var(--emerald-radius-full, 999px);
  pointer-events: none;
}

.emerald-switch__root[data-state="checked"]:focus-visible::after {
  inset: -1px;
}
</style>
