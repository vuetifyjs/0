<!--
  Revenue columns, funnel bars and sparklines render as static CSS/SVG fills
  (real data, no charting library) — the GAP_CONTRACT calls this an acceptable
  "likeness" render since v0 ships no charting primitive yet (see GAPS.md).
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

  // Framework
  import { createFilter, createPagination } from '@vuetify/v0'

  // Context
  import EmeraldShell from './EmeraldShell.vue'

  // Utilities
  import { shallowRef, toRef } from 'vue'

  // Storefront revenue in thousands; the eight months total the $664K headline.
  const months = [
    { label: 'Jan', value: 62 },
    { label: 'Feb', value: 71 },
    { label: 'Mar', value: 68 },
    { label: 'Apr', value: 84 },
    { label: 'May', value: 91 },
    { label: 'Jun', value: 88 },
    { label: 'Jul', value: 103 },
    { label: 'Aug', value: 97 },
  ]

  const peak = Math.max(...months.map(month => month.value))

  const lines = [
    { label: 'Admin templates', amount: '$286K', pct: 100 },
    { label: 'Component kits', amount: '$198K', pct: 69 },
    { label: 'Docs themes', amount: '$112K', pct: 39 },
    { label: 'Icon sets', amount: '$68K', pct: 24 },
  ]

  const funnel = [
    { label: 'Viewed pricing', count: '84,200', pct: 100 },
    { label: 'Started checkout', count: '12,640', pct: 15 },
    { label: 'Entered payment', count: '9,180', pct: 11 },
    { label: 'Completed purchase', count: '7,940', pct: 9 },
  ]

  const refunds = [3.4, 3.1, 2.8, 2.6, 2.2, 2, 1.9, 1.8]
  const order = [71, 74, 73, 78, 80, 79, 84, 84]

  function spark (series: readonly number[]) {
    const high = Math.max(...series)
    const low = Math.min(...series)
    const range = high - low || 1

    return series.map((v, index) => `${index * (100 / (series.length - 1))},${34 - ((v - low) / range) * 28}`).join(' ')
  }

  const promo = shallowRef('')

  const codes = [
    { code: 'LAUNCH25', cut: '25% off', uses: '1,284', state: 'Active' as const },
    { code: 'EARLYBIRD', cut: '15% off', uses: '2,106', state: 'Active' as const },
    { code: 'STUDENT50', cut: '50% off', uses: '738', state: 'Active' as const },
    { code: 'VUEFES30', cut: '30% off', uses: '412', state: 'Scheduled' as const },
    { code: 'TEAMPACK', cut: '20% off', uses: '196', state: 'Expired' as const },
  ]

  const codeFilter = createFilter({ keys: ['code', 'cut'] })
  const codeMatches = codeFilter.apply(promo, codes)
  const visibleCodes = toRef(() => codeMatches.items.value)

  const referrers = [
    { source: 'vuetifyjs.com', pct: 38 },
    { source: 'GitHub', pct: 24 },
    { source: 'Search engines', pct: 16 },
    { source: 'Discord', pct: 14 },
    { source: 'Newsletter', pct: 8 },
  ]

  const search = shallowRef('')
  const show = shallowRef('5')
  const status = shallowRef('all')
  const page = shallowRef(1)

  type Status = 'settled' | 'refunded' | 'disputed'
  type Sale = { id: string, buyer: string, org: string, product: string, amount: string, method: string, status: Status }

  const seed: Sale[] = [
    { id: 'TXN-9042', buyer: 'Priya Raghunathan', org: 'Northwind Labs', product: 'Emerald Pro Admin', amount: '$149.00', method: 'Visa · 4417', status: 'settled' },
    { id: 'TXN-9038', buyer: 'Tomas Lindqvist', org: 'Kestrel Analytics', product: 'Onyx Studio Kit', amount: '$189.00', method: 'Mastercard · 9032', status: 'settled' },
    { id: 'TXN-9031', buyer: 'Adaeze Okonkwo', org: 'Foundry Nine', product: 'Component kit bundle', amount: '$318.00', method: 'SEPA · 2185', status: 'refunded' },
    { id: 'TXN-9027', buyer: 'Ravi Menon', org: 'Vellum Press', product: 'Helix Docs Theme', amount: '$79.00', method: 'Visa · 6620', status: 'settled' },
    { id: 'TXN-9019', buyer: 'Ingrid Solberg', org: 'Palisade Bank', product: 'Emerald Pro Admin', amount: '$149.00', method: 'Invoice', status: 'disputed' },
    { id: 'TXN-9014', buyer: 'Hugo Bellamy', org: 'Copperline Studio', product: 'Prism Icon Set', amount: '$49.00', method: 'Visa · 1188', status: 'settled' },
    { id: 'TXN-9008', buyer: 'Mira Kovac', org: 'Ardent Robotics', product: 'Onyx Studio Kit', amount: '$189.00', method: 'Mastercard · 4471', status: 'settled' },
    { id: 'TXN-9002', buyer: 'Kenji Morrow', org: 'Saltmarsh Digital', product: 'Docs theme bundle', amount: '$138.00', method: 'SEPA · 7730', status: 'refunded' },
  ]

  const sales: Sale[] = Array.from({ length: 25 }, (_, index) => {
    const base = seed[index % seed.length]!

    return index < seed.length ? base : { ...base, id: `TXN-${9042 - index * 7}` }
  })

  const options = [
    { value: 'all', label: 'All' },
    { value: 'settled', label: 'Settled' },
    { value: 'refunded', label: 'Refunded' },
    { value: 'disputed', label: 'Disputed' },
  ]

  function label (value: string) {
    return options.find(option => option.value === value)?.label ?? value
  }

  const filter = createFilter({ keys: ['id', 'buyer', 'org', 'product'] })
  const found = filter.apply(search, sales)

  const filtered = toRef(() => status.value === 'all'
    ? found.items.value
    : found.items.value.filter(row => row.status === status.value),
  )

  const pagination = createPagination({
    page,
    size: () => filtered.value.length,
    itemsPerPage: () => Number(show.value),
  })

  const rows = toRef(() => filtered.value.slice(pagination.pageStart.value, pagination.pageStop.value))

  function initials (name: string) {
    return name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase()
  }
