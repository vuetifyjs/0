<!--
  Datatable showcase — the one page in this wave that exercises v0's data-layer
  composables directly rather than static markup. createDataTable wires real
  sort / filter / pagination / selection; see GAPS.md's "Data table sort /
  column filter / column visibility" row — v0 has no primitive gap here, this
  is a real build.

  The dataset is the sponsorship ledger: who funds the ecosystem, on which
  channel, at what monthly amount. It is the domain the table composables get
  exercised against most honestly — money sorts, tiers group, renewals expire.
-->
<script setup lang="ts">
  import {
    EmButton,
    EmCard,
    EmCardBody,
    EmCardHeader,
    EmCheckbox,
    EmIcon,
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
    EmTag,
    EmTextField,
  } from '@paper/emerald'

  // Framework
  import { createDataTable } from '@vuetify/v0'

  // Context
  import EmeraldShell from './EmeraldShell.vue'

  // Utilities
  import { shallowRef, toRef, watch } from 'vue'

  type Tier = 'anchor' | 'sustaining' | 'supporting' | 'community'
  type Renewal = 'active' | 'renewing' | 'lapsed'

  interface Sponsor extends Record<string, unknown> {
    id: number
    org: string
    handle: string
    tier: Tier
    channel: string
    monthly: number
    since: string
    renewal: Renewal
  }

  const roster: Array<[string, string]> = [
    ['Northwind Labs', 'northwind-labs'],
    ['Helios Interactive', 'helios-io'],
    ['Tandem Foundry', 'tandem-foundry'],
    ['Bluepeak Systems', 'bluepeak'],
    ['Cartograph Studio', 'cartograph'],
    ['Meridian Health', 'meridian-hq'],
    ['Foxglove Analytics', 'foxglove'],
    ['Ninebar Software', 'ninebar'],
    ['Ostrich Digital', 'ostrich-digital'],
    ['Quarry & Co', 'quarryco'],
    ['Sundial Robotics', 'sundial-robotics'],
    ['Thicket Media', 'thicketmedia'],
    ['Umbra Security', 'umbra-sec'],
    ['Verdigris Energy', 'verdigris'],
    ['Wavelength Audio', 'wavelength'],
    ['Yardline Logistics', 'yardline'],
    ['Zephyr Freight', 'zephyr-freight'],
    ['Ambergris Bank', 'ambergris'],
    ['Basalt Cloud', 'basaltcloud'],
    ['Cinder Works', 'cinderworks'],
    ['Driftwood Games', 'driftwood'],
    ['Elmtree Education', 'elmtree-ed'],
    ['Flatiron Retail', 'flatiron-retail'],
    ['Gravel Road Co', 'gravelroad'],
  ]

  const tiers: Tier[] = ['anchor', 'sustaining', 'supporting', 'community']
  const channels = ['GitHub Sponsors', 'Open Collective', 'Direct invoice', 'Patreon']
  const renewals: Renewal[] = ['active', 'active', 'renewing', 'active', 'lapsed']
  const base: Record<Tier, number> = { anchor: 2400, sustaining: 900, supporting: 350, community: 120 }

  const sponsors: Sponsor[] = roster.map(([org, handle], index) => {
    const tier = tiers[index % tiers.length]!

    return {
      id: index + 1,
      org,
      handle,
      tier,
      channel: channels[(index * 3) % channels.length]!,
      monthly: base[tier] + ((index * 37) % 11) * 25,
      since: `20${21 + (index % 5)}-${String(((index * 5) % 12) + 1).padStart(2, '0')}-01`,
      renewal: renewals[index % renewals.length]!,
    }
  })

  const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
  const monthYear = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' })

  function joined (iso: string) {
    return monthYear.format(new Date(iso))
  }

  // Ledger-level facts, deliberately independent of the search box — the
  // footer already reports what the current query narrowed things down to.
  const committed = sponsors.reduce((sum, s) => sum + s.monthly, 0)
  const largest = Math.max(...sponsors.map(s => s.monthly))
  const expiring = sponsors.filter(s => s.renewal !== 'active').length

  const search = shallowRef('')
  const itemsPerPage = shallowRef(6)

  const table = createDataTable<Sponsor>({
    pagination: { itemsPerPage },
    selectStrategy: 'page',
  })

  table.columns.onboard([
    { id: 'org', title: 'Sponsor', sortable: true, filterable: true },
    { id: 'tier', title: 'Tier', sortable: true },
    { id: 'channel', title: 'Channel', sortable: true, filterable: true },
    { id: 'monthly', title: 'Monthly', sortable: true },
    { id: 'since', title: 'Member since', sortable: true },
    { id: 'renewal', title: 'Renewal', sortable: true },
    { id: 'actions', title: 'Ledger' },
  ])

  table.onboard(sponsors.map(value => ({ id: value.id, value })))

  const { items, leaves, selection, sort, total } = table
  const { isAllSelected, isMixed } = selection
  const { page, pageStart, pageStop } = table.pagination

  const selected = toRef(() => selection.selectedIds.size)

  // Narrowing the result set or resizing the page can strand the viewer on a
  // page index that no longer exists — send them back to the first page.
  watch(search, value => {
    table.search(value)
    page.value = 1
  })

  watch(itemsPerPage, () => {
    page.value = 1
  })

  const tierLabel: Record<Tier, string> = {
    anchor: 'Anchor',
    sustaining: 'Sustaining',
    supporting: 'Supporting',
    community: 'Community',
  }

  const tierVariant: Record<Tier, 'success' | 'info' | 'neutral'> = {
    anchor: 'success',
    sustaining: 'info',
    supporting: 'info',
    community: 'neutral',
  }

  const renewalLabel: Record<Renewal, string> = {
    active: 'Active',
    renewing: 'Renews this month',
    lapsed: 'Lapsed',
  }
