<!--
  Total Transaction / Total sales / Earning Report charts below are rendered
  as static CSS-only bar/line fills (real data labels, no charting library) —
  the GAP_CONTRACT calls this an acceptable "likeness" render since v0 ships
  no charting primitive yet (see GAPS.md). The mini KPI sparkline/ring visuals
  use the same technique (flex bars, clip-path polygon, conic-gradient).
-->
<script setup lang="ts">
  import {
    EmAvatar,
    EmAvatarFallback,
    EmButton,
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
    EmSelect,
    EmSelectActivator,
    EmSelectContent,
    EmSelectItem,
    EmSelectValue,
    EmTag,
    EmTextField,
  } from '@paper/emerald'

  // Context
  import AdminShell from './AdminShell.vue'

  // Utilities
  import { shallowRef } from 'vue'

  const kpis = [
    { label: 'Total Profit', sub: '', value: '$88.5k', delta: '-18%', up: false, kind: 'bars' as const, bars: [45, 65, 100, 55, 80, 60] },
    { label: 'Order', sub: 'Last week', value: '124K', delta: '+12.6%', up: true, kind: 'bars' as const, bars: [30, 55, 90, 70, 100, 60, 80, 40] },
    { label: 'Profit', sub: 'Last Month', value: '624K', delta: '+12.6%', up: true, kind: 'line' as const },
    { label: 'User reach', sub: 'Last week', value: '32K', delta: '+12%', up: true, kind: 'ring' as const, ring: 72, ringLabel: '500', ringSub: 'Visitors' },
  ] as const

  const money = [
    { label: 'Total Income', sub: 'Last week', value: '$4,673', delta: '+25.2%', up: true, icon: 'coin' as const },
    { label: 'Total Expense', sub: 'Last month', value: '$1.28K', delta: '-12.2%', up: false, icon: 'card' as const },
  ]

  const transactions = [
    { label: 'Jan', value: 38 },
    { label: 'Feb', value: 52, peak: true },
    { label: 'Mar', value: 32 },
    { label: 'Apr', value: 12 },
    { label: 'May', value: 35 },
    { label: 'Jun', value: 28 },
    { label: 'Jul', value: 33 },
    { label: 'Aug', value: 25 },
  ]
  const transactionMax = Math.max(...transactions.map(t => t.value))

  const salesTrend = [30, 45, 40, 60, 55, 75, 65, 90, 80, 95]

  const earning = [
    { label: 'Net profit', sub: 'Sales', value: '$1,623', delta: '+20.3%', icon: 'pie' as const },
    { label: 'Total income', sub: 'Sales, Affiliation', value: '$5,600', delta: '+16.2%', icon: 'coin' as const },
    { label: 'Total expense', sub: 'ADVT, Marketing', value: '$3,200', delta: '+10.5%', icon: 'card' as const },
  ]
  const weekly = [
    { label: 'MO', value: 40 },
    { label: 'TU', value: 55 },
    { label: 'WE', value: 60 },
    { label: 'TH', value: 100, peak: true },
    { label: 'FR', value: 45 },
    { label: 'SA', value: 65 },
    { label: 'SU', value: 35 },
  ]

  const cardNumber = shallowRef('')
  const search = shallowRef('')
  const show = shallowRef('5')
  const statusFilter = shallowRef('all')
  const page = shallowRef(1)

  type Status = 'paid' | 'pending' | 'sent'

  const invoices: Array<{
    id: string
    name: string
    role: string
    initials: string
    total: string
    date: string
    balance: string
    balanceNeg: boolean
    status: Status
  }> = [
    { id: '#5099', name: 'Jack Alfredo', role: 'UI/UX designer', initials: 'JA', total: '$3,120.00', date: '02 Apr 2025', balance: 'Paid', balanceNeg: false, status: 'sent' },
    { id: '#5008', name: 'Maria Gonzalez', role: 'Frontend developer', initials: 'MG', total: '$1,450.00', date: '11 May 2025', balance: 'Paid', balanceNeg: false, status: 'paid' },
    { id: '#5101', name: 'John Doe', role: 'Graphic designer', initials: 'JD', total: '$1,200.00', date: '25 Jun 2025', balance: 'Paid', balanceNeg: false, status: 'paid' },
    { id: '#4586', name: 'Emily Carter', role: 'UI/UX designer', initials: 'EC', total: '$2,680.00', date: '04 Jul 2025', balance: '-$78.00', balanceNeg: true, status: 'pending' },
    { id: '#4360', name: 'David Lee', role: 'Backend developer', initials: 'DL', total: '$3,120.00', date: '06 Aug 2025', balance: 'Paid', balanceNeg: false, status: 'sent' },
  ]
