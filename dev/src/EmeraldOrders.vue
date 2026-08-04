<!--
  The activation funnel bars, seat-share bars and renewal ring render as static
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

  type Order = {
    id: string
    org: string
    contact: string
    product: string
    seats: number
    value: string
    state: 'Delivered' | 'Awaiting key' | 'Provisioning'
  }

  const catalog = [
    { org: 'Northwind Labs', contact: 'Priya Raghunathan', product: 'Emerald Pro', seats: 40, value: '$4,800.00', state: 'Delivered' as const },
    { org: 'Kestrel Analytics', contact: 'Tomas Lindqvist', product: 'Onyx Studio Kit', seats: 12, value: '$1,740.00', state: 'Provisioning' as const },
    { org: 'Foundry Nine', contact: 'Adaeze Okonkwo', product: 'v0 Enterprise Support', seats: 25, value: '$6,250.00', state: 'Delivered' as const },
    { org: 'Vellum Press', contact: 'Ravi Menon', product: 'Helix Docs Theme', seats: 8, value: '$640.00', state: 'Awaiting key' as const },
    { org: 'Palisade Bank', contact: 'Ingrid Solberg', product: 'Emerald Pro', seats: 120, value: '$13,200.00', state: 'Delivered' as const },
    { org: 'Copperline Studio', contact: 'Hugo Bellamy', product: 'Prism Icon Set', seats: 6, value: '$294.00', state: 'Delivered' as const },
    { org: 'Ardent Robotics', contact: 'Mira Kovac', product: 'Onyx Studio Kit', seats: 32, value: '$4,640.00', state: 'Provisioning' as const },
    { org: 'Saltmarsh Digital', contact: 'Kenji Morrow', product: 'Marketplace Blocks', seats: 15, value: '$1,125.00', state: 'Awaiting key' as const },
  ]

  const orders: Order[] = Array.from({ length: 24 }, (_, index) => {
    const base = catalog[index % catalog.length]!
    const run = Math.floor(index / catalog.length)

    return { ...base, id: `LIC-${8140 - index * 13}`, seats: base.seats + run * 4 }
  })

  const search = shallowRef('')
  const page = shallowRef(1)

  const filter = createFilter({ keys: ['id', 'org', 'contact', 'product'] })
  const found = filter.apply(search, orders)
  const filtered = toRef(() => found.items.value)

  const pagination = createPagination({ page, size: () => filtered.value.length, itemsPerPage: 6 })
  const rows = toRef(() => filtered.value.slice(pagination.pageStart.value, pagination.pageStop.value))

  const funnel = [
    { label: 'Orders placed', count: '1,284', pct: 100 },
    { label: 'Key delivered', count: '1,247', pct: 97 },
    { label: 'First activation', count: '1,092', pct: 85 },
    { label: 'Full seat rollout', count: '806', pct: 63 },
  ]

  const accounts = [
    { org: 'Palisade Bank', plan: 'Emerald Pro · 120 seats', spend: '$18,400', pct: 100 },
    { org: 'Foundry Nine', plan: 'v0 Enterprise · 25 seats', spend: '$12,150', pct: 66 },
    { org: 'Northwind Labs', plan: 'Emerald Pro · 40 seats', spend: '$9,720', pct: 53 },
    { org: 'Ardent Robotics', plan: 'Onyx Studio Kit · 32 seats', spend: '$6,300', pct: 34 },
  ]

  const strip = [
    { label: 'Licenses issued', value: '1,284', delta: '+12.4%', up: true, trend: [22, 28, 25, 33, 30, 38, 44] },
    { label: 'Seats activated', value: '9,610', delta: '+8.1%', up: true, trend: [30, 34, 31, 36, 40, 42, 47] },
    { label: 'Keys pending', value: '37', delta: '-14.2%', up: false, trend: [44, 40, 42, 35, 31, 28, 24] },
    { label: 'Refund requests', value: '6', delta: '-22.5%', up: false, trend: [18, 22, 17, 14, 12, 9, 7] },
  ]

  function points (trend: readonly number[]) {
    const max = Math.max(...trend)
    return trend.map((v, index) => `${index * (100 / (trend.length - 1))},${34 - (v / max) * 30}`).join(' ')
  }

  function initials (name: string) {
    return name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase()
  }
</script>

