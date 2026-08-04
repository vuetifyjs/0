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

  type Category = 'Family' | 'Business' | 'Personal' | 'Holiday' | 'Etc'

  interface CalendarEvent {
    iso: string
    time: string
    title: string
    category: Category
  }

  const events: CalendarEvent[] = [
    { iso: '2026-07-31', time: '1pm', title: 'Project review', category: 'Business' },
    { iso: '2026-08-04', time: '10am', title: 'Team sync', category: 'Business' },
    { iso: '2026-08-05', time: '12pm', title: 'Lunch with Sarah', category: 'Personal' },
    { iso: '2026-08-07', time: '9am', title: 'Product launch', category: 'Business' },
    { iso: '2026-08-08', time: '2:30pm', title: 'Sales pitch', category: 'Business' },
    { iso: '2026-08-09', time: '9am', title: 'Team offsite', category: 'Family' },
    { iso: '2026-08-10', time: '11am', title: 'Design critique', category: 'Business' },
    { iso: '2026-08-13', time: '10am', title: 'Marketing review', category: 'Business' },
    { iso: '2026-08-21', time: '9am', title: 'Annual shareholder call', category: 'Business' },
    { iso: '2026-08-30', time: '9am', title: 'Product launch retro', category: 'Business' },
    { iso: '2026-08-14', time: 'All day', title: 'Company holiday', category: 'Holiday' },
    { iso: '2026-08-16', time: 'All day', title: 'Errands', category: 'Etc' },
  ]

  const categories: Category[] = ['Family', 'Business', 'Personal', 'Holiday', 'Etc']

  const eventFilter = createGroup()
  for (const category of categories) eventFilter.register({ id: category, value: category })
  eventFilter.selectAll()

  const visibleEvents = toRef(() => events.filter(event => eventFilter.selected(event.category)))

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
  const newEventCategory = shallowRef<Category>('Business')

  function onCreateEvent () {
    if (!newEventTitle.value.trim()) return
    events.push({ iso: newEventDate.value, time: 'All day', title: newEventTitle.value.trim(), category: newEventCategory.value })
    newEventOpen.value = false
    newEventTitle.value = ''
  }
</script>

