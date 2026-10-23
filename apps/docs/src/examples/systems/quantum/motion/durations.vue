<script setup lang="ts">
  import { duration, durationDesktop, durationTablet, QuButton } from '@paper/quantum'
  import { useMediaQuery } from '@vuetify/v0'

  import { shallowRef, toRef } from 'vue'

  // The same queries the token sheet switches on.
  const fine = useMediaQuery('(pointer: fine)')
  const tablet = useMediaQuery('(min-width: 600px) and (pointer: coarse)')

  const device = toRef(() => {
    if (fine.matches.value) return 'desktop'
    if (tablet.matches.value) return 'tablet'
    return 'mobile'
  })

  const classes = [
    { id: 'mobile', name: 'Mobile', query: 'default', values: duration },
    { id: 'tablet', name: 'Tablet', query: '(min-width: 600px) and (pointer: coarse)', values: durationTablet },
    { id: 'desktop', name: 'Desktop', query: '(pointer: fine)', values: durationDesktop },
  ]

  const tokens = Object.keys(duration) as (keyof typeof duration)[]

  const played = shallowRef(false)
</script>

<template>
  <div class="quantum-docs-motion-durations">
    <!-- A grid rather than <table>: the docs prose styles every table inside a page. -->
    <div class="quantum-docs-motion-durations-scroll">
      <div class="quantum-docs-motion-durations-table quantum-type-body-1" role="table">
        <div class="quantum-docs-motion-durations-row" role="row">
          <span class="quantum-docs-motion-durations-cell quantum-type-body-2" role="columnheader">Device</span>

          <span
            v-for="token in tokens"
            :key="token"
            class="quantum-docs-motion-durations-cell quantum-type-body-2"
            role="columnheader"
          >
            {{ token }}
          </span>
        </div>

        <div
          v-for="item in classes"
          :key="item.id"
          class="quantum-docs-motion-durations-row"
          :data-active="device === item.id || undefined"
          role="row"
        >
          <span class="quantum-docs-motion-durations-cell" role="rowheader">
            {{ item.name }}

            <span class="quantum-docs-motion-durations-query quantum-type-caption">{{ item.query }}</span>
          </span>

          <span
            v-for="token in tokens"
            :key="token"
            class="quantum-docs-motion-durations-cell"
            role="cell"
          >
            {{ item.values[token] }}
          </span>
        </div>
      </div>
    </div>

    <QuButton variant="raised" @click="played = !played">{{ played ? 'Reset' : 'Play' }}</QuButton>

    <div class="quantum-docs-motion-durations-bars">
      <div v-for="token in tokens" :key="token" class="quantum-docs-motion-durations-bar">
        <span class="quantum-type-caption">--quantum-duration-{{ token }}</span>

        <span class="quantum-docs-motion-durations-track">
          <span
            class="quantum-docs-motion-durations-fill"
            :data-played="played || undefined"
            :style="{ transitionDuration: `var(--quantum-duration-${token}, ${duration[token]})` }"
          />
        </span>
      </div>
    </div>
  </div>
</template>

<style>
  .quantum-docs-motion-durations {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--quantum-spacing-2, 16px);
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
  }

  .quantum-docs-motion-durations-scroll {
    width: 100%;
    overflow-x: auto;
  }

  .quantum-docs-motion-durations-table {
    display: grid;
    grid-template-columns: minmax(160px, 2fr) repeat(4, minmax(72px, 1fr));
    min-width: 480px;
  }

  .quantum-docs-motion-durations-row {
    display: contents;
  }

  .quantum-docs-motion-durations-cell {
    padding: var(--quantum-spacing-1, 8px);
    border-bottom: 1px solid var(--quantum-divider, rgba(0, 0, 0, 0.12));
  }

  .quantum-docs-motion-durations-row[data-active] > .quantum-docs-motion-durations-cell {
    font-weight: var(--quantum-font-weight-medium, 500);
    background: var(--quantum-hover, rgba(0, 0, 0, 0.06));
  }

  .quantum-docs-motion-durations-query {
    display: block;
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .quantum-docs-motion-durations-bars {
    display: flex;
    flex-direction: column;
    gap: var(--quantum-spacing-1, 8px);
    width: 100%;
  }

  .quantum-docs-motion-durations-bar {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .quantum-docs-motion-durations-track {
    display: block;
    height: 8px;
    overflow: hidden;
    background: var(--quantum-divider, rgba(0, 0, 0, 0.12));
  }

  .quantum-docs-motion-durations-fill {
    display: block;
    height: 100%;
    background: var(--quantum-primary, #3F51B5);
    transform: scaleX(0);
    transform-origin: left;
    transition-property: transform;
    transition-timing-function: var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .quantum-docs-motion-durations-fill[data-played] {
    transform: scaleX(1);
  }

  @media (prefers-reduced-motion: reduce) {
    .quantum-docs-motion-durations-fill {
      transition-property: none;
    }
  }
</style>
