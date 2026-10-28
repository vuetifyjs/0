<script lang="ts">
  import { Md1Button, Md1Card, Md1DataTable, Md1Divider, Md1Ripple, Md1Switch } from '@paper/md1'

  // Framework
  import { Button } from '@vuetify/v0'

  import { sales } from './Md1Data'

  // Utilities
  import { shallowRef } from 'vue'
  import { useRouter } from 'vue-router'

  /** Each gauge tile presses through to the page behind its number. */
  const gauges = [
    { label: 'Storage', value: 82, to: '/md1/files' },
    { label: 'Bandwidth', value: 64, to: '/md1/orders' },
    { label: 'Sessions', value: 41, to: '/md1/activity' },
    { label: 'Errors', value: 7, to: '/md1/help' },
  ]

  /** 2 * PI * r for the r=20 gauge ring. */
  const RING = 125.66

  const traffic = [
    { day: 'Mon', sessions: 320 },
    { day: 'Tue', sessions: 480 },
    { day: 'Wed', sessions: 410 },
    { day: 'Thu', sessions: 560 },
    { day: 'Fri', sessions: 690 },
    { day: 'Sat', sessions: 540 },
    { day: 'Sun', sessions: 720 },
  ]

  // Chart plot box inside the 560 x 220 viewBox.
  const TOP = 16
  const BOTTOM = 180
  const LEFT = 40
  const RIGHT = 544
  const MAX = 800

  const ticks = [0, 200, 400, 600, 800]

  function x (index: number) {
    return LEFT + index * ((RIGHT - LEFT) / (traffic.length - 1))
  }

  function y (sessions: number) {
    return BOTTOM - (sessions / MAX) * (BOTTOM - TOP)
  }

  const line = traffic.map((point, index) => `${x(index)},${y(point.sessions)}`).join(' ')
  const area = `${LEFT},${BOTTOM} ${line} ${RIGHT},${BOTTOM}`

  /** The regions table rows live in the shared store (Md1Data). */
  const regions = sales.all
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1Dashboard' })

  const router = useRouter()

  const performance = shallowRef(true)
  const refresh = shallowRef(true)
  const compact = shallowRef(false)
  const beta = shallowRef(false)
</script>

<template>
  <div class="md1-demo-dash">
    <!-- The documented ripple escape hatch: a v0 Button.Root sheet hosting
         Md1Ripple as its first child (ripple page). -->
    <Button.Root
      v-for="gauge in gauges"
      :key="gauge.label"
      class="md1-demo-tile md1-elevation-2"
      @click="router.push(gauge.to)"
    >
      <Md1Ripple />

      <svg
        :aria-label="`${gauge.label} at ${gauge.value} percent`"
        class="md1-demo-gauge"
        role="img"
        viewBox="0 0 48 48"
      >
        <circle
          class="md1-demo-gauge__track"
          cx="24"
          cy="24"
          fill="none"
          r="20"
          stroke-width="4"
        />

        <circle
          class="md1-demo-gauge__arc"
          cx="24"
          cy="24"
          fill="none"
          r="20"
          :stroke-dasharray="`${(gauge.value / 100) * RING} ${RING}`"
          stroke-width="4"
          transform="rotate(-90 24 24)"
        />

        <text class="md1-demo-gauge__value" text-anchor="middle" x="24" y="28">{{ gauge.value }}%</text>
      </svg>

      <span class="md1-type-body-2 md1-demo-tile__label">{{ gauge.label }}</span>
    </Button.Root>

    <Md1Card class="md1-demo-wide">
      <Md1Card.Title>Traffic this week</Md1Card.Title>

      <div class="md1-demo-pad">
        <svg
          aria-label="Sessions per day, Monday through Sunday, from 320 up to 720"
          class="md1-demo-chart"
          role="img"
          viewBox="0 0 560 220"
        >
          <g v-for="tick in ticks" :key="tick">
            <line
              class="md1-demo-chart__grid"
              :x1="LEFT"
              :x2="RIGHT"
              :y1="y(tick)"
              :y2="y(tick)"
            />

            <text class="md1-demo-chart__tick" text-anchor="end" :x="LEFT - 8" :y="y(tick) + 4">{{ tick }}</text>
          </g>

          <polygon class="md1-demo-chart__area" :points="area" />

          <polyline class="md1-demo-chart__line" fill="none" :points="line" />

          <g v-for="(point, index) in traffic" :key="point.day">
            <circle class="md1-demo-chart__dot" :cx="x(index)" :cy="y(point.sessions)" r="3" />

            <text class="md1-demo-chart__tick" text-anchor="middle" :x="x(index)" :y="BOTTOM + 22">{{ point.day }}</text>
          </g>
        </svg>
      </div>
    </Md1Card>

    <Md1Card class="md1-demo-half">
      <Md1Card.Title>Updates</Md1Card.Title>

      <Md1Card.Supporting>
        Deploy pipeline maintenance lands Thursday at 02:00 UTC. Storage quotas
        for the EU region were raised, and nightly exports now finish before
        06:00. Session sampling moved to one-minute windows.
      </Md1Card.Supporting>

      <Md1Card.Actions>
        <Md1Button>Read more</Md1Button>
      </Md1Card.Actions>
    </Md1Card>

    <Md1Card class="md1-demo-half">
      <Md1Card.Title>View options</Md1Card.Title>

      <div class="md1-demo-options">
        <Md1Switch v-model="performance" label="Show performance" />

        <Md1Switch v-model="refresh" label="Auto refresh" />

        <Md1Switch v-model="compact" label="Compact rows" />
      </div>

      <Md1Divider />

      <div class="md1-demo-options">
        <Md1Switch v-model="beta" label="Beta dashboard" />
      </div>
    </Md1Card>

    <!-- The data table paints its own card (data-formats page): no Md1Card wrapper. -->
    <Md1DataTable class="md1-demo-wide">
      <Md1DataTable.Header title="Sales by region" />

      <Md1DataTable.Table>
        <Md1DataTable.Head>
          <Md1DataTable.Column id="region" sortable>Region</Md1DataTable.Column>

          <Md1DataTable.Column id="orders" numeric sortable>Orders</Md1DataTable.Column>

          <Md1DataTable.Column id="revenue" numeric sortable>Revenue</Md1DataTable.Column>

          <Md1DataTable.Column id="share" numeric sortable>Share</Md1DataTable.Column>
        </Md1DataTable.Head>

        <Md1DataTable.Body v-slot="{ rank }">
          <Md1DataTable.Row v-for="row in rank(regions)" :id="row.id" :key="row.id" :value="row">
            <Md1DataTable.Cell>{{ row.region }}</Md1DataTable.Cell>

            <Md1DataTable.Cell numeric>{{ row.orders.toLocaleString('en-US') }}</Md1DataTable.Cell>

            <Md1DataTable.Cell numeric>${{ row.revenue.toLocaleString('en-US') }}</Md1DataTable.Cell>

            <Md1DataTable.Cell numeric>{{ row.share }}%</Md1DataTable.Cell>
          </Md1DataTable.Row>
        </Md1DataTable.Body>
      </Md1DataTable.Table>
    </Md1DataTable>
  </div>
