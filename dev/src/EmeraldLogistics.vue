<!--
  The release-train spine, region latency bars and pipeline meters render as
  static CSS fills (real data, no charting library) — same GAP_CONTRACT
  precedent as EmeraldSales.
-->
<script setup lang="ts">
  import {
    EmCard,
    EmCardBody,
    EmCardFooter,
    EmCardHeader,
    EmCardTitle,
    EmCheckbox,
    EmPagination,
    EmPaginationItem,
    EmPaginationNext,
    EmPaginationPrev,
    EmProgress,
    EmTabs,
    EmTabsItem,
    EmTabsList,
    EmTag,
  } from '@paper/emerald'

  // Framework
  import { createPagination } from '@vuetify/v0'

  // Context
  import EmeraldShell from './EmeraldShell.vue'

  // Utilities
  import { shallowRef, toRef } from 'vue'

  const train = [
    { version: 'v1.0', date: '22 Jul', note: 'Shipped', state: 'done' as const },
    { version: 'v1.1', date: '25 Aug', note: 'In QA', state: 'active' as const },
    { version: 'v1.2', date: '22 Sep', note: 'Scoped', state: 'queued' as const },
    { version: 'v1.3', date: '20 Oct', note: 'Vue Fes cut', state: 'queued' as const },
    { version: 'v1.4', date: '17 Nov', note: 'Planned', state: 'queued' as const },
    { version: 'v1.5', date: '15 Dec', note: 'Planned', state: 'queued' as const },
  ]

  const stats = [
    { label: 'Packages published', value: '148', note: 'this quarter', delta: '+16 vs Q1', up: true },
    { label: 'CDN egress', value: '42.7 TB', note: 'last 30 days', delta: '+8.9%', up: true },
    { label: 'Median install time', value: '6.4s', note: 'cold cache', delta: '-1.2s', up: true },
    { label: 'Failed publishes', value: '2', note: 'needs a rerun', delta: '-5 vs June', up: true },
  ]

  const regions = [
    { name: 'Frankfurt', p50: 24, p95: 61, share: 34 },
    { name: 'Virginia', p50: 31, p95: 78, share: 29 },
    { name: 'Singapore', p50: 44, p95: 96, share: 18 },
    { name: 'São Paulo', p50: 58, p95: 124, share: 11 },
    { name: 'Sydney', p50: 67, p95: 142, share: 8 },
  ]

  const worst = Math.max(...regions.map(region => region.p95))

  const stage = shallowRef('build')

  const pipeline: Record<string, Array<{ label: string, value: number, max: number }>> = {
    build: [
      { label: 'Bundles emitted', value: 42, max: 48 },
      { label: 'Type declarations', value: 48, max: 48 },
      { label: 'Source maps', value: 39, max: 48 },
      { label: 'Vapor variants', value: 31, max: 48 },
    ],
    test: [
      { label: 'Unit suites', value: 1840, max: 1920 },
      { label: 'Browser suites', value: 412, max: 470 },
      { label: 'Vapor suites', value: 96, max: 120 },
      { label: 'SSR smoke checks', value: 88, max: 96 },
    ],
    publish: [
      { label: 'Registry upload', value: 46, max: 48 },
      { label: 'CDN warm', value: 44, max: 48 },
      { label: 'Provenance attestations', value: 46, max: 48 },
      { label: 'Release notes', value: 12, max: 12 },
    ],
  }

  const steps = toRef(() => pipeline[stage.value] ?? [])

  type Package = { name: string, channel: string, version: string, size: string, state: 'Published' | 'Building' | 'Blocked', progress: number }

  const catalog: Package[] = [
    { name: '@vuetify/v0', channel: 'npm latest', version: '1.1.0-beta.4', size: '184 kB', state: 'Building', progress: 68 },
    { name: '@paper/emerald', channel: 'npm next', version: '0.9.2', size: '96 kB', state: 'Published', progress: 100 },
    { name: '@paper/onyx', channel: 'npm next', version: '0.3.0', size: '88 kB', state: 'Building', progress: 41 },
    { name: '@vuetify/nuxt-module', channel: 'npm latest', version: '2.4.1', size: '42 kB', state: 'Published', progress: 100 },
    { name: '@vuetify/cli', channel: 'npm latest', version: '3.0.7', size: '310 kB', state: 'Blocked', progress: 23 },
    { name: '@paper/helix', channel: 'npm canary', version: '0.1.4', size: '74 kB', state: 'Building', progress: 55 },
  ]

  const shipments: Package[] = Array.from({ length: 24 }, (_, index) => {
    const base = catalog[index % catalog.length]!
    const run = Math.floor(index / catalog.length)

    return run === 0 ? base : { ...base, version: `${base.version}+build.${run + 1}`, progress: (base.progress + run * 9) % 101 }
  })

  const page = shallowRef(1)
  const pagination = createPagination({ page, size: shipments.length, itemsPerPage: 6 })
  const rows = toRef(() => shipments.slice(pagination.pageStart.value, pagination.pageStop.value))
