<script setup lang="ts">
  import { QuIcon } from '@paper/quantum'

  import type { QuIconName } from '@paper/quantum'

  const roles: QuIconName[] = ['arrow-back', 'arrow-forward', 'chevron-right', 'send', 'help', 'search', 'schedule', 'play-arrow']

  const directions = [
    { dir: 'ltr', lang: 'en', caption: 'dir="ltr"' },
    { dir: 'rtl', lang: 'ar', caption: 'dir="rtl" lang="ar"' },
    { dir: 'rtl', lang: 'he', caption: 'dir="rtl" lang="he"' },
  ]
</script>

<template>
  <div class="quantum-docs-stack">
    <div
      v-for="entry in directions"
      :key="entry.lang"
      class="quantum-docs-row"
      :dir="entry.dir"
      :lang="entry.lang"
    >
      <QuIcon
        v-for="role in roles"
        :key="role"
        class="quantum-docs-icon-ink"
        :name="role"
      />

      <span class="quantum-docs-icon-caption" dir="ltr">{{ entry.caption }}</span>
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

  .quantum-docs-icon-ink {
    color: var(--quantum-icon-active, rgba(0, 0, 0, 0.54));
  }

  .quantum-docs-icon-caption {
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
