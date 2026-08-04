<!--
  Profit/Revenue bars, Impression trend, Top Services horizontal bars,
  Conversion sparkline, and Earning Report bars render as static CSS/SVG
  fills (real data, no charting library) — same GAP_CONTRACT precedent as
  EmeraldSales.
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

  const kpis = [
    { label: 'Total Profit', sub: '', value: '$88.5k', delta: '-18%', up: false, kind: 'bars' as const, bars: [45, 65, 100, 55, 80, 60] },
    { label: 'Total Revenue', sub: '', value: '$42.5k', delta: '-22%', up: false, kind: 'bars' as const, bars: [30, 55, 90, 40, 60] },
    { label: 'Impression', sub: 'Last year', value: '175K', delta: '+24%', up: true, kind: 'line' as const },
  ] as const

  const stats = [
    { label: 'Total Orders', sub: 'Last 4 months', value: '155K', delta: '+22%', up: true },
    { label: 'Total Profit', sub: 'Last One year', value: '$89.34k', delta: '-16%', up: false },
    { label: 'Bookmarks', sub: 'Last 6 months', value: '$1,200', delta: '+38%', up: true },
  ]

  const services = [
    { label: 'UI design', value: 99, tone: 'primary' as const },
    { label: 'UX design', value: 94, tone: 'secondary' as const },
    { label: 'Music', value: 80, tone: 'info' as const },
    { label: 'Animation', value: 68, tone: 'warning' as const },
    { label: 'React', value: 52, tone: 'warning' as const },
    { label: 'SEO', value: 45, tone: 'dark' as const },
  ]

  const conversion = [40, 55, 45, 60, 92]

  const perfTab = shallowRef('new')

  const performers: Record<string, { role: string, name: string, metric: string, value: string, delta: string }> = {
    new: { role: 'Product Manager', name: 'Angel George', metric: 'Physical product', value: '$78,263', delta: '+14.78%' },
    online: { role: 'Online Sales Lead', name: 'Priya Raman', metric: 'Digital product', value: '$52,910', delta: '+8.32%' },
    daily: { role: 'Daily Sales Lead', name: 'Marcus Webb', metric: 'In-store product', value: '$12,485', delta: '+3.05%' },
  }

  const performer = toRef(() => performers[perfTab.value] ?? performers.new!)

  const earning = [
    { label: 'Net profit', sub: 'Sales', value: '$1,623', delta: '+20.3%' },
    { label: 'Total income', sub: 'Sales, Affiliation', value: '$5,600', delta: '+16.2%' },
    { label: 'Total expense', sub: 'ADVT, Marketing', value: '$3,200', delta: '+10.5%' },
  ]
  const weekly = [40, 55, 60, 30, 100, 60, 45]
  const weeklyMax = Math.max(...weekly)
  const days = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU']

  const search = shallowRef('')
  const courses: Array<{ name: string, tutor: string, time: string, progress: number, of: number }> = [
    { name: 'UI/UX design', tutor: 'John cartal', time: '19h 17m', progress: 50, of: 100 },
    { name: 'Web development', tutor: 'Sara Mitchell', time: '20h 5m', progress: 11, of: 50 },
    { name: 'Product management', tutor: 'Alex Johnson', time: '21h 38m', progress: 1, of: 10 },
    { name: 'Graphic design', tutor: 'Emily Chen', time: '22h 12m', progress: 26, of: 50 },
    { name: 'Data analysis', tutor: 'Mark Robinson', time: '23h 45m', progress: 76, of: 100 },
  ]

  const filter = createFilter({ keys: ['name', 'tutor'] })
  const found = filter.apply(search, courses)
  const rows = toRef(() => found.items.value)

  function initials (name: string) {
    return name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase()
  }
</script>

