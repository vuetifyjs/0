<script lang="ts">
  export interface EmUploadListProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmUploadList' })
</script>

<template>
  <ul class="emerald-upload__list">
    <slot />
  </ul>
</template>

<style>
.emerald-upload__list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0;
  margin: 0;
  list-style: none;
}
</style>
