<script lang="ts">
  export interface EmToastDescriptionProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmToastDescription' })
</script>

<template>
  <div class="emerald-toast__description">
    <slot />
  </div>
</template>

<style scoped>
.emerald-toast__description {
  width: 100%;
  font-size: var(--emerald-text-b2-size);
  font-weight: var(--emerald-text-b2-weight);
  line-height: var(--emerald-text-b2-height);
  color: var(--emerald-on-surface);
  overflow-wrap: break-word;
}
</style>
