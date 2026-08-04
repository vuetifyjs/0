<!--
  Total Income area chart, Total earning bars, and Vehicles Condition rings
  render as static CSS/SVG fills (real data, no charting library) — same
  GAP_CONTRACT precedent as AdminSales.
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
    EmTag,
  } from '@paper/emerald'

  // Context
  import AdminShell from './AdminShell.vue'

  const kpis = [
    { label: 'Total Sales', sub: 'Last 6 months', value: '$13.4k', delta: '+38%', up: true, icon: 'mail' as const },
    { label: 'Total Orders', sub: 'Last 4 months', value: '155K', delta: '+22%', up: true, icon: 'cart' as const },
    { label: 'Total Profit', sub: 'Last One year', value: '$89.34k', delta: '-16%', up: false, icon: 'coin' as const },
    { label: 'Bookmarks', sub: 'Last 6 months', value: '1,200', delta: '+38%', up: true, icon: 'card' as const },
  ]

  const income = [3.2, 4.5, 4.1, 4.9, 4.2, 5.1, 6]
  const incomeMax = Math.max(...income)
  const days = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU']

  const report = [
    { label: 'Income', value: '$5,550', icon: 'card' as const },
    { label: 'Expense', value: '$3,520', icon: 'card' as const },
    { label: 'Profit', value: '$2,350', icon: 'coin' as const },
  ]

  const funnel = [
    { label: 'Emails', value: '14,250', delta: '0.3%', icon: 'mail' as const },
    { label: 'Opened', value: '4,523', delta: '3.1%', icon: 'open' as const },
    { label: 'Clicked', value: '1,250', delta: '1.3%', icon: 'click' as const },
    { label: 'Subscribed', value: '750', delta: '9.8%', icon: 'bell' as const },
    { label: 'Errors', value: '20', delta: '1.5%', icon: 'warn' as const },
    { label: 'Unsubscribed', value: '86', delta: '0.6%', icon: 'off' as const },
  ]

  const earning = [40, 60, 55, 65, 45, 75, 50]

  const condition = [
    { label: 'Excellent', sub: '12% increase', pct: 55, delta: '+25%', tone: 'primary' as const },
    { label: 'Good', sub: '24 vehicles', pct: 20, delta: '+30%', tone: 'secondary' as const },
    { label: 'Average', sub: '182 Tasks', pct: 12, delta: '-15%', tone: 'warning' as const },
    { label: 'Bad', sub: '9 vehicles', pct: 7, delta: '+35%', tone: 'danger' as const },
    { label: 'Not Working', sub: '3 vehicles', pct: 4, delta: '-2%', tone: 'muted' as const },
    { label: 'Scraped', sub: '2 vehicles', pct: 2, delta: '+1%', tone: 'muted' as const },
  ]

  const customers: Array<{ name: string, email: string, spend: string, status: 'active' | 'pending' | 'inactive' }> = [
    { name: 'Jack Alfredo', email: 'jack.alfredo@shadcnstudio.com', spend: '$3,120.00', status: 'active' },
    { name: 'Sarah Mitchell', email: 'sarah.mitchell@company.com', spend: '$1,450.00', status: 'active' },
    { name: 'Robert Chen', email: 'robert.chen@startup.io', spend: '$1,200.00', status: 'pending' },
    { name: 'Emily Wilson', email: 'emily.wilson@freelance.com', spend: '$2,680.00', status: 'inactive' },
    { name: 'David Garcia', email: 'david.garcia@agency.net', spend: '$3,120.00', status: 'active' },
  ]

  function initials (name: string) {
    return name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase()
  }
</script>

