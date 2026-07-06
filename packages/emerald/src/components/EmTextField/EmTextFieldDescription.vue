<script lang="ts">
  // Framework
  import { InputDescription } from '@vuetify/v0'

  export interface EmTextFieldDescriptionProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTextFieldDescription' })
</script>

<template>
  <InputDescription class="emerald-text-field__description">
    <slot />
  </InputDescription>
</template>

<style>
.emerald-text-field__description {
  font-size: var(--emerald-text-b3-size, 12px);
  font-weight: var(--emerald-text-b3-weight, 400);
  line-height: var(--emerald-text-b3-height, 18px);
  color: var(--emerald-neutral-700, #757E85);
}

.emerald-text-field [data-state="invalid"] .emerald-text-field__description {
  color: var(--emerald-danger-600, #A1000E);
}
</style>
