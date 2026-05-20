<script lang="ts">
  // Framework
  import { useCheckboxRoot } from '@vuetify/v0'

  // Types
  import type { CheckboxRootContext } from '@vuetify/v0'

  export interface EmCheckboxLabelProps {
    for?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmCheckboxLabel' })

  const { for: forProp } = defineProps<EmCheckboxLabelProps>()

  // Optional injection — label may sit outside a CheckboxRoot
  let root: CheckboxRootContext<unknown> | null = null
  try {
    root = useCheckboxRoot('v0:checkbox:root')
  } catch {
    // standalone usage, no root context
  }
</script>

<template>
  <label
    class="emerald-checkbox__label"
    :for="forProp ?? (root?.id as string | undefined)"
  >
    <slot />
  </label>
</template>

<style>
.emerald-checkbox__label {
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.4;
  color: var(--emerald-on-background, #1a1c1e);
  cursor: pointer;
  user-select: none;
}

.emerald-checkbox[data-disabled] .emerald-checkbox__label,
.emerald-checkbox__label[data-disabled] {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
