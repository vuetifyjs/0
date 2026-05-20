<script lang="ts">
  // Framework
  import { useRadioRoot } from '@vuetify/v0'

  // Types
  import type { RadioRootContext } from '@vuetify/v0'

  export interface EmRadioLabelProps {
    for?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmRadioLabel' })

  const { for: forProp } = defineProps<EmRadioLabelProps>()

  // Optional injection — label may sit outside a RadioRoot
  let root: RadioRootContext | null = null
  try {
    root = useRadioRoot('v0:radio:root')
  } catch {
    // standalone usage, no root context
  }
</script>

<template>
  <label
    class="emerald-radio__label"
    :for="forProp ?? (root?.id as string | undefined)"
  >
    <slot />
  </label>
</template>

<style>
.emerald-radio__label {
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.4;
  color: var(--emerald-on-background, #1a1c1e);
  cursor: pointer;
  user-select: none;
}

.emerald-radio[data-disabled] .emerald-radio__label,
.emerald-radio__label[data-disabled] {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
