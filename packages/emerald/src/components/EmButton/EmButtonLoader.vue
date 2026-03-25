<script lang="ts">
  export interface EmButtonLoaderProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmButtonLoader' })
</script>

<template>
  <span aria-hidden="true" class="emerald-button__loader">
    <slot />
  </span>
</template>
