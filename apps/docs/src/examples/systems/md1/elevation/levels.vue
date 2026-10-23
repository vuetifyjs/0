<script setup lang="ts">
  const levels = Array.from({ length: 25 }, (_, index) => index)
</script>

<template>
  <div class="md1-docs-elevation-levels">
    <div
      v-for="level in levels"
      :key="level"
      :class="['md1-docs-elevation-level', `md1-elevation-${level}`]"
    >
      <span class="md1-type-title">{{ level }}</span>

      <span class="md1-type-caption">dp</span>
    </div>
  </div>
</template>

<style>
  .md1-docs-elevation-levels {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));
    gap: var(--md1-spacing-3, 24px);
    padding: var(--md1-spacing-2, 16px);
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-elevation-level {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 72px;
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
  }
</style>
