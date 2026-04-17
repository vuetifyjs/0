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
