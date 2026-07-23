<script lang="ts">
  export interface EmCardSubtitleProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmCardSubtitle' })
</script>

<template>
  <p class="emerald-card__subtitle">
    <slot />
  </p>
</template>

<style scoped>
.emerald-card__subtitle {
  margin: 0;
  font: var(--emerald-text-b2-weight) var(--emerald-text-b2-size) / var(--emerald-text-b2-height) var(--emerald-font-sans);
  color: var(--emerald-neutral-700);
}
</style>
