<!--
  Customer ratings trend and progress bars render as static CSS/SVG fills
  (real data, no charting library), matching the EmeraldSales precedent — see
  GAPS.md "Charting" row for the gap contract. Condition rings reuse the
  conic-gradient technique from EmeraldSales' "User reach" KPI.
-->
<script setup lang="ts">
  import {
    EmAvatar,
    EmAvatarFallback,
    EmButton,
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
  } from '@paper/emerald'

  // Context
  import EmeraldShell from './EmeraldShell.vue'

  // Utilities
  import { shallowRef } from 'vue'

  const fleet = [
    { label: 'On the way', time: '2hr 10min', pct: 33.3, tone: 'muted' as const },
    { label: 'Unloading', time: '3hr 15min', pct: 23.5, tone: 'secondary' as const },
    { label: 'Loading', time: '1hr 24min', pct: 22.1, tone: 'primary' as const },
    { label: 'Waiting', time: '5hr 19min', pct: 21.1, tone: 'dark' as const },
  ]

  const packingTab = shallowRef('packed')
  const packing = [
    { label: 'Packing Pending', value: 4250, max: 5000 },
    { label: 'Packing in Progress', value: 2150, max: 5000 },
    { label: 'Packing Complete', value: 1750, max: 5000 },
  ]

  const performance = {
    online: [80, 65, 90, 55, 100, 70, 85],
    offline: [40, 55, 30, 60, 45, 65, 50],
  }

  const condition = [
    { label: 'Excellent', sub: '12% increase', pct: 55, delta: '+25%', tone: 'primary' as const },
    { label: 'Good', sub: '24 vehicles', pct: 20, delta: '+30%', tone: 'secondary' as const },
    { label: 'Average', sub: '182 Tasks', pct: 12, delta: '-15%', tone: 'warning' as const },
    { label: 'Bad', sub: '9 vehicles', pct: 8, delta: '+35%', tone: 'danger' as const },
    { label: 'Not Working', sub: '3 vehicles', pct: 5, delta: '-2%', tone: 'muted' as const },
  ]

  const ratingTrend = [30, 45, 35, 55, 90, 60, 40]

  const fleetOnRoute: Array<{ id: string, start: string, end: string, warning: string, ok: boolean, progress: number }> = [
    { id: 'VOL-159145', start: 'Paris 19, France', end: 'Dresdon, Germany', warning: 'No Warning', ok: true, progress: 50 },
    { id: 'VOL-163825', start: 'Tokyo 23, Japan', end: 'Budapest, Hungary', warning: 'Fuel Problems', ok: false, progress: 75 },
    { id: 'VOL-182624', start: 'New York City, USA', end: 'Kyoto, Japan', warning: 'Temperature Not Optimal', ok: false, progress: 25 },
    { id: 'VOL-27568', start: 'Berlin, Germany', end: 'Cape Town, South Africa', warning: 'Ecu Not Responding', ok: false, progress: 50 },
    { id: 'VOL-300168', start: 'Sydney, Australia', end: 'Buenos Aires, Argentina', warning: 'Oil Leakage', ok: false, progress: 25 },
  ]
</script>

