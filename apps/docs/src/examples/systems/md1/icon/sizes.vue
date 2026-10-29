<script setup lang="ts">
  import { Md1Icon } from '@paper/md1'

  import type { Md1IconName, Md1IconSize } from '@paper/md1'

  const roles: Md1IconName[] = ['menu', 'search', 'edit', 'delete']

  const sizes: { size: Md1IconSize, caption: string }[] = [
    { size: 'm', caption: 'm: 24 dp glyph, 48 dp target' },
    { size: 's', caption: 's: 20 dp glyph, 40 dp target' },
  ]
</script>

<template>
  <div class="md1-docs-stack">
    <div v-for="entry in sizes" :key="entry.size" class="md1-docs-row md1-docs-icon-sizes">
      <span
        v-for="role in roles"
        :key="role"
        class="md1-docs-icon-target"
        :data-size="entry.size"
      >
        <Md1Icon class="md1-docs-icon-ink" :name="role" :size="entry.size" />
      </span>

      <span class="md1-docs-note">{{ entry.caption }}</span>
    </div>
  </div>
</template>

<style>
  .md1-docs-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--md1-spacing-2, 16px);
  }

  /* A row that wraps on a phone keeps its targets and caption centred. */
  .md1-docs-icon-sizes {
    justify-content: center;
  }

  /* The touch target belongs to the host, drawn here as a dashed square: 48 dp around a 24 dp icon, 40 dp around a 20 dp one. */
  .md1-docs-icon-target {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--md1-touch-target, 48px);
    height: var(--md1-touch-target, 48px);
    border: 1px dashed var(--md1-divider, rgba(0, 0, 0, 0.12));
    box-sizing: border-box;
  }

  .md1-docs-icon-target[data-size='s'] {
    width: 40px;
    height: 40px;
  }

  .md1-docs-icon-ink {
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