</script>

<template>
  <EmeraldShell>
    <div class="adm-logistics" data-theme="emerald">
      <header class="adm-logistics__header">
        <h1 class="adm-logistics__title">Release trains</h1>
        <p class="adm-logistics__subtitle">Package delivery, edge distribution and the road to v1.5</p>
      </header>

      <section aria-label="Release train">
        <EmCard variant="simple">
          <EmCardHeader class="adm-logistics__train-head">
            <div>
              <EmCardTitle class="adm-logistics__panel-title">Monthly train, one release per stop</EmCardTitle>
              <p class="adm-logistics__panel-sub">Cut Tuesdays; v1.3 lands the week before Vue Fes</p>
            </div>

            <EmTag variant="info">v1.1 cuts in 21 days</EmTag>
          </EmCardHeader>

          <EmCardBody>
            <ol aria-label="Release train stops" class="adm-logistics__train" role="img">
              <li v-for="stop in train" :key="stop.version" :data-state="stop.state">
                <span aria-hidden="true" class="adm-logistics__stop" />
                <strong class="adm-logistics__stop-version">{{ stop.version }}</strong>
                <span class="adm-logistics__stop-date">{{ stop.date }}</span>
                <span class="adm-logistics__stop-note">{{ stop.note }}</span>
              </li>
            </ol>
          </EmCardBody>
        </EmCard>
      </section>

      <section aria-label="Distribution stats" class="adm-logistics__stats">
        <EmCard v-for="stat in stats" :key="stat.label" variant="simple">
          <EmCardBody class="adm-logistics__stat-body">
            <span class="adm-logistics__stat-label">{{ stat.label }}</span>
            <span class="adm-logistics__stat-value">{{ stat.value }}</span>
            <span class="adm-logistics__stat-note">{{ stat.note }}</span>
            <EmTag :variant="stat.up ? 'success' : 'danger'">{{ stat.delta }}</EmTag>
          </EmCardBody>
        </EmCard>
      </section>

      <section aria-label="Edge regions and pipeline" class="adm-logistics__pair">
        <EmCard class="adm-logistics__panel" variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-logistics__panel-title">Edge region latency</EmCardTitle>
            <p class="adm-logistics__panel-sub">Time to first byte for CDN asset requests</p>
          </EmCardHeader>

          <EmCardBody>
            <ul aria-label="Latency by edge region" class="adm-logistics__regions" role="img">
              <li v-for="region in regions" :key="region.name">
                <span class="adm-logistics__region-name">{{ region.name }}</span>

                <span class="adm-logistics__region-bars">
                  <span class="adm-logistics__region-bar" data-tone="p50" :style="{ width: (region.p50 / worst) * 100 + '%' }" />
                  <span class="adm-logistics__region-bar" data-tone="p95" :style="{ width: (region.p95 / worst) * 100 + '%' }" />
                </span>

                <span class="adm-logistics__region-value">
                  <strong>{{ region.p50 }}ms</strong>
                  <span>{{ region.share }}% of traffic</span>
                </span>
              </li>
            </ul>

            <p class="adm-logistics__legend">
              <span class="adm-logistics__dot" data-tone="p50" /> p50
              <span class="adm-logistics__dot" data-tone="p95" /> p95
            </p>
          </EmCardBody>
        </EmCard>

        <EmCard class="adm-logistics__panel" variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-logistics__panel-title">v1.1 pipeline</EmCardTitle>
            <p class="adm-logistics__panel-sub">48 packages moving through the release job</p>
          </EmCardHeader>

          <EmTabs v-model="stage">
            <EmTabsList>
              <EmTabsItem value="build">Build</EmTabsItem>
              <EmTabsItem value="test">Test</EmTabsItem>
              <EmTabsItem value="publish">Publish</EmTabsItem>
            </EmTabsList>
          </EmTabs>

          <EmCardBody>
            <div class="adm-logistics__pipeline">
              <div v-for="step in steps" :key="step.label">
                <div class="adm-logistics__pipeline-head">
                  <span>{{ step.label }}</span>
                  <strong>{{ step.value.toLocaleString('en-US') }} / {{ step.max.toLocaleString('en-US') }}</strong>
                </div>

                <EmProgress :aria-label="step.label" :max="step.max" :model-value="step.value" size="sm" />
              </div>
            </div>
          </EmCardBody>
        </EmCard>
      </section>

      <section aria-label="Packages in flight">
        <EmCard variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-logistics__panel-title">Packages in flight</EmCardTitle>
            <p class="adm-logistics__panel-sub">Everything the current job is building or pushing</p>
          </EmCardHeader>

          <EmCardBody class="adm-logistics__table-wrap">
            <table class="adm-logistics__table">
              <thead>
                <tr>
                  <th><EmCheckbox aria-label="Select all" /></th>
                  <th>Package</th>
                  <th>Channel</th>
                  <th>Version</th>
                  <th>Bundle</th>
                  <th>State</th>
                  <th>Progress</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="item in rows" :key="item.version + item.name">
                  <td><EmCheckbox :aria-label="`Select ${item.name}`" /></td>
                  <td><code class="adm-logistics__pkg">{{ item.name }}</code></td>
                  <td>{{ item.channel }}</td>
                  <td>{{ item.version }}</td>
                  <td>{{ item.size }}</td>

                  <td>
                    <EmTag :variant="item.state === 'Published' ? 'success' : item.state === 'Building' ? 'info' : 'danger'">
                      {{ item.state }}
                    </EmTag>
                  </td>

                  <td class="adm-logistics__progress-cell">
                    <EmProgress :aria-label="`${item.name} progress`" :model-value="item.progress" size="sm" />
                    <span>{{ item.progress }}%</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </EmCardBody>

          <EmCardFooter class="adm-logistics__table-foot">
            <span class="adm-logistics__table-count">
              Showing {{ pagination.pageStart.value + 1 }} to {{ pagination.pageStop.value }} of {{ shipments.length }} packages
            </span>

            <EmPagination v-model="page" :items-per-page="6" :size="shipments.length">
              <template #default="{ items }">
                <EmPaginationPrev>‹ Previous</EmPaginationPrev>

                <template v-for="(item, index) in items" :key="index">
                  <EmPaginationItem v-if="item.type === 'page'" :value="item.value" />
                  <span v-else class="adm-logistics__page-gap">{{ item.value }}</span>
                </template>

                <EmPaginationNext>Next ›</EmPaginationNext>
              </template>
            </EmPagination>
          </EmCardFooter>
        </EmCard>
      </section>
    </div>
  </EmeraldShell>