<template>
  <EmeraldShell>
    <div class="adm-orders" data-theme="emerald">
      <header class="adm-orders__header">
        <h1 class="adm-orders__title">License orders</h1>
        <p class="adm-orders__subtitle">Marketplace fulfilment, key delivery and seat rollout</p>
      </header>

      <section aria-label="Order queue">
        <EmCard variant="simple">
          <EmCardHeader class="adm-orders__table-head">
            <div>
              <EmCardTitle class="adm-orders__panel-title">Order queue</EmCardTitle>
              <p class="adm-orders__panel-sub">Every purchase awaiting or completing key delivery</p>
            </div>

            <EmTextField v-model="search" aria-label="Search orders" class="adm-orders__search" placeholder="Search order, org or product" />
          </EmCardHeader>

          <EmCardBody class="adm-orders__table-wrap">
            <table class="adm-orders__table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Account</th>
                  <th>Product</th>
                  <th>Seats</th>
                  <th>Value</th>
                  <th>Key status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="order in rows" :key="order.id">
                  <td class="adm-orders__id">{{ order.id }}</td>

                  <td>
                    <div class="adm-orders__client">
                      <EmAvatar size="sm"><EmAvatarFallback>{{ initials(order.org) }}</EmAvatarFallback></EmAvatar>
                      <span><strong>{{ order.org }}</strong><span class="adm-orders__client-sub">{{ order.contact }}</span></span>
                    </div>
                  </td>

                  <td>{{ order.product }}</td>
                  <td>{{ order.seats }}</td>
                  <td>{{ order.value }}</td>

                  <td>
                    <EmTag :variant="order.state === 'Delivered' ? 'success' : order.state === 'Provisioning' ? 'info' : 'neutral'">
                      {{ order.state }}
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

          <EmCardFooter class="adm-orders__table-foot">
            <span class="adm-orders__table-count">
              Showing {{ filtered.length > 0 ? pagination.pageStart.value + 1 : 0 }} to {{ pagination.pageStop.value }} of {{ filtered.length }} orders
            </span>

            <EmPagination v-model="page" :items-per-page="6" :size="filtered.length">
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

      <section aria-label="Activation, accounts and renewals" class="adm-orders__split">
        <EmCard class="adm-orders__panel" variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-orders__panel-title">Activation funnel</EmCardTitle>
            <p class="adm-orders__panel-sub">From checkout to every purchased seat in use</p>
          </EmCardHeader>

          <EmCardBody>
            <ul aria-label="Activation funnel stages" class="adm-orders__funnel" role="img">
              <li v-for="stage in funnel" :key="stage.label">
                <span class="adm-orders__funnel-label">{{ stage.label }}</span>

                <span class="adm-orders__funnel-track">
                  <span class="adm-orders__funnel-fill" :style="{ width: stage.pct + '%' }">{{ stage.count }}</span>
                </span>

                <strong class="adm-orders__funnel-pct">{{ stage.pct }}%</strong>
              </li>
            </ul>
          </EmCardBody>
        </EmCard>

        <EmCard class="adm-orders__panel" variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-orders__panel-title">Seat spend by account</EmCardTitle>
            <p class="adm-orders__panel-sub">Top four accounts this quarter</p>
          </EmCardHeader>

          <EmCardBody>
            <ul class="adm-orders__accounts">
              <li v-for="account in accounts" :key="account.org">
                <EmAvatar size="sm"><EmAvatarFallback>{{ initials(account.org) }}</EmAvatarFallback></EmAvatar>

                <span class="adm-orders__account-text">
                  <strong>{{ account.org }}</strong>
                  <span>{{ account.plan }}</span>
                </span>

                <span class="adm-orders__account-value">
                  {{ account.spend }}
                  <span class="adm-orders__account-bar"><span :style="{ width: account.pct + '%' }" /></span>
                </span>
              </li>
            </ul>
          </EmCardBody>
        </EmCard>

        <EmCard class="adm-orders__panel" variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-orders__panel-title">Renewal rate</EmCardTitle>
          </EmCardHeader>

          <EmCardBody class="adm-orders__goal">
            <span aria-hidden="true" class="adm-orders__ring" style="--pct: 74">
              <span class="adm-orders__ring-value">74%</span>
              <span class="adm-orders__ring-sub">Auto-renewed</span>
            </span>

            <p class="adm-orders__panel-sub">
              949 of 1,284 licenses renewed without a support touch. Lapsed seats fall back to the free tier after 30 days.
            </p>
          </EmCardBody>
        </EmCard>
      </section>

      <section aria-label="Fulfilment indicators" class="adm-orders__strip">
        <EmCard v-for="item in strip" :key="item.label" variant="simple">
          <EmCardBody class="adm-orders__strip-body">
            <span class="adm-orders__strip-label">{{ item.label }}</span>

            <span class="adm-orders__strip-value">
              {{ item.value }}
              <em class="adm-orders__delta" :data-up="item.up || undefined">{{ item.delta }}</em>
            </span>

            <svg aria-hidden="true" class="adm-orders__spark" preserveAspectRatio="none" viewBox="0 0 100 34">
              <polyline
                fill="none"
                :points="points(item.trend)"
                :stroke="item.up ? 'var(--emerald-primary-600, #1fae60)' : 'var(--emerald-neutral-500, #949ca3)'"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
              />
            </svg>
          </EmCardBody>
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

  .adm-orders__panel-title {
    font-size: var(--emerald-text-b1-size, 16px) !important;
    font-weight: 700 !important;
  }

  .adm-orders__panel-sub {
    margin: 2px 0 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
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
    width: 280px;
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

  .adm-orders__table-wrap {
    overflow-x: auto;
    margin-inline: calc(-1 * var(--emerald-spacing-l, 20px));
  }

  .adm-orders__table th:first-child,
  .adm-orders__table td:first-child {
    padding-left: var(--emerald-spacing-l, 20px);
  }

  .adm-orders__table th:last-child,
  .adm-orders__table td:last-child {
    padding-right: var(--emerald-spacing-l, 20px);
  }

  .adm-orders__table tbody tr {
    transition: background-color 120ms ease;
  }

  .adm-orders__table tbody tr:hover {
    background: var(--emerald-neutral-200, #f6f8fa);
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

  .adm-orders__id {
    font-variant-numeric: tabular-nums;
    font-weight: 600;
  }

  .adm-orders__client {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-xs, 8px);
  }

  .adm-orders__client strong {
    display: block;
  }

  .adm-orders__client-sub {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-orders__split {
    display: grid;
    grid-template-columns: minmax(0, 1.3fr) minmax(0, 1.1fr) minmax(0, 0.8fr);
    gap: var(--emerald-spacing-m, 16px);
  }

  .adm-orders__split .emerald-card__body {
    display: flex;
    flex: 1;
    flex-direction: column;
  }

  .adm-orders__funnel {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
    gap: var(--emerald-spacing-m, 16px);
    margin: var(--emerald-spacing-xs, 8px) 0 0;
    padding: 0;
    list-style: none;
  }

  .adm-orders__funnel li {
    display: grid;
    grid-template-columns: 118px minmax(0, 1fr) 42px;
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-orders__funnel-label {
    font-size: var(--emerald-text-b2-size, 14px);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-orders__funnel-track {
    height: 26px;
    border-radius: var(--emerald-radius-xs, 4px);
    background: var(--emerald-neutral-200, #f6f8fa);
    overflow: hidden;
  }

  .adm-orders__funnel-fill {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 100%;
    padding-right: var(--emerald-spacing-xs, 8px);
    border-radius: var(--emerald-radius-xs, 4px);
    background: var(--emerald-primary-600, #1fae60);
    color: var(--emerald-on-primary, #fff);
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 600;
  }

  .adm-orders__funnel-pct {
    font-size: var(--emerald-text-b3-size, 12px);
    text-align: right;
  }

  .adm-orders__accounts {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
    gap: var(--emerald-spacing-m, 16px);
    margin: var(--emerald-spacing-xs, 8px) 0 0;
    padding: 0;
    list-style: none;
  }

  .adm-orders__accounts li {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-orders__account-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    font-size: var(--emerald-text-b3-size, 12px);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-orders__account-text strong {
    color: var(--emerald-on-surface, #2b2d2e);
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-orders__account-value {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 600;
  }

  .adm-orders__account-bar {
    display: block;
    width: 80px;
    height: 5px;
    border-radius: 3px;
    background: var(--emerald-neutral-200, #f6f8fa);
    overflow: hidden;
  }

  .adm-orders__account-bar span {
    display: block;
    height: 100%;
    background: var(--emerald-primary-600, #1fae60);
  }

  .adm-orders__goal {
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
    text-align: center;
  }

  .adm-orders__ring {
    --pct: 74;
    position: relative;
    display: flex;
    flex: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 140px;
    height: 140px;
    margin-top: var(--emerald-spacing-xs, 8px);
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
    font-size: 1.5rem;
    font-weight: 700;
  }

  .adm-orders__ring-sub {
    font-size: var(--emerald-text-b3-size, 12px);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-orders__strip {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: var(--emerald-spacing-m, 16px);
  }

  .adm-orders__strip-body {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-xs, 8px);
    min-height: 108px;
  }

  .adm-orders__strip-label {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-orders__strip-value {
    display: flex;
    align-items: baseline;
    gap: 8px;
    font-size: 1.625rem;
    font-weight: 700;
  }

  .adm-orders__spark {
    width: 100%;
    height: 34px;
    margin-top: auto;
  }

  @media (max-width: 1200px) {
    .adm-orders__split {
      grid-template-columns: 1fr;
    }

    .adm-orders__strip {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 640px) {
    .adm-orders__search {
      width: 100%;
    }

    .adm-orders__strip {
      grid-template-columns: 1fr;
    }

    .adm-orders__funnel li {
      grid-template-columns: 100px minmax(0, 1fr) 38px;
    }
  }
</style>
