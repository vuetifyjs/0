<script lang="ts">
  export interface EmToastTitleProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmToastTitle' })
</script>

<template>
  <div class="emerald-toast__title">
    <slot />
  </div>
</template>
