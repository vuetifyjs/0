<script setup lang="ts">
  import {
    EmButton,
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
  import { createGroup, createSingle } from '@vuetify/v0'

  // Context
  import EmeraldShell from './EmeraldShell.vue'

  // Utilities
  import { shallowRef, toRef } from 'vue'

  type Category = 'Release' | 'Community' | 'Conference' | 'Internal' | 'Personal'

  interface CalendarEvent {
    iso: string
    time: string
    title: string
    category: Category
  }

  const events: CalendarEvent[] = [
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
  ]

  const categories: Category[] = ['Release', 'Community', 'Conference', 'Internal', 'Personal']

  const eventFilter = createGroup()
  for (const category of categories) eventFilter.register({ id: category, value: category })
  eventFilter.selectAll()

  const visibleEvents = toRef(() => events.filter(event => eventFilter.selected(event.category)))

  function categoryCount (category: Category) {
    return events.filter(event => event.category === category).length
  }

  function toIso (date: Date) {
    return date.toISOString().slice(0, 10)
  }

  const today = new Date()
  const cursor = shallowRef(new Date(today.getFullYear(), today.getMonth(), 1))

  const monthLabel = toRef(() => cursor.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }))
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  function buildMonth (anchor: Date) {
    const year = anchor.getFullYear()
    const month = anchor.getMonth()
    const first = new Date(year, month, 1)
    const start = new Date(year, month, 1 - first.getDay())
    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(start)
      date.setDate(start.getDate() + index)
      return { date, iso: toIso(date), inMonth: date.getMonth() === month }
    })
  }

  const cells = toRef(() => buildMonth(cursor.value))

  function eventsOn (iso: string) {
    return visibleEvents.value.filter(event => event.iso === iso)
  }

  /** Agenda strip: the next handful of visible events from today forward. */
  const upcoming = toRef(() => visibleEvents.value
    .filter(event => event.iso >= toIso(today))
    .toSorted((a, b) => a.iso.localeCompare(b.iso) || a.time.localeCompare(b.time))
    .slice(0, 5))

  function dayLabel (iso: string) {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
  }

  const monthCount = toRef(() => {
    const prefix = `${cursor.value.getFullYear()}-${String(cursor.value.getMonth() + 1).padStart(2, '0')}`
    return visibleEvents.value.filter(event => event.iso.startsWith(prefix)).length
  })

  function onPrevMonth () {
    const date = new Date(cursor.value)
    date.setMonth(date.getMonth() - 1)
    cursor.value = date
  }

  function onNextMonth () {
    const date = new Date(cursor.value)
    date.setMonth(date.getMonth() + 1)
    cursor.value = date
  }

  function onToday () {
    cursor.value = new Date(today.getFullYear(), today.getMonth(), 1)
    dayNav.select(toIso(today))
  }

  const dayNav = createSingle({ mandatory: 'force' })
  dayNav.register({ id: toIso(today), value: today })
  dayNav.select(toIso(today))

  function onSelectDay (iso: string) {
    if (!dayNav.has(iso)) dayNav.register({ id: iso, value: new Date(iso) })
    dayNav.select(iso)
  }

  const newEventOpen = shallowRef(false)
  const newEventTitle = shallowRef('')
  const newEventDate = shallowRef(toIso(today))
  const newEventCategory = shallowRef<Category>('Internal')

  function onCreateEvent () {
    if (!newEventTitle.value.trim()) return
    events.push({ iso: newEventDate.value, time: 'All day', title: newEventTitle.value.trim(), category: newEventCategory.value })
    newEventOpen.value = false
    newEventTitle.value = ''
  }
</script>

