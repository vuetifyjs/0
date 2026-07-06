<script lang="ts">
  // Framework
  import { useInputRoot } from '@vuetify/v0'

  export interface EmTextFieldLabelProps {
    for?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTextFieldLabel' })

  const { for: forId } = defineProps<EmTextFieldLabelProps>()

  const root = useInputRoot('v0:input:root')
</script>

<template>
  <label
    class="emerald-text-field__label"
    :for="forId ?? String(root.id)"
  >
    <slot />

    <span
      v-if="root.required"
      aria-hidden="true"
      class="emerald-text-field__mandatory"
    >*</span>
  </label>
</template>

<style>
.emerald-text-field__label {
  display: inline-flex;
  align-items: center;
  gap: var(--emerald-spacing-2xs, 4px);
  font-size: var(--emerald-text-b1-size, 16px);
  font-weight: var(--emerald-text-b1-bold-weight, 700);
  line-height: var(--emerald-text-b1-height, 24px);
  color: var(--emerald-neutral-1000, #2B2D2E);
}

.emerald-text-field__mandatory {
  color: var(--emerald-danger-600, #A1000E);
}
</style>
