<!--
  Total Profit / Total Revenue / Impression mini charts render as static CSS
  bar/line fills (real data labels, no charting library), matching the
  EmeraldSales precedent — see GAPS.md "Charting" row for the gap contract.
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

  type Kpi = {
    label: string
    sub: string
    value: string
    delta: string
    up: boolean
    kind: 'bars' | 'line'
    bars?: number[]
  }

  const kpis: Kpi[] = [
    { label: 'Total Orders', sub: 'Last 4 months', value: '155K', delta: '+22%', up: true, kind: 'bars', bars: [40, 65, 50, 90, 70, 100, 60] },
    { label: 'Total Profit', sub: 'Last One year', value: '$89.34k', delta: '-16%', up: false, kind: 'bars', bars: [80, 60, 100, 55, 70, 40, 65] },
    { label: 'Total Revenue', sub: 'This quarter', value: '$42.5k', delta: '-22%', up: false, kind: 'bars', bars: [55, 100, 90, 40, 70] },
    { label: 'Impression', sub: 'Last year', value: '175K', delta: '+24%', up: true, kind: 'line' },
  ]

  function top (bars: number[] = []) {
    return Math.max(...bars)
  }

  const finance = [
    { label: 'Jan', a: 12, b: 8, c: 10 },
    { label: 'Feb', a: 18, b: 10, c: 6 },
    { label: 'Mar', a: 16, b: 6, c: 8 },
    { label: 'Apr', a: 14, b: 4, c: 4 },
    { label: 'May', a: 20, b: 12, c: 12 },
    { label: 'Jun', a: 15, b: 10, c: 5 },
    { label: 'Jul', a: 22, b: 16, c: 14 },
  ]
  const financeMax = Math.max(...finance.map(f => f.a + f.b + f.c))

  const report = [
    { label: 'Total Profit', value: '$48,568.20', icon: 'coin' as const },
    { label: 'Total Income', value: '$38,453.25', icon: 'card' as const },
    { label: 'Total Expense', value: '$2,453.45', icon: 'card' as const },
  ]

  const visitors = [
    { label: 'Desktop', pct: 17, sub: '23.8' },
    { label: 'Tablet', pct: 65, sub: '13.604' },
    { label: 'Mobile', pct: 18, sub: '47.146' },
  ]
  const visitorMax = Math.max(...visitors.map(v => v.pct))

  const topSales = [
    { name: 'Samsung galaxy S25', brand: 'Samsung', price: '$32,203' },
    { name: 'Apple MacBook Pro', brand: 'Apple', price: '$1,299' },
    { name: 'Sony WH-1000XM4', brand: 'Sony', price: '$348' },
    { name: 'Dell XPS 13', brand: 'Dell', price: '$999' },
  ]

  const topVolume = [
    { name: 'Dell XPS 13', brand: 'Dell', volume: '200k', delta: '+5%', up: true },
    { name: 'Apple iPad', brand: 'Apple', volume: '80k', delta: '+10%', up: true },
    { name: 'Sony PlayStation 5', brand: 'Sony', volume: '30k', delta: '-20%', up: false },
    { name: 'iMac pro', brand: 'Apple', volume: '15k', delta: '+12%', up: true },
  ]

  const search = shallowRef('')
  const role = shallowRef('all')
  const plan = shallowRef('all')
  const status = shallowRef('all')
  const page = shallowRef(1)

  type Status = 'active' | 'pending' | 'inactive'
  type User = { name: string, email: string, role: string, plan: string, billing: string, status: Status }

  const seed: User[] = [
    { name: 'Jack Alfredo', email: 'jack.alfredo@shadcnstudio.com', role: 'Maintainer', plan: 'Enterprise', billing: 'Auto debit', status: 'active' },
    { name: 'Sarah Mitchell', email: 'sarah.mitchell@company.com', role: 'Owner', plan: 'Enterprise', billing: 'Auto debit', status: 'active' },
    { name: 'Robert Chen', email: 'robert.chen@startup.io', role: 'Editor', plan: 'Team', billing: 'Manual - PayPal', status: 'pending' },
    { name: 'Emily Wilson', email: 'emily.wilson@freelance.com', role: 'Author', plan: 'Basic', billing: 'Manual - cash', status: 'inactive' },
    { name: 'David Garcia', email: 'david.garcia@agency.net', role: 'Subscriber', plan: 'Company', billing: 'Auto debit', status: 'active' },
    { name: 'Nina Alvarez', email: 'nina.alvarez@studio.co', role: 'Editor', plan: 'Team', billing: 'Auto debit', status: 'active' },
    { name: 'Tom Baker', email: 'tom.baker@labs.dev', role: 'Owner', plan: 'Enterprise', billing: 'Manual - PayPal', status: 'pending' },
    { name: 'Ava Lindqvist', email: 'ava.l@northmail.se', role: 'Author', plan: 'Basic', billing: 'Manual - cash', status: 'inactive' },
  ]

  const users: User[] = Array.from({ length: 25 }, (_, index) => {
    const base = seed[index % seed.length]!
    const suffix = Math.floor(index / seed.length)

    return suffix === 0 ? base : { ...base, email: base.email.replace('@', `${suffix + 1}@`) }
  })

  type Option = { value: string, label: string }

  const roles: Option[] = [
    { value: 'all', label: 'All' },
    { value: 'Owner', label: 'Owner' },
    { value: 'Editor', label: 'Editor' },
    { value: 'Author', label: 'Author' },
    { value: 'Maintainer', label: 'Maintainer' },
    { value: 'Subscriber', label: 'Subscriber' },
  ]

  const plans: Option[] = [
    { value: 'all', label: 'All' },
    { value: 'Enterprise', label: 'Enterprise' },
    { value: 'Team', label: 'Team' },
    { value: 'Basic', label: 'Basic' },
    { value: 'Company', label: 'Company' },
  ]

  const states: Option[] = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'inactive', label: 'Inactive' },
  ]

  function label (list: Option[], value: string) {
    return list.find(option => option.value === value)?.label ?? value
  }

  const filter = createFilter({ keys: ['name', 'email', 'role'] })
  const found = filter.apply(search, users)

  const filtered = toRef(() => found.items.value.filter(user =>
    (role.value === 'all' || user.role === role.value)
    && (plan.value === 'all' || user.plan === plan.value)
    && (status.value === 'all' || user.status === status.value),
  ))

  const pagination = createPagination({ page, size: () => filtered.value.length, itemsPerPage: 5 })
  const rows = toRef(() => filtered.value.slice(pagination.pageStart.value, pagination.pageStop.value))

  function initials (name: string) {
    return name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase()
  }