<template>
  <EmeraldShell>
    <div class="adm-logistics" data-theme="emerald">
      <header class="adm-logistics__header">
        <h1 class="adm-logistics__title">Logistics</h1>
        <p class="adm-logistics__subtitle">Fleet and shipment overview</p>
      </header>

      <section aria-label="Vehicle status" class="adm-logistics__row1">
        <EmCard class="adm-logistics__panel" variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-logistics__panel-title">Vehicle overview</EmCardTitle>
          </EmCardHeader>

          <EmCardBody>
            <div aria-label="Fleet status distribution" class="adm-logistics__segbar" role="img">
              <span
                v-for="f in fleet"
                :key="f.label"
                class="adm-logistics__seg"
                :data-tone="f.tone"
                :style="{ flexGrow: f.pct }"
              >{{ f.pct }}%</span>
            </div>

            <ul class="adm-logistics__fleet-list">
              <li v-for="f in fleet" :key="f.label">
                <span class="adm-logistics__fleet-label">{{ f.label }}</span>
                <span class="adm-logistics__fleet-time">{{ f.time }}</span>
                <span class="adm-logistics__fleet-pct">{{ f.pct }}%</span>
              </li>
            </ul>
          </EmCardBody>
        </EmCard>

        <EmCard class="adm-logistics__panel" variant="simple">
          <EmCardHeader class="adm-logistics__driver-head">
            <EmAvatar size="md"><EmAvatarFallback>JW</EmAvatarFallback></EmAvatar>

            <div>
              <EmCardTitle class="adm-logistics__panel-title">@jackwilliams</EmCardTitle>
              <p class="adm-logistics__panel-sub">Business</p>
            </div>
          </EmCardHeader>

          <EmCardBody>
            <p class="adm-logistics__orders"><strong>4,689</strong> Orders</p>

            <EmTabs v-model="packingTab">
              <EmTabsList>
                <EmTabsItem value="packed">Packed</EmTabsItem>
                <EmTabsItem value="shipped">Shipped</EmTabsItem>
                <EmTabsItem value="received">Received</EmTabsItem>
              </EmTabsList>
            </EmTabs>

            <div class="adm-logistics__packing">
              <div v-for="row in packing" :key="row.label" class="adm-logistics__packing-row">
                <div class="adm-logistics__packing-head">
                  <span>{{ row.label }}</span>
                  <strong>{{ row.value }}</strong>
                </div>

                <EmProgress :aria-label="row.label" :max="row.max" :model-value="row.value" size="sm" />
              </div>
            </div>
          </EmCardBody>
        </EmCard>
      </section>

      <section aria-label="Performance and condition" class="adm-logistics__row2">
        <EmCard class="adm-logistics__panel" variant="simple">
          <EmCardHeader class="adm-logistics__panel-head">
            <EmCardTitle class="adm-logistics__panel-title">Sales performance</EmCardTitle>
            <EmButton size="sm" variant="tertiary">Details</EmButton>
          </EmCardHeader>

          <EmCardBody>
            <span class="adm-logistics__kpi-value">68K <em class="adm-logistics__delta">-6%</em></span>

            <div class="adm-logistics__dual">
              <div class="adm-logistics__dual-col">
                <span class="adm-logistics__dual-label">Online Store <strong>88</strong></span>

                <div class="adm-logistics__dual-bars">
                  <span
                    v-for="(h, index) in performance.online"
                    :key="index"
                    class="adm-logistics__dual-bar"
                    data-tone="secondary"
                    :style="{ width: h + '%' }"
                  />
                </div>
              </div>

              <div class="adm-logistics__dual-col">
                <span class="adm-logistics__dual-label">Offline Store <strong>64</strong></span>

                <div class="adm-logistics__dual-bars">
                  <span
                    v-for="(h, index) in performance.offline"
                    :key="index"
                    class="adm-logistics__dual-bar"
                    data-tone="primary"
                    :style="{ width: h + '%' }"
                  />
                </div>
              </div>
            </div>
          </EmCardBody>
        </EmCard>

        <EmCard class="adm-logistics__panel" variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-logistics__panel-title">Vehicles Condition</EmCardTitle>
          </EmCardHeader>

          <EmCardBody>
            <ul class="adm-logistics__condition">
              <li v-for="c in condition" :key="c.label">
                <span aria-hidden="true" class="adm-logistics__ring" :data-tone="c.tone" :style="{ '--pct': c.pct }">{{ c.pct }}%</span>

                <span class="adm-logistics__condition-text">
                  <strong>{{ c.label }}</strong>
                  <span>{{ c.sub }}</span>
                </span>

                <EmTag :variant="c.delta.startsWith('+') ? 'success' : 'danger'">{{ c.delta }}</EmTag>
              </li>
            </ul>
          </EmCardBody>
        </EmCard>

        <EmCard class="adm-logistics__panel" variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-logistics__panel-title">Customer Ratings</EmCardTitle>
          </EmCardHeader>

          <EmCardBody>
            <div class="adm-logistics__rating">
              <strong>4.5</strong>

              <span aria-label="4.5 out of 5 stars" class="adm-logistics__stars" role="img">
                <svg
                  v-for="n in 5"
                  :key="n"
                  fill="currentColor"
                  height="16"
                  viewBox="0 0 24 24"
                  width="16"
                >
                  <path d="M12 3.5 14.6 9l6 .9-4.3 4.2 1 6-5.3-2.8L6.7 20l1-6L3.4 9.9l6-.9L12 3.5Z" :opacity="n <= 4 ? 1 : 0.35" />
                </svg>
              </span>

              <EmTag variant="success">+ 5.0</EmTag>
            </div>

            <p class="adm-logistics__panel-sub">Points from last month</p>

            <svg aria-hidden="true" class="adm-logistics__trend" preserveAspectRatio="none" viewBox="0 0 100 40">
              <polyline
                fill="none"
                :points="ratingTrend.map((v, index) => `${index * (100 / (ratingTrend.length - 1))},${40 - (v / 100) * 36}`).join(' ')"
                stroke="var(--emerald-primary-600, #1fae60)"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="3"
              />
            </svg>
          </EmCardBody>
        </EmCard>
      </section>

      <section aria-label="On route vehicles">
        <EmCard variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-logistics__panel-title">On route vehicle</EmCardTitle>
          </EmCardHeader>

          <EmCardBody class="adm-logistics__table-wrap">
            <table class="adm-logistics__table">
              <thead>
                <tr>
                  <th><EmCheckbox aria-label="Select all" /></th>
                  <th>Vehicle</th>
                  <th>Starting route</th>
                  <th>Ending route</th>
                  <th>Warnings</th>
                  <th>Progress</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="v in fleetOnRoute" :key="v.id">
                  <td><EmCheckbox :aria-label="`Select ${v.id}`" /></td>

                  <td>
                    <div class="adm-logistics__vehicle">
                      <span aria-hidden="true" class="adm-logistics__vehicle-icon">
                        <svg
                          fill="none"
                          height="15"
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="1.75"
                          viewBox="0 0 24 24"
                          width="15"
                        ><path d="M3 7h11v9H3V7Z" /><path d="M14 10h4l3 3v3h-7v-6Z" /></svg>
                      </span>
                      {{ v.id }}
                    </div>
                  </td>

                  <td>{{ v.start }}</td>
                  <td>{{ v.end }}</td>
                  <td><EmTag :variant="v.ok ? 'success' : 'info'">{{ v.warning }}</EmTag></td>

                  <td class="adm-logistics__progress-cell">
                    <EmProgress :aria-label="`${v.id} progress`" :model-value="v.progress" size="sm" />
                    <span>{{ v.progress }}%</span>
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
  .adm-logistics {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-l, 20px);
  }

  .adm-logistics .emerald-card {
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

  .adm-logistics__row1 {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--emerald-spacing-m, 16px);
  }

  .adm-logistics__row2 {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--emerald-spacing-m, 16px);
    align-items: start;
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

  .adm-logistics__panel-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-logistics__segbar {
    display: flex;
    height: 40px;
    border-radius: var(--emerald-radius-m, 8px);
    overflow: hidden;
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 600;
  }

  .adm-logistics__seg {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--emerald-on-surface, #2b2d2e);
    background: var(--emerald-neutral-200, #f6f8fa);
  }

  .adm-logistics__seg[data-tone='secondary'] {
    background: var(--emerald-secondary-400, #7fdaf0);
  }

  .adm-logistics__seg[data-tone='primary'] {
    background: var(--emerald-primary-500, #26c26d);
    color: var(--emerald-on-primary, #fff);
  }

  .adm-logistics__seg[data-tone='dark'] {
    background: var(--emerald-neutral-800, #636a70);
    color: var(--emerald-on-primary, #fff);
  }

  .adm-logistics__fleet-list {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-s, 12px);
    margin: var(--emerald-spacing-m, 16px) 0 0;
    padding: 0;
    list-style: none;
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-logistics__fleet-list li {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-logistics__fleet-label {
    flex: 1;
    font-weight: 600;
  }

  .adm-logistics__fleet-time,
  .adm-logistics__fleet-pct {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-logistics__driver-head {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-logistics__orders {
    margin: 0 0 var(--emerald-spacing-m, 16px);
    font-size: var(--emerald-text-b1-size, 16px);
  }

  .adm-logistics__orders strong {
    font-size: 1.5rem;
  }

  .adm-logistics__packing {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-m, 16px);
    margin-top: var(--emerald-spacing-m, 16px);
  }

  .adm-logistics__packing-head {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-logistics__kpi-value {
    display: flex;
    align-items: baseline;
    gap: 8px;
    font-size: 1.75rem;
    font-weight: 700;
  }

  .adm-logistics__delta {
    font-style: normal;
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 600;
    color: var(--emerald-danger-500, #c61424);
  }

  .adm-logistics__dual {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--emerald-spacing-m, 16px);
    margin-top: var(--emerald-spacing-m, 16px);
  }

  .adm-logistics__dual-label {
    display: block;
    margin-bottom: var(--emerald-spacing-xs, 8px);
    font-size: var(--emerald-text-b3-size, 12px);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-logistics__dual-label strong {
    color: var(--emerald-on-surface, #2b2d2e);
  }

  .adm-logistics__dual-bars {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .adm-logistics__dual-bar {
    height: 6px;
    min-width: 8%;
    border-radius: 3px;
    background: var(--emerald-neutral-300, #ccd6e7);
  }

  .adm-logistics__dual-bar[data-tone='primary'] {
    background: var(--emerald-primary-500, #26c26d);
  }

  .adm-logistics__dual-bar[data-tone='secondary'] {
    background: var(--emerald-secondary-500, #00b4dc);
  }

  .adm-logistics__condition {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-s, 12px);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .adm-logistics__condition li {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-logistics__ring {
    --pct: 50;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    font-size: 10px;
    font-weight: 700;
    background: conic-gradient(var(--emerald-primary-600, #1fae60) calc(var(--pct) * 1%), var(--emerald-neutral-200, #f6f8fa) 0);
  }

  .adm-logistics__ring::before {
    content: '';
    position: absolute;
    inset: 4px;
    border-radius: 50%;
    background: var(--emerald-background, #fefefe);
    z-index: 0;
  }

  .adm-logistics__ring {
    z-index: 1;
  }

  .adm-logistics__ring[data-tone='secondary'] {
    background: conic-gradient(var(--emerald-secondary-500, #00b4dc) calc(var(--pct) * 1%), var(--emerald-neutral-200, #f6f8fa) 0);
  }

  .adm-logistics__ring[data-tone='warning'] {
    background: conic-gradient(var(--emerald-warning-500, #f5a623) calc(var(--pct) * 1%), var(--emerald-neutral-200, #f6f8fa) 0);
  }

  .adm-logistics__ring[data-tone='danger'] {
    background: conic-gradient(var(--emerald-danger-500, #c61424) calc(var(--pct) * 1%), var(--emerald-neutral-200, #f6f8fa) 0);
  }

  .adm-logistics__ring[data-tone='muted'] {
    background: conic-gradient(var(--emerald-neutral-500, #949ca3) calc(var(--pct) * 1%), var(--emerald-neutral-200, #f6f8fa) 0);
  }

  .adm-logistics__condition-text {
    display: flex;
    flex-direction: column;
    font-size: var(--emerald-text-b3-size, 12px);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-logistics__condition-text strong {
    color: var(--emerald-on-surface, #2b2d2e);
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-logistics__rating {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-logistics__rating strong {
    font-size: 1.75rem;
  }

  .adm-logistics__stars {
    display: flex;
    gap: 2px;
    color: var(--emerald-warning-500, #f5a623);
  }

  .adm-logistics__trend {
    width: 100%;
    height: 60px;
    margin-top: var(--emerald-spacing-m, 16px);
  }

  .adm-logistics__table-wrap {
    overflow-x: auto;
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

  .adm-logistics__vehicle {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .adm-logistics__vehicle-icon {
    display: inline-flex;
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-logistics__progress-cell {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-xs, 8px);
    min-width: 140px;
  }

  .adm-logistics__progress-cell .emerald-progress {
    flex: 1;
  }

  @media (max-width: 1200px) {
    .adm-logistics__row1,
    .adm-logistics__row2 {
      grid-template-columns: 1fr;
    }
  }
</style>
