<!--
  The triage heatmap, age segments, latency columns and burndown line render as
  static CSS/SVG fills (no charting library) — same GAP_CONTRACT precedent as
  EmeraldSales. The heatmap intensity is generated from a fixed wave so the
  grid is stable across renders while keeping weekends visibly cooler.
-->
<script setup lang="ts">
  import {
    EmAvatar,
    EmAvatarFallback,
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

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const span = 18

  const heat = days.map((_, day) => Array.from({ length: span }, (_, week) => {
    const rest = day > 4
    const wave = Math.sin((week + day) * 0.8) + 1

    return Math.min(Math.round(wave * (rest ? 0.9 : 2)), 4)
  }))

  const rotation = [
    { who: 'Zara Idris', day: 'Monday', queue: 24 },
    { who: 'Bruno Marchetti', day: 'Tuesday', queue: 31 },
    { who: 'Nadia Haddad', day: 'Wednesday', queue: 19 },
    { who: 'Kenji Morrow', day: 'Thursday', queue: 27 },
    { who: 'Camille Fontaine', day: 'Friday', queue: 22 },
  ]

  const ages = [
    { label: 'Under a day', count: 42, pct: 12, tone: 'deep' as const },
    { label: '1–7 days', count: 118, pct: 35, tone: 'mid' as const },
    { label: '8–30 days', count: 96, pct: 28, tone: 'light' as const },
    { label: '31–90 days', count: 54, pct: 16, tone: 'pale' as const },
    { label: 'Over 90 days', count: 31, pct: 9, tone: 'muted' as const },
  ]

  const latency = [14, 11, 13, 9, 8, 6, 7, 5]
  const latencyMax = Math.max(...latency)

  const burndown = [96, 88, 79, 74, 61, 52, 44, 38]
  const burndownMax = Math.max(...burndown)

  const curve = burndown
    .map((v, index) => `${index * (100 / (burndown.length - 1))},${40 - (v / burndownMax) * 34}`)
    .join(' ')

  const search = shallowRef('')
  const area = shallowRef('all')
  const role = shallowRef('all')
  const status = shallowRef('all')
  const page = shallowRef(1)

  type Status = 'active' | 'onleave' | 'inactive'
  type Member = { name: string, handle: string, area: string, role: string, merged: number, closed: number, status: Status }

  const seed: Member[] = [
    { name: 'Camille Fontaine', handle: '@camf', area: 'Composables', role: 'Core', merged: 84, closed: 212, status: 'active' },
    { name: 'Kenji Morrow', handle: '@kmorrow', area: 'Docs', role: 'Core', merged: 61, closed: 168, status: 'active' },
    { name: 'Nadia Haddad', handle: '@nhaddad', area: 'Composables', role: 'Reviewer', merged: 47, closed: 143, status: 'active' },
    { name: 'Bruno Marchetti', handle: '@bmarch', area: 'Design systems', role: 'Core', merged: 52, closed: 96, status: 'active' },
    { name: 'Zara Idris', handle: '@zidris', area: 'Components', role: 'Triage', merged: 18, closed: 264, status: 'active' },
    { name: 'Theo Vasquez', handle: '@tvasquez', area: 'Tooling', role: 'Reviewer', merged: 33, closed: 71, status: 'onleave' },
    { name: 'Sofia Delgado', handle: '@sdelgado', area: 'Components', role: 'Contributor', merged: 24, closed: 38, status: 'active' },
    { name: 'Marek Dvorak', handle: '@mdvorak', area: 'Tooling', role: 'Contributor', merged: 12, closed: 19, status: 'inactive' },
  ]

  const members: Member[] = Array.from({ length: 24 }, (_, index) => {
    const base = seed[index % seed.length]!
    const run = Math.floor(index / seed.length)

    return run === 0
      ? base
      : { ...base, handle: `${base.handle}${run + 1}`, merged: Math.max(base.merged - run * 9, 3), closed: Math.max(base.closed - run * 21, 6) }
  })

  type Option = { value: string, label: string }

  const areaOptions: Option[] = [
    { value: 'all', label: 'All areas' },
    { value: 'Composables', label: 'Composables' },
    { value: 'Components', label: 'Components' },
    { value: 'Docs', label: 'Docs' },
    { value: 'Tooling', label: 'Tooling' },
    { value: 'Design systems', label: 'Design systems' },
  ]

  const roleOptions: Option[] = [
    { value: 'all', label: 'Any role' },
    { value: 'Core', label: 'Core' },
    { value: 'Reviewer', label: 'Reviewer' },
    { value: 'Triage', label: 'Triage' },
    { value: 'Contributor', label: 'Contributor' },
  ]

  const statusOptions: Option[] = [
    { value: 'all', label: 'Any state' },
    { value: 'active', label: 'Active' },
    { value: 'onleave', label: 'On leave' },
    { value: 'inactive', label: 'Inactive' },
  ]

  function label (list: Option[], value: string) {
    return list.find(option => option.value === value)?.label ?? value
  }

  const filter = createFilter({ keys: ['name', 'handle', 'area'] })
  const found = filter.apply(search, members)

  const filtered = toRef(() => found.items.value.filter(member =>
    (area.value === 'all' || member.area === area.value)
    && (role.value === 'all' || member.role === role.value)
    && (status.value === 'all' || member.status === status.value),
  ))

  const pagination = createPagination({ page, size: () => filtered.value.length, itemsPerPage: 6 })
  const rows = toRef(() => filtered.value.slice(pagination.pageStart.value, pagination.pageStop.value))

  function initials (name: string) {
    return name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase()
  }
</script>

<template>
  <EmeraldShell>
    <div class="adm-productivity">
      <header class="adm-productivity__header">
        <h1 class="adm-productivity__title">Maintainer workload</h1>
        <p class="adm-productivity__subtitle">Triage rhythm, review latency and who is carrying the queue</p>
      </header>

      <section aria-label="Triage activity" class="adm-productivity__top">
        <EmCard class="adm-productivity__panel" variant="simple">
          <EmCardHeader class="adm-productivity__heat-head">
            <div>
              <EmCardTitle class="adm-productivity__panel-title">Triage activity</EmCardTitle>
              <p class="adm-productivity__panel-sub">Every label, close and reply, last 18 weeks</p>
            </div>

            <div class="adm-productivity__heat-stats">
              <div><strong>1,284</strong><span>triage actions</span></div>
              <div><strong>341</strong><span>open issues</span></div>
              <div><strong>5.2h</strong><span>median first reply</span></div>
            </div>
          </EmCardHeader>

          <EmCardBody>
            <div aria-label="Triage actions by day and week" class="adm-productivity__heat" role="img">
              <div v-for="(row, day) in heat" :key="days[day]" class="adm-productivity__heat-row">
                <span class="adm-productivity__heat-day">{{ days[day] }}</span>

                <div class="adm-productivity__heat-cells">
                  <span v-for="(level, week) in row" :key="week" class="adm-productivity__cell" :data-level="level" />
                </div>
              </div>
            </div>

            <div class="adm-productivity__heat-legend">
              <span>Quieter</span>
              <span v-for="level in 5" :key="level" class="adm-productivity__cell" :data-level="level - 1" />
              <span>Busier</span>
            </div>
          </EmCardBody>
        </EmCard>

        <EmCard class="adm-productivity__panel" variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-productivity__panel-title">Rotation this week</EmCardTitle>
            <p class="adm-productivity__panel-sub">One owner per weekday</p>
          </EmCardHeader>

          <EmCardBody>
            <ul class="adm-productivity__rotation">
              <li v-for="shift in rotation" :key="shift.day">
                <EmAvatar size="sm"><EmAvatarFallback>{{ initials(shift.who) }}</EmAvatarFallback></EmAvatar>

                <span class="adm-productivity__rotation-text">
                  <strong>{{ shift.who }}</strong>
                  <span>{{ shift.day }}</span>
                </span>

                <EmTag>{{ shift.queue }}</EmTag>
              </li>
            </ul>
          </EmCardBody>
        </EmCard>
      </section>

      <section aria-label="Queue health" class="adm-productivity__trio">
        <EmCard class="adm-productivity__panel" variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-productivity__panel-title">Open issues by age</EmCardTitle>
            <p class="adm-productivity__panel-sub">341 issues waiting on someone</p>
          </EmCardHeader>

          <EmCardBody>
            <div aria-label="Open issues grouped by age" class="adm-productivity__segbar" role="img">
              <span
                v-for="bucket in ages"
                :key="bucket.label"
                class="adm-productivity__seg"
                :data-tone="bucket.tone"
                :style="{ flexGrow: bucket.pct }"
              >{{ bucket.count }}</span>
            </div>

            <ul class="adm-productivity__legend">
              <li v-for="bucket in ages" :key="bucket.label">
                <span class="adm-productivity__dot" :data-tone="bucket.tone" />
                <span>{{ bucket.label }}</span>
                <strong>{{ bucket.pct }}%</strong>
              </li>
            </ul>
          </EmCardBody>
        </EmCard>

        <EmCard class="adm-productivity__panel" variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-productivity__panel-title">Review latency</EmCardTitle>
            <p class="adm-productivity__panel-sub">Median hours to first PR review, by week</p>
          </EmCardHeader>

          <EmCardBody>
            <span class="adm-productivity__stat">5h <em class="adm-productivity__delta" data-up>-9h since March</em></span>

            <div aria-label="Median review latency by week" class="adm-productivity__columns" role="img">
              <span
                v-for="(hours, index) in latency"
                :key="index"
                class="adm-productivity__column"
                :data-best="hours === Math.min(...latency) || undefined"
                :style="{ height: (hours / latencyMax) * 100 + '%' }"
              />
            </div>
          </EmCardBody>
        </EmCard>

        <EmCard class="adm-productivity__panel" variant="simple">
          <EmCardHeader>
            <EmCardTitle class="adm-productivity__panel-title">v1.1 burndown</EmCardTitle>
            <p class="adm-productivity__panel-sub">Milestone issues left, week by week</p>
          </EmCardHeader>

          <EmCardBody>
            <span class="adm-productivity__stat">38 <em class="adm-productivity__delta" data-up>-60% from open</em></span>

            <svg
              aria-label="Milestone burndown"
              class="adm-productivity__curve"
              preserveAspectRatio="none"
              role="img"
              viewBox="0 0 100 40"
            >
              <polyline
                fill="none"
                :points="curve"
                stroke="var(--emerald-primary-600, #1fae60)"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="3"
              />
            </svg>
          </EmCardBody>
        </EmCard>
      </section>

      <section aria-label="Contributors">
        <EmCard variant="simple">
          <EmCardHeader class="adm-productivity__toolbar">
            <EmCardTitle class="adm-productivity__panel-title">Contributors</EmCardTitle>

            <div class="adm-productivity__filters">
              <EmTextField v-model="search" aria-label="Search contributors" class="adm-productivity__search" placeholder="Search contributor" />

              <EmSelect v-model="area" class="adm-productivity__select">
                <EmSelectActivator>
                  <EmSelectValue v-slot="{ selectedValue }">{{ label(areaOptions, String(selectedValue)) }}</EmSelectValue>
                </EmSelectActivator>

                <EmSelectContent>
                  <EmSelectItem v-for="option in areaOptions" :key="option.value" :value="option.value">{{ option.label }}</EmSelectItem>
                </EmSelectContent>
              </EmSelect>

              <EmSelect v-model="role" class="adm-productivity__select">
                <EmSelectActivator>
                  <EmSelectValue v-slot="{ selectedValue }">{{ label(roleOptions, String(selectedValue)) }}</EmSelectValue>
                </EmSelectActivator>

                <EmSelectContent>
                  <EmSelectItem v-for="option in roleOptions" :key="option.value" :value="option.value">{{ option.label }}</EmSelectItem>
                </EmSelectContent>
              </EmSelect>

              <EmSelect v-model="status" class="adm-productivity__select">
                <EmSelectActivator>
                  <EmSelectValue v-slot="{ selectedValue }">{{ label(statusOptions, String(selectedValue)) }}</EmSelectValue>
                </EmSelectActivator>

                <EmSelectContent>
                  <EmSelectItem v-for="option in statusOptions" :key="option.value" :value="option.value">{{ option.label }}</EmSelectItem>
                </EmSelectContent>
              </EmSelect>
            </div>
          </EmCardHeader>

          <EmCardBody class="adm-productivity__table-wrap">
            <table class="adm-productivity__table">
              <thead>
                <tr>
                  <th><EmCheckbox aria-label="Select all" /></th>
                  <th>Contributor</th>
                  <th>Area</th>
                  <th>Role</th>
                  <th>PRs merged</th>
                  <th>Issues closed</th>
                  <th>State</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="member in rows" :key="member.handle">
                  <td><EmCheckbox :aria-label="`Select ${member.name}`" /></td>

                  <td>
                    <div class="adm-productivity__client">
                      <EmAvatar size="sm"><EmAvatarFallback>{{ initials(member.name) }}</EmAvatarFallback></EmAvatar>
                      <span><strong>{{ member.name }}</strong><span class="adm-productivity__client-sub">{{ member.handle }}</span></span>
                    </div>
                  </td>

                  <td>{{ member.area }}</td>
                  <td>{{ member.role }}</td>
                  <td>{{ member.merged }}</td>
                  <td>{{ member.closed }}</td>

                  <td>
                    <EmTag :variant="member.status === 'active' ? 'success' : member.status === 'onleave' ? 'info' : 'neutral'">
                      {{ member.status === 'active' ? 'Active' : member.status === 'onleave' ? 'On leave' : 'Inactive' }}
                    </EmTag>
                  </td>
                </tr>
              </tbody>
            </table>
          </EmCardBody>

          <EmCardFooter class="adm-productivity__table-foot">
            <span class="adm-productivity__table-count">
              Showing {{ filtered.length > 0 ? pagination.pageStart.value + 1 : 0 }} to {{ pagination.pageStop.value }} of {{ filtered.length }} contributors
            </span>

            <EmPagination v-model="page" :items-per-page="6" :size="filtered.length">
              <template #default="{ items }">
                <EmPaginationPrev><EmIcon name="chevron-left" size="s" /> Previous</EmPaginationPrev>

                <template v-for="(item, index) in items" :key="index">
                  <EmPaginationItem v-if="item.type === 'page'" :value="item.value" />
                  <span v-else class="adm-productivity__page-gap">{{ item.value }}</span>
                </template>

                <EmPaginationNext>Next <EmIcon name="chevron-right" size="s" /></EmPaginationNext>
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

  .adm-productivity__panel-title {
    font-size: var(--emerald-text-b1-size, 16px) !important;
    font-weight: 700 !important;
  }

  .adm-productivity__panel-sub {
    margin: 2px 0 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
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

  .adm-productivity__top {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 300px);
    gap: var(--emerald-spacing-m, 16px);
  }

  /* .emerald-card__header is flex-direction: column — a title/action row has to
     opt back into row explicitly. */
  .adm-productivity__heat-head,
  .adm-productivity__toolbar {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-productivity__heat-stats {
    display: flex;
    gap: var(--emerald-spacing-l, 20px);
  }

  .adm-productivity__heat-stats > div {
    display: flex;
    flex-direction: column;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-productivity__heat-stats strong {
    color: var(--emerald-on-surface, #2b2d2e);
    font-size: 1.25rem;
  }

  .adm-productivity__heat {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: var(--emerald-spacing-xs, 8px);
  }

  .adm-productivity__heat-row {
    display: grid;
    grid-template-columns: 34px minmax(0, 1fr);
    align-items: center;
    gap: var(--emerald-spacing-xs, 8px);
  }

  .adm-productivity__heat-day {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-productivity__heat-cells {
    display: grid;
    grid-auto-columns: minmax(0, 1fr);
    grid-auto-flow: column;
    gap: 4px;
  }

  .adm-productivity__cell {
    height: 26px;
    border-radius: 3px;
    background: var(--emerald-neutral-200, #f6f8fa);
  }

  .adm-productivity__cell[data-level='1'] {
    background: var(--emerald-primary-100, #e7fff2);
  }

  .adm-productivity__cell[data-level='2'] {
    background: var(--emerald-primary-300, #baedd0);
  }

  .adm-productivity__cell[data-level='3'] {
    background: var(--emerald-primary-500, #26c26d);
  }

  .adm-productivity__cell[data-level='4'] {
    background: var(--emerald-primary-800, #01603a);
  }

  .adm-productivity__heat-legend {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 4px;
    margin-top: var(--emerald-spacing-s, 12px);
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-productivity__heat-legend .adm-productivity__cell {
    width: 18px;
    height: 18px;
  }

  .adm-productivity__heat-legend > span:first-child {
    margin-right: 4px;
  }

  .adm-productivity__heat-legend > span:last-child {
    margin-left: 4px;
  }

  .adm-productivity__rotation {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-m, 16px);
    margin: var(--emerald-spacing-xs, 8px) 0 0;
    padding: 0;
    list-style: none;
  }

  .adm-productivity__rotation li {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-productivity__rotation-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-productivity__rotation-text strong {
    color: var(--emerald-on-surface, #2b2d2e);
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-productivity__trio {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--emerald-spacing-m, 16px);
  }

  .adm-productivity__trio .emerald-card__body {
    display: flex;
    flex: 1;
    flex-direction: column;
  }

  .adm-productivity__segbar {
    display: flex;
    height: 40px;
    margin-top: var(--emerald-spacing-xs, 8px);
    border-radius: var(--emerald-radius-m, 8px);
    overflow: hidden;
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 600;
  }

  .adm-productivity__seg {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: var(--emerald-primary-800, #01603a);
    color: var(--emerald-on-primary, #fff);
  }

  .adm-productivity__seg[data-tone='mid'] {
    background: var(--emerald-primary-600, #1fae60);
  }

  .adm-productivity__seg[data-tone='light'] {
    background: var(--emerald-primary-500, #26c26d);
  }

  .adm-productivity__seg[data-tone='pale'] {
    background: var(--emerald-primary-300, #baedd0);
    color: var(--emerald-on-surface, #2b2d2e);
  }

  .adm-productivity__seg[data-tone='muted'] {
    background: var(--emerald-neutral-300, #ccd6e7);
    color: var(--emerald-on-surface, #2b2d2e);
  }

  .adm-productivity__legend {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-xs, 8px);
    margin: var(--emerald-spacing-m, 16px) 0 0;
    padding: 0;
    list-style: none;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-productivity__legend li {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .adm-productivity__legend strong {
    margin-left: auto;
    color: var(--emerald-on-surface, #2b2d2e);
  }

  .adm-productivity__dot {
    width: 10px;
    height: 10px;
    border-radius: 3px;
    background: var(--emerald-primary-800, #01603a);
  }

  .adm-productivity__dot[data-tone='mid'] {
    background: var(--emerald-primary-600, #1fae60);
  }

  .adm-productivity__dot[data-tone='light'] {
    background: var(--emerald-primary-500, #26c26d);
  }

  .adm-productivity__dot[data-tone='pale'] {
    background: var(--emerald-primary-300, #baedd0);
  }

  .adm-productivity__dot[data-tone='muted'] {
    background: var(--emerald-neutral-300, #ccd6e7);
  }

  .adm-productivity__stat {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-top: var(--emerald-spacing-xs, 8px);
    font-size: 1.75rem;
    font-weight: 700;
  }

  .adm-productivity__columns {
    display: flex;
    align-items: flex-end;
    gap: 6px;
    height: 90px;
    margin-top: auto;
    padding-top: var(--emerald-spacing-m, 16px);
  }

  .adm-productivity__column {
    flex: 1;
    min-height: 6px;
    border-radius: var(--emerald-radius-xs, 4px) var(--emerald-radius-xs, 4px) 0 0;
    background: var(--emerald-primary-300, #baedd0);
  }

  .adm-productivity__column[data-best] {
    background: var(--emerald-primary-600, #1fae60);
  }

  .adm-productivity__curve {
    width: 100%;
    height: 90px;
    margin-top: auto;
    padding-top: var(--emerald-spacing-m, 16px);
  }

  .adm-productivity__filters {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--emerald-spacing-xs, 8px);
  }

  .adm-productivity__search {
    width: 200px;
  }

  .adm-productivity__select {
    width: 140px;
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

  .adm-productivity__client-sub {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-productivity__table-foot {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-productivity__table-count {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-productivity__page-gap {
    padding: 0 var(--emerald-spacing-2xs, 4px);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  @media (max-width: 1200px) {
    .adm-productivity__top,
    .adm-productivity__trio {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .adm-productivity__search,
    .adm-productivity__select {
      width: 100%;
    }

    .adm-productivity__heat-stats {
      gap: var(--emerald-spacing-m, 16px);
    }

    .adm-productivity__cell {
      height: 12px;
    }

    .adm-productivity__heat-cells {
      gap: 2px;
    }
  }
</style>
