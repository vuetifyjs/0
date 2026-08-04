<script setup lang="ts">
  import {
    EmAlert,
    EmAlertDescription,
    EmAlertTitle,
    EmAvatar,
    EmAvatarFallback,
    EmBadge,
    EmBreadcrumbs,
    EmBreadcrumbsDivider,
    EmBreadcrumbsEllipsis,
    EmBreadcrumbsItem,
    EmBreadcrumbsLink,
    EmBreadcrumbsList,
    EmBreadcrumbsPage,
    EmButton,
    EmCalendar,
    EmCalendarGrid,
    EmCalendarHeader,
    EmCalendarMini,
    EmCalendarNext,
    EmCalendarPrev,
    EmCalendarTitle,
    EmCalendarToday,
    EmCard,
    EmCardBody,
    EmCardFooter,
    EmCardHeader,
    EmCardSubtitle,
    EmCardTitle,
    EmCheckbox,
    EmDialog,
    EmDialogActivator,
    EmDialogClose,
    EmDialogContent,
    EmDialogDescription,
    EmDialogFooter,
    EmDialogTitle,
    EmDivider,
    EmExpansionPanel,
    EmExpansionPanelActivator,
    EmExpansionPanelContent,
    EmExpansionPanelCue,
    EmExpansionPanelGroup,
    EmExpansionPanelHeader,
    EmList,
    EmListItem,
    EmListItemContent,
    EmListItemMedia,
    EmListItemMeta,
    EmListItemSubtitle,
    EmListItemTitle,
    EmPagination,
    EmPaginationItem,
    EmPaginationNext,
    EmPaginationPrev,
    EmPopover,
    EmPopoverActivator,
    EmPopoverContent,
    EmProgress,
    EmRadio,
    EmRadioGroup,
    EmSelect,
    EmSelectActivator,
    EmSelectContent,
    EmSelectItem,
    EmSelectPlaceholder,
    EmSelectValue,
    EmSlider,
    EmSnackbar,
    EmSnackbarClose,
    EmSnackbarContent,
    EmSnackbarPortal,
    EmSnackbarQueue,
    EmSpinner,
    EmStep,
    EmStepItem,
    EmSwitch,
    EmTabs,
    EmTabsItem,
    EmTabsList,
    EmTabsPanel,
    EmTag,
    EmTextField,
    EmTextarea,
    EmTooltip,
    EmTooltipActivator,
    EmTooltipContent,
  } from '@paper/emerald'

  // Utilities
  import { ref, shallowRef } from 'vue'
  import { RouterLink } from 'vue-router'

  // Types
  import type { EmCalendarEvent } from '@paper/emerald'

  const dialogOpen = shallowRef(false)
  const loading = shallowRef(false)
  const checked = shallowRef(true)
  const mixed = shallowRef(true)
  const enabled = shallowRef(true)
  const name = shallowRef('Emerald')
  const email = shallowRef('')
  const notes = shallowRef('')
  const fruit = shallowRef<string | undefined>()
  const tab = shallowRef('overview')
  const page = shallowRef(2)
  const slider = ref([40])
  const tagOn = shallowRef(true)
  const plan = shallowRef('pro')
  const progress = shallowRef(62)
  const step = shallowRef('account')
  const toastOpen = shallowRef(true)
  const popoverOpen = shallowRef(false)

  const active = shallowRef('r1')

  const rows = [
    { id: 'r1', initials: 'MV', title: 'v1.2 release train slips one week', subtitle: 'Marisol Vega', time: '08:42', unread: true, disabled: false },
    { id: 'r2', initials: 'KB', title: 'Emerald tag contrast fails APCA', subtitle: 'Kwame Boateng', time: '10:05', unread: true, disabled: false },
    { id: 'r3', initials: 'TR', title: 'Composable pages need the chip', subtitle: 'Tobias Renner', time: 'Yesterday', unread: false, disabled: false },
    { id: 'r4', initials: 'LB', title: 'Northwind Labs renewal', subtitle: 'Lena Brandt', time: 'Mon', unread: false, disabled: true },
  ]

  /** Nth day of the month now on screen, as ISO — keeps the seed populated forever. */
  function at (day: number) {
    const date = new Date()
    date.setDate(day)
    return date.toLocaleDateString('en-CA')
  }

  const day = shallowRef(at(new Date().getDate()))
  const cursor = shallowRef(new Date())

  const agenda: EmCalendarEvent[] = [
    { date: at(3), title: 'Release cut', allDay: true, tone: 'primary' },
    { date: at(9), title: 'Design review', time: '15:00', tone: 'secondary' },
    { date: at(9), title: 'Contributor call', time: '18:00', tone: 'info' },
    { date: at(9), title: 'Retro', time: '19:30', tone: 'neutral' },
    { date: at(16), title: 'Docs freeze', allDay: true, tone: 'alert' },
    { date: at(22), title: 'Incident review', time: '11:00', tone: 'danger' },
    { date: at(27), title: 'Roadmap workshop', allDay: true, tone: 'neutral' },
  ]

  const notifications = [
    { id: 1, title: 'Emerald 1.0 tokens published', time: '2m' },
    { id: 2, title: 'Build #482 passed', time: '18m' },
    { id: 3, title: 'Wave 3 review requested', time: '1h' },
  ]

  function onLoadDemo () {
    loading.value = true
    setTimeout(() => {
      loading.value = false
    }, 1500)
  }
