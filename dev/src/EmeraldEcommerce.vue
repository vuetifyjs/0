<!--
  Earning insights bars and packing progress render as static CSS fills /
  EmProgress (real data, no charting library) — same GAP_CONTRACT precedent
  as EmeraldSales. Stock toggles use EmSwitch (real interactive state, no gap).
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
    EmProgress,
    EmSelect,
    EmSelectActivator,
    EmSelectContent,
    EmSelectItem,
    EmSelectValue,
    EmSwitch,
    EmTabs,
    EmTabsItem,
    EmTabsList,
    EmTag,
    EmTextField,
  } from '@paper/emerald'

  // Context
  import EmeraldShell from './EmeraldShell.vue'

  // Utilities
  import { shallowRef } from 'vue'

  const stats = [
    { label: 'Total Sales', sub: 'Last 6 months', value: '$13.4k', delta: '+38%', up: true },
    { label: 'Total Orders', sub: 'Last 4 months', value: '155K', delta: '+22%', up: true },
    { label: 'Total Profit', sub: 'Last One year', value: '$89.34k', delta: '-16%', up: false },
    { label: 'Bookmarks', sub: 'Last 6 months', value: '$1,200', delta: '+38%', up: true },
  ]

  const earning = [40, 55, 45, 60, 100, 70, 65, 75]
  const earningMax = Math.max(...earning)
  const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

  const insights = [
    { label: 'Earning', value: '$1,236', pct: 55 },
    { label: 'Profit', value: '$2,300', pct: 78 },
    { label: 'Expense', value: '$1,500', pct: 45 },
  ]

  const packing = [
    { label: 'Packing Pending', value: 4250, max: 5000 },
    { label: 'Packing in Progress', value: 2150, max: 5000 },
    { label: 'Packing Complete', value: 1750, max: 5000 },
  ]

  const ordersTab = shallowRef('new')
  const orders = [
    { role: 'Sender', name: 'Mytrle Ullrich', address: '101 Boulder, California(CA), 959595' },
    { role: 'Receiver', name: 'Barry Schowalter', address: '939 orange, California(CA), 92118' },
  ]

  const popular = [
    { name: 'Nike Vision Low Shoes', price: '$5,600', visits: '10.6K' },
    { name: 'Adidas Ultraboost 21', price: '$4,500', visits: '4.5K' },
    { name: 'Puma RS-X Toys', price: '$3,200', visits: '2K' },
    { name: 'New Balance 550', price: '$2,800', visits: '1.8K' },
    { name: 'Reebok Classic Leather', price: '$2,200', visits: '1.2K' },
  ]

  const category = shallowRef('all')
  const stock = shallowRef('all')
  const status = shallowRef('all')
  const search = shallowRef('')
  const show = shallowRef('5')
  const page = shallowRef(1)

  type Status = 'publish' | 'inactive'

  const products: Array<{ name: string, brand: string, category: string, price: string, qty: number, status: Status, inStock: boolean }> = [
    { name: 'Samsung galaxy s35', brand: 'Samsung', category: 'Smartphone', price: '$312', qty: 45, status: 'publish', inStock: true },
    { name: 'Apple MacBook Pro', brand: 'Apple', category: 'Laptop', price: '$890', qty: 634, status: 'publish', inStock: false },
    { name: 'Sony WH-1000XM4', brand: 'Sony', category: 'Headphone', price: '$120', qty: 456, status: 'inactive', inStock: true },
    { name: 'Dell XPS 13', brand: 'Dell', category: 'Laptop', price: '$112', qty: 4, status: 'publish', inStock: false },
    { name: 'Smart band 4', brand: 'Xiaomi', category: 'Smartwatch', price: '$150', qty: 45, status: 'inactive', inStock: false },
  ]

  function initials (name: string) {
    return name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase()
  }
</script>