</script>

<template>
  <EmeraldShell>
    <div class="adm-ledger">
      <header class="adm-ledger__head">
        <div>
          <h1 class="adm-ledger__title">Sponsorship ledger</h1>
          <p class="adm-ledger__sub">Every funding commitment on the books, sorted and searched through v0's <code>createDataTable</code>.</p>
        </div>

        <EmTag variant="neutral">Fiscal year 2026</EmTag>
      </header>

      <EmCard variant="simple">
        <EmCardHeader class="adm-ledger__toolbar">
          <dl class="adm-ledger__stats">
            <div class="adm-ledger__stat">
              <dt>Sponsors on file</dt>
              <dd>{{ sponsors.length }}</dd>
            </div>

            <div class="adm-ledger__stat">
              <dt>Committed monthly</dt>
              <dd>{{ money.format(committed) }}</dd>
            </div>

            <div class="adm-ledger__stat">
              <dt>Needs attention</dt>
              <dd>{{ expiring }}</dd>
            </div>
          </dl>

          <div class="adm-ledger__controls">
            <EmTextField
              v-model="search"
              aria-label="Search sponsors and channels"
              class="adm-ledger__search"
              placeholder="Search sponsor or channel…"
            />

            <div class="adm-ledger__rows">
              <span class="adm-ledger__rows-label">Rows</span>

              <EmSelect v-model="itemsPerPage" class="adm-ledger__rows-select">
                <EmSelectActivator>
                  <EmSelectValue />
                </EmSelectActivator>

                <EmSelectContent>
                  <EmSelectItem :value="6">6</EmSelectItem>
                  <EmSelectItem :value="12">12</EmSelectItem>
                  <EmSelectItem :value="24">24</EmSelectItem>
                </EmSelectContent>
              </EmSelect>
            </div>
          </div>
        </EmCardHeader>

        <EmCardBody class="adm-ledger__table-wrap">
          <table class="adm-ledger__table">
            <thead>
              <tr>
                <th class="adm-ledger__pick"><EmCheckbox aria-label="Select all on page" :indeterminate="isMixed" :model-value="isAllSelected" @update:model-value="selection.toggleAll()" /></th>

                <th v-for="col in leaves" :key="col.id" :class="`adm-ledger__col-${col.id}`">
                  <button
                    v-if="col.sortable"
                    class="adm-ledger__sort"
                    type="button"
                    @click="sort.toggle(String(col.id))"
                  >
                    {{ col.title }}
                    <EmIcon
                      class="adm-ledger__sort-icon"
                      :data-direction="sort.direction(String(col.id))"
                      name="sort"
                    />
                  </button>

                  <template v-else>{{ col.title }}</template>
                </th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="row in items" :key="row.id" :data-tier="row.tier">
                <td class="adm-ledger__pick"><EmCheckbox :aria-label="`Select ${row.org}`" :model-value="selection.isSelected(row.id)" @update:model-value="selection.toggle(row.id)" /></td>

                <td>
                  <span class="adm-ledger__org">
                    <strong>{{ row.org }}</strong>
                    <span class="adm-ledger__handle">@{{ row.handle }}</span>
                  </span>
                </td>

                <td><EmTag :variant="tierVariant[row.tier]">{{ tierLabel[row.tier] }}</EmTag></td>
                <td class="adm-ledger__channel">{{ row.channel }}</td>

                <td>
                  <span class="adm-ledger__amount">
                    <strong>{{ money.format(row.monthly) }}</strong>

                    <EmProgress
                      :aria-label="`${row.org} share of the largest commitment`"
                      class="adm-ledger__share"
                      :max="largest"
                      :model-value="row.monthly"
                      size="sm"
                    />
                  </span>
                </td>

                <td class="adm-ledger__since">{{ joined(row.since) }}</td>

                <td>
                  <span class="adm-ledger__renewal" :data-renewal="row.renewal">{{ renewalLabel[row.renewal] }}</span>
                </td>

                <td>
                  <EmButton size="sm" variant="tertiary">Open</EmButton>
                </td>
              </tr>

              <tr v-if="items.length === 0">
                <td class="adm-ledger__empty" :colspan="leaves.length + 1">Nothing on the ledger matches "{{ search }}".</td>
              </tr>
            </tbody>
          </table>
        </EmCardBody>

        <div class="adm-ledger__foot">
          <EmPagination v-model="page" :items-per-page :size="total">
            <EmPaginationPrev><EmIcon name="chevron-left" size="s" /> Previous</EmPaginationPrev>
            <EmPaginationItem v-for="n in table.pagination.pages" :key="n" :value="n" />
            <EmPaginationNext>Next <EmIcon name="chevron-right" size="s" /></EmPaginationNext>
          </EmPagination>

          <span class="adm-ledger__count">
            <template v-if="selected > 0">{{ selected }} selected &middot; </template>
            {{ total === 0 ? 0 : pageStart + 1 }}&ndash;{{ pageStop }} of {{ total }}
          </span>
        </div>
      </EmCard>
    </div>
  </EmeraldShell>