</template>

<style>
  .md1-demo-dash {
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    gap: var(--md1-spacing-2, 16px);
  }

  .md1-demo-dash > * {
    grid-column: span 12;
    min-width: 0;
  }

  @media (min-width: 600px) {
    .md1-demo-dash {
      gap: var(--md1-spacing-3, 24px);
    }

    .md1-demo-dash > .md1-demo-tile,
    .md1-demo-dash > .md1-demo-half {
      grid-column: span 6;
    }
  }

  @media (min-width: 1264px) {
    .md1-demo-dash > .md1-demo-tile {
      grid-column: span 3;
    }

    .md1-demo-dash > .md1-demo-wide {
      grid-column: span 8;
    }

    .md1-demo-dash > .md1-demo-half {
      grid-column: span 4;
    }
  }

  /* A pressable sheet (ripple page's composition): surface, 2 dp, the ripple inside. */
  .md1-demo-tile {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--md1-spacing-1, 8px);
    margin: 0;
    padding: var(--md1-spacing-2, 16px);
    border: 0;
    border-radius: var(--md1-radius, 2px);
    background: var(--md1-surface, #FFFFFF);
    color: inherit;
    font: inherit;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  .md1-demo-tile:focus-visible {
    outline: 2px solid var(--md1-accent, #FF4081);
    outline-offset: 2px;
  }

  .md1-demo-tile__label {
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-demo-gauge {
    width: 96px;
    height: 96px;
  }

  .md1-demo-gauge__track {
    stroke: var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  .md1-demo-gauge__arc {
    stroke: var(--md1-accent, #FF4081);
  }

  .md1-demo-gauge__value {
    fill: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    font-size: 10px;
    font-weight: 500;
  }

  .md1-demo-pad {
    padding: 0 var(--md1-spacing-2, 16px) var(--md1-spacing-2, 16px);
  }

  .md1-demo-chart {
    display: block;
    width: 100%;
    height: auto;
  }

  .md1-demo-chart__grid {
    stroke: var(--md1-divider, rgba(0, 0, 0, 0.12));
    stroke-width: 1;
  }

  .md1-demo-chart__tick {
    fill: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
    font-size: 11px;
  }

  /* surface-tint and primary-ink are the band-on-a-sheet roles: primary 100
     over white in light, primary 700 with a light ink in dark. */
  .md1-demo-chart__area {
    fill: var(--md1-surface-tint, #C5CAE9);
  }

  .md1-demo-chart__line {
    stroke: var(--md1-primary-ink, #3F51B5);
    stroke-width: 2;
  }

  .md1-demo-chart__dot {
    fill: var(--md1-primary-ink, #3F51B5);
  }

  .md1-demo-options {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--md1-spacing-1, 8px);
    padding: var(--md1-spacing-2, 16px);
  }
</style>
