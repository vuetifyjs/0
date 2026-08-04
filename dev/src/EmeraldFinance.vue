<!--
  The stacked revenue columns, runway meter and tier bars render as static CSS
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

  // Monthly funding in thousands, split by where the money comes from.
  const revenue = [
    { month: 'Jan', corporate: 18, backers: 6, licenses: 9 },
    { month: 'Feb', corporate: 21, backers: 6, licenses: 11 },
    { month: 'Mar', corporate: 22, backers: 7, licenses: 12 },
    { month: 'Apr', corporate: 24, backers: 7, licenses: 14 },
    { month: 'May', corporate: 26, backers: 8, licenses: 15 },
    { month: 'Jun', corporate: 28, backers: 8, licenses: 17 },
    { month: 'Jul', corporate: 31, backers: 9, licenses: 19 },
  ]

  const peak = Math.max(...revenue.map(month => month.corporate + month.backers + month.licenses))

  const ytd = [
    { label: 'Corporate sponsors', value: '$170K', tone: 'deep' as const },
    { label: 'Individual backers', value: '$51K', tone: 'mid' as const },
    { label: 'Commercial licenses', value: '$97K', tone: 'pale' as const },
  ]

  const tiers = [
    { label: 'Platinum', detail: '3 sponsors · $5,000', amount: '$15,000', pct: 100 },
    { label: 'Gold', detail: '6 sponsors · $1,500', amount: '$9,000', pct: 60 },
    { label: 'Silver', detail: '12 sponsors · $400', amount: '$4,800', pct: 32 },
    { label: 'Bronze', detail: '22 sponsors · $100', amount: '$2,200', pct: 15 },
  ]

  const expenses = [
    { label: 'Maintainer stipends', amount: '$19,400', pct: 100 },
    { label: 'Design contracts', amount: '$5,200', pct: 27 },
    { label: 'Infrastructure & CDN', amount: '$4,900', pct: 25 },
    { label: 'Events & travel', amount: '$2,800', pct: 14 },
    { label: 'Legal & accounting', amount: '$1,900', pct: 10 },
  ]

  const search = shallowRef('')
  const tier = shallowRef('all')
  const cadence = shallowRef('all')
  const status = shallowRef('all')
  const page = shallowRef(1)

  type Status = 'active' | 'pending' | 'lapsed'
  type Sponsor = { org: string, contact: string, tier: string, cadence: string, monthly: string, since: string, status: Status }

  const seed: Sponsor[] = [
    { org: 'Northwind Labs', contact: 'Priya Raghunathan', tier: 'Platinum', cadence: 'Annual', monthly: '$5,000', since: 'Mar 2024', status: 'active' },
    { org: 'Palisade Bank', contact: 'Ingrid Solberg', tier: 'Platinum', cadence: 'Annual', monthly: '$5,000', since: 'Jan 2025', status: 'active' },
    { org: 'Kestrel Analytics', contact: 'Tomas Lindqvist', tier: 'Gold', cadence: 'Monthly', monthly: '$1,500', since: 'Aug 2025', status: 'active' },
    { org: 'Foundry Nine', contact: 'Adaeze Okonkwo', tier: 'Gold', cadence: 'Annual', monthly: '$1,500', since: 'Nov 2024', status: 'pending' },
    { org: 'Vellum Press', contact: 'Ravi Menon', tier: 'Silver', cadence: 'Monthly', monthly: '$400', since: 'Feb 2026', status: 'active' },
    { org: 'Copperline Studio', contact: 'Hugo Bellamy', tier: 'Bronze', cadence: 'Monthly', monthly: '$100', since: 'Apr 2026', status: 'lapsed' },
    { org: 'Ardent Robotics', contact: 'Mira Kovac', tier: 'Silver', cadence: 'Annual', monthly: '$400', since: 'Jun 2025', status: 'active' },
    { org: 'Lumen Grid', contact: 'Dmitri Sokolov', tier: 'Bronze', cadence: 'Monthly', monthly: '$100', since: 'Jan 2026', status: 'pending' },
  ]

  const sponsors: Sponsor[] = Array.from({ length: 24 }, (_, index) => {
    const base = seed[index % seed.length]!
    const run = Math.floor(index / seed.length)

    return run === 0 ? base : { ...base, org: `${base.org} ${['', 'EU', 'APAC'][run]}`.trim() }
  })

  type Option = { value: string, label: string }

  const tierOptions: Option[] = [
    { value: 'all', label: 'All tiers' },
    { value: 'Platinum', label: 'Platinum' },
    { value: 'Gold', label: 'Gold' },
    { value: 'Silver', label: 'Silver' },
    { value: 'Bronze', label: 'Bronze' },
  ]

  const cadenceOptions: Option[] = [
    { value: 'all', label: 'Any cycle' },
    { value: 'Monthly', label: 'Monthly' },
    { value: 'Annual', label: 'Annual' },
  ]

  const statusOptions: Option[] = [
    { value: 'all', label: 'Any state' },
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'lapsed', label: 'Lapsed' },
  ]

  function label (list: Option[], value: string) {
    return list.find(option => option.value === value)?.label ?? value
  }

  const filter = createFilter({ keys: ['org', 'contact', 'tier'] })
  const found = filter.apply(search, sponsors)

  const filtered = toRef(() => found.items.value.filter(sponsor =>
    (tier.value === 'all' || sponsor.tier === tier.value)
    && (cadence.value === 'all' || sponsor.cadence === cadence.value)
    && (status.value === 'all' || sponsor.status === status.value),
  ))

  const pagination = createPagination({ page, size: () => filtered.value.length, itemsPerPage: 6 })
  const rows = toRef(() => filtered.value.slice(pagination.pageStart.value, pagination.pageStop.value))

  function initials (name: string) {
    return name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase()
  }
