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
      as="span"
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
  </V0Paper>
</template>

<style>
.emerald-switch {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  color: var(--emerald-on-background);
  font-size: 14px;
  line-height: 1.4;
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
}

.emerald-switch__root:focus-visible::after {
  content: '';
  position: absolute;
  inset: -3px;
  border: 1px solid var(--emerald-primary-500, #7c5cf6);
  border-radius: 999px;
  pointer-events: none;
}
</style>
