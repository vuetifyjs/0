<!--
  Project timeline, weekly overview, and conversion sparkline render as static
  CSS/SVG fills (real data, no charting library) — same GAP_CONTRACT precedent
  as AdminSales. The timeline bars are positioned with CSS grid-column
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

  // Context
  import AdminShell from './AdminShell.vue'

  // Utilities
  import { shallowRef } from 'vue'

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

  const search = shallowRef('')
  const role = shallowRef('all')
  const plan = shallowRef('all')
  const status = shallowRef('all')
  const page = shallowRef(1)

  type Status = 'active' | 'pending' | 'inactive'

  const members: Array<{ name: string, email: string, role: string, plan: string, billing: string, status: Status }> = [
    { name: 'Jack Alfredo', email: 'jack.alfredo@shadcnstudio.com', role: 'Maintainer', plan: 'Enterprise', billing: 'Auto debit', status: 'active' },
    { name: 'Sarah Mitchell', email: 'sarah.mitchell@company.com', role: 'Admin', plan: 'Enterprise', billing: 'Auto debit', status: 'active' },
    { name: 'Robert Chen', email: 'robert.chen@startup.io', role: 'Editor', plan: 'Team', billing: 'Manual - PayPal', status: 'pending' },
    { name: 'Emily Wilson', email: 'emily.wilson@freelance.com', role: 'Author', plan: 'Basic', billing: 'Manual - cash', status: 'inactive' },
    { name: 'David Garcia', email: 'david.garcia@agency.net', role: 'Subscriber', plan: 'Company', billing: 'Auto debit', status: 'active' },
  ]

  function initials (name: string) {
    return name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase()
  }
</script>

<template>
  <AdminShell>
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
              <EmAvatar size="sm"><EmAvatarFallback>AG</EmAvatarFallback></EmAvatar>

              <span>
                <strong>Angel George</strong>
                <span>Product Manager</span>
              </span>
            </div>

            <div class="adm-productivity__perf-row">
              <EmTag>Daily purchase</EmTag>
              <strong>10 Items</strong>
            </div>

            <div class="adm-productivity__perf-row">
              <span>
                <strong>$78,263</strong>
                <span>Physical product</span>
              </span>

              <EmTag variant="success">+14.78%</EmTag>
            </div>
          </EmCardBody>
        </EmCard>
      </section>

      <section aria-label="Team members">
        <EmCard variant="simple">
          <EmCardHeader class="adm-productivity__toolbar">
            <EmCardTitle class="adm-productivity__panel-title">Team members</EmCardTitle>

            <div class="adm-productivity__toolbar-filters">
              <EmSelect v-model="role" class="adm-productivity__filter">
                <EmSelectActivator><EmSelectValue placeholder="Select Role" /></EmSelectActivator>

                <EmSelectContent>
                  <EmSelectItem value="all">All</EmSelectItem>
                  <EmSelectItem value="admin">Admin</EmSelectItem>
                  <EmSelectItem value="editor">Editor</EmSelectItem>
                </EmSelectContent>
              </EmSelect>

              <EmSelect v-model="plan" class="adm-productivity__filter">
                <EmSelectActivator><EmSelectValue placeholder="Select Plan" /></EmSelectActivator>

                <EmSelectContent>
                  <EmSelectItem value="all">All</EmSelectItem>
                  <EmSelectItem value="enterprise">Enterprise</EmSelectItem>
                  <EmSelectItem value="team">Team</EmSelectItem>
                </EmSelectContent>
              </EmSelect>

              <EmSelect v-model="status" class="adm-productivity__filter">
                <EmSelectActivator><EmSelectValue placeholder="Select Status" /></EmSelectActivator>

                <EmSelectContent>
                  <EmSelectItem value="all">All</EmSelectItem>
                  <EmSelectItem value="active">Active</EmSelectItem>
                  <EmSelectItem value="pending">Pending</EmSelectItem>
                </EmSelectContent>
              </EmSelect>

              <EmTextField v-model="search" aria-label="Search team" placeholder="Search team" />
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
                <tr v-for="m in members" :key="m.email">
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
            <span class="adm-productivity__table-count">Showing 1 to 5 of 25 entries</span>

            <EmPagination v-model="page" :size="5">
              <EmPaginationPrev>‹ Previous</EmPaginationPrev>
              <EmPaginationItem v-for="n in 5" :key="n" :value="n" />
              <EmPaginationNext>Next ›</EmPaginationNext>
            </EmPagination>
          </EmCardFooter>
        </EmCard>
      </section>
    </div>
  </AdminShell>
</template>

<style>
  .adm-productivity {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-l, 20px);
  }

  .adm-productivity .emerald-card {
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
    align-items: start;
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

  .adm-productivity__panel-head {
    display: flex;
    align-items: flex-start;
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
    background: var(--emerald-secondary-500, #00b4dc);
  }

  .adm-productivity__gantt-bar[data-tone='info'] {
    background: var(--emerald-neutral-800, #636a70);
  }

  .adm-productivity__gantt-bar[data-tone='dark'] {
    background: var(--emerald-on-surface, #2b2d2e);
  }

  .adm-productivity__gantt-bar[data-tone='danger'] {
    background: var(--emerald-warning-500, #f5a623);
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

  .adm-productivity__chart-col {
    flex: 1;
    display: flex;
    align-items: flex-end;
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
    align-items: center;
    justify-content: space-between;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-productivity__perf-row > span:first-child {
    display: flex;
    flex-direction: column;
    font-size: var(--emerald-text-b3-size, 12px);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-productivity__perf-row > span:first-child strong {
    color: var(--emerald-on-surface, #2b2d2e);
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-productivity__toolbar {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-productivity__toolbar-filters {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-productivity__filter {
    width: 140px;
  }

  .adm-productivity__table-wrap {
    overflow-x: auto;
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
</style>
