<script lang="ts">
  export interface EmAlertIconProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmAlertIcon' })
</script>

<template>
  <span aria-hidden="true" class="emerald-alert__icon">
    <slot />
  </span>
</template>
