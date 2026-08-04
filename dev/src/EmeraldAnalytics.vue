<!--
  The traffic area chart, query bars, source segments and mini bar strips
  render as static CSS/SVG fills (real data, no charting library) — same
  GAP_CONTRACT precedent as EmeraldSales.
-->
<script setup lang="ts">
  import {
    EmAvatar,
    EmAvatarFallback,
    EmCard,
    EmCardBody,
    EmCardHeader,
    EmCardTitle,
    EmCheckbox,
    EmProgress,
    EmTabs,
    EmTabsItem,
    EmTabsList,
    EmTag,
    EmTextField,
  } from '@paper/emerald'

  // Framework
  import { createFilter } from '@vuetify/v0'

  // Context
  import EmeraldShell from './EmeraldShell.vue'

  // Utilities
  import { shallowRef, toRef } from 'vue'

  const traffic = [268, 292, 310, 341, 368, 402, 429]
  const trafficMax = Math.max(...traffic)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']

  const shape = traffic.map((v, index) => `${index * (100 / (traffic.length - 1))},${40 - (v / trafficMax) * 33}`).join(' ')

  const session = [
    { label: 'Median session', value: '4m 12s' },
    { label: 'Docs search rate', value: '46.0%' },
    { label: 'Bounce rate', value: '28.4%' },
  ]

  const queries = [
    { term: 'data table', hits: '31.4K', pct: 100 },
    { term: 'theme tokens', hits: '24.9K', pct: 79 },
    { term: 'createSelection', hits: '18.2K', pct: 58 },
    { term: 'install nuxt', hits: '12.6K', pct: 40 },
    { term: 'dark mode', hits: '9.8K', pct: 31 },
  ]

  const sources = [
    { label: 'Direct', pct: 38, tone: 'primary' as const },
    { label: 'Search', pct: 31, tone: 'mid' as const },
    { label: 'GitHub', pct: 18, tone: 'light' as const },
    { label: 'Discord', pct: 8, tone: 'pale' as const },
    { label: 'Newsletter', pct: 5, tone: 'muted' as const },
  ]

  type Guide = { title: string, author: string, section: 'guides' | 'api' | 'examples', reads: string, dwell: string, completion: number }

  const library: Guide[] = [
    { title: 'Theming with design tokens', author: 'Camille Fontaine', section: 'guides', reads: '84.2K', dwell: '6m 04s', completion: 78 },
    { title: 'Building a headless data table', author: 'Kenji Morrow', section: 'guides', reads: '71.6K', dwell: '8m 41s', completion: 64 },
    { title: 'createSelection reference', author: 'Nadia Haddad', section: 'api', reads: '66.9K', dwell: '3m 18s', completion: 91 },
    { title: 'usePopover reference', author: 'Bruno Marchetti', section: 'api', reads: '52.3K', dwell: '2m 55s', completion: 88 },
    { title: 'Nuxt install walkthrough', author: 'Ingrid Solberg', section: 'guides', reads: '48.7K', dwell: '5m 22s', completion: 72 },
    { title: 'Virtual scroll playground', author: 'Theo Vasquez', section: 'examples', reads: '39.1K', dwell: '9m 07s', completion: 55 },
    { title: 'Combobox with async options', author: 'Zara Idris', section: 'examples', reads: '33.5K', dwell: '7m 16s', completion: 61 },
    { title: 'createValidation reference', author: 'Marek Dvorak', section: 'api', reads: '28.4K', dwell: '2m 39s', completion: 85 },
    { title: 'Migrating a Material app', author: 'Sofia Delgado', section: 'guides', reads: '24.8K', dwell: '11m 32s', completion: 43 },
    { title: 'Splitter layout recipes', author: 'Felix Amundsen', section: 'examples', reads: '19.2K', dwell: '6m 48s', completion: 58 },
  ]

  const section = shallowRef('all')
  const search = shallowRef('')

  const filter = createFilter({ keys: ['title', 'author'] })
  const found = filter.apply(search, library)

  const rows = toRef(() => section.value === 'all'
    ? found.items.value
    : found.items.value.filter(row => row.section === section.value),
  )

  const strip = [
    { label: 'Unique readers', value: '486K', delta: '+9.2%', up: true, bars: [52, 60, 55, 68, 72, 81] },
    { label: 'API page views', value: '733K', delta: '+14.8%', up: true, bars: [40, 48, 58, 62, 74, 88] },
    { label: 'Example copies', value: '61.2K', delta: '+21.6%', up: true, bars: [30, 38, 44, 56, 70, 92] },
    { label: 'Playground opens', value: '28.9K', delta: '+5.4%', up: true, bars: [60, 58, 63, 61, 68, 72] },
    { label: 'Broken-link reports', value: '43', delta: '-31.7%', up: false, bars: [90, 78, 66, 54, 41, 30] },
  ]

  function initials (name: string) {
    return name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase()
  }
