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
  gap: 10px;
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  color: var(--emerald-on-background);
  font-size: 14px;
  line-height: 1.4;
  cursor: pointer;
  user-select: none;
  border-radius: 999px;
  padding: 2px 8px 2px 2px;
  transition: box-shadow 120ms ease;
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

/* Focus ring on the whole label (control + text) */
.emerald-radio:has(.emerald-radio__root:focus-visible) {
  box-shadow: 0 0 0 2px rgb(var(--emerald-primary-500-channels, 124 92 246) / 0.35);
}
</style>
