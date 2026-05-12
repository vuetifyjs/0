<script lang="ts">
  export interface EmButtonLoaderProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmButtonLoader' })
</script>

<template>
  <span aria-hidden="true" class="emerald-button__loader">
    <slot>
      <span class="emerald-button__spinner" />
    </slot>
  </span>
</template>

<style>
.emerald-button__loader {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
}

.emerald-button__spinner {
  display: inline-block;
  width: 1em;
  height: 1em;
  border-radius: 50%;
  border: 2px solid currentColor;
  border-top-color: transparent;
  animation: emerald-button-spin 700ms linear infinite;
}

@keyframes emerald-button-spin {
  to { transform: rotate(360deg); }
}
</style>
