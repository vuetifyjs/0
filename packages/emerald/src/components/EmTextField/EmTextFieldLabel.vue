<script lang="ts">
  // Framework
  import { useInputRoot } from '@vuetify/v0'

  export interface EmTextFieldLabelProps {
    for?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTextFieldLabel' })

  const root = useInputRoot('v0:input:root')
</script>

<template>
  <label
    class="emerald-text-field__label"
    :for="root.id as string"
  >
    <slot />
  </label>
</template>