<template>
  <EmeraldShell>
    <div class="adm-ecommerce" data-theme="emerald">
      <header class="adm-ecommerce__header">
        <h1 class="adm-ecommerce__title">eCommerce</h1>
        <p class="adm-ecommerce__subtitle">Storefront performance and catalog</p>
      </header>

      <section aria-label="Key metrics" class="adm-ecommerce__kpis">
        <EmCard v-for="s in stats" :key="s.label" class="adm-ecommerce__kpi" variant="simple">
          <EmCardBody class="adm-ecommerce__kpi-body">
            <span class="adm-ecommerce__kpi-value">
              {{ s.value }}
              <em class="adm-ecommerce__delta" :data-up="s.up || undefined">{{ s.delta }}</em>
            </span>

            <span class="adm-ecommerce__kpi-label">{{ s.label }}</span>
            <EmTag class="adm-ecommerce__kpi-tag">{{ s.sub }}</EmTag>
          </EmCardBody>
        </EmCard>
      </section>

      <section aria-label="Earning insights">
        <EmCard variant="simple">
          <EmCardHeader class="adm-ecommerce__panel-head">
            <div>
              <EmCardTitle class="adm-ecommerce__panel-title">Earning insights</EmCardTitle>
              <p class="adm-ecommerce__panel-sub">Weekly Earning overview</p>
            </div>
          </EmCardHeader>

          <EmCardBody class="adm-ecommerce__insights">
            <div class="adm-ecommerce__insights-chart">
              <span class="adm-ecommerce__kpi-value adm-ecommerce__kpi-value--lg">$4.6K <EmTag variant="success">+10%</EmTag></span>
              <p class="adm-ecommerce__panel-sub">Earning of this week compared to last week. it's increasing keep it up.</p>

              <div aria-label="Weekly earning" class="adm-ecommerce__chart" role="img">
                <div v-for="(v, index) in earning" :key="index" class="adm-ecommerce__chart-col">
                  <span class="adm-ecommerce__chart-bar" :data-peak="v === earningMax || undefined" :style="{ height: (v / earningMax) * 100 + '%' }" />
                  <span class="adm-ecommerce__chart-label">{{ days[index] }}</span>
                </div>
              </div>
            </div>

            <div class="adm-ecommerce__insight-stats">
              <div v-for="i in insights" :key="i.label" class="adm-ecommerce__insight-stat">
                <span class="adm-ecommerce__insight-label">{{ i.label }}</span>
                <strong>{{ i.value }}</strong>
                <EmProgress :aria-label="i.label" :model-value="i.pct" size="sm" />
              </div>
            </div>
          </EmCardBody>
        </EmCard>
      </section>

      <section aria-label="Business, orders and popular products" class="adm-ecommerce__row2">
        <EmCard class="adm-ecommerce__panel" variant="simple">
          <EmCardHeader class="adm-ecommerce__driver-head">
            <EmAvatar size="md"><EmAvatarFallback>JW</EmAvatarFallback></EmAvatar>

            <div>
              <EmCardTitle class="adm-ecommerce__panel-title">@jackwilliams</EmCardTitle>
              <p class="adm-ecommerce__panel-sub">Business</p>
            </div>
          </EmCardHeader>

          <EmCardBody>
            <p class="adm-ecommerce__orders"><strong>4,689</strong> Orders</p>

            <div class="adm-ecommerce__packing">
              <div v-for="row in packing" :key="row.label" class="adm-ecommerce__packing-row">
                <div class="adm-ecommerce__packing-head">
                  <span>{{ row.label }}</span>
                  <strong>{{ row.value }}</strong>
                </div>

                <EmProgress :aria-label="row.label" :max="row.max" :model-value="row.value" size="sm" />
              </div>
            </div>
          </EmCardBody>
        </EmCard>

        <EmCard class="adm-ecommerce__panel" variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-ecommerce__panel-title">Orders</EmCardTitle>
            <p class="adm-ecommerce__panel-sub">75 Deliveries in progress</p>
          </EmCardHeader>

          <EmTabs v-model="ordersTab">
            <EmTabsList>
              <EmTabsItem value="new">New</EmTabsItem>
              <EmTabsItem value="pending">Pending</EmTabsItem>
              <EmTabsItem value="shipping">Shipping</EmTabsItem>
            </EmTabsList>
          </EmTabs>

          <EmCardBody>
            <ul class="adm-ecommerce__orders-list">
              <li v-for="(o, index) in orders" :key="index">
                <span class="adm-ecommerce__order-role">{{ o.role }}</span>
                <strong>{{ o.name }}</strong>
                <span class="adm-ecommerce__order-address">{{ o.address }}</span>
              </li>
            </ul>
          </EmCardBody>
        </EmCard>

        <EmCard class="adm-ecommerce__panel" variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-ecommerce__panel-title">Popular product</EmCardTitle>
            <p class="adm-ecommerce__panel-sub">Total 10.4K visitors</p>
          </EmCardHeader>

          <EmCardBody>
            <ul class="adm-ecommerce__popular">
              <li v-for="p in popular" :key="p.name">
                <EmAvatar size="sm"><EmAvatarFallback>{{ initials(p.name) }}</EmAvatarFallback></EmAvatar>
                <span class="adm-ecommerce__popular-text"><strong>{{ p.name }}</strong><span>{{ p.price }}</span></span>
                <span class="adm-ecommerce__popular-visits">{{ p.visits }}</span>
              </li>
            </ul>
          </EmCardBody>
        </EmCard>
      </section>

      <section aria-label="Products">
        <EmCard variant="simple">
          <EmCardHeader class="adm-ecommerce__toolbar">
            <div class="adm-ecommerce__toolbar-filters">
              <EmSelect v-model="category" class="adm-ecommerce__filter">
                <EmSelectActivator><EmSelectValue placeholder="Select Category" /></EmSelectActivator>

                <EmSelectContent>
                  <EmSelectItem value="all">All</EmSelectItem>
                  <EmSelectItem value="phone">Smartphone</EmSelectItem>
                  <EmSelectItem value="laptop">Laptop</EmSelectItem>
                </EmSelectContent>
              </EmSelect>

              <EmSelect v-model="stock" class="adm-ecommerce__filter">
                <EmSelectActivator><EmSelectValue placeholder="Select Stock" /></EmSelectActivator>

                <EmSelectContent>
                  <EmSelectItem value="all">All</EmSelectItem>
                  <EmSelectItem value="in">In stock</EmSelectItem>
                  <EmSelectItem value="out">Out of stock</EmSelectItem>
                </EmSelectContent>
              </EmSelect>

              <EmSelect v-model="status" class="adm-ecommerce__filter">
                <EmSelectActivator><EmSelectValue placeholder="Select Status" /></EmSelectActivator>

                <EmSelectContent>
                  <EmSelectItem value="all">All</EmSelectItem>
                  <EmSelectItem value="publish">Publish</EmSelectItem>
                  <EmSelectItem value="inactive">Inactive</EmSelectItem>
                </EmSelectContent>
              </EmSelect>
            </div>

            <div class="adm-ecommerce__toolbar-right">
              <EmTextField v-model="search" aria-label="Search product" class="adm-ecommerce__search" placeholder="Search product" />

              <EmSelect v-model="show" class="adm-ecommerce__show-select">
                <EmSelectActivator><EmSelectValue /></EmSelectActivator>

                <EmSelectContent>
                  <EmSelectItem value="5">5</EmSelectItem>
                  <EmSelectItem value="10">10</EmSelectItem>
                </EmSelectContent>
              </EmSelect>

              <EmButton size="sm" variant="tertiary">Export</EmButton>
              <EmButton size="sm" variant="primary">Add Product</EmButton>
            </div>
          </EmCardHeader>

          <EmCardBody class="adm-ecommerce__table-wrap">
            <table class="adm-ecommerce__table">
              <thead>
                <tr>
                  <th><EmCheckbox aria-label="Select all" /></th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Amount</th>
                  <th>QTY</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="p in products" :key="p.name">
                  <td><EmCheckbox :aria-label="`Select ${p.name}`" /></td>

                  <td>
                    <div class="adm-ecommerce__client">
                      <EmAvatar size="sm"><EmAvatarFallback>{{ initials(p.name) }}</EmAvatarFallback></EmAvatar>
                      <span><strong>{{ p.name }}</strong><span class="adm-ecommerce__client-sub">{{ p.brand }}</span></span>
                    </div>
                  </td>

                  <td>{{ p.category }}</td>
                  <td><EmSwitch :aria-label="`${p.name} in stock`" :model-value="p.inStock" size="sm" /></td>
                  <td>{{ p.price }}</td>
                  <td>{{ p.qty }}</td>

                  <td>
                    <EmTag :variant="p.status === 'publish' ? 'success' : 'danger'">{{ p.status === 'publish' ? 'Publish' : 'Inactive' }}</EmTag>
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

          <EmCardFooter class="adm-ecommerce__table-foot">
            <span class="adm-ecommerce__table-count">Showing 1 to 5 of 25 entries</span>

            <EmPagination v-model="page" :size="5">
              <EmPaginationPrev>‹ Previous</EmPaginationPrev>
              <EmPaginationItem v-for="n in 5" :key="n" :value="n" />
              <EmPaginationNext>Next ›</EmPaginationNext>
            </EmPagination>
          </EmCardFooter>
        </EmCard>
      </section>
    </div>
  </EmeraldShell>