</script>

<template>
  <EmeraldShell>
    <div class="adm-analytics" data-theme="emerald">
      <header class="adm-analytics__header">
        <h1 class="adm-analytics__title">Docs analytics</h1>
        <p class="adm-analytics__subtitle">Reader traffic, search intent and guide completion</p>
      </header>

      <section aria-label="Traffic overview" class="adm-analytics__hero">
        <EmCard class="adm-analytics__panel adm-analytics__panel--hero" variant="simple">
          <EmCardHeader class="adm-analytics__hero-head">
            <div>
              <EmCardTitle class="adm-analytics__panel-title">Documentation traffic</EmCardTitle>
              <p class="adm-analytics__panel-sub">Page views across every docs surface, last seven months</p>
            </div>

            <span class="adm-analytics__hero-value">
              2.41M
              <em class="adm-analytics__delta" data-up>+18.6%</em>
            </span>
          </EmCardHeader>

          <EmCardBody>
            <svg
              aria-label="Monthly documentation page views"
              class="adm-analytics__area"
              preserveAspectRatio="none"
              role="img"
              viewBox="0 0 100 40"
            >
              <polygon fill="var(--emerald-primary-100, #e7fff2)" :points="`0,40 ${shape} 100,40`" />

              <polyline
                fill="none"
                :points="shape"
                stroke="var(--emerald-primary-600, #1fae60)"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
              />
            </svg>

            <div class="adm-analytics__axis">
              <span v-for="(month, index) in months" :key="month">{{ month }} · {{ traffic[index] }}K</span>
            </div>

            <div class="adm-analytics__session">
              <div v-for="row in session" :key="row.label">
                <span>{{ row.label }}</span>
                <strong>{{ row.value }}</strong>
              </div>
            </div>
          </EmCardBody>
        </EmCard>

        <div class="adm-analytics__rail">
          <EmCard class="adm-analytics__panel" variant="simple">
            <EmCardHeader>
              <EmCardTitle class="adm-analytics__panel-title">What readers search for</EmCardTitle>
            </EmCardHeader>

            <EmCardBody>
              <ul aria-label="Top docs search queries" class="adm-analytics__queries" role="img">
                <li v-for="query in queries" :key="query.term">
                  <code>{{ query.term }}</code>

                  <span class="adm-analytics__query-track">
                    <span class="adm-analytics__query-fill" :style="{ width: query.pct + '%' }" />
                  </span>

                  <strong>{{ query.hits }}</strong>
                </li>
              </ul>
            </EmCardBody>
          </EmCard>

          <EmCard class="adm-analytics__panel" variant="simple">
            <EmCardHeader>
              <EmCardTitle class="adm-analytics__panel-title">Where readers arrive from</EmCardTitle>
            </EmCardHeader>

            <EmCardBody>
              <div aria-label="Traffic source split" class="adm-analytics__segbar" role="img">
                <span
                  v-for="source in sources"
                  :key="source.label"
                  class="adm-analytics__seg"
                  :data-tone="source.tone"
                  :style="{ flexGrow: source.pct }"
                >{{ source.pct }}%</span>
              </div>

              <ul class="adm-analytics__legend">
                <li v-for="source in sources" :key="source.label">
                  <span class="adm-analytics__dot" :data-tone="source.tone" />
                  <span>{{ source.label }}</span>
                  <strong>{{ source.pct }}%</strong>
                </li>
              </ul>
            </EmCardBody>
          </EmCard>
        </div>
      </section>

      <section aria-label="Guide performance">
        <EmCard variant="simple">
          <EmCardHeader class="adm-analytics__table-head">
            <div>
              <EmCardTitle class="adm-analytics__panel-title">Guide performance</EmCardTitle>
              <p class="adm-analytics__panel-sub">Reads, dwell time and how far people get before leaving</p>
            </div>

            <div class="adm-analytics__table-tools">
              <EmTabs v-model="section">
                <EmTabsList>
                  <EmTabsItem value="all">All</EmTabsItem>
                  <EmTabsItem value="guides">Guides</EmTabsItem>
                  <EmTabsItem value="api">API</EmTabsItem>
                  <EmTabsItem value="examples">Examples</EmTabsItem>
                </EmTabsList>
              </EmTabs>

              <EmTextField v-model="search" aria-label="Search pages" class="adm-analytics__search" placeholder="Search pages" />
            </div>
          </EmCardHeader>

          <EmCardBody class="adm-analytics__table-wrap">
            <table class="adm-analytics__table">
              <thead>
                <tr>
                  <th><EmCheckbox aria-label="Select all" /></th>
                  <th>Page</th>
                  <th>Section</th>
                  <th>Reads</th>
                  <th>Dwell</th>
                  <th>Completion</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="guide in rows" :key="guide.title">
                  <td><EmCheckbox :aria-label="`Select ${guide.title}`" /></td>

                  <td>
                    <div class="adm-analytics__client">
                      <EmAvatar size="sm"><EmAvatarFallback>{{ initials(guide.author) }}</EmAvatarFallback></EmAvatar>
                      <span><strong>{{ guide.title }}</strong><span class="adm-analytics__client-sub">{{ guide.author }}</span></span>
                    </div>
                  </td>

                  <td><EmTag :variant="guide.section === 'api' ? 'info' : guide.section === 'examples' ? 'neutral' : 'success'">{{ guide.section }}</EmTag></td>
                  <td>{{ guide.reads }}</td>
                  <td>{{ guide.dwell }}</td>

                  <td class="adm-analytics__progress-cell">
                    <EmProgress :aria-label="`${guide.title} completion`" :model-value="guide.completion" size="sm" />
                    <span>{{ guide.completion }}%</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </EmCardBody>
        </EmCard>
      </section>

      <section aria-label="Engagement indicators" class="adm-analytics__strip">
        <EmCard v-for="item in strip" :key="item.label" variant="simple">
          <EmCardBody class="adm-analytics__strip-body">
            <span class="adm-analytics__strip-value">
              {{ item.value }}
              <em class="adm-analytics__delta" :data-up="item.up || undefined">{{ item.delta }}</em>
            </span>

            <span class="adm-analytics__strip-label">{{ item.label }}</span>

            <div aria-hidden="true" class="adm-analytics__mini-bars">
              <span
                v-for="(h, index) in item.bars"
                :key="index"
                class="adm-analytics__mini-bar"
                :data-down="item.up ? undefined : ''"
                :style="{ height: h + '%' }"
              />
            </div>
          </EmCardBody>
        </EmCard>
      </section>
    </div>
  </EmeraldShell>
