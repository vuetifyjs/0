<script lang="ts">
  export interface EmCardHeaderProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmCardHeader' })
</script>

<template>
  <div class="emerald-card__header">
    <slot />
  </div>
</template>

<style>
.emerald-card__header {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 24px 24px 0;
}
</style>
