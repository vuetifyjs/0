<!--
  Project timeline, weekly overview, and conversion sparkline render as static
  CSS/SVG fills (real data, no charting library) — same GAP_CONTRACT precedent
  as EmeraldSales. The timeline bars are positioned with CSS grid-column
  start/span against a Jan–Aug axis, a real (if simplified) Gantt-style render.
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
  import { shallowRef, toRef } from 'vue'

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']

  const timeline: Array<{ person: string, initials: string, start: number, span: number, tone: 'primary' | 'secondary' | 'info' | 'dark' | 'danger' }> = [
    { person: 'Caleb', initials: 'CB', start: 2, span: 3, tone: 'primary' },
    { person: 'Shaw', initials: 'SH', start: 1, span: 1, tone: 'secondary' },
    { person: 'Jane', initials: 'JN', start: 2, span: 2, tone: 'info' },
    { person: 'Blake', initials: 'BL', start: 0, span: 2, tone: 'danger' },
    { person: 'Quinn', initials: 'QN', start: 3, span: 2, tone: 'dark' },
  ]

  const projects = [
    { name: 'iOS Application', task: '840/2.5K', icon: 'phone' as const },
    { name: 'Web Application', task: '99/1.42K', icon: 'web' as const },
    { name: 'Brand Dashboard', task: '58/100', icon: 'card' as const },
    { name: 'UI Kit Design', task: '120/350', icon: 'kit' as const },
  ]

  const weekly = [30, 55, 40, 65, 100, 55, 50, 40, 35]
  const weeklyMax = Math.max(...weekly)

  const conversion = [40, 55, 45, 60, 92]

  const perfTab = shallowRef('new')

  const performers: Record<string, { role: string, name: string, metric: string, value: string, delta: string }> = {
    new: { role: 'Product Manager', name: 'Angel George', metric: 'Physical product', value: '$78,263', delta: '+14.78%' },
    online: { role: 'Online Sales Lead', name: 'Priya Raman', metric: 'Digital product', value: '$52,910', delta: '+8.32%' },
    daily: { role: 'Daily Sales Lead', name: 'Marcus Webb', metric: 'In-store product', value: '$12,485', delta: '+3.05%' },
  }

  const performer = toRef(() => performers[perfTab.value] ?? performers.new!)

  const search = shallowRef('')
  const role = shallowRef('all')
  const plan = shallowRef('all')
  const status = shallowRef('all')
  const page = shallowRef(1)

  type Status = 'active' | 'pending' | 'inactive'

  type Member = { name: string, email: string, role: string, plan: string, billing: string, status: Status }

  const seed: Member[] = [
    { name: 'Jack Alfredo', email: 'jack.alfredo@shadcnstudio.com', role: 'Maintainer', plan: 'Enterprise', billing: 'Auto debit', status: 'active' },
    { name: 'Sarah Mitchell', email: 'sarah.mitchell@company.com', role: 'Owner', plan: 'Enterprise', billing: 'Auto debit', status: 'active' },
    { name: 'Robert Chen', email: 'robert.chen@startup.io', role: 'Editor', plan: 'Team', billing: 'Manual - PayPal', status: 'pending' },
    { name: 'Emily Wilson', email: 'emily.wilson@freelance.com', role: 'Author', plan: 'Basic', billing: 'Manual - cash', status: 'inactive' },
    { name: 'David Garcia', email: 'david.garcia@agency.net', role: 'Subscriber', plan: 'Company', billing: 'Auto debit', status: 'active' },
    { name: 'Nina Alvarez', email: 'nina.alvarez@studio.co', role: 'Editor', plan: 'Team', billing: 'Auto debit', status: 'active' },
    { name: 'Tom Baker', email: 'tom.baker@labs.dev', role: 'Owner', plan: 'Enterprise', billing: 'Manual - PayPal', status: 'pending' },
    { name: 'Ava Lindqvist', email: 'ava.l@northmail.se', role: 'Author', plan: 'Basic', billing: 'Manual - cash', status: 'inactive' },
  ]

  const members: Member[] = Array.from({ length: 25 }, (_, index) => {
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
  const found = filter.apply(search, members)

  const filtered = toRef(() => found.items.value.filter(member =>
    (role.value === 'all' || member.role === role.value)
    && (plan.value === 'all' || member.plan === plan.value)
    && (status.value === 'all' || member.status === status.value),
  ))

  const pagination = createPagination({ page, size: () => filtered.value.length, itemsPerPage: 5 })
  const rows = toRef(() => filtered.value.slice(pagination.pageStart.value, pagination.pageStop.value))

  function initials (name: string) {
    return name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase()
  }
</script>

<template>
  <EmeraldShell>
    <div class="adm-productivity" data-theme="emerald">
      <header class="adm-productivity__header">
        <h1 class="adm-productivity__title">Productivity</h1>
        <p class="adm-productivity__subtitle">Project timeline and team throughput</p>
      </header>

      <section aria-label="Project timeline and list" class="adm-productivity__row1">
        <EmCard class="adm-productivity__panel adm-productivity__panel--wide" variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-productivity__panel-title">Project Timeline</EmCardTitle>
            <p class="adm-productivity__panel-sub">Total 840 Task Completed</p>
          </EmCardHeader>

          <EmCardBody>
            <div aria-label="Project timeline by contributor" class="adm-productivity__gantt" role="img" :style="{ '--months': months.length }">
              <div aria-hidden="true" class="adm-productivity__gantt-axis">
                <span v-for="m in months" :key="m">{{ m }}</span>
              </div>

              <div v-for="row in timeline" :key="row.person" class="adm-productivity__gantt-row">
                <span class="adm-productivity__gantt-name">{{ row.person }}</span>

                <div class="adm-productivity__gantt-track">
                  <span
                    class="adm-productivity__gantt-bar"
                    :data-tone="row.tone"
                    :style="{ gridColumn: `${row.start + 1} / span ${row.span}` }"
                  />
                </div>
              </div>
            </div>
          </EmCardBody>
        </EmCard>

        <EmCard class="adm-productivity__panel" variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-productivity__panel-title">Project List</EmCardTitle>
            <p class="adm-productivity__panel-sub">4 ongoing project</p>
          </EmCardHeader>

          <EmCardBody>
            <ul class="adm-productivity__projects">
              <li v-for="p in projects" :key="p.name">
                <span aria-hidden="true" class="adm-productivity__icon">
                  <svg
                    fill="none"
                    height="16"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.75"
                    viewBox="0 0 24 24"
                    width="16"
                  ><rect
                     height="16"
                     rx="2"
                     width="12"
                     x="6"
                     y="4"
                   />

                    <path d="M9 8h6M9 12h6" /></svg>
                </span>

                <span class="adm-productivity__project-text">
                  <strong>{{ p.name }}</strong>
                  <span>Task {{ p.task }}</span>
                </span>
              </li>
            </ul>
          </EmCardBody>
        </EmCard>
      </section>

      <section aria-label="Weekly overview and conversion" class="adm-productivity__row2">
        <EmCard class="adm-productivity__panel" variant="simple">
          <EmCardHeader class="adm-productivity__panel-head">
            <EmCardTitle class="adm-productivity__panel-title">Weekly overview</EmCardTitle>
            <EmButton size="sm" variant="tertiary">Details</EmButton>
          </EmCardHeader>

          <EmCardBody>
            <div aria-label="Weekly task completion" class="adm-productivity__chart" role="img">
              <div v-for="(v, index) in weekly" :key="index" class="adm-productivity__chart-col">
                <span class="adm-productivity__chart-bar" :data-peak="v === weeklyMax || undefined" :style="{ height: (v / weeklyMax) * 100 + '%' }" />
              </div>
            </div>

            <p class="adm-productivity__note"><strong>80%</strong> Your sales performance is 60% Better compare to Last month</p>
            <EmButton class="adm-productivity__cta" variant="primary">Details</EmButton>
          </EmCardBody>
        </EmCard>

        <EmCard class="adm-productivity__panel" variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-productivity__panel-title">Conversion rate</EmCardTitle>
            <p class="adm-productivity__panel-sub">Compared to last month</p>
          </EmCardHeader>

          <EmCardBody>
            <span class="adm-productivity__kpi-value">92.8% <em class="adm-productivity__delta" data-up>6.3%</em></span>

            <svg aria-hidden="true" class="adm-productivity__trend" preserveAspectRatio="none" viewBox="0 0 100 40">
              <polyline
                fill="none"
                :points="conversion.map((v, index) => `${index * (100 / (conversion.length - 1))},${40 - (v / 100) * 36}`).join(' ')"
                stroke="var(--emerald-primary-600, #1fae60)"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="3"
              />
            </svg>

            <ul class="adm-productivity__funnel">
              <li><span>Impressions</span> <strong>12.2K Visits</strong> <em class="adm-productivity__delta" data-up>20.3%</em></li>
              <li><span>Added to cart</span> <strong>32 product in cart</strong> <em class="adm-productivity__delta" data-up>6.3%</em></li>
              <li><span>Checkout</span> <strong>15 Product checkout</strong> <em class="adm-productivity__delta">9.56%</em></li>
              <li><span>Purchased</span> <strong>12 orders</strong> <em class="adm-productivity__delta" data-up>2.62%</em></li>
            </ul>
          </EmCardBody>
        </EmCard>
      </section>

      <section aria-label="Performance">
        <EmCard variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-productivity__panel-title">Performance</EmCardTitle>
          </EmCardHeader>

          <EmTabs v-model="perfTab">
            <EmTabsList>
              <EmTabsItem value="new">New Users</EmTabsItem>
              <EmTabsItem value="online">Online Sales</EmTabsItem>
              <EmTabsItem value="daily">Daily Sales</EmTabsItem>
            </EmTabsList>
          </EmTabs>

          <EmCardBody class="adm-productivity__perf">
            <div class="adm-productivity__perf-row">
              <span class="adm-productivity__perf-person">
                <EmAvatar size="sm"><EmAvatarFallback>AG</EmAvatarFallback></EmAvatar>

                <span class="adm-productivity__perf-text">
                  <span>{{ performer.role }}</span>
                  <strong>{{ performer.name }}</strong>
                </span>
              </span>
            </div>

            <div class="adm-productivity__perf-row">
              <EmTag>Daily purchase</EmTag>
              <strong>10 Items</strong>
            </div>

            <div class="adm-productivity__perf-row">
              <span class="adm-productivity__perf-text">
                <span>{{ performer.metric }}</span>
                <strong>{{ performer.value }}</strong>
              </span>

              <EmTag variant="success">{{ performer.delta }}</EmTag>
            </div>
          </EmCardBody>
        </EmCard>
      </section>

      <section aria-label="Team members">
        <EmCard variant="simple">
          <EmCardHeader class="adm-productivity__toolbar">
            <EmCardTitle class="adm-productivity__panel-title">Team members</EmCardTitle>

            <div class="adm-productivity__toolbar-filters">
              <label class="adm-productivity__field">
                <span class="adm-productivity__field-label">Select Role</span>

                <EmSelect v-model="role">
                  <EmSelectActivator>
                    <EmSelectValue v-slot="{ selectedValue }">{{ label(roles, String(selectedValue)) }}</EmSelectValue>
                  </EmSelectActivator>

                  <EmSelectContent>
                    <EmSelectItem v-for="option in roles" :key="option.value" :value="option.value">{{ option.label }}</EmSelectItem>
                  </EmSelectContent>
                </EmSelect>
              </label>

              <label class="adm-productivity__field">
                <span class="adm-productivity__field-label">Select Plan</span>

                <EmSelect v-model="plan">
                  <EmSelectActivator>
                    <EmSelectValue v-slot="{ selectedValue }">{{ label(plans, String(selectedValue)) }}</EmSelectValue>
                  </EmSelectActivator>

                  <EmSelectContent>
                    <EmSelectItem v-for="option in plans" :key="option.value" :value="option.value">{{ option.label }}</EmSelectItem>
                  </EmSelectContent>
                </EmSelect>
              </label>

              <label class="adm-productivity__field">
                <span class="adm-productivity__field-label">Select Status</span>

                <EmSelect v-model="status">
                  <EmSelectActivator>
                    <EmSelectValue v-slot="{ selectedValue }">{{ label(states, String(selectedValue)) }}</EmSelectValue>
                  </EmSelectActivator>

                  <EmSelectContent>
                    <EmSelectItem v-for="option in states" :key="option.value" :value="option.value">{{ option.label }}</EmSelectItem>
                  </EmSelectContent>
                </EmSelect>
              </label>

              <EmTextField v-model="search" aria-label="Search team" class="adm-productivity__search" placeholder="Search team" />
            </div>
          </EmCardHeader>

          <EmCardBody class="adm-productivity__table-wrap">
            <table class="adm-productivity__table">
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
                <tr v-for="m in rows" :key="m.email">
                  <td><EmCheckbox :aria-label="`Select ${m.name}`" /></td>

                  <td>
                    <div class="adm-productivity__client">
                      <EmAvatar size="sm"><EmAvatarFallback>{{ initials(m.name) }}</EmAvatarFallback></EmAvatar>

                      <span>
                        <strong>{{ m.name }}</strong>
                        <span class="adm-productivity__client-email">{{ m.email }}</span>
                      </span>
                    </div>
                  </td>

                  <td>{{ m.role }}</td>
                  <td>{{ m.plan }}</td>
                  <td>{{ m.billing }}</td>

                  <td>
                    <EmTag :variant="m.status === 'active' ? 'success' : m.status === 'pending' ? 'info' : 'danger'">
                      {{ m.status === 'active' ? 'Active' : m.status === 'pending' ? 'Pending' : 'Inactive' }}
                    </EmTag>
                  </td>

                  <td>
                    <div class="adm-productivity__actions">
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
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </EmCardBody>

          <EmCardFooter class="adm-productivity__table-foot">
            <span class="adm-productivity__table-count">
              Showing {{ filtered.length > 0 ? pagination.pageStart.value + 1 : 0 }} to {{ pagination.pageStop.value }} of {{ filtered.length }} entries
            </span>

            <EmPagination v-model="page" :items-per-page="5" :size="filtered.length">
              <template #default="{ items }">
                <EmPaginationPrev>‹ Previous</EmPaginationPrev>

                <template v-for="(item, index) in items" :key="index">
                  <EmPaginationItem v-if="item.type === 'page'" :value="item.value" />
                  <span v-else class="adm-productivity__page-gap">{{ item.value }}</span>
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
  .adm-productivity {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-l, 20px);
  }

  /* EmCard variant="simple" ships 2px padding and its slots add none, so every
     card needs its own inset — see the EmCard padding gap row. */
  .adm-productivity .emerald-card {
    padding: var(--emerald-spacing-l, 20px);
    background: var(--emerald-background, #fefefe);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    border-radius: var(--emerald-radius-xl, 12px);
    box-shadow: var(--emerald-shadow-s, 0 0 2px 0 rgba(51, 51, 51, 0.08));
  }

  .adm-productivity__title {
    margin: 0;
    font-size: clamp(1.375rem, 2vw, 1.625rem);
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .adm-productivity__subtitle {
    margin: 0.25rem 0 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b1-size, 16px);
  }

  .adm-productivity__row1 {
    display: grid;
    grid-template-columns: minmax(0, 1.7fr) minmax(0, 1fr);
    gap: var(--emerald-spacing-m, 16px);
  }

  .adm-productivity__row2 {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--emerald-spacing-m, 16px);
  }

  .adm-productivity__panel-title {
    font-size: var(--emerald-text-b1-size, 16px) !important;
    font-weight: 700 !important;
  }

  .adm-productivity__panel-sub {
    margin: 2px 0 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  /* .emerald-card__header is flex-direction: column — a title/action row has to
     opt back into row explicitly. */
  .adm-productivity__panel-head {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-productivity__gantt {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-productivity__gantt-axis {
    display: grid;
    grid-template-columns: repeat(var(--months), 1fr);
    margin-left: 72px;
    padding-bottom: var(--emerald-spacing-xs, 8px);
    border-bottom: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    font-size: var(--emerald-text-b3-size, 12px);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-productivity__gantt-row {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-productivity__gantt-name {
    width: 60px;
    flex: none;
    font-size: var(--emerald-text-b2-size, 14px);
    font-weight: 600;
  }

  .adm-productivity__gantt-track {
    display: grid;
    flex: 1;
    grid-template-columns: repeat(var(--months), 1fr);
    height: 20px;
  }

  .adm-productivity__gantt-bar {
    border-radius: var(--emerald-radius-m, 8px);
    background: var(--emerald-primary-500, #26c26d);
  }

  .adm-productivity__gantt-bar[data-tone='secondary'] {
    background: var(--emerald-primary-300, #baedd0);
  }

  .adm-productivity__gantt-bar[data-tone='info'] {
    background: var(--emerald-primary-500, #6fb38c);
  }

  .adm-productivity__gantt-bar[data-tone='dark'] {
    background: var(--emerald-primary-800, #01603a);
  }

  .adm-productivity__gantt-bar[data-tone='danger'] {
    background: var(--emerald-primary-700, #027d4c);
  }

  .adm-productivity__projects {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-m, 16px);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .adm-productivity__projects li {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-productivity__icon {
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

  .adm-productivity__project-text {
    display: flex;
    flex-direction: column;
    font-size: var(--emerald-text-b3-size, 12px);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-productivity__project-text strong {
    color: var(--emerald-on-surface, #2b2d2e);
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-productivity__chart {
    display: flex;
    align-items: flex-end;
    gap: 6px;
    height: 140px;
  }

  /* Percentage bar heights need a definite parent height; align-items: flex-end
     on the track leaves the column auto-sized, collapsing every bar. */
  .adm-productivity__chart-col {
    flex: 1;
    display: flex;
    align-items: flex-end;
    height: 100%;
  }

  .adm-productivity__chart-bar {
    width: 100%;
    min-height: 6px;
    border-radius: var(--emerald-radius-xs, 4px) var(--emerald-radius-xs, 4px) 0 0;
    background: var(--emerald-primary-100, #e7fff2);
  }

  .adm-productivity__chart-bar[data-peak] {
    background: var(--emerald-primary-600, #1fae60);
  }

  .adm-productivity__note {
    margin: var(--emerald-spacing-m, 16px) 0 var(--emerald-spacing-s, 12px);
    font-size: var(--emerald-text-b2-size, 14px);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-productivity__note strong {
    color: var(--emerald-on-surface, #2b2d2e);
    font-size: 1.25rem;
  }

  .adm-productivity__cta {
    width: 100%;
  }

  .adm-productivity__kpi-value {
    display: flex;
    align-items: baseline;
    gap: 8px;
    font-size: 1.75rem;
    font-weight: 700;
  }

  .adm-productivity__delta {
    font-style: normal;
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 600;
    color: var(--emerald-danger-500, #c61424);
  }

  .adm-productivity__delta[data-up] {
    color: var(--emerald-primary-700, #027d4c);
  }

  .adm-productivity__trend {
    width: 100%;
    height: 60px;
    margin: var(--emerald-spacing-s, 12px) 0;
  }

  .adm-productivity__funnel {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-productivity__funnel li {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .adm-productivity__funnel span:first-child {
    flex: 1;
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-productivity__perf {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-m, 16px);
  }

  .adm-productivity__perf-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: var(--emerald-spacing-s, 12px);
    padding: var(--emerald-spacing-s, 12px);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    border-radius: var(--emerald-radius-m, 8px);
  }

  .adm-productivity__perf-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
    font-size: var(--emerald-text-b3-size, 12px);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-productivity__perf-text strong {
    color: var(--emerald-on-surface, #2b2d2e);
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-productivity__perf-person {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-productivity__toolbar {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: var(--emerald-spacing-m, 16px);
  }

  .adm-productivity__field {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-2xs, 4px);
    min-width: 0;
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-productivity__field-label {
    color: var(--emerald-on-surface-variant, #757e85);
    font-weight: 600;
  }

  .adm-productivity__search {
    grid-column: 1 / -1;
  }

  .adm-productivity__page-gap {
    padding: 0 var(--emerald-spacing-2xs, 4px);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-productivity__toolbar-filters {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-productivity__table-wrap {
    overflow-x: auto;
    margin-inline: calc(-1 * var(--emerald-spacing-l, 20px));
  }

  .adm-productivity__table th:first-child,
  .adm-productivity__table td:first-child {
    padding-left: var(--emerald-spacing-l, 20px);
  }

  .adm-productivity__table th:last-child,
  .adm-productivity__table td:last-child {
    padding-right: var(--emerald-spacing-l, 20px);
  }

  .adm-productivity__table tbody tr {
    transition: background-color 120ms ease;
  }

  .adm-productivity__table tbody tr:hover {
    background: var(--emerald-neutral-200, #f6f8fa);
  }

  .adm-productivity__table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--emerald-text-b2-size, 14px);
    white-space: nowrap;
  }

  .adm-productivity__table th {
    padding: var(--emerald-spacing-xs, 8px) var(--emerald-spacing-s, 12px);
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 600;
    text-align: left;
    border-bottom: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
  }

  .adm-productivity__table td {
    padding: var(--emerald-spacing-s, 12px);
    border-bottom: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-200, #f6f8fa);
  }

  .adm-productivity__client {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-xs, 8px);
  }

  .adm-productivity__client strong {
    display: block;
  }

  .adm-productivity__client-email {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-productivity__actions {
    display: flex;
    gap: 2px;
  }

  .adm-productivity__actions .emerald-button {
    width: 30px;
    height: 30px;
    padding: 0;
  }

  .adm-productivity__table-foot {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-productivity__table-count {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  @media (max-width: 1200px) {
    .adm-productivity__row1,
    .adm-productivity__row2 {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .adm-productivity__toolbar-filters {
      grid-template-columns: 1fr;
    }
  }
</style>
