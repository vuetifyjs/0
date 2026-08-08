<!--
  Listing thumbnails use the dashed hatch paint texture from EmeraldDashboard;
  category bars render as static CSS fills (real data, no charting library) —
  same GAP_CONTRACT precedent as EmeraldSales. Availability toggles use
  EmSwitch (real interactive state, no gap).
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

  // Framework
  import { createFilter, createPagination } from '@vuetify/v0'

  // Context
  import EmeraldShell from './EmeraldShell.vue'

  // Utilities
  import { ref, shallowRef, toRef } from 'vue'

  const featured = [
    { name: 'Emerald Pro Admin', author: 'Copperline Studio', price: '$149', sales: '1,842', rating: '4.8', angle: -12 },
    { name: 'Onyx Studio Kit', author: 'Ardent Robotics', price: '$189', sales: '964', rating: '4.9', angle: 18 },
    { name: 'Helix Docs Theme', author: 'Vellum Press', price: '$79', sales: '2,318', rating: '4.6', angle: -34 },
    { name: 'Prism Icon Set', author: 'Saltmarsh Digital', price: '$49', sales: '3,470', rating: '4.7', angle: 42 },
  ]

  const queueTab = shallowRef('pending')

  const queues: Record<string, Array<{ name: string, author: string, when: string, note: string }>> = {
    pending: [
      { name: 'Basalt Dashboard Kit', author: 'Yuki Tanabe', when: '2 days ago', note: 'Awaiting a11y pass' },
      { name: 'Tidewater Charts Pack', author: 'Oscar Delaney', when: '4 days ago', note: 'Awaiting a11y pass' },
      { name: 'Quarry Form Blocks', author: 'Lena Fischer', when: '6 days ago', note: 'Licence check queued' },
      { name: 'Meridian Table Kit', author: 'Sam Okoro', when: '9 days ago', note: 'Second reviewer needed' },
    ],
    live: [
      { name: 'Lumen Grid Layouts', author: 'Dmitri Sokolov', when: '11 Jul', note: '412 sales so far' },
      { name: 'Vellum Blog Theme', author: 'Ravi Menon', when: '02 Jul', note: '866 sales so far' },
      { name: 'Kestrel Chart Blocks', author: 'Tomas Lindqvist', when: '24 Jun', note: '1,205 sales so far' },
      { name: 'Foundry Auth Screens', author: 'Adaeze Okonkwo', when: '18 Jun', note: '338 sales so far' },
    ],
    rejected: [
      { name: 'Neon Admin Bundle', author: 'Wren Ashby', when: '28 Jul', note: 'Bundled unlicensed fonts' },
      { name: 'Emerald Pro Reskin', author: 'Anya Petrova', when: '21 Jul', note: 'Derivative listing' },
      { name: 'Rapid Widget Pack', author: 'Ilse Brandt', when: '14 Jul', note: 'Fails contrast baseline' },
    ],
  }

  const queue = toRef(() => queues[queueTab.value] ?? [])

  const revenue = [
    { label: 'Admin templates', amount: '$184K', pct: 100 },
    { label: 'Component kits', amount: '$126K', pct: 68 },
    { label: 'Docs themes', amount: '$74K', pct: 40 },
    { label: 'Icon sets', amount: '$41K', pct: 22 },
    { label: 'Blocks & snippets', amount: '$28K', pct: 15 },
  ]

  const category = shallowRef('all')
  const availability = shallowRef('all')
  const status = shallowRef('all')
  const search = shallowRef('')
  const show = shallowRef('5')
  const page = shallowRef(1)

  type Listing = {
    id: string
    name: string
    author: string
    category: string
    price: string
    sales: number
    availability: string
    status: 'Live' | 'Draft' | 'Retired'
  }

  const seed: Listing[] = [
    { id: 'MP-4101', name: 'Emerald Pro Admin', author: 'Copperline Studio', category: 'Admin templates', price: '$149', sales: 1842, availability: 'Available', status: 'Live' },
    { id: 'MP-4102', name: 'Onyx Studio Kit', author: 'Ardent Robotics', category: 'Component kits', price: '$189', sales: 964, availability: 'Available', status: 'Live' },
    { id: 'MP-4103', name: 'Helix Docs Theme', author: 'Vellum Press', category: 'Docs themes', price: '$79', sales: 2318, availability: 'Available', status: 'Live' },
    { id: 'MP-4104', name: 'Prism Icon Set', author: 'Saltmarsh Digital', category: 'Icon sets', price: '$49', sales: 3470, availability: 'Available', status: 'Live' },
    { id: 'MP-4105', name: 'Meridian Table Kit', author: 'Sam Okoro', category: 'Component kits', price: '$119', sales: 0, availability: 'Withdrawn', status: 'Draft' },
    { id: 'MP-4106', name: 'Lumen Grid Layouts', author: 'Dmitri Sokolov', category: 'Blocks & snippets', price: '$39', sales: 412, availability: 'Available', status: 'Live' },
    { id: 'MP-4107', name: 'Vellum Blog Theme', author: 'Ravi Menon', category: 'Docs themes', price: '$59', sales: 866, availability: 'Withdrawn', status: 'Retired' },
    { id: 'MP-4108', name: 'Foundry Auth Screens', author: 'Adaeze Okonkwo', category: 'Admin templates', price: '$89', sales: 338, availability: 'Available', status: 'Live' },
  ]

  const listings: Listing[] = Array.from({ length: 24 }, (_, index) => {
    const base = seed[index % seed.length]!
    const run = Math.floor(index / seed.length)

    return run === 0
      ? base
      : { ...base, id: `MP-${4101 + index}`, name: `${base.name} v${run + 1}`, sales: Math.max(base.sales - run * 180, 0) }
  })

  const listed = ref<Record<string, boolean>>(
    Object.fromEntries(listings.map(item => [item.id, item.availability === 'Available'])),
  )

  function onList (id: string, value?: boolean) {
    listed.value[id] = Boolean(value)
  }

  type Option = { value: string, label: string }

  const categoryOptions: Option[] = [
    { value: 'all', label: 'All categories' },
    { value: 'Admin templates', label: 'Admin templates' },
    { value: 'Component kits', label: 'Component kits' },
    { value: 'Docs themes', label: 'Docs themes' },
    { value: 'Icon sets', label: 'Icon sets' },
    { value: 'Blocks & snippets', label: 'Blocks & snippets' },
  ]

  const availabilityOptions: Option[] = [
    { value: 'all', label: 'Any listing' },
    { value: 'Available', label: 'Available' },
    { value: 'Withdrawn', label: 'Withdrawn' },
  ]

  const statusOptions: Option[] = [
    { value: 'all', label: 'Any state' },
    { value: 'Live', label: 'Live' },
    { value: 'Draft', label: 'Draft' },
    { value: 'Retired', label: 'Retired' },
  ]

  function label (list: Option[], value: string) {
    return list.find(option => option.value === value)?.label ?? value
  }

  const filter = createFilter({ keys: ['id', 'name', 'author', 'category'] })
  const found = filter.apply(search, listings)

  const filtered = toRef(() => found.items.value.filter(item =>
    (category.value === 'all' || item.category === category.value)
    && (availability.value === 'all' || item.availability === availability.value)
    && (status.value === 'all' || item.status === status.value),
  ))

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
    <div class="adm-ecommerce">
      <header class="adm-ecommerce__header">
        <h1 class="adm-ecommerce__title">Marketplace</h1>
        <p class="adm-ecommerce__subtitle">Third-party kits, themes and blocks sold through the storefront</p>
      </header>

      <section aria-label="Featured listings" class="adm-ecommerce__featured">
        <EmCard v-for="item in featured" :key="item.name" variant="simple">
          <EmCardBody class="adm-ecommerce__tile">
            <span aria-hidden="true" class="adm-ecommerce__thumb" :style="{ '--angle': item.angle + 'deg' }" />

            <strong class="adm-ecommerce__tile-name">{{ item.name }}</strong>
            <span class="adm-ecommerce__tile-author">{{ item.author }}</span>

            <div class="adm-ecommerce__tile-foot">
              <span class="adm-ecommerce__tile-price">{{ item.price }}</span>

              <span class="adm-ecommerce__tile-meta">
                <span :aria-label="`Rated ${item.rating} out of 5`" class="adm-ecommerce__star" role="img">
                  <svg fill="currentColor" height="13" viewBox="0 0 24 24" width="13"><path d="M12 3.5 14.6 9l6 .9-4.3 4.2 1 6-5.3-2.8L6.7 20l1-6L3.4 9.9l6-.9L12 3.5Z" /></svg>
                  {{ item.rating }}
                </span>

                <span>{{ item.sales }} sold</span>
              </span>
            </div>
          </EmCardBody>
        </EmCard>
      </section>

      <section aria-label="Submissions and category revenue" class="adm-ecommerce__split">
        <EmCard class="adm-ecommerce__panel" variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-ecommerce__panel-title">Submission queue</EmCardTitle>
            <p class="adm-ecommerce__panel-sub">Every listing waiting on a reviewer</p>
          </EmCardHeader>

          <EmTabs v-model="queueTab">
            <EmTabsList>
              <EmTabsItem value="pending">Pending</EmTabsItem>
              <EmTabsItem value="live">Approved</EmTabsItem>
              <EmTabsItem value="rejected">Rejected</EmTabsItem>
            </EmTabsList>
          </EmTabs>

          <EmCardBody>
            <ul class="adm-ecommerce__queue">
              <li v-for="entry in queue" :key="entry.name">
                <EmAvatar size="sm"><EmAvatarFallback>{{ initials(entry.author) }}</EmAvatarFallback></EmAvatar>

                <span class="adm-ecommerce__queue-text">
                  <strong>{{ entry.name }}</strong>
                  <span>{{ entry.author }} · {{ entry.note }}</span>
                </span>

                <EmTag>{{ entry.when }}</EmTag>
              </li>
            </ul>
          </EmCardBody>
        </EmCard>

        <EmCard class="adm-ecommerce__panel" variant="simple">
          <EmCardHeader class="adm-ecommerce__revenue-head">
            <div>
              <EmCardTitle class="adm-ecommerce__panel-title">Revenue by category</EmCardTitle>
              <p class="adm-ecommerce__panel-sub">Gross marketplace sales, year to date</p>
            </div>

            <span class="adm-ecommerce__headline">$453K <em class="adm-ecommerce__delta" data-up>+22.4%</em></span>
          </EmCardHeader>

          <EmCardBody>
            <ul aria-label="Revenue by category" class="adm-ecommerce__bars" role="img">
              <li v-for="row in revenue" :key="row.label">
                <span class="adm-ecommerce__bar-label">{{ row.label }}</span>

                <span class="adm-ecommerce__bar-track">
                  <span class="adm-ecommerce__bar-fill" :style="{ width: row.pct + '%' }" />
                </span>

                <strong class="adm-ecommerce__bar-value">{{ row.amount }}</strong>
              </li>
            </ul>

            <p class="adm-ecommerce__note">Sellers keep 70%; the remaining $136K funds maintainer stipends.</p>
          </EmCardBody>
        </EmCard>
      </section>

      <section aria-label="Listings">
        <EmCard variant="simple">
          <EmCardHeader class="adm-ecommerce__toolbar">
            <div class="adm-ecommerce__toolbar-filters">
              <EmSelect v-model="category" class="adm-ecommerce__select">
                <EmSelectActivator>
                  <EmSelectValue v-slot="{ selectedValue }">{{ label(categoryOptions, String(selectedValue)) }}</EmSelectValue>
                </EmSelectActivator>

                <EmSelectContent>
                  <EmSelectItem v-for="option in categoryOptions" :key="option.value" :value="option.value">{{ option.label }}</EmSelectItem>
                </EmSelectContent>
              </EmSelect>

              <EmSelect v-model="availability" class="adm-ecommerce__select">
                <EmSelectActivator>
                  <EmSelectValue v-slot="{ selectedValue }">{{ label(availabilityOptions, String(selectedValue)) }}</EmSelectValue>
                </EmSelectActivator>

                <EmSelectContent>
                  <EmSelectItem v-for="option in availabilityOptions" :key="option.value" :value="option.value">{{ option.label }}</EmSelectItem>
                </EmSelectContent>
              </EmSelect>

              <EmSelect v-model="status" class="adm-ecommerce__select">
                <EmSelectActivator>
                  <EmSelectValue v-slot="{ selectedValue }">{{ label(statusOptions, String(selectedValue)) }}</EmSelectValue>
                </EmSelectActivator>

                <EmSelectContent>
                  <EmSelectItem v-for="option in statusOptions" :key="option.value" :value="option.value">{{ option.label }}</EmSelectItem>
                </EmSelectContent>
              </EmSelect>
            </div>

            <div class="adm-ecommerce__toolbar-right">
              <EmTextField v-model="search" aria-label="Search listings" class="adm-ecommerce__search" placeholder="Search listing or seller" />

              <EmSelect v-model="show" class="adm-ecommerce__show-select">
                <EmSelectActivator><EmSelectValue /></EmSelectActivator>

                <EmSelectContent>
                  <EmSelectItem value="5">5</EmSelectItem>
                  <EmSelectItem value="10">10</EmSelectItem>
                  <EmSelectItem value="25">25</EmSelectItem>
                </EmSelectContent>
              </EmSelect>

              <EmButton size="sm" variant="primary">Invite seller</EmButton>
            </div>
          </EmCardHeader>

          <EmCardBody class="adm-ecommerce__table-wrap">
            <table class="adm-ecommerce__table">
              <thead>
                <tr>
                  <th>Listing</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Units sold</th>
                  <th>State</th>
                  <th>Listed</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="item in rows" :key="item.id">
                  <td>
                    <div class="adm-ecommerce__client">
                      <EmAvatar size="sm"><EmAvatarFallback>{{ initials(item.name) }}</EmAvatarFallback></EmAvatar>
                      <span><strong>{{ item.name }}</strong><span class="adm-ecommerce__client-sub">{{ item.author }}</span></span>
                    </div>
                  </td>

                  <td>{{ item.category }}</td>
                  <td>{{ item.price }}</td>
                  <td>{{ item.sales.toLocaleString('en-US') }}</td>

                  <td>
                    <EmTag :variant="item.status === 'Live' ? 'success' : item.status === 'Draft' ? 'info' : 'neutral'">
                      {{ item.status }}
                    </EmTag>
                  </td>

                  <td>
                    <EmSwitch
                      :aria-label="`List ${item.name} on the storefront`"
                      :model-value="listed[item.id]"
                      @update:model-value="value => onList(item.id, value)"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </EmCardBody>

          <EmCardFooter class="adm-ecommerce__table-foot">
            <span class="adm-ecommerce__table-count">
              Showing {{ filtered.length > 0 ? pagination.pageStart.value + 1 : 0 }} to {{ pagination.pageStop.value }} of {{ filtered.length }} listings
            </span>

            <EmPagination v-model="page" :items-per-page="Number(show)" :size="filtered.length">
              <template #default="{ items }">
                <EmPaginationPrev>‹ Previous</EmPaginationPrev>

                <template v-for="(item, index) in items" :key="index">
                  <EmPaginationItem v-if="item.type === 'page'" :value="item.value" />
                  <span v-else class="adm-ecommerce__page-gap">{{ item.value }}</span>
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
  .adm-ecommerce {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-l, 20px);
  }

  /* EmCard variant="simple" ships 2px padding and its slots add none, so every
     card needs its own inset — see the EmCard padding gap row. */
  .adm-ecommerce .emerald-card {
    padding: var(--emerald-spacing-l, 20px);
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

  .adm-ecommerce__panel-title {
    font-size: var(--emerald-text-b1-size, 16px) !important;
    font-weight: 700 !important;
  }

  .adm-ecommerce__panel-sub {
    margin: 2px 0 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
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

  .adm-ecommerce__featured {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: var(--emerald-spacing-m, 16px);
  }

  .adm-ecommerce__tile {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  /* Same dashed hatch paint texture EmeraldDashboard uses for chart placeholders. */
  .adm-ecommerce__thumb {
    --angle: -12deg;
    display: block;
    height: 96px;
    margin-bottom: var(--emerald-spacing-s, 12px);
    border: 1px dashed var(--emerald-neutral-300, #ccd6e7);
    border-radius: var(--emerald-radius-m, 8px);
    background:
      repeating-linear-gradient(
        var(--angle),
        transparent,
        transparent 10px,
        color-mix(in srgb, var(--emerald-primary-600, #1fae60) 10%, transparent) 10px,
        color-mix(in srgb, var(--emerald-primary-600, #1fae60) 10%, transparent) 12px
      ),
      var(--emerald-neutral-200, #f6f8fa);
  }

  .adm-ecommerce__tile-name {
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-ecommerce__tile-author {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-ecommerce__tile-foot {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: var(--emerald-spacing-xs, 8px);
    margin-top: var(--emerald-spacing-s, 12px);
  }

  .adm-ecommerce__tile-price {
    font-size: 1.25rem;
    font-weight: 700;
  }

  .adm-ecommerce__tile-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-ecommerce__star {
    display: flex;
    align-items: center;
    gap: 3px;
    color: var(--emerald-primary-600, #1fae60);
    font-weight: 600;
  }

  .adm-ecommerce__split {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.35fr);
    gap: var(--emerald-spacing-m, 16px);
  }

  .adm-ecommerce__split .emerald-card__body {
    display: flex;
    flex: 1;
    flex-direction: column;
  }

  /* .emerald-card__header is flex-direction: column — a title/action row has to
     opt back into row explicitly. */
  .adm-ecommerce__revenue-head,
  .adm-ecommerce__toolbar {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-ecommerce__headline {
    display: flex;
    align-items: baseline;
    gap: 8px;
    font-size: 1.625rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .adm-ecommerce__queue {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: var(--emerald-spacing-m, 16px);
    margin: var(--emerald-spacing-m, 16px) 0 0;
    padding: 0;
    list-style: none;
  }

  .adm-ecommerce__queue li {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-ecommerce__queue-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-ecommerce__queue-text strong {
    color: var(--emerald-on-surface, #2b2d2e);
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-ecommerce__bars {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-m, 16px);
    margin: var(--emerald-spacing-xs, 8px) 0 0;
    padding: 0;
    list-style: none;
  }

  .adm-ecommerce__bars li {
    display: grid;
    grid-template-columns: 138px minmax(0, 1fr) 56px;
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-ecommerce__bar-label {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-ecommerce__bar-track {
    height: 12px;
    border-radius: 6px;
    background: var(--emerald-neutral-200, #f6f8fa);
    overflow: hidden;
  }

  .adm-ecommerce__bar-fill {
    display: block;
    height: 100%;
    border-radius: 6px;
    background: var(--emerald-primary-600, #1fae60);
  }

  .adm-ecommerce__bar-value {
    font-size: var(--emerald-text-b2-size, 14px);
    text-align: right;
  }

  .adm-ecommerce__note {
    margin: auto 0 0;
    padding-top: var(--emerald-spacing-m, 16px);
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-ecommerce__toolbar-filters,
  .adm-ecommerce__toolbar-right {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--emerald-spacing-xs, 8px);
  }

  .adm-ecommerce__select {
    width: 150px;
  }

  .adm-ecommerce__show-select {
    width: 76px;
  }

  .adm-ecommerce__search {
    width: 210px;
  }

  .adm-ecommerce__table-wrap {
    overflow-x: auto;
    margin-inline: calc(-1 * var(--emerald-spacing-l, 20px));
  }

  .adm-ecommerce__table th:first-child,
  .adm-ecommerce__table td:first-child {
    padding-left: var(--emerald-spacing-l, 20px);
  }

  .adm-ecommerce__table th:last-child,
  .adm-ecommerce__table td:last-child {
    padding-right: var(--emerald-spacing-l, 20px);
  }

  .adm-ecommerce__table tbody tr {
    transition: background-color 120ms ease;
  }

  .adm-ecommerce__table tbody tr:hover {
    background: var(--emerald-neutral-200, #f6f8fa);
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
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-ecommerce__table-count {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-ecommerce__page-gap {
    padding: 0 var(--emerald-spacing-2xs, 4px);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  @media (max-width: 1200px) {
    .adm-ecommerce__featured {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .adm-ecommerce__split {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .adm-ecommerce__featured {
      grid-template-columns: 1fr;
    }

    .adm-ecommerce__select,
    .adm-ecommerce__search {
      width: 100%;
    }

    .adm-ecommerce__bars li {
      grid-template-columns: 110px minmax(0, 1fr) 50px;
    }
  }
</style>
