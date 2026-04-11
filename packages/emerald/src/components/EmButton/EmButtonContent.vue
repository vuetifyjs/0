<script lang="ts">
  export interface EmButtonContentProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmButtonContent' })
</script>

<template>
  <span class="emerald-button__content">
    <slot />
  </span>
</template>
