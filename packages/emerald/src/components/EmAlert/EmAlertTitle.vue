<script lang="ts">
  export interface EmAlertTitleProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmAlertTitle' })
</script>

<template>
  <div class="emerald-alert__title">
    <slot />
  </div>
</template>
