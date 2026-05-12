<script lang="ts">
  export interface EmToastIconProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmToastIcon' })
</script>

<template>
  <span aria-hidden="true" class="emerald-toast__icon">
    <slot />
  </span>
</template>
