<script setup lang="ts">
  import { useMediaQuery } from '@vuetify/v0'
  import { md1DesignSystem } from '@paper/md1'

  import { toRef } from 'vue'

  const { type, typeDesktop } = md1DesignSystem

  // The query the md1-type-* classes switch on; reading it here only
  // labels which column this browser is getting.
  const { matches } = useMediaQuery('(pointer: fine)')

  const device = toRef(() => matches.value ? 'desktop' : 'device')

  const STYLES = [
    ['subheading', 'Subheading'],
    ['subheading-2', 'Subheading 2'],
    ['body-2', 'Body 2'],
    ['body-1', 'Body 1'],
    ['menu', 'Menu'],
  ] as const

  const rows = STYLES.map(([style, name]) => ({
    style,
    name,
    device: type[style].size.replace('px', ''),
    desktop: typeDesktop[style].size.replace('px', ''),
  }))
</script>

<template>
  <div class="md1-docs-device">
    <p class="md1-docs-device-status md1-type-caption" role="status">
      This pointer gets the {{ device }} sizes
    </p>

    <div v-for="row in rows" :key="row.style" class="md1-docs-device-row">
      <p class="md1-docs-device-sample" :class="`md1-type-${row.style}`">
        {{ row.name }}: the quick brown fox jumps over the lazy dog
      </p>

      <p class="md1-docs-device-sizes md1-type-caption">
        <span class="md1-docs-device-size" :data-active="device === 'device' || undefined">device {{ row.device }} sp</span>

        <span class="md1-docs-device-size" :data-active="device === 'desktop' || undefined">desktop {{ row.desktop }} sp</span>
      </p>
    </div>
  </div>
</template>

<style>
  .md1-docs-device {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-2, 16px);
  }

  .md1-docs-device-status,
  .md1-docs-device-sample,
  .md1-docs-device-sizes {
    margin: 0;
  }

  .md1-docs-device-sizes {
    display: flex;
    gap: var(--md1-spacing-2, 16px);
    margin-top: var(--md1-spacing-1, 8px);
  }

  .md1-docs-device-size {
    color: var(--md1-text-disabled, rgba(0, 0, 0, 0.38));
  }

  .md1-docs-device-size[data-active] {
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }
</style>