</template>

<style>
  .adm-ledger {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-l, 20px);
  }

  .adm-ledger .emerald-card {
    background: var(--emerald-background, #fefefe);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    border-radius: var(--emerald-radius-xl, 12px);
    box-shadow: var(--emerald-shadow-s, 0 0 2px 0 rgba(51, 51, 51, 0.08));
  }

  .adm-ledger__head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--emerald-spacing-m, 16px);
  }

  .adm-ledger__title {
    margin: 0;
    font-size: clamp(1.375rem, 2vw, 1.625rem);
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--emerald-on-surface, #2b2d2e);
  }

  .adm-ledger__sub {
    margin: 4px 0 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b1-size, 16px);
  }

  .adm-ledger__sub code {
    padding: 1px 5px;
    border-radius: var(--emerald-radius-xs, 4px);
    background: var(--emerald-neutral-200, #f6f8fa);
    font-size: 0.9em;
  }

  /* Two stacked bands: ledger totals on top, the live controls beneath them. */
  .adm-ledger__toolbar {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-m, 16px);
    margin-bottom: 0;
    padding: var(--emerald-spacing-m, 16px);
    border-bottom: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
  }

  .adm-ledger__stats {
    display: flex;
    flex-wrap: wrap;
    gap: var(--emerald-spacing-l, 20px);
    margin: 0;
  }

  .adm-ledger__stat {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding-inline-start: var(--emerald-spacing-s, 12px);
    border-inline-start: 2px solid var(--emerald-neutral-300, #ccd6e7);
  }

  .adm-ledger__stat dt {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .adm-ledger__stat dd {
    margin: 0;
    font-size: var(--emerald-text-b1-size, 16px);
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  .adm-ledger__controls {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-ledger__search {
    flex: 1;
    min-width: 0;
  }

  .adm-ledger__rows {
    display: flex;
    align-items: center;
    flex: none;
    gap: var(--emerald-spacing-xs, 8px);
  }

  .adm-ledger__rows-label {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-ledger__rows-select {
    width: 76px;
  }

  .adm-ledger__table-wrap {
    overflow-x: auto;
  }

  .adm-ledger__table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--emerald-text-b2-size, 14px);
    white-space: nowrap;
  }

  .adm-ledger__table th {
    padding: var(--emerald-spacing-xs, 8px) var(--emerald-spacing-s, 12px);
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 600;
    text-align: left;
    border-bottom: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
  }

  .adm-ledger__table td {
    padding: var(--emerald-spacing-s, 12px);
    vertical-align: middle;
    border-bottom: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-200, #f6f8fa);
  }

  .adm-ledger__table tbody tr:last-child td {
    border-bottom: none;
  }

  .adm-ledger__table tbody tr:hover td {
    background: var(--emerald-neutral-200, #f6f8fa);
  }

  /* The tier reads off a leading rail rather than a second status pill. */
  .adm-ledger__pick {
    width: 1%;
    border-inline-start: 3px solid transparent;
  }

  .adm-ledger__table tbody tr[data-tier='anchor'] .adm-ledger__pick {
    border-inline-start-color: var(--emerald-primary-600, #1fae60);
  }

  .adm-ledger__table tbody tr[data-tier='sustaining'] .adm-ledger__pick {
    border-inline-start-color: var(--emerald-primary-400, #6fdca4);
  }

  .adm-ledger__table tbody tr[data-tier='supporting'] .adm-ledger__pick {
    border-inline-start-color: var(--emerald-neutral-400, #aeb6be);
  }

  .adm-ledger__table tbody tr[data-tier='community'] .adm-ledger__pick {
    border-inline-start-color: var(--emerald-neutral-300, #ccd6e7);
  }

  .adm-ledger__sort {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin: 0;
    padding: 0;
    border: none;
    background: none;
    color: inherit;
    font: inherit;
    font-weight: 600;
    cursor: pointer;
  }

  .adm-ledger__sort:hover {
    color: var(--emerald-on-surface, #2b2d2e);
  }

  /* Compact enough to sit inside the header text; below the icon scale. */
  .adm-ledger__sort-icon {
    --emerald-icon-size: 12px;
    --emerald-icon-stroke: 2;
    opacity: 0.4;
  }

  .adm-ledger__sort-icon[data-direction='asc'] {
    opacity: 1;
    transform: scaleY(-1);
  }

  .adm-ledger__sort-icon[data-direction='desc'] {
    opacity: 1;
  }

  .adm-ledger__org strong {
    display: block;
    line-height: 20px;
  }

  .adm-ledger__handle {
    display: block;
    color: var(--emerald-on-surface-variant, #757e85);
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: var(--emerald-text-b3-size, 12px);
    line-height: 16px;
  }

  .adm-ledger__channel,
  .adm-ledger__since {
    color: var(--emerald-on-surface-variant, #757e85);
  }

  /* The money column carries its own share bar, so the figure reads as a
     position in the ledger rather than a loose number. */
  .adm-ledger__amount {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 120px;
  }

  .adm-ledger__amount strong {
    font-variant-numeric: tabular-nums;
  }

  .adm-ledger__share {
    width: 100%;
  }

  .adm-ledger__renewal {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-ledger__renewal::before {
    content: '';
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: currentColor;
  }

  .adm-ledger__renewal[data-renewal='active'] {
    color: var(--emerald-primary-700, #027d4c);
  }

  .adm-ledger__renewal[data-renewal='lapsed'] {
    color: var(--emerald-danger-600, #a1000e);
  }

  .adm-ledger__empty {
    padding: var(--emerald-spacing-l, 20px) !important;
    text-align: center;
    color: var(--emerald-on-surface-variant, #757e85);
  }

  /* Mirrored from the usual count-then-pager order. */
  .adm-ledger__foot {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: var(--emerald-spacing-s, 12px);
    padding: var(--emerald-spacing-m, 16px);
    border-top: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
  }

  .adm-ledger__count {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
    font-variant-numeric: tabular-nums;
  }

  .adm-ledger__foot .emerald-pagination__prev,
  .adm-ledger__foot .emerald-pagination__next {
    white-space: nowrap;
  }

  @media (max-width: 640px) {
    .adm-ledger__head {
      flex-direction: column;
    }

    .adm-ledger__controls {
      flex-wrap: wrap;
    }

    .adm-ledger__search {
      flex-basis: 100%;
    }

    .adm-ledger__foot {
      flex-direction: column-reverse;
      justify-content: center;
    }
  }
</style>
