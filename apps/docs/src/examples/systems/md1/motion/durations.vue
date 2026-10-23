<script setup lang="ts">
  import { duration, durationDesktop, durationTablet, Md1Button } from '@paper/md1'
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
  <div class="md1-docs-motion-durations">
    <!-- A grid rather than <table>: the docs prose styles every table inside a page. -->
    <div class="md1-docs-motion-durations-scroll">
      <div class="md1-docs-motion-durations-table md1-type-body-1" role="table">
        <div class="md1-docs-motion-durations-row" role="row">
          <span class="md1-docs-motion-durations-cell md1-type-body-2" role="columnheader">Device</span>

          <span
            v-for="token in tokens"
            :key="token"
            class="md1-docs-motion-durations-cell md1-type-body-2"
            role="columnheader"
          >
            {{ token }}
          </span>
        </div>

        <div
          v-for="item in classes"
          :key="item.id"
          class="md1-docs-motion-durations-row"
          :data-active="device === item.id || undefined"
          role="row"
        >
          <span class="md1-docs-motion-durations-cell" role="rowheader">
            {{ item.name }}

            <span class="md1-docs-motion-durations-query md1-type-caption">{{ item.query }}</span>
          </span>

          <span
            v-for="token in tokens"
            :key="token"
            class="md1-docs-motion-durations-cell"
            role="cell"
          >
            {{ item.values[token] }}
          </span>
        </div>
      </div>
    </div>

    <Md1Button variant="raised" @click="played = !played">{{ played ? 'Reset' : 'Play' }}</Md1Button>

    <div class="md1-docs-motion-durations-bars">
      <div v-for="token in tokens" :key="token" class="md1-docs-motion-durations-bar">
        <span class="md1-type-caption">--md1-duration-{{ token }}</span>

        <span class="md1-docs-motion-durations-track">
          <span
            class="md1-docs-motion-durations-fill"
            :data-played="played || undefined"
            :style="{ transitionDuration: `var(--md1-duration-${token}, ${duration[token]})` }"
          />
        </span>
      </div>
    </div>
  </div>
</template>

<style>
  .md1-docs-motion-durations {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--md1-spacing-2, 16px);
    /* The panel centres its child at max-content; the cap lets the table scroll inside a phone's width. */
    max-width: 100%;
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  .md1-docs-motion-durations-scroll {
    width: 100%;
    overflow-x: auto;
  }

  .md1-docs-motion-durations-table {
    display: grid;
    grid-template-columns: minmax(160px, 2fr) repeat(4, minmax(72px, 1fr));
    min-width: 480px;
  }

  .md1-docs-motion-durations-row {
    display: contents;
  }

  .md1-docs-motion-durations-cell {
    padding: var(--md1-spacing-1, 8px);
    border-bottom: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  .md1-docs-motion-durations-row[data-active] > .md1-docs-motion-durations-cell {
    font-weight: var(--md1-font-weight-medium, 500);
    background: var(--md1-hover, rgba(0, 0, 0, 0.06));
  }

  .md1-docs-motion-durations-query {
    display: block;
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  /* 54% measures 4.45:1 on the 6% hover fill of the current row; the query there reads at the primary ink. */
  .md1-docs-motion-durations-row[data-active] .md1-docs-motion-durations-query {
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  .md1-docs-motion-durations-bars {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-1, 8px);
    width: 100%;
  }

  .md1-docs-motion-durations-bar {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .md1-docs-motion-durations-track {
    display: block;
    height: 8px;
    overflow: hidden;
    background: var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  .md1-docs-motion-durations-fill {
    display: block;
    height: 100%;
    background: var(--md1-primary, #3F51B5);
    transform: scaleX(0);
    transform-origin: left;
    transition-property: transform;
    transition-timing-function: var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-docs-motion-durations-fill[data-played] {
    transform: scaleX(1);
  }

  @media (prefers-reduced-motion: reduce) {
    .md1-docs-motion-durations-fill {
      transition-property: none;
    }
  }
</style>
