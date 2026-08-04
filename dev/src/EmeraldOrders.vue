<!--
  Total Earning bars, Revenue goal ring, and Cohort strip render as static
  CSS fills (real data, no charting library) — same GAP_CONTRACT precedent as
  EmeraldSales. The ring reuses the conic-gradient technique.
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
    EmPagination,
    EmPaginationItem,
    EmPaginationNext,
    EmPaginationPrev,
    EmTag,
    EmTextField,
  } from '@paper/emerald'

  // Framework
  import { createFilter, createPagination } from '@vuetify/v0'

  // Context
  import EmeraldShell from './EmeraldShell.vue'

  // Utilities
  import { shallowRef, toRef } from 'vue'

  const stats = [
    { label: 'Shipped Orders', value: '42', delta: '+18.2%', up: true, icon: 'truck' as const },
    { label: 'Damaged Returns', value: '8', delta: '-8.7%', up: false, icon: 'warn' as const },
    { label: 'Missed Delivery Slots', value: '27', delta: '+4.3%', up: true, icon: 'calendar' as const },
  ]

  const earning = [
    { label: 'Zipcar', sub: 'Vuejs & HTML', value: '-$23,569.26', pct: 82 },
    { label: 'Bitbank', sub: 'Figma & React', value: '-$12,650.31', pct: 44 },
  ]

  const metrics = [
    { label: 'Sales trend', value: '$11,548' },
    { label: 'Discount offers', value: '$1,326' },
    { label: 'Net profit', value: '$17,356' },
    { label: 'Total orders', value: '248' },
  ]

  const cohort = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

  type Customer = { name: string, email: string, amount: string, status: 'Paid' | 'Pending' }

  const seed: Customer[] = [
    { name: 'Jack Alfredo', email: 'jack@shadcnstudio.com', amount: '$316.00', status: 'Paid' },
    { name: 'Maria Gonzalez', email: 'maria.g@shadcnstudio.com', amount: '$253.40', status: 'Pending' },
    { name: 'John Doe', email: 'john.doe@shadcnstudio.com', amount: '$852.00', status: 'Paid' },
    { name: 'Emily Carter', email: 'emily.carter@shadcnstudio.com', amount: '$889.00', status: 'Pending' },
    { name: 'David Lee', email: 'david.lee@shadcnstudio.com', amount: '$723.16', status: 'Paid' },
    { name: 'Sara Chen', email: 'sara.chen@shadcnstudio.com', amount: '$412.90', status: 'Paid' },
    { name: 'Noah Patel', email: 'noah.p@shadcnstudio.com', amount: '$1,204.00', status: 'Pending' },
    { name: 'Julia Hart', email: 'julia.h@shadcnstudio.com', amount: '$188.25', status: 'Paid' },
  ]

  const customers: Customer[] = Array.from({ length: 25 }, (_, index) => {
    const base = seed[index % seed.length]!
    const suffix = Math.floor(index / seed.length)

    return suffix === 0 ? base : { ...base, email: base.email.replace('@', `${suffix + 1}@`) }
  })

  const search = shallowRef('')
  const page = shallowRef(1)

  const filter = createFilter({ keys: ['name', 'email'] })
  const found = filter.apply(search, customers)
  const filtered = toRef(() => found.items.value)

  const pagination = createPagination({ page, size: () => filtered.value.length, itemsPerPage: 5 })
  const rows = toRef(() => filtered.value.slice(pagination.pageStart.value, pagination.pageStop.value))

  function initials (name: string) {
    return name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase()
  }
</script>

