<script lang="ts">
  export interface EmAlertBodyProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmAlertBody' })
</script>

<template>
  <div class="emerald-alert__body">
    <slot />
  </div>
</template>
