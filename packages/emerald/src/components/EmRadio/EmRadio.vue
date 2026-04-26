<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Framework
  import { RadioRoot } from '@vuetify/v0'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'
  import type { MaybeRefOrGetter } from 'vue'

  export type EmRadioSize = 'sm' | 'md' | 'lg'

  export interface EmRadioProps extends V0PaperProps {
    disabled?: MaybeRefOrGetter<boolean>
    name?: string
    value?: unknown
    label?: string
    size?: EmRadioSize
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmRadio' })

  const {
    disabled = false,
    name,
    value,
    label,
    size = 'md',
    ...paperProps
  } = defineProps<EmRadioProps>()
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="label"
    class="emerald-radio"
    :data-disabled="disabled || undefined"
    :data-size="size"
  >
    <RadioRoot
      as="span"
      class="emerald-radio__root"
      :disabled
      :label
      :name
      :value
    >
      <template #default="slotProps">
        <slot v-bind="slotProps" />
      </template>
    </RadioRoot>
  </V0Paper>
</template>

<style>
.emerald-radio {
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

.emerald-radio[data-disabled] {
  cursor: not-allowed;
  opacity: 0.6;
}

.emerald-radio__root {
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

.emerald-radio__root:focus-visible::after {
  content: '';
  position: absolute;
  inset: -3px;
  border: 1px solid var(--emerald-primary-500, #7c5cf6);
  border-radius: 50%;
  pointer-events: none;
}
</style>