</script>

<template>
  <AdminShell>
    <div class="adm-sales" data-theme="emerald">
      <section aria-label="Key metrics" class="adm-sales__kpis">
        <EmCard v-for="kpi in kpis" :key="kpi.label" class="adm-sales__kpi" variant="simple">
          <EmCardBody class="adm-sales__kpi-body">
            <div class="adm-sales__kpi-text">
              <span class="adm-sales__kpi-label">{{ kpi.label }}</span>
              <span v-if="kpi.sub" class="adm-sales__kpi-sub">{{ kpi.sub }}</span>

              <span class="adm-sales__kpi-value">
                {{ kpi.value }}
                <em class="adm-sales__delta" :data-up="kpi.up || undefined">{{ kpi.delta }}</em>
              </span>
            </div>

            <div v-if="kpi.kind === 'bars'" aria-hidden="true" class="adm-sales__mini-bars">
              <span
                v-for="(h, index) in kpi.bars"
                :key="index"
                class="adm-sales__mini-bar"
                :data-tone="index % 3 === 0 ? 'primary' : index % 3 === 1 ? 'secondary' : 'info'"
                :style="{ height: h + '%' }"
              />
            </div>

            <svg
              v-else-if="kpi.kind === 'line'"
              aria-hidden="true"
              class="adm-sales__mini-line"
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

            <div v-else-if="kpi.kind === 'ring'" aria-hidden="true" class="adm-sales__ring" :style="{ '--pct': kpi.ring }">
              <span class="adm-sales__ring-value">{{ kpi.ringLabel }}</span>
              <span class="adm-sales__ring-sub">{{ kpi.ringSub }}</span>
            </div>
          </EmCardBody>
        </EmCard>

        <EmCard v-for="m in money" :key="m.label" class="adm-sales__kpi adm-sales__kpi--money" variant="simple">
          <EmCardBody class="adm-sales__money-body">
            <span aria-hidden="true" class="adm-sales__money-icon" :data-tone="m.icon === 'coin' ? 'primary' : 'danger'">
              <svg
                v-if="m.icon === 'coin'"
                fill="none"
                height="18"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-width="1.75"
                viewBox="0 0 24 24"
                width="18"
              >
                <path d="M12 3v18M17 8c0-2-2-3.5-5-3.5S7 6 7 8s2 3 5 3.5 5 1.5 5 3.5-2 3.5-5 3.5S7 16 7 14" />
              </svg>

              <svg
                v-else
                fill="none"
                height="18"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-width="1.75"
                viewBox="0 0 24 24"
                width="18"
              >
                <path d="M3 7h18v10H3V7Z" /><path d="M3 10h18" />
              </svg>
            </span>

            <span class="adm-sales__money-label">{{ m.label }}</span>
            <span class="adm-sales__money-sub">{{ m.sub }}</span>
            <span class="adm-sales__money-value">{{ m.value }}</span>
            <EmTag class="adm-sales__money-tag" :variant="m.up ? 'success' : 'danger'">{{ m.delta }}</EmTag>
          </EmCardBody>
        </EmCard>
      </section>

      <section aria-label="Transactions and sales" class="adm-sales__row1">
        <EmCard class="adm-sales__panel adm-sales__panel--wide" variant="simple">
          <EmCardHeader class="adm-sales__panel-head">
            <div>
              <EmCardTitle class="adm-sales__panel-title">Total Transaction</EmCardTitle>
              <p class="adm-sales__panel-sub">Weekly overview</p>
            </div>
          </EmCardHeader>

          <EmCardBody>
            <div aria-label="Total transaction by month" class="adm-sales__chart" role="img">
              <div v-for="t in transactions" :key="t.label" class="adm-sales__chart-col">
                <span class="adm-sales__chart-value">{{ t.value }}K</span>
                <span class="adm-sales__chart-bar" :data-peak="t.peak || undefined" :style="{ height: (t.value / transactionMax) * 100 + '%' }" />
                <span class="adm-sales__chart-label">{{ t.label }}</span>
              </div>
            </div>
          </EmCardBody>
        </EmCard>

        <EmCard class="adm-sales__panel" variant="simple">
          <EmCardHeader class="adm-sales__panel-head">
            <EmCardTitle class="adm-sales__panel-title">Report</EmCardTitle>
          </EmCardHeader>

          <EmCardBody class="adm-sales__report">
            <p class="adm-sales__report-lead">Last month transactions <strong>$23.4K</strong></p>

            <div class="adm-sales__report-stats">
              <div class="adm-sales__report-stat">
                <span aria-hidden="true" class="adm-sales__money-icon" data-tone="primary">
                  <svg
                    fill="none"
                    height="16"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-width="1.75"
                    viewBox="0 0 24 24"
                    width="16"
                  ><path d="M12 3v18M17 8c0-2-2-3.5-5-3.5S7 6 7 8s2 3 5 3.5 5 1.5 5 3.5-2 3.5-5 3.5S7 16 7 14" /></svg>
                </span>

                <span class="adm-sales__report-stat-label">This week</span>
                <span class="adm-sales__delta" data-up>+82.46%</span>
              </div>

              <div class="adm-sales__report-stat">
                <span aria-hidden="true" class="adm-sales__money-icon" data-tone="danger">
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

                <span class="adm-sales__report-stat-label">This week</span>
                <span class="adm-sales__delta">-24.8%</span>
              </div>
            </div>

            <div class="adm-sales__report-perf">
              <div>
                <span class="adm-sales__report-stat-label">Performance</span>
                <span class="adm-sales__delta" data-up>+94.13%</span>
              </div>

              <EmButton size="sm" variant="primary">View Report</EmButton>
            </div>
          </EmCardBody>
        </EmCard>

        <EmCard class="adm-sales__panel" variant="simple">
          <EmCardHeader class="adm-sales__panel-head">
            <EmCardTitle class="adm-sales__panel-title">Total sales</EmCardTitle>
            <EmButton size="sm" variant="tertiary">Details</EmButton>
          </EmCardHeader>

          <EmCardBody>
            <span class="adm-sales__kpi-value adm-sales__kpi-value--lg">
              $2,150.00
              <em class="adm-sales__delta" data-up>+5%</em>
            </span>

            <ul class="adm-sales__channels">
              <li><span>Online Store</span> <strong>$20k</strong> <em class="adm-sales__delta" data-up>+12.6%</em></li>
              <li><span>Offline Store</span> <strong>$20k</strong> <em class="adm-sales__delta">-4.2%</em></li>
            </ul>

            <div class="adm-sales__trend" role="presentation">
              <span v-for="(v, index) in salesTrend" :key="index" class="adm-sales__trend-bar" :style="{ height: v + '%' }" />
            </div>
          </EmCardBody>
        </EmCard>
      </section>

      <section aria-label="Plan, earnings and promo" class="adm-sales__row2">
        <EmCard class="adm-sales__panel" variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-sales__panel-title">Upgrade your plan</EmCardTitle>
            <p class="adm-sales__panel-sub">To fully enjoy all the amazing features and benefits of our premium plan.</p>
          </EmCardHeader>

          <EmCardBody class="adm-sales__plan">
            <div class="adm-sales__plan-price">
              <span class="adm-sales__plan-tier">Platinum</span>
              <span class="adm-sales__plan-period">Last 6 months</span>
              <strong class="adm-sales__plan-amount">$5,550<span>/Year</span></strong>
            </div>

            <p class="adm-sales__plan-heading">Payment details</p>

            <ul class="adm-sales__plan-cards">
              <li>
                <span class="adm-sales__plan-card-label">Credit card</span>
                <span class="adm-sales__plan-card-num">5688 xxxx xxxx 2356</span>
                <EmTag>CVC</EmTag>
              </li>

              <li>
                <span class="adm-sales__plan-card-label">Credit card</span>
                <span class="adm-sales__plan-card-num">8562 xxxx xxxx 4563</span>
                <EmTag>CVC</EmTag>
              </li>
            </ul>

            <p class="adm-sales__plan-heading">Add payment method</p>
            <EmTextField v-model="cardNumber" aria-label="Card number" placeholder="Card Number" />
          </EmCardBody>

          <EmCardFooter>
            <EmButton class="adm-sales__plan-pay" variant="primary">Pay now</EmButton>
          </EmCardFooter>
        </EmCard>

        <EmCard class="adm-sales__panel" variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-sales__panel-title">Earning Report</EmCardTitle>
            <p class="adm-sales__panel-sub">Weekly Earning overview</p>
          </EmCardHeader>

          <EmCardBody>
            <ul class="adm-sales__earning">
              <li v-for="row in earning" :key="row.label">
                <span aria-hidden="true" class="adm-sales__money-icon" :data-tone="row.icon === 'pie' ? 'info' : row.icon === 'coin' ? 'primary' : 'danger'">
                  <svg
                    v-if="row.icon === 'pie'"
                    fill="none"
                    height="16"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-width="1.75"
                    viewBox="0 0 24 24"
                    width="16"
                  ><path d="M12 3a9 9 0 1 0 9 9h-9V3Z" /><path d="M15 3.5A9 9 0 0 1 20.5 9H15V3.5Z" /></svg>

                  <svg
                    v-else-if="row.icon === 'coin'"
                    fill="none"
                    height="16"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-width="1.75"
                    viewBox="0 0 24 24"
                    width="16"
                  ><path d="M12 3v18M17 8c0-2-2-3.5-5-3.5S7 6 7 8s2 3 5 3.5 5 1.5 5 3.5-2 3.5-5 3.5S7 16 7 14" /></svg>

                  <svg
                    v-else
                    fill="none"
                    height="16"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-width="1.75"
                    viewBox="0 0 24 24"
                    width="16"
                  ><path d="M3 7h18v10H3V7Z" /><path d="M3 10h18" /></svg>
                </span>

                <span class="adm-sales__earning-text">
                  <strong>{{ row.label }}</strong>
                  <span>{{ row.sub }}</span>
                </span>

                <span class="adm-sales__earning-value">
                  {{ row.value }}
                  <em class="adm-sales__delta" data-up>{{ row.delta }}</em>
                </span>
              </li>
            </ul>

            <div aria-label="Weekly earning overview" class="adm-sales__week-chart" role="img">
              <div v-for="w in weekly" :key="w.label" class="adm-sales__chart-col">
                <span class="adm-sales__chart-bar adm-sales__chart-bar--sm" :data-peak="w.peak || undefined" :style="{ height: w.value + '%' }" />
                <span class="adm-sales__chart-label">{{ w.label }}</span>
              </div>
            </div>
          </EmCardBody>
        </EmCard>

        <EmCard class="adm-sales__panel adm-sales__promo" variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-sales__panel-title">Design strategy master class</EmCardTitle>
            <p class="adm-sales__panel-sub">12 Dec at 10:00 PM</p>
          </EmCardHeader>

          <div class="adm-sales__promo-media" role="img" :style="{ backgroundImage: 'url(/emerald/contact-hero.jpg)' }" />

          <EmCardBody>
            <p class="adm-sales__promo-copy">How to improve your next design's strategy that works for user and business.</p>

            <div class="adm-sales__promo-tags">
              <EmTag>Technical</EmTag>
              <EmTag>User research</EmTag>
              <EmTag>Analytics</EmTag>
            </div>
          </EmCardBody>

          <EmCardFooter class="adm-sales__promo-foot">
            <div class="adm-sales__promo-avatars">
              <EmAvatar v-for="index in 3" :key="index" size="sm"><EmAvatarFallback>{{ ['SC', 'JH', 'NP'][index - 1] }}</EmAvatarFallback></EmAvatar>
            </div>

            <EmButton size="sm" variant="primary">Join now</EmButton>
          </EmCardFooter>
        </EmCard>
      </section>

      <section aria-label="Invoices">
        <EmCard variant="simple">
          <EmCardHeader class="adm-sales__toolbar">
            <div class="adm-sales__toolbar-left">
              <span class="adm-sales__toolbar-label">Show</span>

              <EmSelect v-model="show" class="adm-sales__show-select">
                <EmSelectActivator>
                  <EmSelectValue />

                  <svg
                    aria-hidden="true"
                    class="emerald-select__icon"
                    fill="none"
                    height="16"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    viewBox="0 0 16 16"
                    width="16"
                  ><path d="M4 6l4 4 4-4" /></svg>
                </EmSelectActivator>

                <EmSelectContent>
                  <EmSelectItem value="5">5</EmSelectItem>
                  <EmSelectItem value="10">10</EmSelectItem>
                  <EmSelectItem value="25">25</EmSelectItem>
                </EmSelectContent>
              </EmSelect>

              <EmButton size="sm" variant="primary">Create Invoice</EmButton>
            </div>

            <div class="adm-sales__toolbar-right">
              <EmTextField v-model="search" aria-label="Search client" class="adm-sales__search" placeholder="Search client" />

              <EmSelect v-model="statusFilter" class="adm-sales__status-select">
                <EmSelectActivator>
                  <EmSelectValue />

                  <svg
                    aria-hidden="true"
                    class="emerald-select__icon"
                    fill="none"
                    height="16"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    viewBox="0 0 16 16"
                    width="16"
                  ><path d="M4 6l4 4 4-4" /></svg>
                </EmSelectActivator>

                <EmSelectContent>
                  <EmSelectItem value="all">All</EmSelectItem>
                  <EmSelectItem value="paid">Paid</EmSelectItem>
                  <EmSelectItem value="pending">Pending</EmSelectItem>
                  <EmSelectItem value="sent">Sent</EmSelectItem>
                </EmSelectContent>
              </EmSelect>
            </div>
          </EmCardHeader>

          <EmCardBody class="adm-sales__table-wrap">
            <table class="adm-sales__table">
              <thead>
                <tr>
                  <th><EmCheckbox aria-label="Select all" /></th>
                  <th>ID</th>
                  <th>Status</th>
                  <th>Client</th>
                  <th>Total</th>
                  <th>Issued Date</th>
                  <th>Balance</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="row in invoices" :key="row.id">
                  <td><EmCheckbox :aria-label="`Select ${row.id}`" /></td>
                  <td>{{ row.id }}</td>

                  <td>
                    <EmTag :variant="row.status === 'paid' ? 'success' : row.status === 'pending' ? 'info' : 'neutral'">
                      {{ row.status === 'paid' ? 'Paid' : row.status === 'pending' ? 'Pending' : 'Sent' }}
                    </EmTag>
                  </td>

                  <td>
                    <div class="adm-sales__client">
                      <EmAvatar size="sm"><EmAvatarFallback>{{ row.initials }}</EmAvatarFallback></EmAvatar>

                      <span>
                        <strong>{{ row.name }}</strong>
                        <span class="adm-sales__client-role">{{ row.role }}</span>
                      </span>
                    </div>
                  </td>

                  <td>{{ row.total }}</td>
                  <td>{{ row.date }}</td>

                  <td>
                    <EmTag :variant="row.balanceNeg ? 'danger' : 'success'">{{ row.balance }}</EmTag>
                  </td>

                  <td>
                    <div class="adm-sales__actions">
                      <EmButton aria-label="Delete" size="sm" variant="tertiary">
                        <svg
                          fill="none"
                          height="15"
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="1.75"
                          viewBox="0 0 24 24"
                          width="15"
                        ><path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" /></svg>
                      </EmButton>

                      <EmButton aria-label="View" size="sm" variant="tertiary">
                        <svg
                          fill="none"
                          height="15"
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="1.75"
                          viewBox="0 0 24 24"
                          width="15"
                        ><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                      </EmButton>

                      <EmButton aria-label="More actions" size="sm" variant="tertiary">
                        <svg fill="currentColor" height="15" viewBox="0 0 24 24" width="15"><circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" /></svg>
                      </EmButton>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </EmCardBody>

          <EmCardFooter class="adm-sales__table-foot">
            <span class="adm-sales__table-count">Showing 1 to 5 of 25 entries</span>

            <EmPagination v-model="page" :size="5">
              <EmPaginationPrev>‹ Previous</EmPaginationPrev>
              <EmPaginationItem v-for="n in 5" :key="n" :value="n" />
              <EmPaginationNext>Next ›</EmPaginationNext>
            </EmPagination>
          </EmCardFooter>
        </EmCard>
      </section>
    </div>
  </AdminShell>
