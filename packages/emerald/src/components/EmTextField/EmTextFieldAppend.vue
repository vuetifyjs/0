<script lang="ts">
  export interface EmTextFieldAppendProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTextFieldAppend' })
</script>

<template>
  <span class="emerald-text-field__append">
    <slot />
  </span>
</template>