</script>

<template>
  <div class="emerald-sink" data-theme="emerald">
    <header class="sink-header">
      <h1>Emerald Kitchen Sink</h1>

      <p>
        Wave 1–3 component inventory —
        <RouterLink to="/emerald">Dashboard showcase →</RouterLink>
      </p>
    </header>

    <section>
      <h2>Breadcrumbs</h2>

      <EmBreadcrumbs>
        <EmBreadcrumbsList>
          <EmBreadcrumbsItem text="Home">
            <EmBreadcrumbsLink href="#">Home</EmBreadcrumbsLink>
          </EmBreadcrumbsItem>

          <EmBreadcrumbsDivider />

          <EmBreadcrumbsItem text="Design systems">
            <EmBreadcrumbsLink href="#">Design systems</EmBreadcrumbsLink>
          </EmBreadcrumbsItem>

          <EmBreadcrumbsDivider />

          <EmBreadcrumbsEllipsis />

          <EmBreadcrumbsDivider />

          <EmBreadcrumbsItem text="Emerald">
            <EmBreadcrumbsPage>Emerald</EmBreadcrumbsPage>
          </EmBreadcrumbsItem>
        </EmBreadcrumbsList>
      </EmBreadcrumbs>
    </section>

    <section>
      <h2>Alert</h2>

      <div class="stack" style="max-width: 480px; width: 100%;">
        <EmAlert variant="success">
          <EmAlertTitle>Saved</EmAlertTitle>
          <EmAlertDescription>Your changes are live.</EmAlertDescription>
        </EmAlert>

        <EmAlert variant="warning">
          <EmAlertTitle>Check tokens</EmAlertTitle>
          <EmAlertDescription>Canonical Figma: Emerald 1.0 (WaY9z9gHeU6LbkqNgcD9io).</EmAlertDescription>
        </EmAlert>

        <EmAlert variant="error">
          <EmAlertTitle>Failed</EmAlertTitle>
          <EmAlertDescription>Something went wrong.</EmAlertDescription>
        </EmAlert>

        <EmAlert variant="info">
          <EmAlertTitle>Tip</EmAlertTitle>
          <EmAlertDescription>Compose on v0, style with Emerald tokens.</EmAlertDescription>
        </EmAlert>
      </div>
    </section>

    <section>
      <h2>Badge · Spinner · Divider</h2>

      <div class="row">
        <EmBadge :content="3" variant="primary" />
        <EmBadge :content="120" :max="99" variant="danger" />
        <EmBadge variant="success">NEW</EmBadge>
        <EmBadge dot variant="info" />
        <EmSpinner size="sm" />
        <EmSpinner size="md" />
        <EmSpinner size="lg" />
      </div>

      <div class="stack narrow" style="width: 100%; max-width: 360px; margin-top: 1rem;">
        <EmDivider />
        <EmDivider>or continue</EmDivider>
      </div>
    </section>

    <section>
      <h2>Card</h2>

      <div class="row">
        <EmCard style="width: 320px;" variant="complete">
          <EmCardHeader>
            <EmCardTitle>Preferences</EmCardTitle>
            <EmCardSubtitle>Wave 2 card shell</EmCardSubtitle>
          </EmCardHeader>

          <EmCardBody>
            Token-driven surface with end-aligned footer actions.
          </EmCardBody>

          <EmCardFooter>
            <EmButton variant="tertiary">Cancel</EmButton>
            <EmButton>Save</EmButton>
          </EmCardFooter>
        </EmCard>

        <EmCard hoverable style="width: 320px;" variant="complete">
          <EmCardHeader>
            <EmCardTitle>Hoverable</EmCardTitle>
            <EmCardSubtitle>Hover for primary border</EmCardSubtitle>
          </EmCardHeader>

          <EmCardBody>Card with hoverable elevation.</EmCardBody>
        </EmCard>
      </div>
    </section>

    <section>
      <h2>Tag</h2>

      <div class="row">
        <EmTag variant="neutral">Neutral</EmTag>

        <EmTag interactive :selected="tagOn" variant="success" @click="tagOn = !tagOn">
          Success {{ tagOn ? 'on' : 'off' }}
        </EmTag>

        <EmTag variant="danger">Danger</EmTag>
        <EmTag variant="info">Info</EmTag>
        <EmTag disabled variant="neutral">Disabled</EmTag>
      </div>
    </section>

    <section>
      <h2>Avatar</h2>

      <div class="row">
        <EmAvatar size="sm">
          <EmAvatarFallback>SM</EmAvatarFallback>
        </EmAvatar>

        <EmAvatar size="md">
          <EmAvatarFallback>MD</EmAvatarFallback>
        </EmAvatar>

        <EmAvatar size="lg">
          <EmAvatarFallback>LG</EmAvatarFallback>
        </EmAvatar>
      </div>
    </section>

    <section>
      <h2>Tabs</h2>

      <EmTabs v-model="tab">
        <EmTabsList>
          <EmTabsItem value="overview">Overview</EmTabsItem>
          <EmTabsItem value="tokens">Tokens</EmTabsItem>
          <EmTabsItem disabled value="api">API</EmTabsItem>
        </EmTabsList>

        <EmTabsPanel value="overview">Overview panel content.</EmTabsPanel>
        <EmTabsPanel value="tokens">Token panel content.</EmTabsPanel>
        <EmTabsPanel value="api">API panel content.</EmTabsPanel>
      </EmTabs>
    </section>

    <section>
      <h2>Step</h2>

      <EmStep v-model="step">
        <EmStepItem value="account">Account</EmStepItem>
        <EmStepItem value="profile">Profile</EmStepItem>
        <EmStepItem value="review">Review</EmStepItem>
      </EmStep>

      <p class="muted">Step: {{ step }}</p>
    </section>

    <section>
      <h2>Pagination</h2>

      <EmPagination v-model="page" :items-per-page="10" :size="50">
        <EmPaginationPrev>‹</EmPaginationPrev>
        <EmPaginationItem :value="1">1</EmPaginationItem>
        <EmPaginationItem :value="2">2</EmPaginationItem>
        <EmPaginationItem :value="3">3</EmPaginationItem>
        <EmPaginationItem :value="4">4</EmPaginationItem>
        <EmPaginationItem :value="5">5</EmPaginationItem>
        <EmPaginationNext>›</EmPaginationNext>
      </EmPagination>

      <p class="muted">Page {{ page }}</p>
    </section>

    <section>
      <h2>Progress</h2>

      <div class="stack narrow" style="width: 100%; max-width: 360px;">
        <EmProgress v-model="progress" label="Upload" show-value />
        <EmProgress indeterminate label="Syncing…" size="sm" />

        <EmSlider
          v-model="progress"
          label="Upload progress"
          :max="100"
          :min="0"
          :step="1"
        />
      </div>
    </section>

    <section>
      <h2>Slider</h2>

      <div class="stack narrow" style="width: 100%; max-width: 360px;">
        <EmSlider
          v-model="slider"
          label="Volume"
          :max="100"
          :min="0"
          :step="1"
        />

        <p class="muted">Value: {{ slider[0] }}</p>
      </div>
    </section>

    <section>
      <h2>Button · Tooltip</h2>

      <div class="row">
        <EmButton size="sm" variant="primary">Small</EmButton>
        <EmButton size="md" variant="primary">Medium</EmButton>
        <EmButton size="lg" variant="primary">Large</EmButton>
      </div>

      <div class="row">
        <EmButton variant="primary">Primary</EmButton>
        <EmButton variant="secondary">Secondary</EmButton>
        <EmButton variant="tertiary">Tertiary</EmButton>
        <EmButton variant="destructive">Destructive</EmButton>
      </div>

      <div class="row">
        <EmButton disabled>Disabled</EmButton>

        <EmButton :loading @click="onLoadDemo">
          {{ loading ? 'Loading…' : 'Click to load' }}
        </EmButton>

        <EmTooltip>
          <!-- `styles` carries the CSS anchor-name and is a separate slot prop
               from `attrs`; without it the content has no anchor and falls back
               to the UA's default popover position. -->
          <EmTooltipActivator v-slot="tip" renderless>
            <EmButton v-bind="tip.attrs" :style="tip.styles" variant="secondary">Hover for tip</EmButton>
          </EmTooltipActivator>

          <EmTooltipContent>Emerald paints; v0 owns behavior.</EmTooltipContent>
        </EmTooltip>
      </div>
    </section>

    <section>
      <h2>TextField · Textarea</h2>

      <div class="stack narrow">
        <EmTextField v-model="name" label="Name" placeholder="Your name" />

        <EmTextField
          v-model="email"
          label="Email"
          placeholder="you@example.com"
          :rules="[v => !v || /@/.test(String(v)) || 'Must include @']"
          type="email"
          validate-on="blur"
        />

        <EmTextarea
          v-model="notes"
          description="Props only — no named slots."
          label="Notes"
          placeholder="Tell us more…"
          :rows="4"
        />
      </div>
    </section>

    <section>
      <h2>Checkbox · Radio · Switch</h2>

      <div class="row" style="align-items: flex-start;">
        <div class="stack">
          <EmCheckbox v-model="checked" size="sm">Small checked</EmCheckbox>
          <EmCheckbox v-model="checked" size="md">Medium</EmCheckbox>
          <EmCheckbox v-model="checked" size="lg">Large</EmCheckbox>
          <EmCheckbox v-model="checked" disabled>Disabled</EmCheckbox>
          <EmCheckbox v-model="mixed" indeterminate>Indeterminate (mixed)</EmCheckbox>
        </div>

        <EmRadioGroup v-model="plan" mandatory name="plan">
          <EmRadio value="free">Free</EmRadio>
          <EmRadio value="pro">Pro</EmRadio>
          <EmRadio size="lg" value="enterprise">Enterprise</EmRadio>
          <EmRadio disabled value="legacy">Legacy</EmRadio>
        </EmRadioGroup>

        <div class="stack">
          <EmSwitch v-model="enabled" size="sm">Small</EmSwitch>
          <EmSwitch v-model="enabled" size="md">Medium</EmSwitch>
          <EmSwitch v-model="enabled" size="lg">Large</EmSwitch>
          <EmSwitch v-model="enabled" disabled>Disabled</EmSwitch>
        </div>
      </div>

      <p class="muted">Plan: {{ plan }}</p>
    </section>

    <section>
      <h2>Expansion panel</h2>

      <div style="max-width: 480px; width: 100%;">
        <EmExpansionPanelGroup>
          <EmExpansionPanel>
            <EmExpansionPanelHeader>
              <EmExpansionPanelActivator>
                What is Emerald?
                <EmExpansionPanelCue />
              </EmExpansionPanelActivator>
            </EmExpansionPanelHeader>

            <EmExpansionPanelContent>
              First commercial Paper design system — a thin skin over v0 that sells the headless stack.
            </EmExpansionPanelContent>
          </EmExpansionPanel>

          <EmExpansionPanel>
            <EmExpansionPanelHeader>
              <EmExpansionPanelActivator>
                Install path
                <EmExpansionPanelCue />
              </EmExpansionPanelActivator>
            </EmExpansionPanelHeader>

            <EmExpansionPanelContent>
              createEmeraldPlugin() wires the adapter and the default emerald theme —
              consumers never assemble one. This showcase installs exactly that from
              main.ts; theme.css + style.css are the plugin-less equivalent for hosts
              that only want the CSS.
            </EmExpansionPanelContent>
          </EmExpansionPanel>
        </EmExpansionPanelGroup>
      </div>
    </section>

    <section>
      <h2>Select</h2>

      <div class="stack narrow">
        <EmSelect v-model="fruit" label="Fruit">
          <EmSelectActivator>
            <EmSelectValue />
            <EmSelectPlaceholder>Pick a fruit</EmSelectPlaceholder>

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
            >
              <path d="M4 6l4 4 4-4" />
            </svg>
          </EmSelectActivator>

          <EmSelectContent>
            <EmSelectItem value="apple">Apple</EmSelectItem>
            <EmSelectItem value="banana">Banana</EmSelectItem>
            <EmSelectItem value="cherry">Cherry</EmSelectItem>
            <EmSelectItem disabled value="durian">Durian (disabled)</EmSelectItem>
          </EmSelectContent>
        </EmSelect>

        <p class="muted">Selected: {{ fruit ?? '—' }}</p>
      </div>
    </section>

    <section>
      <h2>Dialog</h2>

      <div class="row">
        <EmDialog v-model="dialogOpen">
          <EmDialogActivator>
            Open dialog
          </EmDialogActivator>

          <EmDialogContent>
            <div class="dialog-head">
              <EmDialogTitle>Confirm action</EmDialogTitle>
              <EmDialogClose />
            </div>

            <EmDialogDescription>
              Wave 1 dialog shell — Content, Title, Description, Close.
            </EmDialogDescription>

            <EmDialogFooter>
              <EmButton variant="tertiary" @click="dialogOpen = false">Cancel</EmButton>
              <EmButton @click="dialogOpen = false">Confirm</EmButton>
            </EmDialogFooter>
          </EmDialogContent>
        </EmDialog>

        <EmDialog>
          <EmDialogActivator v-slot="{ attrs }" renderless>
            <EmButton v-bind="attrs" variant="secondary">Renderless + EmButton</EmButton>
          </EmDialogActivator>

          <EmDialogContent>
            <EmDialogTitle>Renderless activator</EmDialogTitle>

            <EmDialogDescription>
              No nested button — attrs land on EmButton.
            </EmDialogDescription>

            <EmDialogClose />
          </EmDialogContent>
        </EmDialog>
      </div>
    </section>

    <section>
      <h2>Popover</h2>

      <div class="row">
        <EmPopover v-model="popoverOpen">
          <EmPopoverActivator>
            Notifications
          </EmPopoverActivator>

          <EmPopoverContent position-area="block-end span-inline-end">
            <p class="popover-heading">Notifications</p>

            <ul class="popover-list">
              <li v-for="item in notifications" :key="item.id">
                <span class="popover-list__title">{{ item.title }}</span>
                <span class="popover-list__meta">{{ item.time }}</span>
              </li>
            </ul>
          </EmPopoverContent>
        </EmPopover>

        <EmPopover>
          <!-- attrs carry the anchor-name style; binding them alone anchors the panel -->
          <EmPopoverActivator v-slot="pop" renderless>
            <EmButton v-bind="pop.attrs" variant="secondary">Renderless + EmButton</EmButton>
          </EmPopoverActivator>

          <EmPopoverContent>
            <p class="muted">No nested button — attrs land on EmButton.</p>
          </EmPopoverContent>
        </EmPopover>

        <EmButton variant="tertiary" @click="popoverOpen = !popoverOpen">
          Toggle from outside
        </EmButton>
      </div>

      <p class="muted">Panel open: {{ popoverOpen }}</p>
    </section>

    <section>
      <h2>List</h2>

      <div class="sink-list">
        <EmList v-model="active" mandatory="force">
          <EmListItem
            v-for="row in rows"
            :key="row.id"
            :data-unread="row.unread || undefined"
            :disabled="row.disabled"
            :value="row.id"
          >
            <EmListItemMedia>
              <EmAvatar size="sm"><EmAvatarFallback>{{ row.initials }}</EmAvatarFallback></EmAvatar>
            </EmListItemMedia>

            <EmListItemContent>
              <EmListItemTitle>{{ row.title }}</EmListItemTitle>
              <EmListItemSubtitle>{{ row.subtitle }}</EmListItemSubtitle>
            </EmListItemContent>

            <EmListItemMeta>{{ row.time }}</EmListItemMeta>
          </EmListItem>
        </EmList>
      </div>

      <p class="muted">Selected: {{ active }} — the last row is disabled, the first two are unread.</p>
    </section>

    <section>
      <h2>Calendar</h2>

      <div class="sink-calendar">
        <EmCalendar
          v-model="day"
          v-model:month="cursor"
          :events="agenda"
        >
          <EmCalendarHeader>
            <div class="row" style="margin-bottom: 0;">
              <EmCalendarPrev />
              <EmCalendarNext />
              <EmCalendarTitle />
            </div>

            <EmCalendarToday />
          </EmCalendarHeader>

          <EmCalendarGrid />
        </EmCalendar>

        <EmCalendar
          v-model="day"
          v-model:month="cursor"
          class="sink-calendar__mini"
          :events="agenda"
        >
          <EmCalendarMini />
        </EmCalendar>
      </div>

      <p class="muted">
        Selected: {{ day }} — both roots share the page refs, so the mini tracks the grid.
        In the grid: arrows move a day or a week, Home/End jump to the week edges,
        PageUp/PageDown change month keeping the day, Enter or Space selects.
      </p>
    </section>

    <section>
      <h2>Snackbar (static)</h2>

      <p class="muted" style="margin-bottom: 0.75rem;">
        Queue-driven toasts need createNotificationsPlugin; static Root shows paint.
      </p>

      <div class="row">
        <EmButton variant="tertiary" @click="toastOpen = !toastOpen">
          Toggle toast
        </EmButton>
      </div>

      <EmSnackbarPortal :teleport="false">
        <!-- Queue is the notifications-driven surface; static Root still paints without plugin -->
        <EmSnackbarQueue v-slot="{ items }">
          <EmSnackbar
            v-for="item in items"
            :id="item.id"
            :key="item.id"
            variant="neutral"
          >
            <EmSnackbarContent>{{ item.subject }}</EmSnackbarContent>
            <EmSnackbarClose />
          </EmSnackbar>
        </EmSnackbarQueue>

        <EmSnackbar v-if="toastOpen" variant="success">
          <EmSnackbarContent>Changes saved to Emerald.</EmSnackbarContent>
          <EmSnackbarClose @click="toastOpen = false" />
        </EmSnackbar>
      </EmSnackbarPortal>
    </section>
  </div>
