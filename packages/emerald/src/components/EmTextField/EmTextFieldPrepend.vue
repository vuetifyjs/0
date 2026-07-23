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
  justify-content: center;
  inline-size: var(--emerald-icon-l, 24px);
  block-size: var(--emerald-icon-l, 24px);
  color: var(--emerald-neutral-700, #757E85);
}
</style>