</template>

<style>
  .adm-sales {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-l, 20px);
  }

  .adm-sales .emerald-card {
    background: var(--emerald-background, #fefefe);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    border-radius: var(--emerald-radius-xl, 12px);
    box-shadow: var(--emerald-shadow-s, 0 0 2px 0 rgba(51, 51, 51, 0.08));
  }

  .adm-sales__kpis {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: var(--emerald-spacing-m, 16px);
  }

  .adm-sales__kpi-body {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-s, 12px);
    min-height: 128px;
  }

  .adm-sales__kpi-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .adm-sales__kpi-label {
    font-weight: 700;
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-sales__kpi-sub {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-sales__kpi-value {
    display: flex;
    align-items: baseline;
    gap: 6px;
    margin-top: 4px;
    font-size: 1.375rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .adm-sales__kpi-value--lg {
    font-size: 1.75rem;
  }

  .adm-sales__delta {
    font-style: normal;
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 600;
    color: var(--emerald-danger-500, #c61424);
  }

  .adm-sales__delta[data-up] {
    color: var(--emerald-primary-700, #027d4c);
  }

  .adm-sales__mini-bars {
    display: flex;
    align-items: flex-end;
    gap: 4px;
    height: 48px;
    margin-top: auto;
  }

  .adm-sales__mini-bar {
    flex: 1;
    min-width: 4px;
    border-radius: 2px 2px 0 0;
    background: var(--emerald-primary-500, #26c26d);
  }

  .adm-sales__mini-bar[data-tone='secondary'] {
    background: var(--emerald-secondary-600, #00b4dc);
  }

  .adm-sales__mini-bar[data-tone='info'] {
    background: var(--emerald-neutral-400, #aeb6be);
  }

  .adm-sales__mini-line {
    width: 100%;
    height: 48px;
    margin-top: auto;
  }

  .adm-sales__ring {
    --pct: 72;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 68px;
    height: 68px;
    margin: auto auto 0;
    border-radius: 50%;
    background: conic-gradient(var(--emerald-primary-600, #1fae60) calc(var(--pct) * 1%), var(--emerald-neutral-200, #f6f8fa) 0);
  }

  .adm-sales__ring::before {
    content: '';
    position: absolute;
    inset: 6px;
    border-radius: 50%;
    background: var(--emerald-background, #fefefe);
  }

  .adm-sales__ring-value,
  .adm-sales__ring-sub {
    position: relative;
    z-index: 1;
    line-height: 1.1;
  }

  .adm-sales__ring-value {
    font-weight: 700;
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-sales__ring-sub {
    font-size: 9px;
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-sales__kpi--money .adm-sales__money-body {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-height: 128px;
  }

  .adm-sales__money-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: var(--emerald-radius-m, 8px);
    background: var(--emerald-primary-100, #e7fff2);
    color: var(--emerald-primary-700, #027d4c);
  }

  .adm-sales__money-icon[data-tone='danger'] {
    background: var(--emerald-danger-100, #ffebee);
    color: var(--emerald-danger-500, #c61424);
  }

  .adm-sales__money-icon[data-tone='info'] {
    background: var(--emerald-info-100, #e4f2ff);
    color: var(--emerald-neutral-800, #636a70);
  }

  .adm-sales__money-label {
    margin-top: 4px;
    font-weight: 700;
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-sales__money-sub {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-sales__money-value {
    margin-top: 2px;
    font-size: 1.25rem;
    font-weight: 700;
  }

  .adm-sales__money-tag {
    width: fit-content;
    margin-top: 2px;
  }

  .adm-sales__row1 {
    display: grid;
    grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr) minmax(0, 1fr);
    gap: var(--emerald-spacing-m, 16px);
  }

  .adm-sales__row2 {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--emerald-spacing-m, 16px);
    align-items: start;
  }

  .adm-sales__panel-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-sales__panel-title {
    font-size: var(--emerald-text-b1-size, 16px) !important;
    font-weight: 700 !important;
  }

  .adm-sales__panel-sub {
    margin: 2px 0 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-sales__chart {
    display: flex;
    align-items: flex-end;
    gap: var(--emerald-spacing-s, 12px);
    height: 220px;
    padding-top: 24px;
  }

  .adm-sales__chart-col {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    gap: 6px;
    height: 100%;
  }

  .adm-sales__chart-value {
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 600;
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-sales__chart-bar {
    width: 60%;
    min-height: 6px;
    border-radius: var(--emerald-radius-xs, 4px) var(--emerald-radius-xs, 4px) 0 0;
    background: var(--emerald-primary-100, #e7fff2);
  }

  .adm-sales__chart-bar[data-peak] {
    background: var(--emerald-primary-600, #1fae60);
  }

  .adm-sales__chart-bar--sm {
    width: 55%;
  }

  .adm-sales__chart-label {
    font-size: var(--emerald-text-b3-size, 12px);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-sales__report {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-m, 16px);
  }

  .adm-sales__report-lead {
    margin: 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-sales__report-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-sales__report-stat {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .adm-sales__report-stat-label {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-sales__report-perf {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--emerald-spacing-s, 12px);
    padding-top: var(--emerald-spacing-s, 12px);
    border-top: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
  }

  .adm-sales__report-perf > div {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .adm-sales__channels {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin: var(--emerald-spacing-s, 12px) 0;
    padding: 0;
    list-style: none;
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-sales__channels li {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .adm-sales__channels span {
    flex: 1;
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-sales__trend {
    display: flex;
    align-items: flex-end;
    gap: 3px;
    height: 70px;
    margin-top: var(--emerald-spacing-s, 12px);
  }

  .adm-sales__trend-bar {
    flex: 1;
    min-height: 4px;
    border-radius: 2px 2px 0 0;
    background: var(--emerald-primary-300, #baedd0);
  }

  .adm-sales__plan {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-m, 16px);
  }

  .adm-sales__plan-price {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 4px 8px;
    padding: var(--emerald-spacing-s, 12px);
    border-radius: var(--emerald-radius-m, 8px);
    background: var(--emerald-neutral-200, #f6f8fa);
  }

  .adm-sales__plan-tier {
    font-weight: 700;
  }

  .adm-sales__plan-period {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-sales__plan-amount {
    margin-left: auto;
    font-size: 1.25rem;
  }

  .adm-sales__plan-amount span {
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 400;
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-sales__plan-heading {
    margin: 0;
    font-weight: 700;
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-sales__plan-cards {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-xs, 8px);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .adm-sales__plan-cards li {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-xs, 8px);
    padding: var(--emerald-spacing-xs, 8px);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    border-radius: var(--emerald-radius-m, 8px);
  }

  .adm-sales__plan-card-label {
    font-size: var(--emerald-text-b3-size, 12px);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-sales__plan-card-num {
    flex: 1;
    font-size: var(--emerald-text-b2-size, 14px);
    font-weight: 600;
  }

  .adm-sales__plan-pay {
    width: 100%;
  }

  .adm-sales__earning {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-s, 12px);
    margin: 0 0 var(--emerald-spacing-m, 16px);
    padding: 0;
    list-style: none;
  }

  .adm-sales__earning li {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-sales__earning-text {
    display: flex;
    flex-direction: column;
    font-size: var(--emerald-text-b3-size, 12px);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-sales__earning-text strong {
    color: var(--emerald-on-surface, #2b2d2e);
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-sales__earning-value {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    font-weight: 700;
  }

  .adm-sales__week-chart {
    display: flex;
    align-items: flex-end;
    gap: 8px;
    height: 120px;
  }

  .adm-sales__promo {
    overflow: hidden;
  }

  .adm-sales__promo-media {
    height: 140px;
    margin: 0 var(--emerald-spacing-m, 16px);
    border-radius: var(--emerald-radius-m, 8px);
    background-position: center;
    background-size: cover;
  }

  .adm-sales__promo-copy {
    margin: 0 0 var(--emerald-spacing-s, 12px);
    font-size: var(--emerald-text-b2-size, 14px);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-sales__promo-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .adm-sales__promo-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .adm-sales__promo-avatars {
    display: flex;
  }

  .adm-sales__promo-avatars .emerald-avatar {
    margin-left: -8px;
    border: 2px solid var(--emerald-background, #fefefe);
  }

  .adm-sales__promo-avatars .emerald-avatar:first-child {
    margin-left: 0;
  }

  .adm-sales__toolbar {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-sales__toolbar-left,
  .adm-sales__toolbar-right {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-sales__toolbar-label {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-sales__show-select {
    width: 76px;
  }

  .adm-sales__search {
    width: 220px;
  }

  .adm-sales__status-select {
    width: 120px;
  }

  .adm-sales__table-wrap {
    overflow-x: auto;
  }

  .adm-sales__table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--emerald-text-b2-size, 14px);
    white-space: nowrap;
  }

  .adm-sales__table th {
    padding: var(--emerald-spacing-xs, 8px) var(--emerald-spacing-s, 12px);
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 600;
    text-align: left;
    border-bottom: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
  }

  .adm-sales__table td {
    padding: var(--emerald-spacing-s, 12px);
    border-bottom: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-200, #f6f8fa);
  }

  .adm-sales__client {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-xs, 8px);
  }

  .adm-sales__client strong {
    display: block;
  }

  .adm-sales__client-role {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-sales__actions {
    display: flex;
    gap: 2px;
  }

  .adm-sales__actions .emerald-button {
    width: 30px;
    height: 30px;
    padding: 0;
  }

  .adm-sales__table-foot {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-sales__table-count {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  @media (max-width: 1200px) {
    .adm-sales__kpis {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .adm-sales__row1,
    .adm-sales__row2 {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .adm-sales__kpis {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
</style>