</template>

<style>
  .emerald-sink {
    min-height: 100vh;
    padding: 2rem clamp(1rem, 4vw, 3rem) 4rem;
    font-family: var(--emerald-font-sans, Manrope, system-ui, sans-serif);
    background: var(--emerald-background, #fefefe);
    color: var(--emerald-on-background, #2b2d2e);
    overflow-x: clip;
  }

  @media (max-width: 720px) {
    .emerald-sink {
      padding: 1.25rem 1rem 3rem;
    }

    .emerald-sink .row {
      max-width: 100%;
    }
  }

  .sink-header {
    margin-bottom: 2rem;
  }

  .sink-header h1 {
    margin: 0 0 0.25rem;
    font-size: 1.75rem;
  }

  .sink-header p {
    margin: 0;
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .sink-header a {
    color: var(--emerald-primary-700, #027d4c);
    font-weight: 600;
    text-decoration: none;
  }

  .sink-header a:hover {
    text-decoration: underline;
  }

  .emerald-sink section {
    margin-bottom: 2.5rem;
  }

  .emerald-sink section h2 {
    margin: 0 0 0.75rem;
    font-size: 1.125rem;
    font-weight: 700;
  }

  .emerald-sink .row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }

  .emerald-sink .stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .emerald-sink .stack.narrow {
    max-width: 360px;
  }

  .emerald-sink .muted {
    margin: 0;
    font-size: 0.875rem;
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .dialog-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
  }

  .popover-heading {
    margin: 0 0 0.5rem;
    font-size: 0.8125rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .popover-list {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    width: 260px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .popover-list li {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.375rem 0.5rem;
    border-radius: var(--emerald-radius-s, 6px);
  }

  .popover-list li:hover {
    background: var(--emerald-neutral-200, #f6f8fa);
  }

  .popover-list__title {
    font-size: 0.875rem;
    color: var(--emerald-on-surface, #2b2d2e);
  }

  .popover-list__meta {
    flex: none;
    font-size: 0.75rem;
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .sink-calendar {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 240px;
    gap: 1rem;
    align-items: start;
    margin-bottom: 0.75rem;
  }

  @media (max-width: 720px) {
    .sink-calendar {
      grid-template-columns: minmax(0, 1fr);
    }

    .sink-calendar__mini {
      display: none;
    }
  }

  .sink-list {
    max-width: 440px;
    margin-bottom: 0.75rem;
  }

  .dialog-head .emerald-dialog__title {
    flex: 1;
  }
</style>
