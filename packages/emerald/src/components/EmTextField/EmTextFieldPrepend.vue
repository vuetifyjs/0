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

<style>
.emerald-text-field__prepend {
  display: inline-flex;
  align-items: center;
  color: rgb(var(--emerald-neutral-channels, 26 28 30) / 0.6);
}
</style>
