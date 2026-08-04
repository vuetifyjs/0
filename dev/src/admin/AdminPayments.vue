<!--
  Total Revenue bars and the Growth donut render as static CSS/SVG fills
  (real data, no charting library) — same GAP_CONTRACT precedent as
  AdminSales. The donut reuses the conic-gradient ring technique.
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

  const stats = [
    { label: 'Income this month', value: '$5,280', delta: '+12.2%', up: true, trend: [10, 18, 14, 22, 16, 26] },
    { label: 'Expense this month', value: '$4,120', delta: '-12.2%', up: false, trend: [8, 14, 10, 20, 12, 18] },
  ]

  const revenue = [20, 12, 15, 10, 22, 16, 20]
  const revenueMax = Math.max(...revenue)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']

  const countries = [
    { name: 'Austria', code: 'AT', value: '$867k', delta: '+20.3%', up: true },
    { name: 'China', code: 'CN', value: '$1.2M', delta: '+15.7%', up: true },
    { name: 'Switzerland', code: 'CH', value: '$750k', delta: '-18.2%', up: false },
    { name: 'India', code: 'IN', value: '$1.5M', delta: '+22.1%', up: true },
    { name: 'Brazil', code: 'BR', value: '$980k', delta: '-19.6%', up: false },
  ]

  const history = [
    { card: '*5688', kind: 'Credit Card', date: '05/Jan', spend: '-$2,820' },
    { card: '*8562', kind: 'Debit Card', date: '15/Feb', spend: '-$1,450' },
    { card: '*5238', kind: 'ATM card', date: '20/Mar', spend: '-$500' },
    { card: '*8562', kind: 'Debit card', date: '10/Mar', spend: '-$750' },
    { card: '**5688', kind: 'Credit Card', date: '25/May', spend: '-$1,200' },
  ]

  const transactions = [
    { label: 'Credit Card', sub: 'Digital Ocean', value: '-$2820', up: false },
    { label: 'Bank account', sub: 'Received money', value: '+$1,260', up: true },
    { label: 'Credit Card', sub: 'Netflix', value: '-$149', up: false },
    { label: 'Wallet', sub: 'Starbucks', value: '-$49', up: false },
    { label: 'Bank account', sub: 'Received money', value: '+$268', up: true },
  ]

  const show = shallowRef('5')
  const search = shallowRef('')
  const status = shallowRef('all')
  const page = shallowRef(1)

  type Status = 'paid' | 'pending' | 'sent'

  const invoices: Array<{ id: string, name: string, role: string, total: string, date: string, balance: string, balanceNeg: boolean, status: Status }> = [
    { id: '#5099', name: 'Jack Alfredo', role: 'UI/UX designer', total: '$3,120.00', date: '02 Apr 2025', balance: 'Paid', balanceNeg: false, status: 'sent' },
    { id: '#5008', name: 'Maria Gonzalez', role: 'Frontend developer', total: '$1,450.00', date: '11 May 2025', balance: 'Paid', balanceNeg: false, status: 'paid' },
    { id: '#5101', name: 'John Doe', role: 'Graphic designer', total: '$1,200.00', date: '25 Jun 2025', balance: 'Paid', balanceNeg: false, status: 'paid' },
    { id: '#4586', name: 'Emily Carter', role: 'UI/UX designer', total: '$2,680.00', date: '04 Jul 2025', balance: '-$78.00', balanceNeg: true, status: 'pending' },
    { id: '#4360', name: 'David Lee', role: 'Backend developer', total: '$3,120.00', date: '06 Aug 2025', balance: 'Paid', balanceNeg: false, status: 'sent' },
  ]

  function initials (name: string) {
    return name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase()
  }
</script>

