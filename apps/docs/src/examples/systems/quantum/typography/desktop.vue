<script setup lang="ts">
  import { useMediaQuery } from '@vuetify/v0'
  import { quantumDesignSystem } from '@paper/quantum'

  import { toRef } from 'vue'

  const { type, typeDesktop } = quantumDesignSystem

  // The query the quantum-type-* classes switch on; reading it here only
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
  <div class="quantum-docs-device">
    <p class="quantum-docs-device-status quantum-type-caption" role="status">
      This pointer gets the {{ device }} sizes
    </p>

    <div v-for="row in rows" :key="row.style" class="quantum-docs-device-row">
      <p class="quantum-docs-device-sample" :class="`quantum-type-${row.style}`">
        {{ row.name }}: the quick brown fox jumps over the lazy dog
      </p>

      <p class="quantum-docs-device-sizes quantum-type-caption">
        <span class="quantum-docs-device-size" :data-active="device === 'device' || undefined">device {{ row.device }} sp</span>

        <span class="quantum-docs-device-size" :data-active="device === 'desktop' || undefined">desktop {{ row.desktop }} sp</span>
      </p>
    </div>
  </div>
</template>

<style>
  .quantum-docs-device {
    display: flex;
    flex-direction: column;
    gap: var(--quantum-spacing-2, 16px);
  }

  .quantum-docs-device-status,
  .quantum-docs-device-sample,
  .quantum-docs-device-sizes {
    margin: 0;
  }

  .quantum-docs-device-sizes {
    display: flex;
    gap: var(--quantum-spacing-2, 16px);
    margin-top: var(--quantum-spacing-1, 8px);
  }

  .quantum-docs-device-size {
    color: var(--quantum-text-disabled, rgba(0, 0, 0, 0.38));
  }

  .quantum-docs-device-size[data-active] {
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
  }
</style>