</template>

<style>
  .adm-ecommerce {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-l, 20px);
  }

  .adm-ecommerce .emerald-card {
    background: var(--emerald-background, #fefefe);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    border-radius: var(--emerald-radius-xl, 12px);
    box-shadow: var(--emerald-shadow-s, 0 0 2px 0 rgba(51, 51, 51, 0.08));
  }

  .adm-ecommerce__title {
    margin: 0;
    font-size: clamp(1.375rem, 2vw, 1.625rem);
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .adm-ecommerce__subtitle {
    margin: 0.25rem 0 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b1-size, 16px);
  }

  .adm-ecommerce__kpis {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: var(--emerald-spacing-m, 16px);
  }

  .adm-ecommerce__kpi-body {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .adm-ecommerce__kpi-value {
    display: flex;
    align-items: baseline;
    gap: 6px;
    font-size: 1.5rem;
    font-weight: 700;
  }

  .adm-ecommerce__kpi-value--lg {
    align-items: center;
    font-size: 2rem;
  }

  .adm-ecommerce__delta {
    font-style: normal;
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 600;
    color: var(--emerald-danger-500, #c61424);
  }

  .adm-ecommerce__delta[data-up] {
    color: var(--emerald-primary-700, #027d4c);
  }

  .adm-ecommerce__kpi-label {
    font-weight: 600;
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-ecommerce__kpi-tag {
    width: fit-content;
  }

  .adm-ecommerce__panel-title {
    font-size: var(--emerald-text-b1-size, 16px) !important;
    font-weight: 700 !important;
  }

  .adm-ecommerce__panel-sub {
    margin: 2px 0 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-ecommerce__panel-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-ecommerce__insights {
    display: grid;
    grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
    gap: var(--emerald-spacing-l, 20px);
  }

  .adm-ecommerce__chart {
    display: flex;
    align-items: flex-end;
    gap: 8px;
    height: 120px;
    margin-top: var(--emerald-spacing-m, 16px);
  }

  .adm-ecommerce__chart-col {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    gap: 4px;
    height: 100%;
  }

  .adm-ecommerce__chart-bar {
    width: 55%;
    min-height: 6px;
    border-radius: var(--emerald-radius-xs, 4px) var(--emerald-radius-xs, 4px) 0 0;
    background: var(--emerald-neutral-300, #ccd6e7);
  }

  .adm-ecommerce__chart-bar[data-peak] {
    background: var(--emerald-on-surface, #2b2d2e);
  }

  .adm-ecommerce__chart-label {
    font-size: var(--emerald-text-b3-size, 12px);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-ecommerce__insight-stats {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: var(--emerald-spacing-m, 16px);
  }

  .adm-ecommerce__insight-stat {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .adm-ecommerce__insight-label {
    font-size: var(--emerald-text-b3-size, 12px);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-ecommerce__insight-stat strong {
    font-size: var(--emerald-text-b1-size, 16px);
  }

  .adm-ecommerce__row2 {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--emerald-spacing-m, 16px);
    align-items: start;
  }

  .adm-ecommerce__driver-head {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-ecommerce__orders {
    margin: 0 0 var(--emerald-spacing-m, 16px);
    font-size: var(--emerald-text-b1-size, 16px);
  }

  .adm-ecommerce__orders strong {
    font-size: 1.5rem;
  }

  .adm-ecommerce__packing {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-m, 16px);
  }

  .adm-ecommerce__packing-head {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-ecommerce__orders-list {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-m, 16px);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .adm-ecommerce__orders-list li {
    display: flex;
    flex-direction: column;
    padding-bottom: var(--emerald-spacing-s, 12px);
    border-bottom: var(--emerald-stroke-s, 1px) dashed var(--emerald-neutral-300, #ccd6e7);
  }

  .adm-ecommerce__orders-list li:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .adm-ecommerce__order-role {
    font-size: var(--emerald-text-b3-size, 12px);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-ecommerce__order-address {
    font-size: var(--emerald-text-b3-size, 12px);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-ecommerce__popular {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-s, 12px);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .adm-ecommerce__popular li {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-xs, 8px);
  }

  .adm-ecommerce__popular-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    font-size: var(--emerald-text-b3-size, 12px);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-ecommerce__popular-text strong {
    color: var(--emerald-on-surface, #2b2d2e);
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-ecommerce__popular-visits {
    font-size: var(--emerald-text-b2-size, 14px);
    font-weight: 600;
  }

  .adm-ecommerce__toolbar {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-ecommerce__toolbar-filters,
  .adm-ecommerce__toolbar-right {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-ecommerce__filter {
    width: 140px;
  }

  .adm-ecommerce__search {
    width: 180px;
  }

  .adm-ecommerce__show-select {
    width: 70px;
  }

  .adm-ecommerce__table-wrap {
    overflow-x: auto;
  }

  .adm-ecommerce__table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--emerald-text-b2-size, 14px);
    white-space: nowrap;
  }

  .adm-ecommerce__table th {
    padding: var(--emerald-spacing-xs, 8px) var(--emerald-spacing-s, 12px);
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 600;
    text-align: left;
    border-bottom: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
  }

  .adm-ecommerce__table td {
    padding: var(--emerald-spacing-s, 12px);
    border-bottom: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-200, #f6f8fa);
  }

  .adm-ecommerce__client {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-xs, 8px);
  }

  .adm-ecommerce__client strong {
    display: block;
  }

  .adm-ecommerce__client-sub {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-ecommerce__table-foot {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-ecommerce__table-count {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  @media (max-width: 1200px) {
    .adm-ecommerce__kpis {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .adm-ecommerce__insights,
    .adm-ecommerce__row2 {
      grid-template-columns: 1fr;
    }
  }
</style>