<template>
  <AdminShell>
    <div class="adm-campaign" data-theme="emerald">
      <header class="adm-campaign__header">
        <h1 class="adm-campaign__title">Campaign</h1>
        <p class="adm-campaign__subtitle">Email campaign performance</p>
      </header>

      <section aria-label="Key metrics" class="adm-campaign__kpis">
        <EmCard v-for="kpi in kpis" :key="kpi.label" class="adm-campaign__kpi" variant="simple">
          <EmCardBody class="adm-campaign__kpi-body">
            <span aria-hidden="true" class="adm-campaign__icon" :data-tone="kpi.up ? 'primary' : 'danger'">
              <svg
                fill="none"
                height="16"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-width="1.75"
                viewBox="0 0 24 24"
                width="16"
              ><path d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" /><path d="M3 6l9 7 9-7" /></svg>
            </span>

            <span class="adm-campaign__kpi-value">
              {{ kpi.value }}
              <em class="adm-campaign__delta" :data-up="kpi.up || undefined">{{ kpi.delta }}</em>
            </span>

            <span class="adm-campaign__kpi-label">{{ kpi.label }}</span>
            <EmTag class="adm-campaign__kpi-tag">{{ kpi.sub }}</EmTag>
          </EmCardBody>
        </EmCard>

        <EmCard class="adm-campaign__kpi adm-campaign__kpi--customers" variant="simple">
          <EmCardBody>
            <span class="adm-campaign__kpi-label">Customers</span>
            <EmTag>Daily customers</EmTag>
            <span class="adm-campaign__kpi-value">42.4k <em class="adm-campaign__delta" data-up>+9.2%</em></span>
          </EmCardBody>
        </EmCard>
      </section>

      <section aria-label="Income and campaign state" class="adm-campaign__row1">
        <EmCard class="adm-campaign__panel" variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-campaign__panel-title">Total Income</EmCardTitle>
            <p class="adm-campaign__panel-sub">Weekly report overview</p>
          </EmCardHeader>

          <EmCardBody>
            <svg
              aria-label="Total income by day"
              class="adm-campaign__area"
              preserveAspectRatio="none"
              role="img"
              viewBox="0 0 100 40"
            >
              <polygon
                fill="var(--emerald-primary-100, #e7fff2)"
                :points="`0,40 ${income.map((v, index) => `${index * (100 / (income.length - 1))},${40 - (v / incomeMax) * 34}`).join(' ')} 100,40`"
              />

              <polyline
                fill="none"
                :points="income.map((v, index) => `${index * (100 / (income.length - 1))},${40 - (v / incomeMax) * 34}`).join(' ')"
                stroke="var(--emerald-primary-600, #1fae60)"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
              />
            </svg>

            <div class="adm-campaign__area-axis">
              <span v-for="d in days" :key="d">{{ d }}</span>
            </div>
          </EmCardBody>
        </EmCard>

        <EmCard class="adm-campaign__panel" variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-campaign__panel-title">Report</EmCardTitle>
            <p class="adm-campaign__panel-sub">Weekly activity</p>
          </EmCardHeader>

          <EmCardBody>
            <ul class="adm-campaign__report">
              <li v-for="row in report" :key="row.label">
                <span aria-hidden="true" class="adm-campaign__icon" data-tone="primary">
                  <svg
                    fill="none"
                    height="16"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-width="1.75"
                    viewBox="0 0 24 24"
                    width="16"
                  ><path d="M3 7h18v10H3V7Z" /><path d="M3 10h18" /></svg>
                </span>

                <span class="adm-campaign__report-label">{{ row.label }}</span>
                <strong>{{ row.value }}</strong>
              </li>
            </ul>
          </EmCardBody>
        </EmCard>

        <EmCard class="adm-campaign__panel" variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-campaign__panel-title">Monthly campaign state</EmCardTitle>
            <p class="adm-campaign__panel-sub">7.58k Social Visitors</p>
          </EmCardHeader>

          <EmCardBody>
            <ul class="adm-campaign__funnel">
              <li v-for="f in funnel" :key="f.label">
                <span class="adm-campaign__funnel-label">{{ f.label }}</span>
                <strong>{{ f.value }}</strong>
                <span class="adm-campaign__funnel-delta">{{ f.delta }}</span>
              </li>
            </ul>
          </EmCardBody>
        </EmCard>
      </section>

      <section aria-label="Earning and business plans" class="adm-campaign__row2">
        <EmCard class="adm-campaign__panel" variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-campaign__panel-title">Total earning</EmCardTitle>
          </EmCardHeader>

          <EmCardBody>
            <span class="adm-campaign__kpi-value adm-campaign__kpi-value--lg">87% <em class="adm-campaign__delta" data-up>+38%</em></span>

            <div aria-label="Total earning trend" class="adm-campaign__bars" role="img">
              <span v-for="(v, index) in earning" :key="index" class="adm-campaign__bar" :style="{ height: v + '%' }" />
            </div>

            <div class="adm-campaign__earning-rows">
              <div><span class="adm-campaign__icon" data-tone="primary">$</span> <span>Total revenue<br><small>Successful payments</small></span> <strong>+$250</strong></div>
              <div><span class="adm-campaign__icon" data-tone="secondary">◧</span> <span>Total sales<br><small>Refund</small></span> <strong>+$80</strong></div>
            </div>
          </EmCardBody>
        </EmCard>

        <EmCard class="adm-campaign__panel" variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-campaign__panel-title">For Business Shark</EmCardTitle>
            <p class="adm-campaign__panel-sub">A range of items and features used without them</p>
          </EmCardHeader>

          <EmCardBody>
            <span class="adm-campaign__report-label">Taxes <strong class="adm-campaign__amount">$32</strong></span>
            <span class="adm-campaign__report-label">Total amount <strong class="adm-campaign__amount">$152</strong></span>
            <EmButton class="adm-campaign__cta" variant="primary">Pay now</EmButton>
          </EmCardBody>
        </EmCard>

        <EmCard class="adm-campaign__panel" variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-campaign__panel-title">Vehicles Condition</EmCardTitle>
          </EmCardHeader>

          <EmCardBody>
            <ul class="adm-campaign__condition">
              <li v-for="c in condition" :key="c.label">
                <span aria-hidden="true" class="adm-campaign__ring" :data-tone="c.tone" :style="{ '--pct': c.pct }">{{ c.pct }}%</span>

                <span class="adm-campaign__condition-text">
                  <strong>{{ c.label }}</strong>
                  <span>{{ c.sub }}</span>
                </span>
              </li>
            </ul>
          </EmCardBody>
        </EmCard>
      </section>

      <section aria-label="Customers">
        <EmCard variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-campaign__panel-title">Customers</EmCardTitle>
          </EmCardHeader>

          <EmCardBody class="adm-campaign__table-wrap">
            <table class="adm-campaign__table">
              <thead>
                <tr>
                  <th><EmCheckbox aria-label="Select all" /></th>
                  <th>Client</th>
                  <th>Total Spend</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="c in customers" :key="c.email">
                  <td><EmCheckbox :aria-label="`Select ${c.name}`" /></td>

                  <td>
                    <div class="adm-campaign__client">
                      <EmAvatar size="sm"><EmAvatarFallback>{{ initials(c.name) }}</EmAvatarFallback></EmAvatar>

                      <span>
                        <strong>{{ c.name }}</strong>
                        <span class="adm-campaign__client-email">{{ c.email }}</span>
                      </span>
                    </div>
                  </td>

                  <td>{{ c.spend }}</td>

                  <td>
                    <EmTag :variant="c.status === 'active' ? 'success' : c.status === 'pending' ? 'info' : 'danger'">
                      {{ c.status === 'active' ? 'Active' : c.status === 'pending' ? 'Pending' : 'Inactive' }}
                    </EmTag>
                  </td>

                  <td>
                    <EmButton aria-label="More actions" size="sm" variant="tertiary">
                      <svg fill="currentColor" height="15" viewBox="0 0 24 24" width="15"><circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" /></svg>
                    </EmButton>
                  </td>
                </tr>
              </tbody>
            </table>
          </EmCardBody>
        </EmCard>
      </section>
    </div>
  </AdminShell>