<template>
  <EmeraldShell>
    <div class="adm-orders" data-theme="emerald">
      <header class="adm-orders__header">
        <h1 class="adm-orders__title">Orders</h1>
        <p class="adm-orders__subtitle">Fulfilment health and revenue goals</p>
      </header>

      <section aria-label="Fulfilment stats" class="adm-orders__kpis">
        <EmCard v-for="s in stats" :key="s.label" class="adm-orders__kpi" variant="simple">
          <EmCardBody class="adm-orders__kpi-body">
            <span aria-hidden="true" class="adm-orders__icon">
              <svg
                v-if="s.icon === 'truck'"
                fill="none"
                height="18"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.75"
                viewBox="0 0 24 24"
                width="18"
              ><path d="M3 7h11v9H3V7Z" /><path d="M14 10h4l3 3v3h-7v-6Z" /></svg>

              <svg
                v-else-if="s.icon === 'warn'"
                fill="none"
                height="18"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.75"
                viewBox="0 0 24 24"
                width="18"
              ><path d="M12 9v4M12 17h.01" /><path d="M10.3 3.9 2.6 17a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /></svg>

              <svg
                v-else
                fill="none"
                height="18"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.75"
                viewBox="0 0 24 24"
                width="18"
              ><path d="M4 5h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" /><path d="M3 10h18" /></svg>
            </span>

            <span class="adm-orders__kpi-value">{{ s.value }}</span>
            <span class="adm-orders__kpi-label">{{ s.label }}</span>
            <span class="adm-orders__delta" :data-up="s.up || undefined">{{ s.delta }} than last week</span>
          </EmCardBody>
        </EmCard>
      </section>

      <section aria-label="Total earning and sales metrics" class="adm-orders__row1">
        <EmCard class="adm-orders__panel" variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-orders__panel-title">Total Earning</EmCardTitle>
          </EmCardHeader>

          <EmCardBody>
            <span class="adm-orders__kpi-value adm-orders__kpi-value--lg">$24650 <em class="adm-orders__delta" data-up>10%</em></span>
            <p class="adm-orders__panel-sub">Compare to last year ($84,325)</p>

            <ul class="adm-orders__earning">
              <li v-for="e in earning" :key="e.label">
                <EmAvatar size="sm"><EmAvatarFallback>{{ initials(e.label) }}</EmAvatarFallback></EmAvatar>
                <span class="adm-orders__earning-text"><strong>{{ e.label }}</strong><span>{{ e.sub }}</span></span>

                <span class="adm-orders__earning-value">
                  {{ e.value }}
                  <span class="adm-orders__earning-bar"><span :style="{ width: e.pct + '%' }" /></span>
                </span>
              </li>
            </ul>
          </EmCardBody>
        </EmCard>

        <EmCard class="adm-orders__panel" variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-orders__panel-title">Sales metrics</EmCardTitle>
          </EmCardHeader>

          <EmCardBody>
            <div class="adm-orders__company">
              <EmAvatar size="md"><EmAvatarFallback>SC</EmAvatarFallback></EmAvatar>
              <div><strong>Sandy' Company</strong><span>sandy@company.com</span></div>
            </div>

            <div class="adm-orders__metrics">
              <div v-for="m in metrics" :key="m.label">
                <span>{{ m.label }}</span>
                <strong>{{ m.value }}</strong>
              </div>
            </div>
          </EmCardBody>
        </EmCard>

        <EmCard class="adm-orders__panel" variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-orders__panel-title">Revenue goal</EmCardTitle>
          </EmCardHeader>

          <EmCardBody class="adm-orders__goal">
            <span aria-hidden="true" class="adm-orders__ring" style="--pct: 62">
              <span class="adm-orders__ring-value">256.24</span>
              <span class="adm-orders__ring-sub">Total Profit</span>
            </span>

            <p class="adm-orders__panel-sub">Plan completed <strong>56%</strong></p>
          </EmCardBody>
        </EmCard>
      </section>

      <section aria-label="Cohort analysis">
        <EmCard variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-orders__panel-title">Cohort analysis indicators</EmCardTitle>
          </EmCardHeader>

          <EmCardBody class="adm-orders__cohort">
            <div class="adm-orders__cohort-stat">
              <span class="adm-orders__cohort-value">54%</span>
              <p class="adm-orders__panel-sub">Analyzes the behaviour of a group of users who joined a product/service at the same time, over a certain period.</p>
            </div>

            <div class="adm-orders__cohort-links">
              <EmButton size="sm" variant="tertiary">Open Statistics</EmButton>
              <EmButton size="sm" variant="tertiary">Percentage Change</EmButton>
            </div>

            <div aria-label="Percentage profit from total sales" class="adm-orders__cohort-strip" role="img">
              <span v-for="(v, index) in cohort" :key="index" class="adm-orders__cohort-cell" :data-on="v ? '' : undefined" />
            </div>
          </EmCardBody>
        </EmCard>
      </section>

      <section aria-label="Customers">
        <EmCard variant="simple">
          <EmCardHeader class="adm-orders__table-head">
            <EmCardTitle class="adm-orders__panel-title">Customers</EmCardTitle>

            <EmTextField v-model="search" aria-label="Search customer" class="adm-orders__search" placeholder="Search customer" />
          </EmCardHeader>

          <EmCardBody class="adm-orders__table-wrap">
            <table class="adm-orders__table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Paid by</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="c in rows" :key="c.email">
                  <td>
                    <div class="adm-orders__client">
                      <EmAvatar size="sm"><EmAvatarFallback>{{ initials(c.name) }}</EmAvatarFallback></EmAvatar>
                      <span><strong>{{ c.name }}</strong><span class="adm-orders__client-email">{{ c.email }}</span></span>
                    </div>
                  </td>

                  <td>{{ c.amount }}</td>
                  <td><EmTag :variant="c.status === 'Paid' ? 'success' : 'info'">{{ c.status }}</EmTag></td>

                  <td>
                    <span aria-hidden="true" class="adm-orders__card-icon">
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

          <EmCardFooter class="adm-orders__table-foot">
            <span class="adm-orders__table-count">
              Showing {{ filtered.length > 0 ? pagination.pageStart.value + 1 : 0 }} to {{ pagination.pageStop.value }} of {{ filtered.length }} entries
            </span>

            <EmPagination v-model="page" :items-per-page="5" :size="filtered.length">
              <template #default="{ items }">
                <EmPaginationPrev>‹ Previous</EmPaginationPrev>

                <template v-for="(item, index) in items" :key="index">
                  <EmPaginationItem v-if="item.type === 'page'" :value="item.value" />
                  <span v-else class="adm-orders__page-gap">{{ item.value }}</span>
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
  .adm-orders {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-l, 20px);
  }

  /* EmCard variant="simple" ships 2px padding and its slots add none, so every
     card needs its own inset — see the EmCard padding gap row. */
  .adm-orders .emerald-card {
    padding: var(--emerald-spacing-l, 20px);
    background: var(--emerald-background, #fefefe);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    border-radius: var(--emerald-radius-xl, 12px);
    box-shadow: var(--emerald-shadow-s, 0 0 2px 0 rgba(51, 51, 51, 0.08));
  }

  .adm-orders__title {
    margin: 0;
    font-size: clamp(1.375rem, 2vw, 1.625rem);
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .adm-orders__subtitle {
    margin: 0.25rem 0 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b1-size, 16px);
  }

  .adm-orders__kpis {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--emerald-spacing-m, 16px);
  }

  .adm-orders__kpi-body {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .adm-orders__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    margin-bottom: 4px;
    border-radius: var(--emerald-radius-m, 8px);
    background: var(--emerald-neutral-200, #f6f8fa);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-orders__kpi-value {
    font-size: 1.75rem;
    font-weight: 700;
  }

  .adm-orders__kpi-value--lg {
    display: flex;
    align-items: baseline;
    gap: 8px;
  }

  .adm-orders__kpi-label {
    font-weight: 600;
    font-size: var(--emerald-text-b2-size, 14px);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-orders__delta {
    font-style: normal;
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 600;
    color: var(--emerald-danger-500, #c61424);
  }

  .adm-orders__delta[data-up] {
    color: var(--emerald-primary-700, #027d4c);
  }

  .adm-orders__row1 {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--emerald-spacing-m, 16px);
  }

  .adm-orders__panel-title {
    font-size: var(--emerald-text-b1-size, 16px) !important;
    font-weight: 700 !important;
  }

  .adm-orders__panel-sub {
    margin: 2px 0 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-orders__earning {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-m, 16px);
    margin: var(--emerald-spacing-m, 16px) 0 0;
    padding: 0;
    list-style: none;
  }

  .adm-orders__earning li {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-orders__earning-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    font-size: var(--emerald-text-b3-size, 12px);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-orders__earning-text strong {
    color: var(--emerald-on-surface, #2b2d2e);
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-orders__earning-value {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-orders__earning-bar {
    display: block;
    width: 80px;
    height: 5px;
    border-radius: 3px;
    background: var(--emerald-neutral-200, #f6f8fa);
    overflow: hidden;
  }

  .adm-orders__earning-bar span {
    display: block;
    height: 100%;
    background: var(--emerald-primary-600, #1fae60);
  }

  .adm-orders__company {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
    margin-bottom: var(--emerald-spacing-m, 16px);
  }

  .adm-orders__company div {
    display: flex;
    flex-direction: column;
    font-size: var(--emerald-text-b3-size, 12px);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-orders__metrics {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-orders__metrics > div {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: var(--emerald-spacing-s, 12px);
    border-radius: var(--emerald-radius-m, 8px);
    background: var(--emerald-neutral-200, #f6f8fa);
    font-size: var(--emerald-text-b3-size, 12px);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-orders__metrics strong {
    color: var(--emerald-on-surface, #2b2d2e);
    font-size: var(--emerald-text-b1-size, 16px);
  }

  .adm-orders__goal {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
    text-align: center;
  }

  .adm-orders__ring {
    --pct: 62;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 140px;
    height: 140px;
    border-radius: 50%;
    background: conic-gradient(var(--emerald-primary-600, #1fae60) calc(var(--pct) * 1%), var(--emerald-neutral-200, #f6f8fa) 0);
  }

  .adm-orders__ring::before {
    content: '';
    position: absolute;
    inset: 14px;
    border-radius: 50%;
    background: var(--emerald-background, #fefefe);
  }

  .adm-orders__ring-value,
  .adm-orders__ring-sub {
    position: relative;
    z-index: 1;
  }

  .adm-orders__ring-value {
    font-size: 1.375rem;
    font-weight: 700;
  }

  .adm-orders__ring-sub {
    font-size: var(--emerald-text-b3-size, 12px);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-orders__cohort {
    display: grid;
    grid-template-columns: auto auto 1fr;
    align-items: center;
    gap: var(--emerald-spacing-l, 20px);
  }

  .adm-orders__cohort-value {
    font-size: 2.5rem;
    font-weight: 700;
  }

  .adm-orders__cohort-links {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-orders__cohort-strip {
    display: flex;
    gap: 3px;
    grid-column: 1 / -1;
  }

  .adm-orders__cohort-cell {
    flex: 1;
    height: 24px;
    border-radius: 2px;
    background: var(--emerald-neutral-200, #f6f8fa);
  }

  .adm-orders__cohort-cell[data-on] {
    background: var(--emerald-primary-600, #1fae60);
  }

  /* .emerald-card__header is flex-direction: column — a title/action row has to
     opt back into row explicitly. */
  .adm-orders__table-head {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-orders__search {
    width: 240px;
  }

  .adm-orders__table-foot {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-orders__table-count {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-orders__page-gap {
    padding: 0 var(--emerald-spacing-2xs, 4px);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-orders__table tbody tr {
    transition: background-color 120ms ease;
  }

  .adm-orders__table tbody tr:hover {
    background: var(--emerald-neutral-200, #f6f8fa);
  }

  .adm-orders__table-wrap {
    overflow-x: auto;
  }

  .adm-orders__table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--emerald-text-b2-size, 14px);
    white-space: nowrap;
  }

  .adm-orders__table th {
    padding: var(--emerald-spacing-xs, 8px) var(--emerald-spacing-s, 12px);
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 600;
    text-align: left;
    border-bottom: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
  }

  .adm-orders__table td {
    padding: var(--emerald-spacing-s, 12px);
    border-bottom: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-200, #f6f8fa);
  }

  .adm-orders__client {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-xs, 8px);
  }

  .adm-orders__client strong {
    display: block;
  }

  .adm-orders__client-email {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-orders__card-icon {
    display: inline-flex;
    color: var(--emerald-on-surface-variant, #757e85);
  }

  @media (max-width: 1200px) {
    .adm-orders__kpis,
    .adm-orders__row1 {
      grid-template-columns: 1fr;
    }

    .adm-orders__cohort {
      grid-template-columns: 1fr;
      text-align: center;
    }
  }
</style>
