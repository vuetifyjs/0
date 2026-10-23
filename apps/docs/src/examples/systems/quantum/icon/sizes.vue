<script setup lang="ts">
  import { QuIcon } from '@paper/quantum'

  import type { QuIconName, QuIconSize } from '@paper/quantum'

  const roles: QuIconName[] = ['menu', 'search', 'edit', 'delete']

  const sizes: { size: QuIconSize, caption: string }[] = [
    { size: 'm', caption: 'm: 24 dp glyph, 48 dp target' },
    { size: 's', caption: 's: 20 dp glyph, 40 dp target' },
  ]
</script>

<template>
  <div class="quantum-docs-stack">
    <div v-for="entry in sizes" :key="entry.size" class="quantum-docs-row">
      <span
        v-for="role in roles"
        :key="role"
        class="quantum-docs-icon-target"
        :data-size="entry.size"
      >
        <QuIcon class="quantum-docs-icon-ink" :name="role" :size="entry.size" />
      </span>

      <span class="quantum-docs-note">{{ entry.caption }}</span>
    </div>
  </div>
</template>

<style>
  .quantum-docs-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--quantum-spacing-2, 16px);
  }

  .quantum-docs-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--quantum-spacing-1, 8px);
  }

  /* The touch target belongs to the host, drawn here as a dashed square: 48 dp around a 24 dp icon, 40 dp around a 20 dp one. */
  .quantum-docs-icon-target {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--quantum-touch-target, 48px);
    height: var(--quantum-touch-target, 48px);
    border: 1px dashed var(--quantum-divider, rgba(0, 0, 0, 0.12));
    box-sizing: border-box;
  }

  .quantum-docs-icon-target[data-size='s'] {
    width: 40px;
    height: 40px;
  }

  .quantum-docs-icon-ink {
    color: var(--quantum-icon-active, rgba(0, 0, 0, 0.54));
  }

  .quantum-docs-note {
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
