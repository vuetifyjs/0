<script lang="ts">
  export interface EmButtonPrependProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmButtonPrepend' })
</script>

<template>
  <span class="emerald-button__prepend">
    <slot />
  </span>
</template>
