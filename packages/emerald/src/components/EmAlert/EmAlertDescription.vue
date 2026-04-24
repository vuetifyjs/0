<script lang="ts">
  export interface EmAlertDescriptionProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmAlertDescription' })
</script>

<template>
  <div class="emerald-alert__description">
    <slot />
  </div>
</template>
