<script setup lang="ts">
  import { duration, durationDesktop, durationTablet, layout, layoutTablet } from '@paper/quantum'
  import { useMediaQuery } from '@vuetify/v0'

  import { toRef } from 'vue'

  // The two queries every Quantum metric hangs off.
  const tablet = useMediaQuery('(min-width: 600px)')
  const fine = useMediaQuery('(pointer: fine)')

  const metrics = toRef(() => {
    const keylines = tablet.matches.value ? layoutTablet : layout
    // Fine pointer wins; the tablet scale needs both the width and a coarse pointer.
    const times = fine.matches.value ? durationDesktop : (tablet.matches.value ? durationTablet : duration)

    return [
      { token: '--quantum-keyline-margin', value: keylines['keyline-margin'] },
      { token: '--quantum-keyline-content', value: keylines['keyline-content'] },
      { token: '--quantum-increment', value: keylines.increment },
      { token: '--quantum-duration-standard', value: times.standard },
      { token: 'body 1 type size', value: fine.matches.value ? '13px' : '14px' },
      { token: 'raised button at rest', value: fine.matches.value ? '0 dp' : '2 dp' },
    ]
  })
</script>

<template>
  <div class="quantum-docs-layout-devices">
    <div class="quantum-docs-layout-devices-axes">
      <div class="quantum-docs-layout-devices-axis">
        <span class="quantum-type-caption">(min-width: 600px)</span>

        <span class="quantum-type-title">{{ tablet.matches.value ? 'Tablet layout' : 'Handset layout' }}</span>
      </div>

      <div class="quantum-docs-layout-devices-axis">
        <span class="quantum-type-caption">(pointer: fine)</span>

        <span class="quantum-type-title">{{ fine.matches.value ? 'Desktop input' : 'Touch input' }}</span>
      </div>
    </div>

    <dl class="quantum-docs-layout-devices-list quantum-type-body-1">
      <div v-for="metric in metrics" :key="metric.token" class="quantum-docs-layout-devices-entry">
        <dt class="quantum-docs-layout-devices-term">{{ metric.token }}</dt>

        <dd class="quantum-docs-layout-devices-value">{{ metric.value }}</dd>
      </div>
    </dl>
  </div>
</template>

<style>
  .quantum-docs-layout-devices {
    display: flex;
    flex-direction: column;
    gap: var(--quantum-spacing-2, 16px);
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
  }

  .quantum-docs-layout-devices-axes {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--quantum-spacing-2, 16px);
  }

  .quantum-docs-layout-devices-axis {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: var(--quantum-spacing-2, 16px);
    background: var(--quantum-surface, #FFFFFF);
    border-radius: var(--quantum-radius, 2px);
    box-shadow: var(--quantum-elevation-2, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
  }

  .quantum-docs-layout-devices-list {
    margin: 0;
  }

  .quantum-docs-layout-devices-entry {
    display: flex;
    justify-content: space-between;
    gap: var(--quantum-spacing-2, 16px);
    padding: var(--quantum-spacing-1, 8px) 0;
    border-bottom: 1px solid var(--quantum-divider, rgba(0, 0, 0, 0.12));
  }

  .quantum-docs-layout-devices-term {
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .quantum-docs-layout-devices-value {
    margin: 0;
  }
</style>