</template>

<style>
  .adm-analytics {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-l, 20px);
  }

  /* EmCard variant="simple" ships 2px padding and its slots add none, so every
     card needs its own inset — see the EmCard padding gap row. */
  .adm-analytics .emerald-card {
    padding: var(--emerald-spacing-l, 20px);
    background: var(--emerald-background, #fefefe);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    border-radius: var(--emerald-radius-xl, 12px);
    box-shadow: var(--emerald-shadow-s, 0 0 2px 0 rgba(51, 51, 51, 0.08));
  }

  .adm-analytics__title {
    margin: 0;
    font-size: clamp(1.375rem, 2vw, 1.625rem);
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .adm-analytics__subtitle {
    margin: 0.25rem 0 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b1-size, 16px);
  }

  .adm-analytics__panel-title {
    font-size: var(--emerald-text-b1-size, 16px) !important;
    font-weight: 700 !important;
  }

  .adm-analytics__panel-sub {
    margin: 2px 0 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-analytics__delta {
    font-style: normal;
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 600;
    color: var(--emerald-danger-500, #c61424);
  }

  .adm-analytics__delta[data-up] {
    color: var(--emerald-primary-700, #027d4c);
  }

  .adm-analytics__hero {
    display: grid;
    grid-template-columns: minmax(0, 1.7fr) minmax(0, 1fr);
    gap: var(--emerald-spacing-m, 16px);
  }

  /* .emerald-card__header is flex-direction: column — a title/action row has to
     opt back into row explicitly. */
  .adm-analytics__hero-head {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-analytics__hero-value {
    display: flex;
    align-items: baseline;
    gap: 8px;
    font-size: 1.875rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .adm-analytics__panel--hero .emerald-card__body {
    display: flex;
    flex-direction: column;
  }

  .adm-analytics__area {
    width: 100%;
    height: 190px;
  }

  .adm-analytics__axis {
    display: flex;
    justify-content: space-between;
    gap: 4px;
    margin-top: var(--emerald-spacing-xs, 8px);
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-analytics__session {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--emerald-spacing-s, 12px);
    margin-top: auto;
    padding-top: var(--emerald-spacing-m, 16px);
  }

  .adm-analytics__session > div {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: var(--emerald-spacing-s, 12px);
    border-radius: var(--emerald-radius-m, 8px);
    background: var(--emerald-neutral-200, #f6f8fa);
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-analytics__session strong {
    color: var(--emerald-on-surface, #2b2d2e);
    font-size: var(--emerald-text-b1-size, 16px);
  }

  .adm-analytics__rail {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-m, 16px);
  }

  .adm-analytics__queries {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-s, 12px);
    margin: var(--emerald-spacing-xs, 8px) 0 0;
    padding: 0;
    list-style: none;
  }

  .adm-analytics__queries li {
    display: grid;
    grid-template-columns: minmax(0, 108px) minmax(0, 1fr) 48px;
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-analytics__queries code {
    overflow: hidden;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .adm-analytics__queries strong {
    font-size: var(--emerald-text-b3-size, 12px);
    text-align: right;
  }

  .adm-analytics__query-track {
    height: 8px;
    border-radius: 4px;
    background: var(--emerald-neutral-200, #f6f8fa);
    overflow: hidden;
  }

  .adm-analytics__query-fill {
    display: block;
    height: 100%;
    border-radius: 4px;
    background: var(--emerald-primary-600, #1fae60);
  }

  .adm-analytics__segbar {
    display: flex;
    height: 36px;
    margin-top: var(--emerald-spacing-xs, 8px);
    border-radius: var(--emerald-radius-m, 8px);
    overflow: hidden;
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 600;
  }

  .adm-analytics__seg {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: var(--emerald-primary-800, #01603a);
    color: var(--emerald-on-primary, #fff);
  }

  .adm-analytics__seg[data-tone='mid'] {
    background: var(--emerald-primary-600, #1fae60);
  }

  .adm-analytics__seg[data-tone='light'] {
    background: var(--emerald-primary-500, #26c26d);
  }

  .adm-analytics__seg[data-tone='pale'] {
    background: var(--emerald-primary-300, #baedd0);
    color: var(--emerald-on-surface, #2b2d2e);
  }

  .adm-analytics__seg[data-tone='muted'] {
    background: var(--emerald-neutral-300, #ccd6e7);
    color: var(--emerald-on-surface, #2b2d2e);
  }

  .adm-analytics__legend {
    display: flex;
    flex-wrap: wrap;
    gap: var(--emerald-spacing-s, 12px) var(--emerald-spacing-m, 16px);
    margin: var(--emerald-spacing-m, 16px) 0 0;
    padding: 0;
    list-style: none;
    font-size: var(--emerald-text-b3-size, 12px);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-analytics__legend li {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .adm-analytics__legend strong {
    color: var(--emerald-on-surface, #2b2d2e);
  }

  .adm-analytics__dot {
    width: 10px;
    height: 10px;
    border-radius: 3px;
    background: var(--emerald-primary-800, #01603a);
  }

  .adm-analytics__dot[data-tone='mid'] {
    background: var(--emerald-primary-600, #1fae60);
  }

  .adm-analytics__dot[data-tone='light'] {
    background: var(--emerald-primary-500, #26c26d);
  }

  .adm-analytics__dot[data-tone='pale'] {
    background: var(--emerald-primary-300, #baedd0);
  }

  .adm-analytics__dot[data-tone='muted'] {
    background: var(--emerald-neutral-300, #ccd6e7);
  }

  .adm-analytics__table-head {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-analytics__table-tools {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-analytics__search {
    width: 200px;
  }

  .adm-analytics__table-wrap {
    overflow-x: auto;
    margin-inline: calc(-1 * var(--emerald-spacing-l, 20px));
  }

  .adm-analytics__table th:first-child,
  .adm-analytics__table td:first-child {
    padding-left: var(--emerald-spacing-l, 20px);
  }

  .adm-analytics__table th:last-child,
  .adm-analytics__table td:last-child {
    padding-right: var(--emerald-spacing-l, 20px);
  }

  .adm-analytics__table tbody tr {
    transition: background-color 120ms ease;
  }

  .adm-analytics__table tbody tr:hover {
    background: var(--emerald-neutral-200, #f6f8fa);
  }

  .adm-analytics__table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--emerald-text-b2-size, 14px);
    white-space: nowrap;
  }

  .adm-analytics__table th {
    padding: var(--emerald-spacing-xs, 8px) var(--emerald-spacing-s, 12px);
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 600;
    text-align: left;
    border-bottom: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
  }

  .adm-analytics__table td {
    padding: var(--emerald-spacing-s, 12px);
    border-bottom: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-200, #f6f8fa);
  }

  .adm-analytics__client {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-xs, 8px);
  }

  .adm-analytics__client strong {
    display: block;
  }

  .adm-analytics__client-sub {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-analytics__progress-cell {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-xs, 8px);
    min-width: 160px;
  }

  .adm-analytics__progress-cell .emerald-progress {
    flex: 1;
  }

  .adm-analytics__strip {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: var(--emerald-spacing-m, 16px);
  }

  .adm-analytics__strip-body {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-2xs, 4px);
    min-height: 118px;
  }

  .adm-analytics__strip-value {
    display: flex;
    align-items: baseline;
    gap: 6px;
    font-size: 1.375rem;
    font-weight: 700;
  }

  .adm-analytics__strip-label {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-analytics__mini-bars {
    display: flex;
    align-items: flex-end;
    gap: 4px;
    height: 40px;
    margin-top: auto;
  }

  .adm-analytics__mini-bar {
    flex: 1;
    min-width: 4px;
    border-radius: 2px 2px 0 0;
    background: var(--emerald-primary-500, #26c26d);
  }

  .adm-analytics__mini-bar[data-down] {
    background: var(--emerald-neutral-300, #ccd6e7);
  }

  @media (max-width: 1200px) {
    .adm-analytics__hero {
      grid-template-columns: 1fr;
    }

    .adm-analytics__strip {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .adm-analytics__axis {
      flex-wrap: wrap;
    }
  }

  @media (max-width: 640px) {
    .adm-analytics__strip {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .adm-analytics__session {
      grid-template-columns: 1fr;
    }

    .adm-analytics__search {
      width: 100%;
    }
  }
</style>