</template>

<style>
  .adm-campaign {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-l, 20px);
  }

  .adm-campaign .emerald-card {
    background: var(--emerald-background, #fefefe);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    border-radius: var(--emerald-radius-xl, 12px);
    box-shadow: var(--emerald-shadow-s, 0 0 2px 0 rgba(51, 51, 51, 0.08));
  }

  .adm-campaign__title {
    margin: 0;
    font-size: clamp(1.375rem, 2vw, 1.625rem);
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .adm-campaign__subtitle {
    margin: 0.25rem 0 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b1-size, 16px);
  }

  .adm-campaign__kpis {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: var(--emerald-spacing-m, 16px);
  }

  .adm-campaign__kpi-body {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .adm-campaign__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    margin-bottom: 4px;
    border-radius: var(--emerald-radius-m, 8px);
    background: var(--emerald-primary-100, #e7fff2);
    color: var(--emerald-primary-700, #027d4c);
  }

  .adm-campaign__icon[data-tone='danger'] {
    background: var(--emerald-danger-100, #ffebee);
    color: var(--emerald-danger-500, #c61424);
  }

  .adm-campaign__icon[data-tone='secondary'] {
    background: var(--emerald-secondary-100, #e4f2ff);
    color: var(--emerald-neutral-800, #636a70);
  }

  .adm-campaign__kpi-value {
    display: flex;
    align-items: baseline;
    gap: 6px;
    font-size: 1.5rem;
    font-weight: 700;
  }

  .adm-campaign__kpi-value--lg {
    font-size: 1.75rem;
    margin-bottom: var(--emerald-spacing-s, 12px);
  }

  .adm-campaign__delta {
    font-style: normal;
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 600;
    color: var(--emerald-danger-500, #c61424);
  }

  .adm-campaign__delta[data-up] {
    color: var(--emerald-primary-700, #027d4c);
  }

  .adm-campaign__kpi-label {
    font-weight: 600;
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-campaign__kpi-tag {
    width: fit-content;
    margin-top: 4px;
  }

  .adm-campaign__kpi--customers {
    display: flex;
    align-items: center;
  }

  .adm-campaign__kpi--customers .emerald-card__body {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .adm-campaign__row1 {
    display: grid;
    grid-template-columns: minmax(0, 1.3fr) minmax(0, 0.9fr) minmax(0, 1.1fr);
    gap: var(--emerald-spacing-m, 16px);
  }

  .adm-campaign__row2 {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--emerald-spacing-m, 16px);
    align-items: start;
  }

  .adm-campaign__panel-title {
    font-size: var(--emerald-text-b1-size, 16px) !important;
    font-weight: 700 !important;
  }

  .adm-campaign__panel-sub {
    margin: 2px 0 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-campaign__area {
    width: 100%;
    height: 140px;
  }

  .adm-campaign__area-axis {
    display: flex;
    justify-content: space-between;
    margin-top: 4px;
    font-size: var(--emerald-text-b3-size, 12px);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-campaign__report {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-m, 16px);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .adm-campaign__report li {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-campaign__report-label {
    display: flex;
    justify-content: space-between;
    flex: 1;
    font-weight: 700;
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-campaign__amount {
    font-size: var(--emerald-text-b1-size, 16px);
  }

  .adm-campaign__cta {
    width: 100%;
    margin-top: var(--emerald-spacing-m, 16px);
  }

  .adm-campaign__funnel {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-s, 12px);
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-campaign__funnel li {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .adm-campaign__funnel-label {
    flex: 1;
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-campaign__funnel-delta {
    font-size: var(--emerald-text-b3-size, 12px);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-campaign__bars {
    display: flex;
    align-items: flex-end;
    gap: 6px;
    height: 90px;
    margin: var(--emerald-spacing-m, 16px) 0;
  }

  .adm-campaign__bar {
    flex: 1;
    min-height: 6px;
    border-radius: 2px 2px 0 0;
    background: var(--emerald-secondary-500, #00b4dc);
  }

  .adm-campaign__earning-rows {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-campaign__earning-rows > div {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-xs, 8px);
    font-size: var(--emerald-text-b3-size, 12px);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-campaign__earning-rows strong {
    margin-left: auto;
    color: var(--emerald-on-surface, #2b2d2e);
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-campaign__condition {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-s, 12px);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .adm-campaign__condition li {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-campaign__ring {
    --pct: 50;
    position: relative;
    display: flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-size: 9px;
    font-weight: 700;
    background: conic-gradient(var(--emerald-primary-600, #1fae60) calc(var(--pct) * 1%), var(--emerald-neutral-200, #f6f8fa) 0);
  }

  .adm-campaign__ring::before {
    content: '';
    position: absolute;
    inset: 4px;
    z-index: -1;
    border-radius: 50%;
    background: var(--emerald-background, #fefefe);
  }

  .adm-campaign__ring[data-tone='secondary'] {
    background: conic-gradient(var(--emerald-secondary-500, #00b4dc) calc(var(--pct) * 1%), var(--emerald-neutral-200, #f6f8fa) 0);
  }

  .adm-campaign__ring[data-tone='warning'] {
    background: conic-gradient(var(--emerald-warning-500, #f5a623) calc(var(--pct) * 1%), var(--emerald-neutral-200, #f6f8fa) 0);
  }

  .adm-campaign__ring[data-tone='danger'] {
    background: conic-gradient(var(--emerald-danger-500, #c61424) calc(var(--pct) * 1%), var(--emerald-neutral-200, #f6f8fa) 0);
  }

  .adm-campaign__ring[data-tone='muted'] {
    background: conic-gradient(var(--emerald-neutral-500, #949ca3) calc(var(--pct) * 1%), var(--emerald-neutral-200, #f6f8fa) 0);
  }

  .adm-campaign__condition-text {
    display: flex;
    flex-direction: column;
    font-size: var(--emerald-text-b3-size, 12px);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-campaign__condition-text strong {
    color: var(--emerald-on-surface, #2b2d2e);
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-campaign__table-wrap {
    overflow-x: auto;
  }

  .adm-campaign__table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--emerald-text-b2-size, 14px);
    white-space: nowrap;
  }

  .adm-campaign__table th {
    padding: var(--emerald-spacing-xs, 8px) var(--emerald-spacing-s, 12px);
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 600;
    text-align: left;
    border-bottom: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
  }

  .adm-campaign__table td {
    padding: var(--emerald-spacing-s, 12px);
    border-bottom: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-200, #f6f8fa);
  }

  .adm-campaign__client {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-xs, 8px);
  }

  .adm-campaign__client strong {
    display: block;
  }

  .adm-campaign__client-email {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  @media (max-width: 1200px) {
    .adm-campaign__kpis {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .adm-campaign__row1,
    .adm-campaign__row2 {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .adm-campaign__kpis {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
</style>