<template>
  <AdminShell>
    <div class="adm-payments" data-theme="emerald">
      <header class="adm-payments__header">
        <h1 class="adm-payments__title">Payments</h1>
        <p class="adm-payments__subtitle">Revenue, transactions and invoices</p>
      </header>

      <section aria-label="Income and expense" class="adm-payments__kpis">
        <EmCard v-for="s in stats" :key="s.label" class="adm-payments__kpi" variant="simple">
          <EmCardBody class="adm-payments__kpi-body">
            <span class="adm-payments__kpi-label">{{ s.label }}</span>
            <span class="adm-payments__kpi-value">{{ s.value }}</span>

            <svg aria-hidden="true" class="adm-payments__mini-line" preserveAspectRatio="none" viewBox="0 0 100 40">
              <polyline
                fill="none"
                :points="s.trend.map((v, index) => `${index * (100 / (s.trend.length - 1))},${40 - (v / 26) * 32}`).join(' ')"
                :stroke="s.up ? 'var(--emerald-primary-600, #1fae60)' : 'var(--emerald-danger-500, #c61424)'"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
              />
            </svg>

            <EmTag :variant="s.up ? 'success' : 'danger'">{{ s.delta }} vs Last month</EmTag>
          </EmCardBody>
        </EmCard>

        <EmCard class="adm-payments__kpi" variant="simple">
          <EmCardBody class="adm-payments__kpi-body">
            <span class="adm-payments__kpi-label">Total orders</span>
            <span class="adm-payments__kpi-value">42.4k <em class="adm-payments__delta" data-up>+10.8%</em></span>
            <EmTag>Last Week</EmTag>
          </EmCardBody>
        </EmCard>
      </section>

      <section aria-label="Revenue" class="adm-payments__row1">
        <EmCard class="adm-payments__panel" variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-payments__panel-title">Total Revenue</EmCardTitle>
          </EmCardHeader>

          <EmCardBody>
            <div aria-label="Total revenue by month" class="adm-payments__chart" role="img">
              <div v-for="(v, index) in revenue" :key="index" class="adm-payments__chart-col">
                <span class="adm-payments__chart-bar" :style="{ height: (v / revenueMax) * 100 + '%' }" />
                <span class="adm-payments__chart-label">{{ months[index] }}</span>
              </div>
            </div>
          </EmCardBody>
        </EmCard>

        <EmCard class="adm-payments__panel" variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-payments__panel-title">Growth</EmCardTitle>
          </EmCardHeader>

          <EmCardBody class="adm-payments__growth">
            <span aria-hidden="true" class="adm-payments__donut" style="--pct: 78">
              <span class="adm-payments__donut-value">78%</span>
              <span class="adm-payments__donut-sub">Growth</span>
            </span>

            <p class="adm-payments__panel-sub">62% Company Growth</p>

            <div class="adm-payments__growth-stats">
              <div><strong>2024</strong><span>$32.5K</span></div>
              <div><strong>2023</strong><span>$41.2K</span></div>
            </div>
          </EmCardBody>
        </EmCard>
      </section>

      <section aria-label="Payment history and countries" class="adm-payments__row2">
        <EmCard class="adm-payments__panel" variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-payments__panel-title">Payment History</EmCardTitle>
          </EmCardHeader>

          <EmCardBody class="adm-payments__table-wrap">
            <table class="adm-payments__mini-table">
              <thead>
                <tr><th>Card</th><th>Date</th><th>Spend</th></tr>
              </thead>

              <tbody>
                <tr v-for="(h, index) in history" :key="index">
                  <td><strong>{{ h.card }}</strong><span>{{ h.kind }}</span></td>
                  <td>{{ h.date }}</td>
                  <td>{{ h.spend }}</td>
                </tr>
              </tbody>
            </table>
          </EmCardBody>
        </EmCard>

        <EmCard class="adm-payments__panel" variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-payments__panel-title">Sales by countries</EmCardTitle>
            <p class="adm-payments__panel-sub">Monthly sales overview</p>
          </EmCardHeader>

          <EmCardBody>
            <ul class="adm-payments__countries">
              <li v-for="c in countries" :key="c.name">
                <EmAvatar size="sm"><EmAvatarFallback>{{ c.code }}</EmAvatarFallback></EmAvatar>
                <span class="adm-payments__country-text"><strong>{{ c.value }}</strong><span>{{ c.name }}</span></span>
                <em class="adm-payments__delta" :data-up="c.up || undefined">{{ c.delta }}</em>
              </li>
            </ul>
          </EmCardBody>
        </EmCard>
      </section>

      <section aria-label="Transactions and earning" class="adm-payments__row2">
        <EmCard class="adm-payments__panel" variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-payments__panel-title">Transactions</EmCardTitle>
          </EmCardHeader>

          <EmCardBody>
            <ul class="adm-payments__transactions">
              <li v-for="(t, index) in transactions" :key="index">
                <span class="adm-payments__icon" :data-tone="t.up ? 'primary' : 'danger'">
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

                <span class="adm-payments__transaction-text"><strong>{{ t.label }}</strong><span>{{ t.sub }}</span></span>
                <strong class="adm-payments__delta" :data-up="t.up || undefined">{{ t.value }}</strong>
              </li>
            </ul>
          </EmCardBody>
        </EmCard>

        <EmCard class="adm-payments__panel" variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-payments__panel-title">Total Earning</EmCardTitle>
          </EmCardHeader>

          <EmCardBody>
            <span class="adm-payments__kpi-value adm-payments__kpi-value--lg">$24650 <em class="adm-payments__delta" data-up>+10%</em></span>
            <p class="adm-payments__panel-sub">Compare to last year ($84,325)</p>
          </EmCardBody>
        </EmCard>
      </section>

      <section aria-label="Invoices">
        <EmCard variant="simple">
          <EmCardHeader class="adm-payments__toolbar">
            <div class="adm-payments__toolbar-left">
              <span class="adm-payments__toolbar-label">Show</span>

              <EmSelect v-model="show" class="adm-payments__show-select">
                <EmSelectActivator><EmSelectValue /></EmSelectActivator>

                <EmSelectContent>
                  <EmSelectItem value="5">5</EmSelectItem>
                  <EmSelectItem value="10">10</EmSelectItem>
                  <EmSelectItem value="25">25</EmSelectItem>
                </EmSelectContent>
              </EmSelect>

              <EmButton size="sm" variant="primary">Create Invoice</EmButton>
            </div>

            <div class="adm-payments__toolbar-right">
              <EmTextField v-model="search" aria-label="Search client" class="adm-payments__search" placeholder="Search client" />

              <EmSelect v-model="status" class="adm-payments__status-select">
                <EmSelectActivator><EmSelectValue /></EmSelectActivator>

                <EmSelectContent>
                  <EmSelectItem value="all">All</EmSelectItem>
                  <EmSelectItem value="paid">Paid</EmSelectItem>
                  <EmSelectItem value="pending">Pending</EmSelectItem>
                </EmSelectContent>
              </EmSelect>
            </div>
          </EmCardHeader>

          <EmCardBody class="adm-payments__table-wrap">
            <table class="adm-payments__table">
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
                    <div class="adm-payments__client">
                      <EmAvatar size="sm"><EmAvatarFallback>{{ initials(row.name) }}</EmAvatarFallback></EmAvatar>
                      <span><strong>{{ row.name }}</strong><span class="adm-payments__client-role">{{ row.role }}</span></span>
                    </div>
                  </td>

                  <td>{{ row.total }}</td>
                  <td>{{ row.date }}</td>
                  <td><EmTag :variant="row.balanceNeg ? 'danger' : 'success'">{{ row.balance }}</EmTag></td>

                  <td>
                    <div class="adm-payments__actions">
                      <EmButton aria-label="Delete" size="sm" variant="tertiary">
                        <svg
                          fill="none"
                          height="15"
                          stroke="currentColor"
                          stroke-linecap="round"
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

          <EmCardFooter class="adm-payments__table-foot">
            <span class="adm-payments__table-count">Showing 1 to 5 of 25 entries</span>

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
  .adm-payments {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-l, 20px);
  }

  .adm-payments .emerald-card {
    background: var(--emerald-background, #fefefe);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    border-radius: var(--emerald-radius-xl, 12px);
    box-shadow: var(--emerald-shadow-s, 0 0 2px 0 rgba(51, 51, 51, 0.08));
  }

  .adm-payments__title {
    margin: 0;
    font-size: clamp(1.375rem, 2vw, 1.625rem);
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .adm-payments__subtitle {
    margin: 0.25rem 0 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b1-size, 16px);
  }

  .adm-payments__kpis {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--emerald-spacing-m, 16px);
  }

  .adm-payments__kpi-body {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-xs, 8px);
    min-height: 120px;
  }

  .adm-payments__kpi-label {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-payments__kpi-value {
    display: flex;
    align-items: baseline;
    gap: 8px;
    font-size: 1.5rem;
    font-weight: 700;
  }

  .adm-payments__kpi-value--lg {
    font-size: 1.75rem;
  }

  .adm-payments__delta {
    font-style: normal;
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 600;
    color: var(--emerald-danger-500, #c61424);
  }

  .adm-payments__delta[data-up] {
    color: var(--emerald-primary-700, #027d4c);
  }

  .adm-payments__mini-line {
    width: 100%;
    height: 40px;
    margin-top: auto;
  }

  .adm-payments__row1 {
    display: grid;
    grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
    gap: var(--emerald-spacing-m, 16px);
  }

  .adm-payments__row2 {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--emerald-spacing-m, 16px);
    align-items: start;
  }

  .adm-payments__panel-title {
    font-size: var(--emerald-text-b1-size, 16px) !important;
    font-weight: 700 !important;
  }

  .adm-payments__panel-sub {
    margin: 2px 0 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-payments__chart {
    display: flex;
    align-items: flex-end;
    gap: var(--emerald-spacing-s, 12px);
    height: 200px;
  }

  .adm-payments__chart-col {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    gap: 6px;
    height: 100%;
  }

  .adm-payments__chart-bar {
    width: 55%;
    min-height: 6px;
    border-radius: var(--emerald-radius-xs, 4px) var(--emerald-radius-xs, 4px) 0 0;
    background: var(--emerald-on-surface, #2b2d2e);
  }

  .adm-payments__chart-label {
    font-size: var(--emerald-text-b3-size, 12px);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-payments__growth {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
    text-align: center;
  }

  .adm-payments__donut {
    --pct: 78;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 140px;
    height: 140px;
    border-radius: 50%;
    background: conic-gradient(var(--emerald-on-surface, #2b2d2e) calc(var(--pct) * 1%), var(--emerald-neutral-200, #f6f8fa) 0);
  }

  .adm-payments__donut::before {
    content: '';
    position: absolute;
    inset: 14px;
    border-radius: 50%;
    background: var(--emerald-background, #fefefe);
  }

  .adm-payments__donut-value,
  .adm-payments__donut-sub {
    position: relative;
    z-index: 1;
  }

  .adm-payments__donut-value {
    font-size: 1.5rem;
    font-weight: 700;
  }

  .adm-payments__donut-sub {
    font-size: var(--emerald-text-b3-size, 12px);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-payments__growth-stats {
    display: flex;
    gap: var(--emerald-spacing-l, 20px);
    margin-top: var(--emerald-spacing-s, 12px);
  }

  .adm-payments__growth-stats > div {
    display: flex;
    flex-direction: column;
    font-size: var(--emerald-text-b3-size, 12px);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-payments__growth-stats strong {
    color: var(--emerald-on-surface, #2b2d2e);
  }

  .adm-payments__mini-table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-payments__mini-table th {
    padding: var(--emerald-spacing-xs, 8px) 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
    text-align: left;
    border-bottom: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
  }

  .adm-payments__mini-table td {
    padding: var(--emerald-spacing-s, 12px) 0;
    border-bottom: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-200, #f6f8fa);
  }

  .adm-payments__mini-table td strong {
    display: block;
  }

  .adm-payments__mini-table td span {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-payments__countries {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-s, 12px);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .adm-payments__countries li {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-payments__country-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    font-size: var(--emerald-text-b3-size, 12px);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-payments__country-text strong {
    color: var(--emerald-on-surface, #2b2d2e);
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-payments__transactions {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-s, 12px);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .adm-payments__transactions li {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-payments__icon {
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: var(--emerald-radius-m, 8px);
    background: var(--emerald-primary-100, #e7fff2);
    color: var(--emerald-primary-700, #027d4c);
  }

  .adm-payments__icon[data-tone='danger'] {
    background: var(--emerald-danger-100, #ffebee);
    color: var(--emerald-danger-500, #c61424);
  }

  .adm-payments__transaction-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    font-size: var(--emerald-text-b3-size, 12px);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-payments__transaction-text strong {
    color: var(--emerald-on-surface, #2b2d2e);
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-payments__toolbar {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-payments__toolbar-left,
  .adm-payments__toolbar-right {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-payments__toolbar-label {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-payments__show-select {
    width: 76px;
  }

  .adm-payments__search {
    width: 220px;
  }

  .adm-payments__status-select {
    width: 120px;
  }

  .adm-payments__table-wrap {
    overflow-x: auto;
  }

  .adm-payments__table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--emerald-text-b2-size, 14px);
    white-space: nowrap;
  }

  .adm-payments__table th {
    padding: var(--emerald-spacing-xs, 8px) var(--emerald-spacing-s, 12px);
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 600;
    text-align: left;
    border-bottom: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
  }

  .adm-payments__table td {
    padding: var(--emerald-spacing-s, 12px);
    border-bottom: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-200, #f6f8fa);
  }

  .adm-payments__client {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-xs, 8px);
  }

  .adm-payments__client strong {
    display: block;
  }

  .adm-payments__client-role {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-payments__actions {
    display: flex;
    gap: 2px;
  }

  .adm-payments__actions .emerald-button {
    width: 30px;
    height: 30px;
    padding: 0;
  }

  .adm-payments__table-foot {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-payments__table-count {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  @media (max-width: 1200px) {
    .adm-payments__kpis {
      grid-template-columns: 1fr;
    }

    .adm-payments__row1,
    .adm-payments__row2 {
      grid-template-columns: 1fr;
    }
  }
</style>
