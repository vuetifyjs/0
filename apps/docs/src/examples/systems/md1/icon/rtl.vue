<script setup lang="ts">
  import { Md1Icon } from '@paper/md1'

  import type { Md1IconName } from '@paper/md1'

  const roles: Md1IconName[] = ['arrow-back', 'arrow-forward', 'chevron-right', 'send', 'help', 'search', 'schedule', 'play-arrow']

  const directions = [
    { dir: 'ltr', lang: 'en', caption: 'dir="ltr"' },
    { dir: 'rtl', lang: 'ar', caption: 'dir="rtl" lang="ar"' },
    { dir: 'rtl', lang: 'he', caption: 'dir="rtl" lang="he"' },
  ]
</script>

<template>
  <div class="md1-docs-stack">
    <div
      v-for="entry in directions"
      :key="entry.lang"
      class="md1-docs-row"
      :dir="entry.dir"
      :lang="entry.lang"
    >
      <Md1Icon
        v-for="role in roles"
        :key="role"
        class="md1-docs-icon-ink"
        :name="role"
      />

      <span class="md1-docs-icon-caption" dir="ltr">{{ entry.caption }}</span>
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

  .md1-docs-icon-ink {
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-icon-caption {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
