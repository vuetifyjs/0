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

<style scoped>
.emerald-radio {
  --emerald-radio-control: 20px;
  --emerald-radio-dot: 10px;

  display: inline-flex;
  align-items: center;
  gap: var(--emerald-spacing-2xs);
  font-family: var(--emerald-font-sans);
  color: var(--emerald-on-background);
  font-size: var(--emerald-text-b1-size);
  font-weight: var(--emerald-text-b1-bold-weight);
  line-height: var(--emerald-text-b1-height);
  cursor: pointer;
  user-select: none;
}

.emerald-radio[data-size="sm"] {
  --emerald-radio-control: 16px;
  --emerald-radio-dot: 8px;
}

.emerald-radio[data-size="lg"] {
  --emerald-radio-control: 24px;
  --emerald-radio-dot: 12px;
}

.emerald-radio[data-disabled] {
  cursor: not-allowed;
}

/* :deep — RadioRoot is a multi-root v0 component (Atom + optional hidden input), so it never receives this scope attribute */
.emerald-radio :deep(.emerald-radio__root) {
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
