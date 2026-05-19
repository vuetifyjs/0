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

<style>
.emerald-card__subtitle {
  margin: 0;
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 21.7px;
  color: rgb(var(--emerald-neutral-700-channels, 30 28 40) / 0.5);
}
</style>