</template>

<style>
  .adm-logistics {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-l, 20px);
  }

  /* EmCard variant="simple" ships 2px padding and its slots add none, so every
     card needs its own inset — see the EmCard padding gap row. */
  .adm-logistics .emerald-card {
    padding: var(--emerald-spacing-l, 20px);
    background: var(--emerald-background, #fefefe);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    border-radius: var(--emerald-radius-xl, 12px);
    box-shadow: var(--emerald-shadow-s, 0 0 2px 0 rgba(51, 51, 51, 0.08));
  }

  .adm-logistics__title {
    margin: 0;
    font-size: clamp(1.375rem, 2vw, 1.625rem);
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .adm-logistics__subtitle {
    margin: 0.25rem 0 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b1-size, 16px);
  }

  .adm-logistics__panel-title {
    font-size: var(--emerald-text-b1-size, 16px) !important;
    font-weight: 700 !important;
  }

  .adm-logistics__panel-sub {
    margin: 2px 0 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  /* .emerald-card__header is flex-direction: column — a title/action row has to
     opt back into row explicitly. */
  .adm-logistics__train-head {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-logistics__train {
    display: grid;
    grid-auto-columns: minmax(0, 1fr);
    grid-auto-flow: column;
    margin: var(--emerald-spacing-m, 16px) 0 0;
    padding: 0;
    list-style: none;
  }

  .adm-logistics__train li {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding-top: 26px;
  }

  /* Rail between stops; the final stop terminates the line. */
  .adm-logistics__train li::before {
    content: '';
    position: absolute;
    top: 6px;
    left: 7px;
    width: 100%;
    height: 2px;
    background: var(--emerald-neutral-300, #ccd6e7);
  }

  .adm-logistics__train li:last-child::before {
    display: none;
  }

  .adm-logistics__train li[data-state='done']::before {
    background: var(--emerald-primary-600, #1fae60);
  }

  .adm-logistics__stop {
    position: absolute;
    top: 0;
    left: 0;
    width: 14px;
    height: 14px;
    border: 3px solid var(--emerald-neutral-300, #ccd6e7);
    border-radius: 50%;
    background: var(--emerald-background, #fefefe);
  }

  .adm-logistics__train li[data-state='done'] .adm-logistics__stop {
    border-color: var(--emerald-primary-600, #1fae60);
    background: var(--emerald-primary-600, #1fae60);
  }

  .adm-logistics__train li[data-state='active'] .adm-logistics__stop {
    border-color: var(--emerald-primary-600, #1fae60);
    box-shadow: 0 0 0 4px var(--emerald-primary-100, #e7fff2);
  }

  .adm-logistics__stop-version {
    font-size: var(--emerald-text-b1-size, 16px);
  }

  .adm-logistics__stop-date {
    color: var(--emerald-on-surface, #2b2d2e);
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-logistics__stop-note {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-logistics__train li[data-state='active'] .adm-logistics__stop-note {
    color: var(--emerald-primary-700, #027d4c);
    font-weight: 600;
  }

  .adm-logistics__stats {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: var(--emerald-spacing-m, 16px);
  }

  .adm-logistics__stat-body {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
  }

  .adm-logistics__stat-label {
    font-weight: 600;
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-logistics__stat-value {
    font-size: 1.75rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .adm-logistics__stat-note {
    margin-bottom: var(--emerald-spacing-xs, 8px);
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-logistics__pair {
    display: grid;
    grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr);
    gap: var(--emerald-spacing-m, 16px);
  }

  .adm-logistics__pair .emerald-card__body {
    display: flex;
    flex: 1;
    flex-direction: column;
  }

  .adm-logistics__regions {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
    gap: var(--emerald-spacing-m, 16px);
    margin: var(--emerald-spacing-xs, 8px) 0 0;
    padding: 0;
    list-style: none;
  }

  .adm-logistics__regions li {
    display: grid;
    grid-template-columns: 94px minmax(0, 1fr) 104px;
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-logistics__region-name {
    font-size: var(--emerald-text-b2-size, 14px);
    font-weight: 600;
  }

  .adm-logistics__region-bars {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .adm-logistics__region-bar {
    height: 7px;
    min-width: 6px;
    border-radius: 4px;
    background: var(--emerald-primary-600, #1fae60);
  }

  .adm-logistics__region-bar[data-tone='p95'] {
    background: var(--emerald-primary-300, #baedd0);
  }

  .adm-logistics__region-value {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-logistics__region-value strong {
    color: var(--emerald-on-surface, #2b2d2e);
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-logistics__legend {
    display: flex;
    align-items: center;
    gap: 6px;
    margin: var(--emerald-spacing-m, 16px) 0 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-logistics__dot {
    width: 10px;
    height: 10px;
    margin-left: var(--emerald-spacing-s, 12px);
    border-radius: 3px;
    background: var(--emerald-primary-600, #1fae60);
  }

  .adm-logistics__dot:first-child {
    margin-left: 0;
  }

  .adm-logistics__dot[data-tone='p95'] {
    background: var(--emerald-primary-300, #baedd0);
  }

  .adm-logistics__pipeline {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-l, 20px);
    margin-top: var(--emerald-spacing-m, 16px);
  }

  .adm-logistics__pipeline-head {
    display: flex;
    justify-content: space-between;
    margin-bottom: 6px;
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-logistics__table-wrap {
    overflow-x: auto;
    margin-inline: calc(-1 * var(--emerald-spacing-l, 20px));
  }

  .adm-logistics__table th:first-child,
  .adm-logistics__table td:first-child {
    padding-left: var(--emerald-spacing-l, 20px);
  }

  .adm-logistics__table th:last-child,
  .adm-logistics__table td:last-child {
    padding-right: var(--emerald-spacing-l, 20px);
  }

  .adm-logistics__table tbody tr {
    transition: background-color 120ms ease;
  }

  .adm-logistics__table tbody tr:hover {
    background: var(--emerald-neutral-200, #f6f8fa);
  }

  .adm-logistics__table-foot {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-logistics__table-count {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-logistics__page-gap {
    padding: 0 var(--emerald-spacing-2xs, 4px);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-logistics__table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--emerald-text-b2-size, 14px);
    white-space: nowrap;
  }

  .adm-logistics__table th {
    padding: var(--emerald-spacing-xs, 8px) var(--emerald-spacing-s, 12px);
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 600;
    text-align: left;
    border-bottom: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
  }

  .adm-logistics__table td {
    padding: var(--emerald-spacing-s, 12px);
    border-bottom: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-200, #f6f8fa);
  }

  .adm-logistics__pkg {
    font-weight: 600;
  }

  .adm-logistics__progress-cell {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-xs, 8px);
    min-width: 150px;
  }

  .adm-logistics__progress-cell .emerald-progress {
    flex: 1;
  }

  @media (max-width: 1200px) {
    .adm-logistics__stats {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .adm-logistics__pair {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 860px) {
    .adm-logistics__train {
      grid-auto-flow: row;
      gap: var(--emerald-spacing-s, 12px);
    }

    .adm-logistics__train li {
      display: grid;
      grid-template-columns: 60px 70px minmax(0, 1fr);
      align-items: center;
      padding-top: 0;
      padding-left: 26px;
    }

    /* Stacked stops swap the rail from horizontal to vertical. */
    .adm-logistics__train li::before {
      top: 50%;
      left: 6px;
      width: 2px;
      height: 100%;
    }

    .adm-logistics__stop {
      top: 50%;
      margin-top: -7px;
    }
  }

  @media (max-width: 640px) {
    .adm-logistics__stats {
      grid-template-columns: 1fr;
    }

    .adm-logistics__regions li {
      grid-template-columns: 80px minmax(0, 1fr) 92px;
    }
  }
</style>