<template>
  <EmeraldShell>
    <div class="adm-calendar" data-theme="emerald">
      <aside aria-label="Calendar controls" class="adm-calendar__side">
        <EmButton class="adm-calendar__new" variant="primary" @click="newEventOpen = true">
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

        <div class="adm-calendar__mini">
          <header class="adm-calendar__mini-head">
            <button aria-label="Previous month" class="adm-calendar__nav-btn" type="button" @click="onPrevMonth">‹</button>
            <strong>{{ monthLabel }}</strong>
            <button aria-label="Next month" class="adm-calendar__nav-btn" type="button" @click="onNextMonth">›</button>
          </header>

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
              <span v-if="eventsOn(cell.iso).length > 0" aria-hidden="true" class="adm-calendar__mini-dot" />
            </button>
          </div>
        </div>

        <div class="adm-calendar__filters">
          <p class="adm-calendar__filters-title">Event filters</p>

          <EmCheckbox
            :indeterminate="eventFilter.isMixed.value"
            :model-value="eventFilter.isAllSelected.value"
            @update:model-value="eventFilter.toggleAll()"
          >
            All
          </EmCheckbox>

          <EmCheckbox
            v-for="category in categories"
            :key="category"
            :model-value="eventFilter.selected(category)"
            @update:model-value="eventFilter.toggle(category)"
          >
            {{ category }}
          </EmCheckbox>
        </div>
      </aside>

      <section aria-label="Month view" class="adm-calendar__main">
        <header class="adm-calendar__main-head">
          <EmButton variant="tertiary" @click="onToday">Today</EmButton>

          <div class="adm-calendar__main-nav">
            <button aria-label="Previous month" class="adm-calendar__nav-btn" type="button" @click="onPrevMonth">‹</button>
            <h1>{{ monthLabel }}</h1>
            <button aria-label="Next month" class="adm-calendar__nav-btn" type="button" @click="onNextMonth">›</button>
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
              <li v-for="event in eventsOn(cell.iso).slice(0, 2)" :key="event.title" :data-category="event.category">
                <strong>{{ event.time }}</strong> {{ event.title }}
              </li>

              <li v-if="eventsOn(cell.iso).length > 2" class="adm-calendar__cell-more">+{{ eventsOn(cell.iso).length - 2 }} more</li>
            </ul>
          </div>
        </div>
      </section>

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
  .adm-calendar {
    display: grid;
    grid-template-columns: 260px minmax(0, 1fr);
    gap: var(--emerald-spacing-m, 16px);
    align-items: start;
  }

  .adm-calendar__side {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-m, 16px);
  }

  .adm-calendar__new {
    width: 100%;
    justify-content: center;
  }

  .adm-calendar__mini,
  .adm-calendar__filters {
    padding: var(--emerald-spacing-m, 16px);
    background: var(--emerald-background, #fefefe);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    border-radius: var(--emerald-radius-xl, 12px);
    box-shadow: var(--emerald-shadow-s, 0 0 2px 0 rgba(51, 51, 51, 0.08));
  }

  .adm-calendar__mini-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--emerald-spacing-s, 12px);
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-calendar__nav-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border: none;
    border-radius: var(--emerald-radius-m, 8px);
    background: transparent;
    color: var(--emerald-on-surface, #2b2d2e);
    cursor: pointer;
    font-size: 1rem;
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
    background: var(--emerald-neutral-900, #2b2d2e);
    color: var(--emerald-on-primary, #fff);
  }

  .adm-calendar__mini-dot {
    width: 4px;
    height: 4px;
    margin-top: 1px;
    border-radius: 50%;
    background: var(--emerald-primary-600, #1fae60);
  }

  .adm-calendar__mini-day[data-selected] .adm-calendar__mini-dot {
    background: var(--emerald-on-primary, #fff);
  }

  .adm-calendar__filters {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-calendar__filters-title {
    margin: 0;
    font-weight: 700;
    font-size: var(--emerald-text-b1-size, 16px);
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
    padding: var(--emerald-spacing-m, 16px);
    border-bottom: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
  }

  .adm-calendar__main-nav {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-calendar__main-nav h1 {
    margin: 0;
    font-size: var(--emerald-text-b1-size, 16px);
    font-weight: 700;
  }

  .adm-calendar__weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    padding: var(--emerald-spacing-xs, 8px) 0;
    border-bottom: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
  }

  .adm-calendar__weekdays span {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 600;
    text-align: center;
  }

  .adm-calendar__grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-auto-rows: minmax(96px, 1fr);
  }

  .adm-calendar__cell {
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
    border-radius: 50%;
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-calendar__cell-date[data-today] {
    background: var(--emerald-neutral-900, #2b2d2e);
    color: var(--emerald-on-primary, #fff);
  }

  .adm-calendar__cell-events {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin: 4px 0 0;
    padding: 0;
    list-style: none;
  }

  .adm-calendar__cell-events li {
    overflow: hidden;
    padding: 1px 4px;
    border-radius: 4px;
    background: var(--emerald-info-100, #e4f2ff);
    font-size: 10px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .adm-calendar__cell-events li[data-category='Family'] { background: var(--emerald-warning-100, #fff4e0); }
  .adm-calendar__cell-events li[data-category='Personal'] { background: var(--emerald-danger-100, #ffebee); }
  .adm-calendar__cell-events li[data-category='Holiday'] { background: var(--emerald-primary-100, #e7fff2); }
  .adm-calendar__cell-events li[data-category='Etc'] { background: var(--emerald-neutral-200, #f6f8fa); }

  .adm-calendar__cell-more {
    color: var(--emerald-on-surface-variant, #757e85);
    background: transparent !important;
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
    .adm-calendar__filters {
      flex: 1;
      min-width: 220px;
    }
  }

  @media (max-width: 640px) {
    .adm-calendar__cell-events {
      display: none;
    }
  }
</style>
