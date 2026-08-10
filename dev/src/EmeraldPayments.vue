<!--
  The revenue-mix segmented bar and method share bars render as static CSS
  fills (real data, no charting library) — same GAP_CONTRACT precedent as
  EmeraldSales.
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
    EmIcon,
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

  const billing = [
    { label: 'Billed this month', value: '$184,320', delta: '+9.4%', up: true },
    { label: 'Collected', value: '$171,940', delta: '+11.2%', up: true },
    { label: 'Outstanding', value: '$12,380', delta: '-6.8%', up: false },
    { label: 'Failed charges', value: '14', delta: '-3 vs June', up: false },
  ]

  const mix = [
    { label: 'Seat subscriptions', pct: 58, tone: 'deep' as const },
    { label: 'Perpetual licenses', pct: 24, tone: 'mid' as const },
    { label: 'Support contracts', pct: 13, tone: 'light' as const },
    { label: 'Marketplace fees', pct: 5, tone: 'pale' as const },
  ]

  const methods = [
    { brand: 'Visa', tail: '4417', share: 46, volume: '$84,780' },
    { brand: 'Mastercard', tail: '9032', share: 27, volume: '$49,760' },
    { brand: 'SEPA direct debit', tail: '2185', share: 16, volume: '$29,490' },
    { brand: 'Invoice / wire', tail: '—', share: 11, volume: '$20,290' },
  ]

  const payouts = [
    { who: 'Camille Fontaine', role: 'Core maintainer', when: '05 Aug', amount: '$4,200' },
    { who: 'Kenji Morrow', role: 'Docs lead', when: '05 Aug', amount: '$3,100' },
    { who: 'Nadia Haddad', role: 'Composables', when: '12 Aug', amount: '$2,850' },
    { who: 'Bruno Marchetti', role: 'Design systems', when: '12 Aug', amount: '$2,400' },
    { who: 'Zara Idris', role: 'Triage rotation', when: '19 Aug', amount: '$1,650' },
  ]

  const failures = [
    { org: 'Copperline Studio', reason: 'Card expired', amount: '$294.00', attempt: 'Retry 2 of 4' },
    { org: 'Saltmarsh Digital', reason: 'Insufficient funds', amount: '$1,125.00', attempt: 'Retry 1 of 4' },
    { org: 'Tidewater Freight', reason: 'Bank declined', amount: '$720.00', attempt: 'Retry 3 of 4' },
    { org: 'Quarry Software', reason: 'Mandate revoked', amount: '$2,480.00', attempt: 'Needs contact' },
  ]

  const show = shallowRef('5')
  const search = shallowRef('')
  const status = shallowRef('all')
  const page = shallowRef(1)

  type Status = 'paid' | 'open' | 'draft'

  type Invoice = { id: string, org: string, contact: string, plan: string, total: string, due: string, balance: string, owing: boolean, status: Status }

  const accounts = [
    { org: 'Northwind Labs', contact: 'Priya Raghunathan', plan: 'Emerald Pro · annual' },
    { org: 'Kestrel Analytics', contact: 'Tomas Lindqvist', plan: 'Onyx Studio Kit · monthly' },
    { org: 'Foundry Nine', contact: 'Adaeze Okonkwo', plan: 'v0 Enterprise · annual' },
    { org: 'Vellum Press', contact: 'Ravi Menon', plan: 'Helix Docs Theme · one-off' },
    { org: 'Palisade Bank', contact: 'Ingrid Solberg', plan: 'Emerald Pro · annual' },
    { org: 'Ardent Robotics', contact: 'Mira Kovac', plan: 'Onyx Studio Kit · annual' },
    { org: 'Lumen Grid', contact: 'Dmitri Sokolov', plan: 'Support contract · quarterly' },
    { org: 'Basalt Health', contact: 'Yuki Tanabe', plan: 'Emerald Pro · monthly' },
  ]

  const cycles = ['Apr', 'May', 'Jun', 'Jul', 'Aug']
  const states: Status[] = ['paid', 'paid', 'open', 'draft', 'paid']

  const invoices: Invoice[] = Array.from({ length: 25 }, (_, index) => {
    const account = accounts[index % accounts.length]!
    const state = states[index % states.length]!
    const owing = state !== 'paid'

    return {
      id: `INV-${4210 + index * 6}`,
      org: account.org,
      contact: account.contact,
      plan: account.plan,
      total: `$${(980 + index * 217).toLocaleString('en-US')}.00`,
      due: `${String((index % 27) + 2).padStart(2, '0')} ${cycles[index % cycles.length]} 2026`,
      balance: owing ? `$${(120 + index * 31).toLocaleString('en-US')}.00` : 'Settled',
      owing,
      status: state,
    }
  })

  const options = [
    { value: 'all', label: 'All' },
    { value: 'paid', label: 'Paid' },
    { value: 'open', label: 'Open' },
    { value: 'draft', label: 'Draft' },
  ]

  function label (value: string) {
    return options.find(option => option.value === value)?.label ?? value
  }

  const filter = createFilter({ keys: ['id', 'org', 'contact', 'plan'] })
  const found = filter.apply(search, invoices)

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
    <div class="adm-payments">
      <header class="adm-payments__header">
        <h1 class="adm-payments__title">Billing &amp; payouts</h1>
        <p class="adm-payments__subtitle">Subscription collection, invoice state and maintainer disbursement</p>
      </header>

      <section aria-label="Billing summary">
        <EmCard variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-payments__panel-title">August billing run</EmCardTitle>
            <p class="adm-payments__panel-sub">Closed 03 Aug · next run opens 01 Sep</p>
          </EmCardHeader>

          <EmCardBody>
            <div class="adm-payments__summary">
              <div v-for="item in billing" :key="item.label">
                <span class="adm-payments__summary-label">{{ item.label }}</span>
                <span class="adm-payments__summary-value">{{ item.value }}</span>
                <em class="adm-payments__delta" :data-up="item.up || undefined">{{ item.delta }}</em>
              </div>
            </div>

            <div aria-label="Revenue mix" class="adm-payments__segbar" role="img">
              <span
                v-for="segment in mix"
                :key="segment.label"
                class="adm-payments__seg"
                :data-tone="segment.tone"
                :style="{ flexGrow: segment.pct }"
              >{{ segment.pct }}%</span>
            </div>

            <ul class="adm-payments__legend">
              <li v-for="segment in mix" :key="segment.label">
                <span class="adm-payments__dot" :data-tone="segment.tone" />
                <span>{{ segment.label }}</span>
              </li>
            </ul>
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

              <EmButton size="sm" variant="primary">New invoice</EmButton>
            </div>

            <div class="adm-payments__toolbar-right">
              <EmTextField v-model="search" aria-label="Search invoices" class="adm-payments__search" placeholder="Search invoice or account" />

              <EmSelect v-model="status" class="adm-payments__status-select">
                <EmSelectActivator>
                  <EmSelectValue v-slot="{ selectedValue }">{{ label(String(selectedValue)) }}</EmSelectValue>
                </EmSelectActivator>

                <EmSelectContent>
                  <EmSelectItem v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</EmSelectItem>
                </EmSelectContent>
              </EmSelect>
            </div>
          </EmCardHeader>

          <EmCardBody class="adm-payments__table-wrap">
            <table class="adm-payments__table">
              <thead>
                <tr>
                  <th><EmCheckbox aria-label="Select all" /></th>
                  <th>Invoice</th>
                  <th>Status</th>
                  <th>Account</th>
                  <th>Plan</th>
                  <th>Total</th>
                  <th>Due</th>
                  <th>Balance</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="row in rows" :key="row.id">
                  <td><EmCheckbox :aria-label="`Select ${row.id}`" /></td>
                  <td>{{ row.id }}</td>

                  <td>
                    <EmTag :variant="row.status === 'paid' ? 'success' : row.status === 'open' ? 'info' : 'neutral'">
                      {{ row.status === 'paid' ? 'Paid' : row.status === 'open' ? 'Open' : 'Draft' }}
                    </EmTag>
                  </td>

                  <td>
                    <div class="adm-payments__client">
                      <EmAvatar size="sm"><EmAvatarFallback>{{ initials(row.org) }}</EmAvatarFallback></EmAvatar>
                      <span><strong>{{ row.org }}</strong><span class="adm-payments__client-role">{{ row.contact }}</span></span>
                    </div>
                  </td>

                  <td>{{ row.plan }}</td>
                  <td>{{ row.total }}</td>
                  <td>{{ row.due }}</td>
                  <td><EmTag :variant="row.owing ? 'danger' : 'success'">{{ row.balance }}</EmTag></td>

                  <td>
                    <div class="adm-payments__actions">
                      <EmButton aria-label="Send reminder" size="sm" variant="tertiary">
                        <EmIcon name="envelope" size="s" />
                      </EmButton>

                      <EmButton aria-label="View invoice" size="sm" variant="tertiary">
                        <EmIcon name="eye" size="s" />
                      </EmButton>

                      <EmButton aria-label="More actions" size="sm" variant="tertiary">
                        <EmIcon name="kebab" size="s" />
                      </EmButton>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </EmCardBody>

          <EmCardFooter class="adm-payments__table-foot">
            <span class="adm-payments__table-count">
              Showing {{ filtered.length > 0 ? pagination.pageStart.value + 1 : 0 }} to {{ pagination.pageStop.value }} of {{ filtered.length }} invoices
            </span>

            <EmPagination v-model="page" :items-per-page="Number(show)" :size="filtered.length">
              <template #default="{ items }">
                <EmPaginationPrev>‹ Previous</EmPaginationPrev>

                <template v-for="(item, index) in items" :key="index">
                  <EmPaginationItem v-if="item.type === 'page'" :value="item.value" />
                  <span v-else class="adm-payments__page-gap">{{ item.value }}</span>
                </template>

                <EmPaginationNext>Next ›</EmPaginationNext>
              </template>
            </EmPagination>
          </EmCardFooter>
        </EmCard>
      </section>

      <section aria-label="Methods, payouts and failures" class="adm-payments__trio">
        <EmCard class="adm-payments__panel" variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-payments__panel-title">How accounts pay</EmCardTitle>
          </EmCardHeader>

          <EmCardBody>
            <ul class="adm-payments__methods">
              <li v-for="method in methods" :key="method.brand">
                <span class="adm-payments__method-text">
                  <strong>{{ method.brand }}</strong>
                  <span>{{ method.tail === '—' ? 'No stored instrument' : `ending ${method.tail}` }}</span>
                </span>

                <span class="adm-payments__method-value">
                  {{ method.volume }}
                  <span class="adm-payments__method-bar"><span :style="{ width: method.share + '%' }" /></span>
                </span>
              </li>
            </ul>
          </EmCardBody>
        </EmCard>

        <EmCard class="adm-payments__panel" variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-payments__panel-title">Maintainer payouts</EmCardTitle>
            <p class="adm-payments__panel-sub">$14,200 scheduled across three runs</p>
          </EmCardHeader>

          <EmCardBody>
            <ul class="adm-payments__payouts">
              <li v-for="payout in payouts" :key="payout.who">
                <EmAvatar size="sm"><EmAvatarFallback>{{ initials(payout.who) }}</EmAvatarFallback></EmAvatar>

                <span class="adm-payments__payout-text">
                  <strong>{{ payout.who }}</strong>
                  <span>{{ payout.role }}</span>
                </span>

                <span class="adm-payments__payout-value">
                  <strong>{{ payout.amount }}</strong>
                  <span>{{ payout.when }}</span>
                </span>
              </li>
            </ul>
          </EmCardBody>
        </EmCard>

        <EmCard class="adm-payments__panel" variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-payments__panel-title">Charges needing attention</EmCardTitle>
            <p class="adm-payments__panel-sub">$4,619 stuck in dunning</p>
          </EmCardHeader>

          <EmCardBody>
            <ul class="adm-payments__failures">
              <li v-for="failure in failures" :key="failure.org">
                <span class="adm-payments__failure-text">
                  <strong>{{ failure.org }}</strong>
                  <span>{{ failure.reason }}</span>
                </span>

                <span class="adm-payments__failure-value">
                  <strong>{{ failure.amount }}</strong>
                  <EmTag :variant="failure.attempt === 'Needs contact' ? 'danger' : 'neutral'">{{ failure.attempt }}</EmTag>
                </span>
              </li>
            </ul>
          </EmCardBody>
        </EmCard>
      </section>
    </div>
  </EmeraldShell>
