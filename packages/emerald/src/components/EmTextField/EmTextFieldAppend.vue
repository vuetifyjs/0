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

<style>
.emerald-text-field__append {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: var(--emerald-icon-l, 24px);
  block-size: var(--emerald-icon-l, 24px);
  color: var(--emerald-neutral-700, #757E85);
}
</style>