</script>

<template>
  <EmeraldShell>
    <div class="adm-sales" data-theme="emerald">
      <header class="adm-sales__header">
        <h1 class="adm-sales__title">Theme storefront</h1>
        <p class="adm-sales__subtitle">First-party template sales, checkout health and discounting</p>
      </header>

      <section aria-label="Revenue and checkout" class="adm-sales__grid">
        <EmCard class="adm-sales__card adm-sales__card--revenue" variant="simple">
          <EmCardHeader class="adm-sales__revenue-head">
            <div>
              <EmCardTitle class="adm-sales__panel-title">Storefront revenue</EmCardTitle>
              <p class="adm-sales__panel-sub">Eight months of first-party template sales</p>
            </div>

            <span class="adm-sales__headline">$664K <em class="adm-sales__delta" data-up>+31.4% YoY</em></span>
          </EmCardHeader>

          <EmCardBody>
            <div aria-label="Storefront revenue by month" class="adm-sales__chart" role="img">
              <div v-for="month in months" :key="month.label" class="adm-sales__column">
                <span class="adm-sales__bar" :data-peak="month.value === peak || undefined" :style="{ height: (month.value / peak) * 100 + '%' }" />
                <span class="adm-sales__column-total">${{ month.value }}K</span>
                <span class="adm-sales__column-label">{{ month.label }}</span>
              </div>
            </div>

            <ul class="adm-sales__lines">
              <li v-for="line in lines" :key="line.label">
                <span class="adm-sales__line-label">{{ line.label }}</span>

                <span class="adm-sales__line-track">
                  <span class="adm-sales__line-fill" :style="{ width: line.pct + '%' }" />
                </span>

                <strong>{{ line.amount }}</strong>
              </li>
            </ul>
          </EmCardBody>
        </EmCard>

        <EmCard class="adm-sales__card adm-sales__card--funnel" variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-sales__panel-title">Checkout funnel</EmCardTitle>
            <p class="adm-sales__panel-sub">Pricing page through to a paid licence</p>
          </EmCardHeader>

          <EmCardBody>
            <ol aria-label="Checkout funnel stages" class="adm-sales__funnel" role="img">
              <li v-for="stage in funnel" :key="stage.label">
                <span class="adm-sales__funnel-label">{{ stage.label }}</span>

                <span class="adm-sales__funnel-track">
                  <span class="adm-sales__funnel-fill" :style="{ width: stage.pct + '%' }" />
                </span>

                <span class="adm-sales__funnel-meta">
                  <strong>{{ stage.count }}</strong>
                  <span>{{ stage.pct }}%</span>
                </span>
              </li>
            </ol>
          </EmCardBody>
        </EmCard>

        <EmCard class="adm-sales__card" variant="simple">
          <EmCardBody class="adm-sales__stat-body">
            <span class="adm-sales__stat-label">Refund rate</span>
            <span class="adm-sales__stat-value">1.8% <em class="adm-sales__delta" data-up>-1.6pt</em></span>

            <svg aria-hidden="true" class="adm-sales__spark" preserveAspectRatio="none" viewBox="0 0 100 34">
              <polyline
                fill="none"
                :points="spark(refunds)"
                stroke="var(--emerald-primary-600, #1fae60)"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
              />
            </svg>
          </EmCardBody>
        </EmCard>

        <EmCard class="adm-sales__card" variant="simple">
          <EmCardBody class="adm-sales__stat-body">
            <span class="adm-sales__stat-label">Average order value</span>
            <span class="adm-sales__stat-value">$83.62 <em class="adm-sales__delta" data-up>+$12.40</em></span>

            <svg aria-hidden="true" class="adm-sales__spark" preserveAspectRatio="none" viewBox="0 0 100 34">
              <polyline
                fill="none"
                :points="spark(order)"
                stroke="var(--emerald-primary-600, #1fae60)"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
              />
            </svg>
          </EmCardBody>
        </EmCard>
      </section>

      <section aria-label="Transactions">
        <EmCard variant="simple">
          <EmCardHeader class="adm-sales__toolbar">
            <div class="adm-sales__toolbar-left">
              <EmCardTitle class="adm-sales__panel-title">Transactions</EmCardTitle>

              <EmSelect v-model="show" class="adm-sales__show-select">
                <EmSelectActivator><EmSelectValue /></EmSelectActivator>

                <EmSelectContent>
                  <EmSelectItem value="5">5</EmSelectItem>
                  <EmSelectItem value="10">10</EmSelectItem>
                  <EmSelectItem value="25">25</EmSelectItem>
                </EmSelectContent>
              </EmSelect>
            </div>

            <div class="adm-sales__toolbar-right">
              <EmTextField v-model="search" aria-label="Search transactions" class="adm-sales__search" placeholder="Search buyer or product" />

              <EmSelect v-model="status" class="adm-sales__status-select">
                <EmSelectActivator>
                  <EmSelectValue v-slot="{ selectedValue }">{{ label(String(selectedValue)) }}</EmSelectValue>
                </EmSelectActivator>

                <EmSelectContent>
                  <EmSelectItem v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</EmSelectItem>
                </EmSelectContent>
              </EmSelect>

              <EmButton size="sm" variant="primary">Export</EmButton>
            </div>
          </EmCardHeader>

          <EmCardBody class="adm-sales__table-wrap">
            <table class="adm-sales__table">
              <thead>
                <tr>
                  <th><EmCheckbox aria-label="Select all" /></th>
                  <th>Transaction</th>
                  <th>Buyer</th>
                  <th>Product</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>State</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="sale in rows" :key="sale.id">
                  <td><EmCheckbox :aria-label="`Select ${sale.id}`" /></td>
                  <td class="adm-sales__id">{{ sale.id }}</td>

                  <td>
                    <div class="adm-sales__client">
                      <EmAvatar size="sm"><EmAvatarFallback>{{ initials(sale.buyer) }}</EmAvatarFallback></EmAvatar>
                      <span><strong>{{ sale.buyer }}</strong><span class="adm-sales__client-sub">{{ sale.org }}</span></span>
                    </div>
                  </td>

                  <td>{{ sale.product }}</td>
                  <td>{{ sale.amount }}</td>
                  <td>{{ sale.method }}</td>

                  <td>
                    <EmTag :variant="sale.status === 'settled' ? 'success' : sale.status === 'refunded' ? 'neutral' : 'danger'">
                      {{ sale.status === 'settled' ? 'Settled' : sale.status === 'refunded' ? 'Refunded' : 'Disputed' }}
                    </EmTag>
                  </td>
                </tr>
              </tbody>
            </table>
          </EmCardBody>

          <EmCardFooter class="adm-sales__table-foot">
            <span class="adm-sales__table-count">
              Showing {{ filtered.length > 0 ? pagination.pageStart.value + 1 : 0 }} to {{ pagination.pageStop.value }} of {{ filtered.length }} transactions
            </span>

            <EmPagination v-model="page" :items-per-page="Number(show)" :size="filtered.length">
              <template #default="{ items }">
                <EmPaginationPrev>‹ Previous</EmPaginationPrev>

                <template v-for="(item, index) in items" :key="index">
                  <EmPaginationItem v-if="item.type === 'page'" :value="item.value" />
                  <span v-else class="adm-sales__page-gap">{{ item.value }}</span>
                </template>

                <EmPaginationNext>Next ›</EmPaginationNext>
              </template>
            </EmPagination>
          </EmCardFooter>
        </EmCard>
      </section>

      <section aria-label="Discounts and referrers" class="adm-sales__pair">
        <EmCard class="adm-sales__panel" variant="simple">
          <EmCardHeader class="adm-sales__codes-head">
            <EmCardTitle class="adm-sales__panel-title">Discount codes</EmCardTitle>
            <EmTextField v-model="promo" aria-label="Filter discount codes" class="adm-sales__code-search" placeholder="Filter codes" />
          </EmCardHeader>

          <EmCardBody>
            <ul class="adm-sales__codes">
              <li v-for="entry in visibleCodes" :key="entry.code">
                <code>{{ entry.code }}</code>

                <span class="adm-sales__code-text">
                  <strong>{{ entry.cut }}</strong>
                  <span>{{ entry.uses }} redemptions</span>
                </span>

                <EmTag :variant="entry.state === 'Active' ? 'success' : entry.state === 'Scheduled' ? 'info' : 'neutral'">
                  {{ entry.state }}
                </EmTag>
              </li>
            </ul>

            <p v-if="visibleCodes.length === 0" class="adm-sales__empty">No code matches that filter.</p>
          </EmCardBody>
        </EmCard>

        <EmCard class="adm-sales__panel" variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-sales__panel-title">Where buyers come from</EmCardTitle>
            <p class="adm-sales__panel-sub">Attributed on the last touch before checkout</p>
          </EmCardHeader>

          <EmCardBody>
            <ul aria-label="Referrer share" class="adm-sales__referrers" role="img">
              <li v-for="row in referrers" :key="row.source">
                <span class="adm-sales__referrer-label">{{ row.source }}</span>

                <span class="adm-sales__line-track">
                  <span class="adm-sales__line-fill" :style="{ width: row.pct + '%' }" />
                </span>

                <strong>{{ row.pct }}%</strong>
              </li>
            </ul>
          </EmCardBody>
        </EmCard>
      </section>
    </div>
  </EmeraldShell>
