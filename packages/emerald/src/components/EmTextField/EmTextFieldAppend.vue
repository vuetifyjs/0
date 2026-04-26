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
  color: rgb(var(--emerald-neutral-channels, 26 28 30) / 0.6);
}
</style>