<template>
  <EmeraldShell>
    <div class="adm-calendar">
      <section aria-label="Month view" class="adm-calendar__main">
        <!-- Month label and its arrows lead the header; the actions cluster at
             the trailing edge instead of straddling the row. -->
        <header class="adm-calendar__main-head">
          <div class="adm-calendar__main-nav">
            <button aria-label="Previous month" class="adm-calendar__nav-btn" type="button" @click="onPrevMonth">‹</button>
            <button aria-label="Next month" class="adm-calendar__nav-btn" type="button" @click="onNextMonth">›</button>

            <div class="adm-calendar__main-title">
              <h1>{{ monthLabel }}</h1>
              <p>{{ monthCount }} events visible</p>
            </div>
          </div>

          <div class="adm-calendar__main-actions">
            <EmButton variant="tertiary" @click="onToday">Today</EmButton>

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
        </header>

        <div class="adm-calendar__weekdays">
          <span v-for="day in weekdays" :key="day">{{ day }}</span>
        </div>

        <div class="adm-calendar__grid">
          <div
            v-for="cell in cells"
            :key="cell.iso"
            class="adm-calendar__cell"
            :data-out="!cell.inMonth || undefined"
            :data-selected="dayNav.selected(cell.iso) || undefined"
            @click="onSelectDay(cell.iso)"
          >
            <span class="adm-calendar__cell-date" :data-today="cell.iso === toIso(today) || undefined">{{ cell.date.getDate() }}</span>

            <ul class="adm-calendar__cell-events">
              <!-- All-day events read as a filled bar; timed ones trail their clock time. -->
              <li
                v-for="event in eventsOn(cell.iso).slice(0, 2)"
                :key="event.title"
                :data-allday="event.time === 'All day' || undefined"
                :data-category="event.category"
              >
                <span class="adm-calendar__chip-title">{{ event.title }}</span>
                <span v-if="event.time !== 'All day'" class="adm-calendar__chip-time">{{ event.time }}</span>
              </li>

              <li v-if="eventsOn(cell.iso).length > 2" class="adm-calendar__cell-more">+{{ eventsOn(cell.iso).length - 2 }} more</li>
            </ul>
          </div>
        </div>
      </section>

      <aside aria-label="Calendar controls" class="adm-calendar__side">
        <div class="adm-calendar__mini">
          <p class="adm-calendar__mini-head">{{ monthLabel }}</p>

          <div class="adm-calendar__mini-grid">
            <span v-for="day in weekdays" :key="day" class="adm-calendar__mini-weekday">{{ day.slice(0, 2) }}</span>

            <button
              v-for="cell in cells"
              :key="cell.iso"
              class="adm-calendar__mini-day"
              :data-selected="dayNav.selected(cell.iso) || undefined"
              :data-today="cell.iso === toIso(today) || undefined"
              :disabled="!cell.inMonth"
              type="button"
              @click="onSelectDay(cell.iso)"
            >
              {{ cell.date.getDate() }}

              <span aria-hidden="true" class="adm-calendar__mini-dots">
                <span
                  v-for="event in eventsOn(cell.iso).slice(0, 3)"
                  :key="event.title"
                  class="adm-calendar__mini-dot"
                  :data-category="event.category"
                />
              </span>
            </button>
          </div>
        </div>

        <div class="adm-calendar__filters">
          <p class="adm-calendar__side-title">Calendars</p>

          <EmCheckbox
            :indeterminate="eventFilter.isMixed.value"
            :model-value="eventFilter.isAllSelected.value"
            @update:model-value="eventFilter.toggleAll()"
          >
            <span class="adm-calendar__filter-label">
              <span class="adm-calendar__filter-name">Everything</span>
              <span class="adm-calendar__filter-count">{{ events.length }}</span>
            </span>
          </EmCheckbox>

          <EmCheckbox
            v-for="category in categories"
            :key="category"
            :model-value="eventFilter.selected(category)"
            @update:model-value="eventFilter.toggle(category)"
          >
            <span class="adm-calendar__filter-label">
              <span aria-hidden="true" class="adm-calendar__dot" :data-category="category" />
              <span class="adm-calendar__filter-name">{{ category }}</span>
              <span class="adm-calendar__filter-count">{{ categoryCount(category) }}</span>
            </span>
          </EmCheckbox>
        </div>

        <!-- Agenda strip: what the month grid cannot show at a glance. -->
        <div class="adm-calendar__agenda">
          <p class="adm-calendar__side-title">Up next</p>

          <ul>
            <li v-for="event in upcoming" :key="`${event.iso}-${event.title}`">
              <span aria-hidden="true" class="adm-calendar__dot" :data-category="event.category" />

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

              <svg
                aria-hidden="true"
                class="emerald-select__icon"
                fill="none"
                height="16"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                viewBox="0 0 16 16"
                width="16"
              ><path d="M4 6l4 4 4-4" /></svg>
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

  .adm-calendar__mini,
  .adm-calendar__filters,
  .adm-calendar__agenda {
    padding: var(--emerald-spacing-m, 16px);
    background: var(--emerald-background, #fefefe);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    border-radius: var(--emerald-radius-xl, 12px);
    box-shadow: var(--emerald-shadow-s, 0 0 2px 0 rgba(51, 51, 51, 0.08));
  }

  /* Month stepping lives once, in the main header. */
  .adm-calendar__mini-head {
    margin: 0 0 var(--emerald-spacing-s, 12px);
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .adm-calendar__nav-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    border-radius: var(--emerald-radius-m, 8px);
    background: var(--emerald-background, #fefefe);
    color: var(--emerald-on-surface, #2b2d2e);
    cursor: pointer;
    font-size: 1rem;
    line-height: 1;
  }

  .adm-calendar__nav-btn:hover {
    background: var(--emerald-neutral-200, #f6f8fa);
  }

  .adm-calendar__mini-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
  }

  .adm-calendar__mini-weekday {
    padding: 2px 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: 10px;
    font-weight: 600;
    text-align: center;
  }

  .adm-calendar__mini-day {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 28px;
    border: none;
    border-radius: var(--emerald-radius-m, 8px);
    background: transparent;
    color: var(--emerald-on-surface, #2b2d2e);
    font-size: var(--emerald-text-b3-size, 12px);
    cursor: pointer;
  }

  .adm-calendar__mini-day:disabled {
    color: var(--emerald-on-surface-variant, #757e85);
    opacity: 0.5;
  }

  .adm-calendar__mini-day:hover:not(:disabled) {
    background: var(--emerald-neutral-200, #f6f8fa);
  }

  .adm-calendar__mini-day[data-today] {
    font-weight: 700;
  }

  .adm-calendar__mini-day[data-selected] {
    background: var(--emerald-primary-700, #027d4c);
    color: var(--emerald-on-primary, #fff);
  }

  .adm-calendar__mini-dots {
    display: flex;
    gap: 2px;
    height: 4px;
    margin-top: 1px;
  }

  .adm-calendar__mini-dot,
  .adm-calendar__dot {
    flex: none;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--emerald-primary-600, #1fae60);
  }

  .adm-calendar__dot {
    width: 8px;
    height: 8px;
  }

  .adm-calendar__mini-dot[data-category='Community'],
  .adm-calendar__dot[data-category='Community'] { background: var(--emerald-secondary-600, #00b4dc); }
  .adm-calendar__mini-dot[data-category='Conference'],
  .adm-calendar__dot[data-category='Conference'] { background: var(--emerald-info-500, #3a70e2); }
  .adm-calendar__mini-dot[data-category='Internal'],
  .adm-calendar__dot[data-category='Internal'] { background: var(--emerald-neutral-600, #939dac); }
  .adm-calendar__mini-dot[data-category='Personal'],
  .adm-calendar__dot[data-category='Personal'] { background: var(--emerald-alert-600, #d9af00); }

  .adm-calendar__mini-day[data-selected] .adm-calendar__mini-dot {
    background: var(--emerald-on-primary, #fff);
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

  .adm-calendar__main {
    display: flex;
    flex-direction: column;
    background: var(--emerald-background, #fefefe);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    border-radius: var(--emerald-radius-xl, 12px);
    box-shadow: var(--emerald-shadow-s, 0 0 2px 0 rgba(51, 51, 51, 0.08));
    overflow: hidden;
  }

  .adm-calendar__main-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--emerald-spacing-m, 16px);
    padding: var(--emerald-spacing-s, 12px) var(--emerald-spacing-m, 16px);
    border-bottom: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
  }

  .adm-calendar__main-nav {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-xs, 8px);
  }

  .adm-calendar__main-title {
    margin-left: 4px;
  }

  .adm-calendar__main-title h1 {
    margin: 0;
    font-size: var(--emerald-text-h4-size, 20px);
    font-weight: 700;
    letter-spacing: -0.01em;
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

  .adm-calendar__weekdays {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    padding: var(--emerald-spacing-xs, 8px) 0;
    border-bottom: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
  }

  .adm-calendar__weekdays span {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    text-align: center;
  }

  /* minmax(0, 1fr): plain 1fr floors at min-content, and the nowrap event chips
     would push the columns past the card and out of step with the day header. */
  .adm-calendar__grid {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    grid-auto-rows: minmax(104px, 1fr);
  }

  .adm-calendar__cell {
    min-width: 0;
    padding: 6px;
    border-right: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-200, #f6f8fa);
    border-bottom: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-200, #f6f8fa);
    cursor: pointer;
  }

  .adm-calendar__cell:hover {
    background: var(--emerald-neutral-200, #f6f8fa);
  }

  .adm-calendar__cell[data-selected] {
    background: var(--emerald-primary-100, #e7fff2);
  }

  .adm-calendar__cell[data-out] {
    color: var(--emerald-on-surface-variant, #757e85);
    opacity: 0.5;
  }

  .adm-calendar__cell-date {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 22px;
    height: 22px;
    border-radius: var(--emerald-radius-s, 6px);
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 600;
  }

  .adm-calendar__cell-date[data-today] {
    background: var(--emerald-primary-700, #027d4c);
    color: var(--emerald-on-primary, #fff);
  }

  .adm-calendar__cell-events {
    display: flex;
    flex-direction: column;
    gap: 3px;
    margin: 4px 0 0;
    padding: 0;
    list-style: none;
  }

  /* Chips are ruled on the leading edge rather than filled end to end, and the
     time trails the title instead of leading it. */
  .adm-calendar__cell-events li {
    display: flex;
    align-items: baseline;
    gap: 4px;
    overflow: hidden;
    min-width: 0;
    padding: 1px 4px;
    border-left: 3px solid var(--emerald-primary-600, #1fae60);
    border-radius: 0 3px 3px 0;
    background: var(--emerald-neutral-200, #f6f8fa);
    font-size: 10px;
  }

  .adm-calendar__cell-events li[data-category='Community'] { border-left-color: var(--emerald-secondary-600, #00b4dc); }
  .adm-calendar__cell-events li[data-category='Conference'] { border-left-color: var(--emerald-info-500, #3a70e2); }
  .adm-calendar__cell-events li[data-category='Internal'] { border-left-color: var(--emerald-neutral-600, #939dac); }
  .adm-calendar__cell-events li[data-category='Personal'] { border-left-color: var(--emerald-alert-600, #d9af00); }

  .adm-calendar__cell-events li[data-allday] { background: var(--emerald-primary-100, #e7fff2); }
  .adm-calendar__cell-events li[data-allday][data-category='Community'] { background: var(--emerald-secondary-100, #dbf8ff); }
  .adm-calendar__cell-events li[data-allday][data-category='Conference'] { background: var(--emerald-info-100, #e4f2ff); }
  .adm-calendar__cell-events li[data-allday][data-category='Internal'] { background: var(--emerald-neutral-300, #ccd6e7); }
  .adm-calendar__cell-events li[data-allday][data-category='Personal'] { background: var(--emerald-alert-100, #fff7e1); }

  .adm-calendar__chip-title {
    overflow: hidden;
    flex: 1;
    min-width: 0;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .adm-calendar__chip-time {
    flex: none;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: 9px;
  }

  .adm-calendar__cell-more {
    border-left-color: transparent !important;
    background: transparent !important;
    color: var(--emerald-on-surface-variant, #757e85);
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

    .adm-calendar__main-head {
      flex-wrap: wrap;
      gap: var(--emerald-spacing-xs, 8px);
    }

    .adm-calendar__grid {
      grid-auto-rows: minmax(76px, 1fr);
    }

    .adm-calendar__cell-events li {
      padding: 1px 2px;
      font-size: 9px;
    }

    .adm-calendar__chip-time {
      display: none;
    }
  }
</style>
