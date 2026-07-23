<script lang="ts">
  export interface EmTextFieldInfoProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTextFieldInfo' })
</script>

<template>
  <span class="emerald-text-field__info">
    <slot />
  </span>
</template>

<style>
.emerald-text-field__info {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: var(--emerald-icon-m, 20px);
  block-size: var(--emerald-icon-m, 20px);
  /* Paints after the mandatory asterisk when slotted inside EmTextFieldLabel — spec order is Label, *, info-icon */
  order: 1;
}
</style>