</script>

<template>
  <EmeraldShell>
    <div class="adm-finance" data-theme="emerald">
      <header class="adm-finance__header">
        <h1 class="adm-finance__title">Sponsorships &amp; runway</h1>
        <p class="adm-finance__subtitle">Who funds the project, and how long the money lasts</p>
      </header>

      <div class="adm-finance__layout">
        <div class="adm-finance__main">
          <EmCard variant="simple">
            <EmCardHeader class="adm-finance__chart-head">
              <div>
                <EmCardTitle class="adm-finance__panel-title">Funding by source</EmCardTitle>
                <p class="adm-finance__panel-sub">Monthly inflow, year to date</p>
              </div>

              <span class="adm-finance__headline">
                $59K
                <em class="adm-finance__delta" data-up>+11.3% MoM</em>
              </span>
            </EmCardHeader>

            <EmCardBody>
              <div aria-label="Monthly funding by source" class="adm-finance__chart" role="img">
                <div v-for="month in revenue" :key="month.month" class="adm-finance__column">
                  <span class="adm-finance__stack">
                    <span class="adm-finance__seg" data-tone="pale" :style="{ height: (month.licenses / peak) * 100 + '%' }" />
                    <span class="adm-finance__seg" data-tone="mid" :style="{ height: (month.backers / peak) * 100 + '%' }" />
                    <span class="adm-finance__seg" data-tone="deep" :style="{ height: (month.corporate / peak) * 100 + '%' }" />
                  </span>

                  <span class="adm-finance__column-total">${{ month.corporate + month.backers + month.licenses }}K</span>
                  <span class="adm-finance__column-label">{{ month.month }}</span>
                </div>
              </div>

              <ul class="adm-finance__ytd">
                <li v-for="row in ytd" :key="row.label">
                  <span class="adm-finance__dot" :data-tone="row.tone" />
                  <span>{{ row.label }}</span>
                  <strong>{{ row.value }}</strong>
                </li>
              </ul>
            </EmCardBody>
          </EmCard>

          <EmCard variant="simple">
            <EmCardHeader class="adm-finance__toolbar">
              <EmCardTitle class="adm-finance__panel-title">Sponsor ledger</EmCardTitle>

              <div class="adm-finance__filters">
                <EmTextField v-model="search" aria-label="Search sponsors" class="adm-finance__search" placeholder="Search sponsor" />

                <EmSelect v-model="tier" class="adm-finance__select">
                  <EmSelectActivator>
                    <EmSelectValue v-slot="{ selectedValue }">{{ label(tierOptions, String(selectedValue)) }}</EmSelectValue>
                  </EmSelectActivator>

                  <EmSelectContent>
                    <EmSelectItem v-for="option in tierOptions" :key="option.value" :value="option.value">{{ option.label }}</EmSelectItem>
                  </EmSelectContent>
                </EmSelect>

                <EmSelect v-model="cadence" class="adm-finance__select">
                  <EmSelectActivator>
                    <EmSelectValue v-slot="{ selectedValue }">{{ label(cadenceOptions, String(selectedValue)) }}</EmSelectValue>
                  </EmSelectActivator>

                  <EmSelectContent>
                    <EmSelectItem v-for="option in cadenceOptions" :key="option.value" :value="option.value">{{ option.label }}</EmSelectItem>
                  </EmSelectContent>
                </EmSelect>

                <EmSelect v-model="status" class="adm-finance__select">
                  <EmSelectActivator>
                    <EmSelectValue v-slot="{ selectedValue }">{{ label(statusOptions, String(selectedValue)) }}</EmSelectValue>
                  </EmSelectActivator>

                  <EmSelectContent>
                    <EmSelectItem v-for="option in statusOptions" :key="option.value" :value="option.value">{{ option.label }}</EmSelectItem>
                  </EmSelectContent>
                </EmSelect>
              </div>
            </EmCardHeader>

            <EmCardBody class="adm-finance__table-wrap">
              <table class="adm-finance__table">
                <thead>
                  <tr>
                    <th><EmCheckbox aria-label="Select all" /></th>
                    <th>Sponsor</th>
                    <th>Tier</th>
                    <th>Cycle</th>
                    <th>Monthly</th>
                    <th>State</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="sponsor in rows" :key="sponsor.org + sponsor.contact">
                    <td><EmCheckbox :aria-label="`Select ${sponsor.org}`" /></td>

                    <td>
                      <div class="adm-finance__client">
                        <EmAvatar size="sm"><EmAvatarFallback>{{ initials(sponsor.org) }}</EmAvatarFallback></EmAvatar>
                        <span><strong>{{ sponsor.org }}</strong><span class="adm-finance__client-sub">{{ sponsor.contact }}</span></span>
                      </div>
                    </td>

                    <td>{{ sponsor.tier }}</td>
                    <td>{{ sponsor.cadence }}</td>
                    <td>{{ sponsor.monthly }}</td>

                    <td>
                      <EmTag :variant="sponsor.status === 'active' ? 'success' : sponsor.status === 'pending' ? 'info' : 'danger'">
                        {{ sponsor.status === 'active' ? 'Active' : sponsor.status === 'pending' ? 'Pending' : 'Lapsed' }}
                      </EmTag>
                    </td>
                  </tr>
                </tbody>
              </table>
            </EmCardBody>

            <EmCardFooter class="adm-finance__table-foot">
              <span class="adm-finance__table-count">
                Showing {{ filtered.length > 0 ? pagination.pageStart.value + 1 : 0 }} to {{ pagination.pageStop.value }} of {{ filtered.length }} sponsors
              </span>

              <EmPagination v-model="page" :items-per-page="6" :size="filtered.length">
                <template #default="{ items }">
                  <EmPaginationPrev>‹ Previous</EmPaginationPrev>

                  <template v-for="(item, index) in items" :key="index">
                    <EmPaginationItem v-if="item.type === 'page'" :value="item.value" />
                    <span v-else class="adm-finance__page-gap">{{ item.value }}</span>
                  </template>

                  <EmPaginationNext>Next ›</EmPaginationNext>
                </template>
              </EmPagination>
            </EmCardFooter>
          </EmCard>
        </div>

        <aside class="adm-finance__rail">
          <EmCard variant="simple">
            <EmCardHeader>
              <EmCardTitle class="adm-finance__panel-title">Runway</EmCardTitle>
            </EmCardHeader>

            <EmCardBody>
              <span class="adm-finance__runway">14.2 <small>months</small></span>

              <div aria-label="Runway consumed" class="adm-finance__meter" role="img">
                <span style="width: 28%" />
              </div>

              <ul class="adm-finance__runway-facts">
                <li><span>In the bank</span><strong>$486,000</strong></li>
                <li><span>Monthly burn</span><strong>$34,200</strong></li>
                <li><span>Monthly inflow</span><strong>$59,000</strong></li>
              </ul>

              <EmButton class="adm-finance__cta" size="sm" variant="tertiary">Open forecast</EmButton>
            </EmCardBody>
          </EmCard>

          <EmCard variant="simple">
            <EmCardHeader>
              <EmCardTitle class="adm-finance__panel-title">Corporate tiers</EmCardTitle>
              <p class="adm-finance__panel-sub">$31,000 committed each month</p>
            </EmCardHeader>

            <EmCardBody>
              <ul class="adm-finance__bars">
                <li v-for="row in tiers" :key="row.label">
                  <span class="adm-finance__bar-text">
                    <strong>{{ row.label }}</strong>
                    <span>{{ row.detail }}</span>
                  </span>

                  <span class="adm-finance__bar-value">
                    {{ row.amount }}
                    <span class="adm-finance__bar-track"><span :style="{ width: row.pct + '%' }" /></span>
                  </span>
                </li>
              </ul>
            </EmCardBody>
          </EmCard>

          <EmCard variant="simple">
            <EmCardHeader>
              <EmCardTitle class="adm-finance__panel-title">Where it goes</EmCardTitle>
              <p class="adm-finance__panel-sub">$34,200 monthly burn</p>
            </EmCardHeader>

            <EmCardBody>
              <ul class="adm-finance__bars">
                <li v-for="row in expenses" :key="row.label">
                  <span class="adm-finance__bar-text">
                    <strong>{{ row.label }}</strong>
                  </span>

                  <span class="adm-finance__bar-value">
                    {{ row.amount }}
                    <span class="adm-finance__bar-track"><span :style="{ width: row.pct + '%' }" /></span>
                  </span>
                </li>
              </ul>
            </EmCardBody>
          </EmCard>
        </aside>
      </div>
    </div>
  </EmeraldShell>
