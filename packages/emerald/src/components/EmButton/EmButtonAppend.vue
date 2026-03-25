<script lang="ts">
  export interface EmButtonAppendProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmButtonAppend' })
</script>

<template>
  <span class="emerald-button__append">
    <slot />
  </span>
</template>
