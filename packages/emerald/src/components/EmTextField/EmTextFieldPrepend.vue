<script lang="ts">
  export interface EmTextFieldPrependProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTextFieldPrepend' })
</script>

<template>
  <span class="emerald-text-field__prepend">
    <slot />
  </span>
</template>