</template>

<style>
  .adm-payments {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-l, 20px);
  }

  /* EmCard variant="simple" ships 2px padding and its slots add none, so every
     card needs its own inset — see the EmCard padding gap row. */
  .adm-payments .emerald-card {
    padding: var(--emerald-spacing-l, 20px);
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

  .adm-payments__panel-title {
    font-size: var(--emerald-text-b1-size, 16px) !important;
    font-weight: 700 !important;
  }

  .adm-payments__panel-sub {
    margin: 2px 0 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
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

  .adm-payments__summary {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: var(--emerald-spacing-m, 16px);
    margin-top: var(--emerald-spacing-xs, 8px);
  }

  .adm-payments__summary > div {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding-left: var(--emerald-spacing-m, 16px);
    border-left: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
  }

  .adm-payments__summary > div:first-child {
    padding-left: 0;
    border-left: 0;
  }

  .adm-payments__summary-label {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-payments__summary-value {
    font-size: 1.75rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .adm-payments__segbar {
    display: flex;
    height: 40px;
    margin-top: var(--emerald-spacing-l, 20px);
    border-radius: var(--emerald-radius-m, 8px);
    overflow: hidden;
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 600;
  }

  .adm-payments__seg {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: var(--emerald-primary-800, #01603a);
    color: var(--emerald-on-primary, #fff);
  }

  .adm-payments__seg[data-tone='mid'] {
    background: var(--emerald-primary-600, #1fae60);
  }

  .adm-payments__seg[data-tone='light'] {
    background: var(--emerald-primary-500, #26c26d);
  }

  .adm-payments__seg[data-tone='pale'] {
    background: var(--emerald-primary-300, #baedd0);
    color: var(--emerald-on-surface, #2b2d2e);
  }

  .adm-payments__legend {
    display: flex;
    flex-wrap: wrap;
    gap: var(--emerald-spacing-s, 12px) var(--emerald-spacing-l, 20px);
    margin: var(--emerald-spacing-s, 12px) 0 0;
    padding: 0;
    list-style: none;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-payments__legend li {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .adm-payments__dot {
    width: 10px;
    height: 10px;
    border-radius: 3px;
    background: var(--emerald-primary-800, #01603a);
  }

  .adm-payments__dot[data-tone='mid'] {
    background: var(--emerald-primary-600, #1fae60);
  }

  .adm-payments__dot[data-tone='light'] {
    background: var(--emerald-primary-500, #26c26d);
  }

  .adm-payments__dot[data-tone='pale'] {
    background: var(--emerald-primary-300, #baedd0);
  }

  /* .emerald-card__header is flex-direction: column — a title/action row has to
     opt back into row explicitly. */
  .adm-payments__toolbar {
    display: flex;
    flex-direction: row;
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
    width: 240px;
  }

  .adm-payments__status-select {
    width: 120px;
  }

  .adm-payments__table-wrap {
    overflow-x: auto;
    margin-inline: calc(-1 * var(--emerald-spacing-l, 20px));
  }

  .adm-payments__table th:first-child,
  .adm-payments__table td:first-child,
  .adm-payments__mini-table th:first-child,
  .adm-payments__mini-table td:first-child {
    padding-left: var(--emerald-spacing-l, 20px);
  }

  .adm-payments__table th:last-child,
  .adm-payments__table td:last-child,
  .adm-payments__mini-table th:last-child,
  .adm-payments__mini-table td:last-child {
    padding-right: var(--emerald-spacing-l, 20px);
  }

  .adm-payments__table tbody tr,
  .adm-payments__mini-table tbody tr {
    transition: background-color 120ms ease;
  }

  .adm-payments__table tbody tr:hover,
  .adm-payments__mini-table tbody tr:hover {
    background: var(--emerald-neutral-200, #f6f8fa);
  }

  .adm-payments__page-gap {
    padding: 0 var(--emerald-spacing-2xs, 4px);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-payments__table,
  .adm-payments__mini-table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--emerald-text-b2-size, 14px);
    white-space: nowrap;
  }

  .adm-payments__table th,
  .adm-payments__mini-table th {
    padding: var(--emerald-spacing-xs, 8px) var(--emerald-spacing-s, 12px);
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 600;
    text-align: left;
    border-bottom: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
  }

  .adm-payments__table td,
  .adm-payments__mini-table td {
    padding: var(--emerald-spacing-s, 12px);
    border-bottom: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-200, #f6f8fa);
  }

  .adm-payments__mini-table td strong {
    display: block;
  }

  .adm-payments__mini-table td span {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
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

  .adm-payments__trio {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--emerald-spacing-m, 16px);
  }

  .adm-payments__trio .emerald-card__body {
    display: flex;
    flex: 1;
    flex-direction: column;
  }

  .adm-payments__methods,
  .adm-payments__payouts,
  .adm-payments__failures {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
    gap: var(--emerald-spacing-m, 16px);
    margin: var(--emerald-spacing-xs, 8px) 0 0;
    padding: 0;
    list-style: none;
  }

  .adm-payments__methods li,
  .adm-payments__payouts li,
  .adm-payments__failures li {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-payments__method-text,
  .adm-payments__payout-text,
  .adm-payments__failure-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-payments__method-text strong,
  .adm-payments__payout-text strong,
  .adm-payments__failure-text strong {
    color: var(--emerald-on-surface, #2b2d2e);
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-payments__method-value {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 600;
  }

  .adm-payments__method-bar {
    display: block;
    width: 72px;
    height: 5px;
    border-radius: 3px;
    background: var(--emerald-neutral-200, #f6f8fa);
    overflow: hidden;
  }

  .adm-payments__method-bar span {
    display: block;
    height: 100%;
    background: var(--emerald-primary-600, #1fae60);
  }

  .adm-payments__payout-value {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-payments__payout-value strong {
    color: var(--emerald-on-surface, #2b2d2e);
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-payments__failure-value {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
    font-size: var(--emerald-text-b2-size, 14px);
  }

  @media (max-width: 1200px) {
    .adm-payments__summary {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .adm-payments__summary > div:nth-child(3) {
      padding-left: 0;
      border-left: 0;
    }

    .adm-payments__trio {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .adm-payments__summary {
      grid-template-columns: 1fr;
    }

    .adm-payments__summary > div {
      padding-left: 0;
      border-left: 0;
    }

    .adm-payments__search {
      width: 100%;
    }
  }
</style>
