<script setup lang="ts">
  const levels = Array.from({ length: 25 }, (_, index) => index)
</script>

<template>
  <div class="quantum-docs-elevation-levels">
    <div
      v-for="level in levels"
      :key="level"
      :class="['quantum-docs-elevation-level', `quantum-elevation-${level}`]"
    >
      <span class="quantum-type-title">{{ level }}</span>

      <span class="quantum-type-caption">dp</span>
    </div>
  </div>
</template>

<style>
  .quantum-docs-elevation-levels {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));
    gap: var(--quantum-spacing-3, 24px);
    padding: var(--quantum-spacing-2, 16px);
    background: var(--quantum-background, #FAFAFA);
  }

  .quantum-docs-elevation-level {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 72px;
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
    background: var(--quantum-surface, #FFFFFF);
    border-radius: var(--quantum-radius, 2px);
  }
</style>