<template>
  <EmeraldShell>
    <div class="adm-analytics" data-theme="emerald">
      <header class="adm-analytics__header">
        <h1 class="adm-analytics__title">Analytics</h1>
        <p class="adm-analytics__subtitle">Traffic, services and course engagement</p>
      </header>

      <section aria-label="Profit and revenue" class="adm-analytics__kpis">
        <EmCard v-for="kpi in kpis" :key="kpi.label" class="adm-analytics__kpi" variant="simple">
          <EmCardBody class="adm-analytics__kpi-body">
            <span class="adm-analytics__kpi-label">{{ kpi.label }}</span>

            <span class="adm-analytics__kpi-value">
              {{ kpi.value }}
              <em class="adm-analytics__delta" :data-up="kpi.up || undefined">{{ kpi.delta }}</em>
            </span>

            <div v-if="kpi.kind === 'bars'" aria-hidden="true" class="adm-analytics__mini-bars">
              <span v-for="(h, index) in kpi.bars" :key="index" class="adm-analytics__mini-bar" :style="{ height: h + '%' }" />
            </div>

            <svg
              v-else
              aria-hidden="true"
              class="adm-analytics__mini-line"
              preserveAspectRatio="none"
              viewBox="0 0 100 40"
            >
              <polyline
                fill="none"
                points="0,32 15,26 30,30 45,18 60,22 75,8 100,4"
                stroke="var(--emerald-primary-600, #1fae60)"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="3"
              />
            </svg>
          </EmCardBody>
        </EmCard>

        <EmCard v-for="stat in stats" :key="stat.label" class="adm-analytics__kpi" variant="simple">
          <EmCardBody class="adm-analytics__stat-body">
            <span class="adm-analytics__kpi-value">
              {{ stat.value }}
              <em class="adm-analytics__delta" :data-up="stat.up || undefined">{{ stat.delta }}</em>
            </span>

            <span class="adm-analytics__kpi-label">{{ stat.label }}</span>
            <EmTag class="adm-analytics__kpi-tag">{{ stat.sub }}</EmTag>
          </EmCardBody>
        </EmCard>
      </section>

      <section aria-label="Top services">
        <EmCard variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-analytics__panel-title">Top Services by Sales</EmCardTitle>
          </EmCardHeader>

          <EmCardBody>
            <ul aria-label="Top services by sales" class="adm-analytics__hbars" role="img">
              <li v-for="s in services" :key="s.label">
                <span class="adm-analytics__hbar-label">{{ s.label }}</span>

                <span class="adm-analytics__hbar-track">
                  <span class="adm-analytics__hbar-fill" :data-tone="s.tone" :style="{ width: s.value + '%' }" />
                </span>

                <strong>{{ s.value }}%</strong>
              </li>
            </ul>
          </EmCardBody>
        </EmCard>
      </section>

      <section aria-label="Conversion and performance" class="adm-analytics__row2">
        <EmCard class="adm-analytics__panel" variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-analytics__panel-title">Conversion rate</EmCardTitle>
            <p class="adm-analytics__panel-sub">Compared to last month</p>
          </EmCardHeader>

          <EmCardBody>
            <span class="adm-analytics__kpi-value adm-analytics__kpi-value--lg">92.8% <em class="adm-analytics__delta" data-up>6.3%</em></span>

            <svg aria-hidden="true" class="adm-analytics__trend" preserveAspectRatio="none" viewBox="0 0 100 40">
              <polyline
                fill="none"
                :points="conversion.map((v, index) => `${index * (100 / (conversion.length - 1))},${40 - (v / 100) * 36}`).join(' ')"
                stroke="var(--emerald-primary-600, #1fae60)"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="3"
              />
            </svg>
          </EmCardBody>
        </EmCard>

        <EmCard class="adm-analytics__panel" variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-analytics__panel-title">Performance</EmCardTitle>
          </EmCardHeader>

          <EmTabs v-model="perfTab">
            <EmTabsList>
              <EmTabsItem value="new">New Users</EmTabsItem>
              <EmTabsItem value="online">Online Sales</EmTabsItem>
              <EmTabsItem value="daily">Daily Sales</EmTabsItem>
            </EmTabsList>
          </EmTabs>

          <EmCardBody class="adm-analytics__perf">
            <div class="adm-analytics__perf-row">
              <span class="adm-analytics__perf-person">
                <EmAvatar size="sm"><EmAvatarFallback>AG</EmAvatarFallback></EmAvatar>

                <span class="adm-analytics__perf-text">
                  <span>{{ performer.role }}</span>
                  <strong>{{ performer.name }}</strong>
                </span>
              </span>
            </div>

            <div class="adm-analytics__perf-row">
              <span class="adm-analytics__perf-text">
                <span>{{ performer.metric }}</span>
                <strong>{{ performer.value }}</strong>
              </span>

              <EmTag variant="success">{{ performer.delta }}</EmTag>
            </div>
          </EmCardBody>
        </EmCard>
      </section>

      <section aria-label="Earning report and courses" class="adm-analytics__row3">
        <EmCard class="adm-analytics__panel" variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-analytics__panel-title">Earning Report</EmCardTitle>
            <p class="adm-analytics__panel-sub">Weekly Earning overview</p>
          </EmCardHeader>

          <EmCardBody>
            <ul class="adm-analytics__earning">
              <li v-for="row in earning" :key="row.label">
                <span class="adm-analytics__earning-text">
                  <strong>{{ row.label }}</strong>
                  <span>{{ row.sub }}</span>
                </span>

                <span class="adm-analytics__earning-value">
                  {{ row.value }}
                  <em class="adm-analytics__delta" data-up>{{ row.delta }}</em>
                </span>
              </li>
            </ul>

            <div aria-label="Weekly earning overview" class="adm-analytics__week-chart" role="img">
              <div v-for="(v, index) in weekly" :key="index" class="adm-analytics__chart-col">
                <span class="adm-analytics__chart-bar" :data-peak="v === weeklyMax || undefined" :style="{ height: v + '%' }" />
                <span class="adm-analytics__chart-label">{{ days[index] }}</span>
              </div>
            </div>
          </EmCardBody>
        </EmCard>

        <EmCard class="adm-analytics__panel adm-analytics__panel--wide" variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-analytics__panel-title">Course you are taking</EmCardTitle>
            <EmTextField v-model="search" aria-label="Search course" class="adm-analytics__search" placeholder="Search course" />
          </EmCardHeader>

          <EmCardBody class="adm-analytics__table-wrap">
            <table class="adm-analytics__table">
              <thead>
                <tr>
                  <th><EmCheckbox aria-label="Select all" /></th>
                  <th>Course</th>
                  <th>Time</th>
                  <th>Progress</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="c in rows" :key="c.name">
                  <td><EmCheckbox :aria-label="`Select ${c.name}`" /></td>

                  <td>
                    <div class="adm-analytics__client">
                      <EmAvatar size="sm"><EmAvatarFallback>{{ initials(c.name) }}</EmAvatarFallback></EmAvatar>
                      <span><strong>{{ c.name }}</strong><span class="adm-analytics__client-sub">{{ c.tutor }}</span></span>
                    </div>
                  </td>

                  <td>{{ c.time }}</td>

                  <td class="adm-analytics__progress-cell">
                    <EmProgress :aria-label="`${c.name} progress`" :max="c.of" :model-value="c.progress" size="sm" />
                    <span>{{ c.progress }}/{{ c.of }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
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

  .adm-analytics__kpis {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: var(--emerald-spacing-m, 16px);
  }

  .adm-analytics__kpi-body,
  .adm-analytics__stat-body {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-xs, 8px);
    min-height: 110px;
  }

  .adm-analytics__kpi-label {
    font-weight: 600;
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-analytics__kpi-value {
    display: flex;
    align-items: baseline;
    gap: 6px;
    font-size: 1.25rem;
    font-weight: 700;
  }

  .adm-analytics__kpi-value--lg {
    font-size: 1.75rem;
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

  .adm-analytics__mini-line {
    width: 100%;
    height: 40px;
    margin-top: auto;
  }

  .adm-analytics__kpi-tag {
    width: fit-content;
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

  .adm-analytics__hbars {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-m, 16px);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .adm-analytics__hbars li {
    display: grid;
    grid-template-columns: 90px 1fr 48px;
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-analytics__hbar-label {
    font-size: var(--emerald-text-b2-size, 14px);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-analytics__hbar-track {
    height: 10px;
    border-radius: 5px;
    background: var(--emerald-neutral-200, #f6f8fa);
    overflow: hidden;
  }

  .adm-analytics__hbar-fill {
    display: block;
    height: 100%;
    border-radius: 5px;
    background: var(--emerald-primary-500, #26c26d);
  }

  .adm-analytics__hbar-fill[data-tone='secondary'] {
    background: var(--emerald-primary-500, #6fb38c);
  }

  .adm-analytics__hbar-fill[data-tone='info'] {
    background: var(--emerald-primary-400, #94cbab);
  }

  .adm-analytics__hbar-fill[data-tone='warning'] {
    background: var(--emerald-primary-300, #baedd0);
  }

  .adm-analytics__hbar-fill[data-tone='dark'] {
    background: var(--emerald-primary-800, #01603a);
  }

  .adm-analytics__row2,
  .adm-analytics__row3 {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--emerald-spacing-m, 16px);
  }

  .adm-analytics__trend {
    width: 100%;
    height: 70px;
    margin-top: var(--emerald-spacing-m, 16px);
  }

  .adm-analytics__perf {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-m, 16px);
  }

  .adm-analytics__perf-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: var(--emerald-spacing-s, 12px);
    padding: var(--emerald-spacing-s, 12px);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    border-radius: var(--emerald-radius-m, 8px);
  }

  .adm-analytics__perf-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
    font-size: var(--emerald-text-b3-size, 12px);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-analytics__perf-person {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-analytics__perf-row > span:first-child strong {
    color: var(--emerald-on-surface, #2b2d2e);
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-analytics__earning {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-s, 12px);
    margin: 0 0 var(--emerald-spacing-m, 16px);
    padding: 0;
    list-style: none;
  }

  .adm-analytics__earning li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-analytics__earning-text {
    display: flex;
    flex-direction: column;
    font-size: var(--emerald-text-b3-size, 12px);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-analytics__earning-text strong {
    color: var(--emerald-on-surface, #2b2d2e);
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-analytics__earning-value {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    font-weight: 700;
  }

  .adm-analytics__week-chart {
    display: flex;
    align-items: flex-end;
    gap: 8px;
    height: 110px;
  }

  .adm-analytics__chart-col {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    gap: 4px;
    height: 100%;
  }

  .adm-analytics__chart-bar {
    width: 55%;
    min-height: 6px;
    border-radius: var(--emerald-radius-xs, 4px) var(--emerald-radius-xs, 4px) 0 0;
    background: var(--emerald-primary-100, #e7fff2);
  }

  .adm-analytics__chart-bar[data-peak] {
    background: var(--emerald-primary-600, #1fae60);
  }

  .adm-analytics__chart-label {
    font-size: var(--emerald-text-b3-size, 12px);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  /* .emerald-card__header is flex-direction: column — a title/action row has to
     opt back into row explicitly. */
  .adm-analytics__panel--wide .emerald-card__header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-analytics__search {
    width: 200px;
  }

  .adm-analytics__table-wrap {
    overflow-x: auto;
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

  @media (max-width: 1200px) {
    .adm-analytics__kpis {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .adm-analytics__row2,
    .adm-analytics__row3 {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .adm-analytics__kpis {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
</style>