</template>

<style>
  .adm-sales {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-l, 20px);
  }

  /* EmCard variant="simple" ships 2px padding and its slots add none, so every
     card needs its own inset — see the EmCard padding gap row. */
  .adm-sales .emerald-card {
    padding: var(--emerald-spacing-l, 20px);
    background: var(--emerald-background, #fefefe);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    border-radius: var(--emerald-radius-xl, 12px);
    box-shadow: var(--emerald-shadow-s, 0 0 2px 0 rgba(51, 51, 51, 0.08));
  }

  .adm-sales__title {
    margin: 0;
    font-size: clamp(1.375rem, 2vw, 1.625rem);
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .adm-sales__subtitle {
    margin: 0.25rem 0 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b1-size, 16px);
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

  .adm-sales__delta {
    font-style: normal;
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 600;
    color: var(--emerald-danger-500, #c61424);
  }

  .adm-sales__delta[data-up] {
    color: var(--emerald-primary-700, #027d4c);
  }

  /* The revenue and funnel cards each claim both rows; the two stat cards fill
     the remaining single cells in column four. */
  .adm-sales__grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: var(--emerald-spacing-m, 16px);
  }

  .adm-sales__card--revenue {
    grid-column: span 2;
    grid-row: span 2;
  }

  .adm-sales__card--funnel {
    grid-row: span 2;
  }

  .adm-sales__card .emerald-card__body {
    display: flex;
    flex: 1;
    flex-direction: column;
  }

  /* .emerald-card__header is flex-direction: column — a title/action row has to
     opt back into row explicitly. */
  .adm-sales__revenue-head,
  .adm-sales__toolbar,
  .adm-sales__codes-head {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-sales__headline {
    display: flex;
    align-items: baseline;
    gap: 8px;
    font-size: 1.75rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .adm-sales__chart {
    display: flex;
    align-items: flex-end;
    gap: var(--emerald-spacing-s, 12px);
    height: 190px;
    margin-top: var(--emerald-spacing-xs, 8px);
  }

  .adm-sales__column {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    gap: 4px;
    height: 100%;
  }

  .adm-sales__bar {
    width: 58%;
    min-width: 16px;
    min-height: 6px;
    border-radius: var(--emerald-radius-xs, 4px) var(--emerald-radius-xs, 4px) 0 0;
    background: var(--emerald-primary-300, #baedd0);
  }

  .adm-sales__bar[data-peak] {
    background: var(--emerald-primary-600, #1fae60);
  }

  .adm-sales__column-total {
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 600;
  }

  .adm-sales__column-label {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-sales__lines {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-s, 12px);
    margin: auto 0 0;
    padding-top: var(--emerald-spacing-l, 20px);
    list-style: none;
  }

  .adm-sales__lines li,
  .adm-sales__referrers li {
    display: grid;
    grid-template-columns: 138px minmax(0, 1fr) 58px;
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-sales__line-label,
  .adm-sales__referrer-label {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-sales__lines strong,
  .adm-sales__referrers strong {
    font-size: var(--emerald-text-b2-size, 14px);
    text-align: right;
  }

  .adm-sales__line-track {
    height: 10px;
    border-radius: 5px;
    background: var(--emerald-neutral-200, #f6f8fa);
    overflow: hidden;
  }

  .adm-sales__line-fill {
    display: block;
    height: 100%;
    border-radius: 5px;
    background: var(--emerald-primary-600, #1fae60);
  }

  .adm-sales__funnel {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
    gap: var(--emerald-spacing-m, 16px);
    margin: var(--emerald-spacing-xs, 8px) 0 0;
    padding: 0;
    list-style: none;
  }

  .adm-sales__funnel li {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .adm-sales__funnel-label {
    font-size: var(--emerald-text-b2-size, 14px);
    font-weight: 600;
  }

  .adm-sales__funnel-track {
    height: 12px;
    border-radius: 6px;
    background: var(--emerald-neutral-200, #f6f8fa);
    overflow: hidden;
  }

  .adm-sales__funnel-fill {
    display: block;
    height: 100%;
    border-radius: 6px;
    background: var(--emerald-primary-600, #1fae60);
  }

  .adm-sales__funnel-meta {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-sales__funnel-meta strong {
    color: var(--emerald-on-surface, #2b2d2e);
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-sales__stat-body {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-2xs, 4px);
    min-height: 116px;
  }

  .adm-sales__stat-label {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-sales__stat-value {
    display: flex;
    align-items: baseline;
    gap: 8px;
    font-size: 1.75rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .adm-sales__spark {
    width: 100%;
    height: 34px;
    margin-top: auto;
  }

  .adm-sales__toolbar-left,
  .adm-sales__toolbar-right {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-sales__show-select {
    width: 76px;
  }

  .adm-sales__status-select {
    width: 130px;
  }

  .adm-sales__search {
    width: 230px;
  }

  .adm-sales__table-wrap {
    overflow-x: auto;
    margin-inline: calc(-1 * var(--emerald-spacing-l, 20px));
  }

  .adm-sales__table th:first-child,
  .adm-sales__table td:first-child {
    padding-left: var(--emerald-spacing-l, 20px);
  }

  .adm-sales__table th:last-child,
  .adm-sales__table td:last-child {
    padding-right: var(--emerald-spacing-l, 20px);
  }

  .adm-sales__table tbody tr {
    transition: background-color 120ms ease;
  }

  .adm-sales__table tbody tr:hover {
    background: var(--emerald-neutral-200, #f6f8fa);
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

  .adm-sales__id {
    font-variant-numeric: tabular-nums;
    font-weight: 600;
  }

  .adm-sales__client {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-xs, 8px);
  }

  .adm-sales__client strong {
    display: block;
  }

  .adm-sales__client-sub {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-sales__table-foot {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-sales__table-count {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-sales__page-gap {
    padding: 0 var(--emerald-spacing-2xs, 4px);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-sales__pair {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--emerald-spacing-m, 16px);
  }

  .adm-sales__pair .emerald-card__body {
    display: flex;
    flex: 1;
    flex-direction: column;
  }

  .adm-sales__code-search {
    width: 160px;
  }

  .adm-sales__codes,
  .adm-sales__referrers {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
    gap: var(--emerald-spacing-s, 12px);
    margin: var(--emerald-spacing-xs, 8px) 0 0;
    padding: 0;
    list-style: none;
  }

  .adm-sales__codes li {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-sales__codes code {
    min-width: 96px;
    padding: 4px var(--emerald-spacing-xs, 8px);
    border-radius: var(--emerald-radius-xs, 4px);
    background: var(--emerald-neutral-200, #f6f8fa);
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 600;
  }

  .adm-sales__code-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-sales__code-text strong {
    color: var(--emerald-on-surface, #2b2d2e);
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-sales__empty {
    margin: var(--emerald-spacing-m, 16px) 0 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b2-size, 14px);
  }

  @media (max-width: 1200px) {
    .adm-sales__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .adm-sales__card--revenue {
      grid-column: span 2;
      grid-row: auto;
    }

    .adm-sales__card--funnel {
      grid-column: span 2;
      grid-row: auto;
    }

    .adm-sales__pair {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .adm-sales__grid {
      grid-template-columns: 1fr;
    }

    .adm-sales__card--revenue,
    .adm-sales__card--funnel {
      grid-column: auto;
    }

    .adm-sales__search,
    .adm-sales__code-search {
      width: 100%;
    }

    .adm-sales__chart {
      gap: 6px;
      height: 160px;
    }

    .adm-sales__column-total {
      font-size: 10px;
    }

    .adm-sales__lines li,
    .adm-sales__referrers li {
      grid-template-columns: 110px minmax(0, 1fr) 52px;
    }
  }
</style>
