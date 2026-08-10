<script setup lang="ts">
  import {
    EmButton,
    EmCalendar,
    EmCalendarGrid,
    EmCalendarHeader,
    EmCalendarMini,
    EmCalendarNext,
    EmCalendarPrev,
    EmCalendarTitle,
    EmCalendarToday,
    EmCheckbox,
    EmDialog,
    EmDialogClose,
    EmDialogContent,
    EmDialogFooter,
    EmDialogTitle,
    EmSelect,
    EmSelectActivator,
    EmSelectContent,
    EmSelectItem,
    EmSelectValue,
    EmTextField,
  } from '@paper/emerald'

  // Framework
  import { createGroup } from '@vuetify/v0'

  // Context
  import EmeraldShell from './EmeraldShell.vue'

  // Utilities
  import { ref, shallowRef, toRef } from 'vue'

  // Types
  import type { EmCalendarEvent, EmCalendarTone } from '@paper/emerald'

  type Category = 'Release' | 'Community' | 'Conference' | 'Internal' | 'Personal'

  interface CalendarEvent {
    iso: string
    time: string
    title: string
    category: Category
  }

  const events = ref<CalendarEvent[]>([
    { iso: '2026-07-30', time: 'All day', title: 'v1.1.2 patch ships', category: 'Release' },
    { iso: '2026-08-04', time: '09:30', title: 'Core sync', category: 'Internal' },
    { iso: '2026-08-05', time: '15:00', title: 'Emerald design review', category: 'Internal' },
    { iso: '2026-08-06', time: 'All day', title: 'Vue Fes CFP closes', category: 'Conference' },
    { iso: '2026-08-07', time: '11:00', title: 'Northwind renewal call', category: 'Internal' },
    { iso: '2026-08-11', time: '16:00', title: 'August community call', category: 'Community' },
    { iso: '2026-08-11', time: 'All day', title: 'Emerald token drop', category: 'Release' },
    { iso: '2026-08-11', time: '18:00', title: 'Office hours', category: 'Community' },
    { iso: '2026-08-13', time: '10:00', title: 'Accessibility walkthrough', category: 'Internal' },
    { iso: '2026-08-14', time: 'All day', title: 'Docs freeze', category: 'Release' },
    { iso: '2026-08-18', time: '09:00', title: 'Composable API review', category: 'Internal' },
    { iso: '2026-08-20', time: '13:00', title: 'Contributor office hours', category: 'Community' },
    { iso: '2026-08-21', time: '17:00', title: 'v1.2 changeset freeze', category: 'Release' },
    { iso: '2026-08-25', time: 'All day', title: 'v1.2 ships', category: 'Release' },
    { iso: '2026-08-25', time: '19:00', title: 'Release stream', category: 'Community' },
    { iso: '2026-08-27', time: 'All day', title: 'Conference travel', category: 'Personal' },
    { iso: '2026-08-28', time: '14:00', title: 'Train retro', category: 'Internal' },
    { iso: '2026-09-02', time: 'All day', title: 'Roadmap workshop', category: 'Internal' },
  ])

  const categories: Category[] = ['Release', 'Community', 'Conference', 'Internal', 'Personal']

  /** The page owns the category vocabulary; the calendar only speaks in tones. */
  const tones: Record<Category, EmCalendarTone> = {
    Release: 'primary',
    Community: 'secondary',
    Conference: 'info',
    Internal: 'neutral',
    Personal: 'alert',
  }

  const filter = createGroup()
  for (const category of categories) filter.register({ id: category, value: category })
  filter.selectAll()

  const shown = toRef(() => events.value.filter(event => filter.selected(event.category)))

  /** The component's only seam: the page filters, the calendar renders what it is given. */
  const visible = toRef((): EmCalendarEvent[] => shown.value.map(event => ({
    date: event.iso,
    title: event.title,
    time: event.time,
    allDay: event.time === 'All day',
    tone: tones[event.category],
  })))

  function count (category: Category) {
    return events.value.filter(event => event.category === category).length
  }

  // 'en-CA' is the shortest honest YYYY-MM-DD — toISOString() would shift the
  // day west of Greenwich.
  const now = new Date().toLocaleDateString('en-CA')

  const selected = shallowRef(now)
  const month = shallowRef(new Date())

  /** Agenda strip: the next handful of visible events from today forward. */
  const upcoming = toRef(() => shown.value
    .filter(event => event.iso >= now)
    .toSorted((a, b) => a.iso.localeCompare(b.iso) || a.time.localeCompare(b.time))
    .slice(0, 5))

  function dayLabel (iso: string) {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
  }

  const monthCount = toRef(() => {
    const prefix = `${month.value.getFullYear()}-${String(month.value.getMonth() + 1).padStart(2, '0')}`
    return shown.value.filter(event => event.iso.startsWith(prefix)).length
  })

  const newEventOpen = shallowRef(false)
  const newEventTitle = shallowRef('')
  const newEventDate = shallowRef(now)
  const newEventCategory = shallowRef<Category>('Internal')

  function onCreateEvent () {
    if (!newEventTitle.value.trim()) return
    events.value.push({ iso: newEventDate.value, time: 'All day', title: newEventTitle.value.trim(), category: newEventCategory.value })
    newEventOpen.value = false
    newEventTitle.value = ''
  }
