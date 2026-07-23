<script lang="ts">
  export interface EmTextareaIconProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTextareaIcon' })
</script>

<template>
  <span class="emerald-textarea__icon">
    <slot />
  </span>
</template>

<style>
.emerald-textarea__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--emerald-icon-m, 20px);
  height: var(--emerald-icon-m, 20px);
  /* Places the icon after the auto-rendered mandatory asterisk inside the label row */
  order: 1;
}

.emerald-textarea__icon > * {
  width: 100%;
  height: 100%;
}
</style>
