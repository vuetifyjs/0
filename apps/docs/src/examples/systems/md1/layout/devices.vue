<script setup lang="ts">
  import { duration, durationDesktop, durationTablet, layout, layoutTablet } from '@paper/md1'
  import { useMediaQuery } from '@vuetify/v0'

  import { toRef } from 'vue'

  // The two queries every Material Design 1 metric hangs off.
  const tablet = useMediaQuery('(min-width: 600px)')
  const fine = useMediaQuery('(pointer: fine)')

  const metrics = toRef(() => {
    const keylines = tablet.matches.value ? layoutTablet : layout
    // Fine pointer wins; the tablet scale needs both the width and a coarse pointer.
    const times = fine.matches.value ? durationDesktop : (tablet.matches.value ? durationTablet : duration)

    return [
      { token: '--md1-keyline-margin', value: keylines['keyline-margin'] },
      { token: '--md1-keyline-content', value: keylines['keyline-content'] },
      { token: '--md1-increment', value: keylines.increment },
      { token: '--md1-duration-standard', value: times.standard },
      { token: 'body 1 type size', value: fine.matches.value ? '13px' : '14px' },
      { token: 'raised button at rest', value: fine.matches.value ? '0 dp' : '2 dp' },
    ]
  })
</script>

<template>
  <div class="md1-docs-layout-devices">
    <div class="md1-docs-layout-devices-axes">
      <div class="md1-docs-layout-devices-axis">
        <span class="md1-type-caption">(min-width: 600px)</span>

        <span class="md1-type-title">{{ tablet.matches.value ? 'Tablet layout' : 'Handset layout' }}</span>
      </div>

      <div class="md1-docs-layout-devices-axis">
        <span class="md1-type-caption">(pointer: fine)</span>

        <span class="md1-type-title">{{ fine.matches.value ? 'Desktop input' : 'Touch input' }}</span>
      </div>
    </div>

    <dl class="md1-docs-layout-devices-list md1-type-body-1">
      <div v-for="metric in metrics" :key="metric.token" class="md1-docs-layout-devices-entry">
        <dt class="md1-docs-layout-devices-term">{{ metric.token }}</dt>

        <dd class="md1-docs-layout-devices-value">{{ metric.value }}</dd>
      </div>
    </dl>
  </div>
</template>

<style>
  .md1-docs-layout-devices {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-2, 16px);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  .md1-docs-layout-devices-axes {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--md1-spacing-2, 16px);
  }

  .md1-docs-layout-devices-axis {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: var(--md1-spacing-2, 16px);
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
    box-shadow: var(--md1-elevation-2, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
  }

  .md1-docs-layout-devices-list {
    margin: 0;
  }

  .md1-docs-layout-devices-entry {
    display: flex;
    justify-content: space-between;
    gap: var(--md1-spacing-2, 16px);
    padding: var(--md1-spacing-1, 8px) 0;
    border-bottom: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  .md1-docs-layout-devices-term {
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-layout-devices-value {
    margin: 0;
  }
</style>