</script>

<template>
  <EmeraldShell>
    <div class="adm-calendar">
      <!-- Month label and its arrows lead the header; the actions cluster at
           the trailing edge instead of straddling the row. -->
      <EmCalendar
        v-model="selected"
        v-model:month="month"
        :events="visible"
      >
        <EmCalendarHeader>
          <div class="adm-calendar__main-nav">
            <EmCalendarPrev />
            <EmCalendarNext />

            <div class="adm-calendar__main-title">
              <EmCalendarTitle as="h1" />
              <p>{{ monthCount }} events visible</p>
            </div>
          </div>

          <div class="adm-calendar__main-actions">
            <EmCalendarToday />

            <EmButton variant="primary" @click="newEventOpen = true">
              <svg
                aria-hidden="true"
                fill="none"
                height="16"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                viewBox="0 0 24 24"
                width="16"
              ><path d="M12 5v14M5 12h14" /></svg>
              New event
            </EmButton>
          </div>
        </EmCalendarHeader>

        <EmCalendarGrid />
      </EmCalendar>

      <aside aria-label="Calendar controls" class="adm-calendar__side">
        <!-- Same page refs as the main grid, so the two roots stay in lockstep.
             Month stepping lives once, in the main header. -->
        <EmCalendar
          v-model="selected"
          v-model:month="month"
          class="adm-calendar__mini"
          :events="visible"
        >
          <!-- The main header's title already announces the month; both roots
               share one cursor, so a live region here would double it up. -->
          <EmCalendarTitle
            as="p"
            class="adm-calendar__mini-head"
            :live="false"
          />

          <EmCalendarMini />
        </EmCalendar>

        <div class="adm-calendar__filters">
          <p class="adm-calendar__side-title">Calendars</p>

          <EmCheckbox
            :indeterminate="filter.isMixed.value"
            :model-value="filter.isAllSelected.value"
            @update:model-value="filter.toggleAll()"
          >
            <span class="adm-calendar__filter-label">
              <span class="adm-calendar__filter-name">Everything</span>
              <span class="adm-calendar__filter-count">{{ events.length }}</span>
            </span>
          </EmCheckbox>

          <EmCheckbox
            v-for="category in categories"
            :key="category"
            :model-value="filter.selected(category)"
            @update:model-value="filter.toggle(category)"
          >
            <span class="adm-calendar__filter-label">
              <span aria-hidden="true" class="adm-calendar__dot" :data-tone="tones[category]" />
              <span class="adm-calendar__filter-name">{{ category }}</span>
              <span class="adm-calendar__filter-count">{{ count(category) }}</span>
            </span>
          </EmCheckbox>
        </div>

        <!-- Agenda strip: what the month grid cannot show at a glance. -->
        <div class="adm-calendar__agenda">
          <p class="adm-calendar__side-title">Up next</p>

          <ul>
            <li v-for="event in upcoming" :key="`${event.iso}-${event.title}`">
              <span aria-hidden="true" class="adm-calendar__dot" :data-tone="tones[event.category]" />

              <span class="adm-calendar__agenda-body">
                <span class="adm-calendar__agenda-title">{{ event.title }}</span>
                <span class="adm-calendar__agenda-when">{{ dayLabel(event.iso) }} · {{ event.time }}</span>
              </span>
            </li>

            <li v-if="upcoming.length === 0" class="adm-calendar__agenda-empty">Nothing scheduled in the visible calendars.</li>
          </ul>
        </div>
      </aside>

      <EmDialog v-model="newEventOpen">
        <EmDialogContent>
          <div class="adm-calendar__dialog-head">
            <EmDialogTitle>New event</EmDialogTitle>
            <EmDialogClose />
          </div>

          <EmTextField v-model="newEventTitle" aria-label="Event title" placeholder="Event title" />
          <EmTextField v-model="newEventDate" aria-label="Date" placeholder="YYYY-MM-DD" />

          <EmSelect v-model="newEventCategory">
            <EmSelectActivator>
              <EmSelectValue />
            </EmSelectActivator>

            <EmSelectContent>
              <EmSelectItem v-for="category in categories" :key="category" :value="category">{{ category }}</EmSelectItem>
            </EmSelectContent>
          </EmSelect>

          <EmDialogFooter>
            <EmButton variant="tertiary" @click="newEventOpen = false">Cancel</EmButton>
            <EmButton variant="primary" @click="onCreateEvent">Create</EmButton>
          </EmDialogFooter>
        </EmDialogContent>
      </EmDialog>
    </div>
  </EmeraldShell>