</script>

<template>
  <EmeraldShell>
    <div class="adm-finance" data-theme="emerald">
      <header class="adm-finance__header">
        <h1 class="adm-finance__title">Finance</h1>
        <p class="adm-finance__subtitle">Yearly report overview</p>
      </header>

      <section aria-label="Key metrics" class="adm-finance__kpis">
        <EmCard v-for="kpi in kpis" :key="kpi.label" class="adm-finance__kpi" variant="simple">
          <EmCardBody class="adm-finance__kpi-body">
            <div class="adm-finance__kpi-text">
              <span class="adm-finance__kpi-label">{{ kpi.label }}</span>
              <span class="adm-finance__kpi-sub">{{ kpi.sub }}</span>

              <span class="adm-finance__kpi-value">
                {{ kpi.value }}
                <em class="adm-finance__delta" :data-up="kpi.up || undefined">{{ kpi.delta }}</em>
              </span>
            </div>

            <div v-if="kpi.kind === 'bars'" aria-hidden="true" class="adm-finance__mini-bars">
              <span
                v-for="(h, index) in kpi.bars"
                :key="index"
                class="adm-finance__mini-bar"
                :data-peak="h === top(kpi.bars) || undefined"
                :style="{ height: h + '%' }"
              />
            </div>

            <svg
              v-else
              aria-hidden="true"
              class="adm-finance__mini-line"
              preserveAspectRatio="none"
              viewBox="0 0 100 40"
            >
              <polyline
                fill="none"
                points="0,30 15,22 30,26 45,10 60,18 75,6 100,14"
                stroke="var(--emerald-primary-600, #1fae60)"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="3"
              />
            </svg>
          </EmCardBody>
        </EmCard>
      </section>

      <section aria-label="Yearly report and totals" class="adm-finance__row1">
        <EmCard class="adm-finance__panel adm-finance__panel--wide" variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-finance__panel-title">Finance</EmCardTitle>
            <p class="adm-finance__panel-sub">Yearly report overview</p>
          </EmCardHeader>

          <EmCardBody>
            <div aria-label="Finance by month" class="adm-finance__chart" role="img">
              <div v-for="f in finance" :key="f.label" class="adm-finance__chart-col">
                <div class="adm-finance__stack" :style="{ height: ((f.a + f.b + f.c) / financeMax) * 100 + '%' }">
                  <span class="adm-finance__stack-seg" data-tone="info" :style="{ flexGrow: f.c }" />
                  <span class="adm-finance__stack-seg" data-tone="secondary" :style="{ flexGrow: f.b }" />
                  <span class="adm-finance__stack-seg" data-tone="primary" :style="{ flexGrow: f.a }" />
                </div>

                <span class="adm-finance__chart-label">{{ f.label }}</span>
              </div>
            </div>
          </EmCardBody>
        </EmCard>

        <EmCard class="adm-finance__panel" variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-finance__panel-title">Report</EmCardTitle>
            <p class="adm-finance__panel-sub">Monthly Avg. $45.578k</p>
          </EmCardHeader>

          <EmCardBody>
            <ul class="adm-finance__report">
              <li v-for="row in report" :key="row.label">
                <span aria-hidden="true" class="adm-finance__icon" :data-tone="row.icon === 'coin' ? 'primary' : 'secondary'">
                  <svg
                    v-if="row.icon === 'coin'"
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

                <span class="adm-finance__report-label">{{ row.label }}</span>
                <strong class="adm-finance__report-value">{{ row.value }}</strong>
              </li>
            </ul>
          </EmCardBody>

          <EmCardFooter>
            <EmButton class="adm-finance__report-cta" variant="primary">View Report</EmButton>
          </EmCardFooter>
        </EmCard>
      </section>

      <section aria-label="Visitors and top products" class="adm-finance__row2">
        <EmCard class="adm-finance__panel" variant="simple">
          <EmCardHeader class="adm-finance__panel-head">
            <EmCardTitle class="adm-finance__panel-title">Total visitors</EmCardTitle>
            <EmButton size="sm" variant="tertiary">Details</EmButton>
          </EmCardHeader>

          <EmCardBody>
            <span class="adm-finance__kpi-value adm-finance__kpi-value--lg">23.02K <em class="adm-finance__delta">-6%</em></span>

            <div aria-label="Visitors by device" class="adm-finance__visitors" role="img">
              <div v-for="v in visitors" :key="v.label" class="adm-finance__visitor-col">
                <span class="adm-finance__visitor-pct">{{ v.pct }}%</span>
                <span class="adm-finance__visitor-bar" :data-peak="v.pct === visitorMax || undefined" :style="{ height: (v.pct / visitorMax) * 100 + '%' }" />
                <span class="adm-finance__visitor-label">{{ v.label }}</span>
                <span class="adm-finance__visitor-sub">{{ v.sub }}</span>
              </div>
            </div>
          </EmCardBody>
        </EmCard>

        <EmCard class="adm-finance__panel" variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-finance__panel-title">Top Products by Sales</EmCardTitle>
          </EmCardHeader>

          <EmCardBody>
            <ul class="adm-finance__products">
              <li v-for="p in topSales" :key="p.name">
                <EmAvatar size="sm"><EmAvatarFallback>{{ initials(p.name) }}</EmAvatarFallback></EmAvatar>

                <span class="adm-finance__product-text">
                  <strong>{{ p.name }}</strong>
                  <span>{{ p.brand }}</span>
                </span>

                <strong class="adm-finance__product-price">{{ p.price }}</strong>
              </li>
            </ul>
          </EmCardBody>
        </EmCard>

        <EmCard class="adm-finance__panel" variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-finance__panel-title">Top Products by Volume</EmCardTitle>
          </EmCardHeader>

          <EmCardBody>
            <ul class="adm-finance__products">
              <li v-for="p in topVolume" :key="p.name">
                <EmAvatar size="sm"><EmAvatarFallback>{{ initials(p.name) }}</EmAvatarFallback></EmAvatar>

                <span class="adm-finance__product-text">
                  <strong>{{ p.name }}</strong>
                  <span>{{ p.brand }}</span>
                </span>

                <span class="adm-finance__product-volume">
                  {{ p.volume }}
                  <em class="adm-finance__delta" :data-up="p.up || undefined">{{ p.delta }}</em>
                </span>
              </li>
            </ul>
          </EmCardBody>
        </EmCard>
      </section>

      <section aria-label="Users">
        <EmCard variant="simple">
          <EmCardHeader class="adm-finance__toolbar">
            <EmCardTitle class="adm-finance__panel-title">Users</EmCardTitle>

            <div class="adm-finance__toolbar-filters">
              <label class="adm-finance__field">
                <span class="adm-finance__field-label">Select Role</span>

                <EmSelect v-model="role">
                  <EmSelectActivator>
                    <EmSelectValue v-slot="{ selectedValue }">{{ label(roles, String(selectedValue)) }}</EmSelectValue>
                  </EmSelectActivator>

                  <EmSelectContent>
                    <EmSelectItem v-for="option in roles" :key="option.value" :value="option.value">{{ option.label }}</EmSelectItem>
                  </EmSelectContent>
                </EmSelect>
              </label>

              <label class="adm-finance__field">
                <span class="adm-finance__field-label">Select Plan</span>

                <EmSelect v-model="plan">
                  <EmSelectActivator>
                    <EmSelectValue v-slot="{ selectedValue }">{{ label(plans, String(selectedValue)) }}</EmSelectValue>
                  </EmSelectActivator>

                  <EmSelectContent>
                    <EmSelectItem v-for="option in plans" :key="option.value" :value="option.value">{{ option.label }}</EmSelectItem>
                  </EmSelectContent>
                </EmSelect>
              </label>

              <label class="adm-finance__field">
                <span class="adm-finance__field-label">Select Status</span>

                <EmSelect v-model="status">
                  <EmSelectActivator>
                    <EmSelectValue v-slot="{ selectedValue }">{{ label(states, String(selectedValue)) }}</EmSelectValue>
                  </EmSelectActivator>

                  <EmSelectContent>
                    <EmSelectItem v-for="option in states" :key="option.value" :value="option.value">{{ option.label }}</EmSelectItem>
                  </EmSelectContent>
                </EmSelect>
              </label>

              <EmTextField v-model="search" aria-label="Search users" class="adm-finance__search" placeholder="Search users" />
            </div>
          </EmCardHeader>

          <EmCardBody class="adm-finance__table-wrap">
            <table class="adm-finance__table">
              <thead>
                <tr>
                  <th><EmCheckbox aria-label="Select all" /></th>
                  <th>User</th>
                  <th>Role</th>
                  <th>Plan</th>
                  <th>Billing</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="user in rows" :key="user.email">
                  <td><EmCheckbox :aria-label="`Select ${user.name}`" /></td>

                  <td>
                    <div class="adm-finance__client">
                      <EmAvatar size="sm"><EmAvatarFallback>{{ initials(user.name) }}</EmAvatarFallback></EmAvatar>

                      <span>
                        <strong>{{ user.name }}</strong>
                        <span class="adm-finance__client-email">{{ user.email }}</span>
                      </span>
                    </div>
                  </td>

                  <td>{{ user.role }}</td>
                  <td>{{ user.plan }}</td>
                  <td>{{ user.billing }}</td>

                  <td>
                    <EmTag :variant="user.status === 'active' ? 'success' : user.status === 'pending' ? 'info' : 'danger'">
                      {{ user.status === 'active' ? 'Active' : user.status === 'pending' ? 'Pending' : 'Inactive' }}
                    </EmTag>
                  </td>

                  <td>
                    <div class="adm-finance__actions">
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

          <EmCardFooter class="adm-finance__table-foot">
            <span class="adm-finance__table-count">
              Showing {{ filtered.length > 0 ? pagination.pageStart.value + 1 : 0 }} to {{ pagination.pageStop.value }} of {{ filtered.length }} entries
            </span>

            <EmPagination v-model="page" :items-per-page="5" :size="filtered.length">
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
      </section>
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

  .adm-finance__kpis {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: var(--emerald-spacing-m, 16px);
  }

  .adm-finance__kpi-body {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-s, 12px);
    min-height: 128px;
  }

  .adm-finance__kpi-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .adm-finance__kpi-label {
    font-weight: 700;
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-finance__kpi-sub {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-finance__kpi-value {
    display: flex;
    align-items: baseline;
    gap: 6px;
    margin-top: 4px;
    font-size: 1.375rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .adm-finance__kpi-value--lg {
    font-size: 1.75rem;
    margin-bottom: var(--emerald-spacing-s, 12px);
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

  .adm-finance__mini-bars {
    display: flex;
    align-items: flex-end;
    gap: 4px;
    height: 48px;
    margin-top: auto;
  }

  .adm-finance__mini-bar {
    flex: 1;
    min-width: 4px;
    border-radius: 2px 2px 0 0;
    background: var(--emerald-primary-300, #baedd0);
  }

  .adm-finance__mini-bar[data-peak] {
    background: var(--emerald-primary-600, #1fae60);
  }

  .adm-finance__mini-line {
    width: 100%;
    height: 48px;
    margin-top: auto;
  }

  .adm-finance__row1 {
    display: grid;
    grid-template-columns: minmax(0, 1.7fr) minmax(0, 1fr);
    gap: var(--emerald-spacing-m, 16px);
  }

  .adm-finance__row2 {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--emerald-spacing-m, 16px);
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

  /* .emerald-card__header is flex-direction: column — a title/action row has to
     opt back into row explicitly. */
  .adm-finance__panel-head {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-finance__chart {
    display: flex;
    align-items: flex-end;
    gap: var(--emerald-spacing-s, 12px);
    height: 220px;
  }

  .adm-finance__chart-col {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    gap: 6px;
    height: 100%;
  }

  .adm-finance__stack {
    display: flex;
    flex-direction: column-reverse;
    width: 55%;
    min-height: 6px;
    border-radius: var(--emerald-radius-xs, 4px) var(--emerald-radius-xs, 4px) 0 0;
    overflow: hidden;
  }

  .adm-finance__stack-seg[data-tone='primary'] {
    background: var(--emerald-primary-700, #027d4c);
  }

  .adm-finance__stack-seg[data-tone='secondary'] {
    background: var(--emerald-primary-500, #6fb38c);
  }

  .adm-finance__stack-seg[data-tone='info'] {
    background: var(--emerald-primary-300, #baedd0);
  }

  .adm-finance__chart-label {
    font-size: var(--emerald-text-b3-size, 12px);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-finance__report {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-m, 16px);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .adm-finance__report li {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-finance__icon {
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

  .adm-finance__icon[data-tone='secondary'] {
    background: var(--emerald-secondary-100, #e4f2ff);
    color: var(--emerald-neutral-800, #636a70);
  }

  .adm-finance__report-label {
    flex: 1;
    font-weight: 700;
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-finance__report-value {
    font-size: var(--emerald-text-b1-size, 16px);
  }

  .adm-finance__report-cta {
    width: 100%;
  }

  .adm-finance__visitors {
    display: flex;
    align-items: flex-end;
    gap: var(--emerald-spacing-m, 16px);
    height: 160px;
    margin-top: var(--emerald-spacing-m, 16px);
    padding-top: 24px;
    border-top: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
  }

  .adm-finance__visitor-col {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    gap: 4px;
    height: 100%;
    text-align: center;
  }

  .adm-finance__visitor-pct {
    font-weight: 700;
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-finance__visitor-bar {
    width: 60%;
    min-height: 6px;
    border-radius: var(--emerald-radius-xs, 4px);
    background: var(--emerald-primary-300, #baedd0);
  }

  .adm-finance__visitor-bar[data-peak] {
    background: var(--emerald-primary-600, #1fae60);
  }

  .adm-finance__visitor-label {
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 600;
  }

  .adm-finance__visitor-sub {
    font-size: var(--emerald-text-b3-size, 12px);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-finance__products {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-s, 12px);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .adm-finance__products li {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-xs, 8px);
  }

  .adm-finance__product-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    font-size: var(--emerald-text-b3-size, 12px);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-finance__product-text strong {
    color: var(--emerald-on-surface, #2b2d2e);
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-finance__product-price,
  .adm-finance__product-volume {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-finance__toolbar {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: var(--emerald-spacing-m, 16px);
  }

  .adm-finance__toolbar-filters {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-finance__field {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-2xs, 4px);
    min-width: 0;
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-finance__field-label {
    color: var(--emerald-on-surface-variant, #757e85);
    font-weight: 600;
  }

  .adm-finance__search {
    grid-column: 1 / -1;
  }

  .adm-finance__table-wrap {
    overflow-x: auto;
    margin-inline: calc(-1 * var(--emerald-spacing-l, 20px));
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

  .adm-finance__page-gap {
    padding: 0 var(--emerald-spacing-2xs, 4px);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-finance__client {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-xs, 8px);
  }

  .adm-finance__client strong {
    display: block;
  }

  .adm-finance__client-email {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-finance__actions {
    display: flex;
    gap: 2px;
  }

  .adm-finance__actions .emerald-button {
    width: 30px;
    height: 30px;
    padding: 0;
  }

  .adm-finance__table-foot {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-finance__table-count {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  @media (max-width: 1200px) {
    .adm-finance__kpis {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .adm-finance__row1,
    .adm-finance__row2 {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .adm-finance__toolbar-filters {
      grid-template-columns: 1fr;
    }

    .adm-finance__kpis {
      grid-template-columns: 1fr;
    }
  }
</style>