</template>

<style>
  .adm-finance {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-l, 20px);
  }

  /* EmCard variant="simple" ships 2px padding and its slots add none, so every
     card needs its own inset — see the EmCard padding gap row. */
  .adm-finance .emerald-card {
    padding: var(--emerald-spacing-l, 20px);
    background: var(--emerald-background, #fefefe);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    border-radius: var(--emerald-radius-xl, 12px);
    box-shadow: var(--emerald-shadow-s, 0 0 2px 0 rgba(51, 51, 51, 0.08));
  }

  .adm-finance__title {
    margin: 0;
    font-size: clamp(1.375rem, 2vw, 1.625rem);
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .adm-finance__subtitle {
    margin: 0.25rem 0 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b1-size, 16px);
  }

  .adm-finance__panel-title {
    font-size: var(--emerald-text-b1-size, 16px) !important;
    font-weight: 700 !important;
  }

  .adm-finance__panel-sub {
    margin: 2px 0 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-finance__delta {
    font-style: normal;
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 600;
    color: var(--emerald-danger-500, #c61424);
  }

  .adm-finance__delta[data-up] {
    color: var(--emerald-primary-700, #027d4c);
  }

  .adm-finance__layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 320px);
    align-items: start;
    gap: var(--emerald-spacing-m, 16px);
  }

  .adm-finance__main,
  .adm-finance__rail {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-m, 16px);
    min-width: 0;
  }

  /* .emerald-card__header is flex-direction: column — a title/action row has to
     opt back into row explicitly. */
  .adm-finance__chart-head,
  .adm-finance__toolbar {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-finance__headline {
    display: flex;
    align-items: baseline;
    gap: 8px;
    font-size: 1.75rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .adm-finance__chart {
    display: flex;
    align-items: flex-end;
    gap: var(--emerald-spacing-s, 12px);
    height: 220px;
    margin-top: var(--emerald-spacing-xs, 8px);
  }

  .adm-finance__column {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    gap: 4px;
    height: 100%;
  }

  .adm-finance__stack {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: flex-end;
    width: 60%;
    min-width: 18px;
    border-radius: var(--emerald-radius-xs, 4px);
    overflow: hidden;
  }

  .adm-finance__seg {
    display: block;
    background: var(--emerald-primary-800, #01603a);
  }

  .adm-finance__seg[data-tone='mid'] {
    background: var(--emerald-primary-500, #26c26d);
  }

  .adm-finance__seg[data-tone='pale'] {
    background: var(--emerald-primary-300, #baedd0);
  }

  .adm-finance__column-total {
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 600;
  }

  .adm-finance__column-label {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-finance__ytd {
    display: flex;
    flex-wrap: wrap;
    gap: var(--emerald-spacing-s, 12px) var(--emerald-spacing-l, 20px);
    margin: var(--emerald-spacing-m, 16px) 0 0;
    padding: 0;
    list-style: none;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-finance__ytd li {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .adm-finance__ytd strong {
    color: var(--emerald-on-surface, #2b2d2e);
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-finance__dot {
    width: 10px;
    height: 10px;
    border-radius: 3px;
    background: var(--emerald-primary-800, #01603a);
  }

  .adm-finance__dot[data-tone='mid'] {
    background: var(--emerald-primary-500, #26c26d);
  }

  .adm-finance__dot[data-tone='pale'] {
    background: var(--emerald-primary-300, #baedd0);
  }

  .adm-finance__filters {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--emerald-spacing-xs, 8px);
  }

  .adm-finance__search {
    width: 180px;
  }

  .adm-finance__select {
    width: 124px;
  }

  .adm-finance__table-wrap {
    overflow-x: auto;
    margin-inline: calc(-1 * var(--emerald-spacing-l, 20px));
  }

  .adm-finance__table th:first-child,
  .adm-finance__table td:first-child {
    padding-left: var(--emerald-spacing-l, 20px);
  }

  .adm-finance__table th:last-child,
  .adm-finance__table td:last-child {
    padding-right: var(--emerald-spacing-l, 20px);
  }

  .adm-finance__table tbody tr {
    transition: background-color 120ms ease;
  }

  .adm-finance__table tbody tr:hover {
    background: var(--emerald-neutral-200, #f6f8fa);
  }

  .adm-finance__table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--emerald-text-b2-size, 14px);
    white-space: nowrap;
  }

  .adm-finance__table th {
    padding: var(--emerald-spacing-xs, 8px) var(--emerald-spacing-s, 12px);
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 600;
    text-align: left;
    border-bottom: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
  }

  .adm-finance__table td {
    padding: var(--emerald-spacing-s, 12px);
    border-bottom: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-200, #f6f8fa);
  }

  .adm-finance__client {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-xs, 8px);
  }

  .adm-finance__client strong {
    display: block;
  }

  .adm-finance__client-sub {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-finance__table-foot {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-finance__table-count {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-finance__page-gap {
    padding: 0 var(--emerald-spacing-2xs, 4px);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-finance__runway {
    display: block;
    font-size: 2.5rem;
    font-weight: 700;
    letter-spacing: -0.03em;
  }

  .adm-finance__runway small {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b2-size, 14px);
    font-weight: 600;
    letter-spacing: 0;
  }

  .adm-finance__meter {
    height: 12px;
    margin: var(--emerald-spacing-s, 12px) 0;
    border-radius: 6px;
    background: var(--emerald-primary-100, #e7fff2);
    overflow: hidden;
  }

  .adm-finance__meter span {
    display: block;
    height: 100%;
    border-radius: 6px;
    background: var(--emerald-primary-600, #1fae60);
  }

  .adm-finance__runway-facts {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-xs, 8px);
    margin: 0;
    padding: 0;
    list-style: none;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-finance__runway-facts li {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-finance__runway-facts strong {
    color: var(--emerald-on-surface, #2b2d2e);
  }

  .adm-finance__cta {
    width: 100%;
    margin-top: var(--emerald-spacing-m, 16px);
  }

  .adm-finance__bars {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-s, 12px);
    margin: var(--emerald-spacing-xs, 8px) 0 0;
    padding: 0;
    list-style: none;
  }

  .adm-finance__bars li {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-finance__bar-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-finance__bar-text strong {
    color: var(--emerald-on-surface, #2b2d2e);
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-finance__bar-value {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 600;
  }

  .adm-finance__bar-track {
    display: block;
    width: 76px;
    height: 5px;
    border-radius: 3px;
    background: var(--emerald-neutral-200, #f6f8fa);
    overflow: hidden;
  }

  .adm-finance__bar-track span {
    display: block;
    height: 100%;
    background: var(--emerald-primary-600, #1fae60);
  }

  @media (max-width: 1200px) {
    .adm-finance__layout {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .adm-finance__search,
    .adm-finance__select {
      width: 100%;
    }

    .adm-finance__chart {
      gap: 6px;
      height: 180px;
    }

    .adm-finance__column-total {
      font-size: 10px;
    }
  }
</style>