</template>

<style>
  /* The rail trails the grid — the reference leads with it. */
  .adm-calendar {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 264px;
    gap: var(--emerald-spacing-m, 16px);
    align-items: start;
  }

  .adm-calendar__side {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-m, 16px);
  }

  /* The mini rides EmCalendar's own card chrome; these two still need it. */
  .adm-calendar__filters,
  .adm-calendar__agenda {
    padding: var(--emerald-spacing-m, 16px);
    background: var(--emerald-background, #fefefe);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    border-radius: var(--emerald-radius-xl, 12px);
    box-shadow: var(--emerald-shadow-s, 0 0 2px 0 rgba(51, 51, 51, 0.08));
  }

  /* Compound selector: the DS title class carries its own h4 type, and a single
     page class would tie on specificity and lose to load order. */
  .adm-calendar__mini .adm-calendar__mini-head {
    margin: var(--emerald-spacing-m, 16px) var(--emerald-spacing-m, 16px) 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .adm-calendar__mini-head + .emerald-calendar__mini {
    padding-top: var(--emerald-spacing-s, 12px);
  }

  .adm-calendar__filters {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-calendar__side-title {
    margin: 0;
    font-weight: 700;
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-calendar__filter-label {
    display: inline-flex;
    align-items: center;
    gap: var(--emerald-spacing-xs, 8px);
    width: 100%;
  }

  .adm-calendar__filter-name {
    flex: 1;
  }

  .adm-calendar__filter-count {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-calendar__dot {
    flex: none;
    width: 8px;
    height: 8px;
    border-radius: var(--emerald-radius-full, 999px);
    background: var(--emerald-neutral-600, #939dac);
  }

  .adm-calendar__dot[data-tone='primary'] { background: var(--emerald-primary-600, #1fae60); }
  .adm-calendar__dot[data-tone='secondary'] { background: var(--emerald-secondary-600, #00b4dc); }
  .adm-calendar__dot[data-tone='info'] { background: var(--emerald-info-500, #3a70e2); }
  .adm-calendar__dot[data-tone='alert'] { background: var(--emerald-alert-600, #d9af00); }
  .adm-calendar__dot[data-tone='danger'] { background: var(--emerald-danger-500, #e5484d); }

  .adm-calendar__agenda ul {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-s, 12px);
    margin: var(--emerald-spacing-s, 12px) 0 0;
    padding: 0;
    list-style: none;
  }

  .adm-calendar__agenda li {
    display: flex;
    align-items: flex-start;
    gap: var(--emerald-spacing-xs, 8px);
  }

  .adm-calendar__agenda .adm-calendar__dot {
    margin-top: 5px;
  }

  .adm-calendar__agenda-body {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .adm-calendar__agenda-title {
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 600;
  }

  .adm-calendar__agenda-when,
  .adm-calendar__agenda-empty {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: 11px;
  }

  .adm-calendar__main-nav {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-xs, 8px);
  }

  .adm-calendar__main-title {
    margin-left: 4px;
  }

  .adm-calendar__main-title p {
    margin: 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: 11px;
  }

  .adm-calendar__main-actions {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-xs, 8px);
  }

  .adm-calendar__dialog-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  @media (max-width: 1024px) {
    .adm-calendar {
      grid-template-columns: minmax(0, 1fr);
    }

    .adm-calendar__side {
      flex-direction: row;
      flex-wrap: wrap;
    }

    .adm-calendar__mini,
    .adm-calendar__filters,
    .adm-calendar__agenda {
      flex: 1;
      min-width: 220px;
    }
  }

  /* The month grid is the mini calendar's superset, so drop the duplicate and
     let the grid (with its events) sit near the top of the viewport. */
  @media (max-width: 640px) {
    .adm-calendar__mini {
      display: none;
    }

    .adm-calendar__filters {
      flex-direction: row;
      flex-wrap: wrap;
      gap: var(--emerald-spacing-xs, 8px) var(--emerald-spacing-m, 16px);
      align-items: center;
    }

    .adm-calendar__filters .adm-calendar__side-title {
      flex: 1 0 100%;
    }

    .adm-calendar__filter-count {
      display: none;
    }
  }
</style>
