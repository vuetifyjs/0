<script lang="ts">
  import {
    Md1BottomNavigation,
    Md1Button,
    Md1Divider,
    Md1FeatureDiscovery,
    Md1IconToggle,
    Md1List,
    Md1Menu,
    Md1NavigationDrawer,
    Md1Snackbar,
    Md1Toolbar,
    Md1Tooltip,
    md1Breakpoints,
  } from '@paper/md1'

  // Framework
  import { isNull, isString, useBreakpoints, useReducedMotion, useStorage, useTimer } from '@vuetify/v0'
  import { IN_BROWSER } from '@vuetify/v0'

  // Context
  import { activity, profile, search } from './Md1Data'

  // Utilities
  import { mergeProps, onMounted, shallowRef, toRef, watch } from 'vue'
  import { RouterView, useRoute, useRouter } from 'vue-router'

  // Types
  import type { Md1IconName, Md1MenuActivatorSlotProps, Md1TooltipActivatorSlotProps } from '@paper/md1'

  type Link = {
    label: string
    to: string
    icon: Md1IconName
  }

  /** Top-level destinations: the drawer's first list and the phone bottom bar. */
  const links: Link[] = [
    { label: 'Overview', to: '/md1', icon: 'home' },
    { label: 'Inbox', to: '/md1/inbox', icon: 'inbox' },
    { label: 'Contacts', to: '/md1/contacts', icon: 'person' },
    { label: 'Activity', to: '/md1/activity', icon: 'history' },
  ]

  /** The drawer's Workspace group. */
  const tools: Link[] = [
    { label: 'Orders', to: '/md1/orders', icon: 'reorder' },
    { label: 'Files', to: '/md1/files', icon: 'folder' },
    { label: 'Gallery', to: '/md1/gallery', icon: 'photo' },
  ]

  /** The header's 16:9 cover, a flat indigo dusk scene: the demo ships no raster images. */
  const cover = 'data:image/svg+xml,'
    + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice"><rect width="320" height="180" fill="#283593"/><circle cx="248" cy="48" r="22" fill="#5C6BC0"/><path d="M0 128 L84 72 L150 118 L214 84 L320 142 V180 H0 Z" fill="#3949AB"/><path d="M0 154 L70 116 L138 150 L226 112 L320 162 V180 H0 Z" fill="#1A237E"/></svg>')

</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1Shell' })

  const route = useRoute()
  const router = useRouter()
  const storage = useStorage()

  const me = profile.me

  /** The page name in the app bar, carried by each child route's `meta.title`. */
  const title = toRef(() => isString(route.meta.title) ? route.meta.title : 'Overview')

  const { width } = useBreakpoints()

  /** Below the 960 dp breakpoint the drawer is temporary; above it, permanent and clipped. */
  const mobile = toRef(() => width.value < md1Breakpoints[960])
  const open = shallowRef(false)

  // A drawer that changes type starts closed, so a handset never opens on a scrim.
  watch(mobile, () => {
    open.value = false
  })

  /** Theme choice survives reload (wave 3); the storage plugin owns the key. */
  const dark = storage.get('md1-demo:dark', false)

  /** The drawer's Workspace group keeps its open state across visits. */
  const group = storage.get('md1-demo:workspace', true)

  const current = toRef(() => route.path.length > 1 ? route.path.replace(/\/+$/, '') : route.path)

  /** The header caret swaps the drawer between the destinations and the account actions. */
  const accounts = shallowRef(false)

  /** A closed or navigated drawer returns to the destinations. */
  watch([open, () => route.path], () => {
    accounts.value = false
  })

  function onAccount (to: string) {
    accounts.value = false
    go(to)
  }

  const added = shallowRef(false)

  /** Routes whose primary action sits at the bottom end (the assistant's send,
      the gallery's speed dial): the offer yields the corner and takes the
      spec's start placement there instead. */
  const docked = toRef(() => current.value === '/md1/assistant' || current.value === '/md1/gallery')

  function go (to: string) {
    router.push(to)
    open.value = false
  }

  // Toolbar search

  const searching = shallowRef(false)
  const query = shallowRef('')
  const found = search(query)

  const motion = useReducedMotion()

  /**
   * The row-for-search swap is instant in the package (the spec names no
   * motion for it); the demo cross-fades the bar through a view transition
   * scoped to the toolbar, at the standard duration and easing.
   */
  function morph (value: boolean) {
    function run () {
      searching.value = value
    }

    if (!IN_BROWSER || motion.isReduced.value || !document.startViewTransition) {
      run()
      return
    }

    document.startViewTransition(run)
  }

  /** Completions straight from the live cross-page search: they always exist. */
  const suggestions = toRef(() => found.value.flatMap(hits => hits.hits.map(hit => hit.title)).slice(0, 6))

  const history = storage.get<string[]>('md1-demo:searches', [])

  function onFind (value: string) {
    if (!value.trim()) return

    history.value = [value, ...history.value.filter(past => past !== value)].slice(0, 5)
    morph(false)
    router.push({ path: '/md1/search', query: { q: value } })
  }

  // Already on the results page, typing filters it live; Enter still commits to history.
  watch(query, value => {
    if (searching.value && route.path === '/md1/search') {
      router.replace({ path: '/md1/search', query: value.trim() ? { q: value } : {} })
    }
  })

  // The tour: a snackbar offer, then five chained one-step prompts (the
  // feature-discovery page runs a one-step v0 Tour per prompt; its guided-flow
  // scenario covers actions that take more than one interaction). 0 = idle,
  // then theme, search, the search bar's back arrow, Inbox, the compose FAB.

  const stage = shallowRef<0 | 1 | 2 | 3 | 4 | 5>(0)

  const ask = shallowRef(false)

  // The offer waits for the shell to settle, once per load, every load; the
  // tour itself only ever starts from Start or the overflow's Show tips.
  const delay = useTimer(() => {
    ask.value = true
  }, { duration: 1200 })

  onMounted(() => {
    delay.start()
  })

  /** Which stop's hue paints the prompts; outlives `stage` through the exit. */
  const stop = shallowRef<0 | 1 | 2 | 3 | 4 | 5>(0)

  /** The tapped stop's effect, held until the prompt's circles have left. */
  let pending: (() => void) | null = null

  /** Where the finished exit leads; 0 ends the tour. */
  let next: 0 | 2 | 3 | 4 | 5 = 0

  /** The beat's destination while it counts down. */
  let queued: 2 | 3 | 4 | 5 = 2

  /** One standard transition unit between chained prompts (motion page: the 300 ms mobile standard). */
  const beat = useTimer(() => {
    advance(queued)
  }, { duration: 300 })

  /**
   * Stops 3 to 5 target controls the demo cannot wrap (the search bar's back
   * arrow and the compose FAB are inside components; the Inbox link is a list
   * item a span may not wrap). Each is found fresh by selector — stop 4 differs
   * by breakpoint — and its prompt anchors a measured ghost over it.
   */
  const TARGETS = {
    3: () => '.md1-toolbar__back',
    4: () => mobile.value ? '.md1-bottom-navigation a[href="/md1/inbox"]' : '.md1-navigation-drawer a[href="/md1/inbox"]',
    5: () => '.md1-demo-inbox-fab',
  } as const

  function locate (n: 3 | 4 | 5) {
    return IN_BROWSER ? document.querySelector<HTMLElement>(TARGETS[n]()) : null
  }

  /** The ghost activator's seat over the real control, measured at arming. */
  const ghost = shallowRef<Record<string, string>>()

  function advance (n: 2 | 3 | 4 | 5) {
    if (n === 2) {
      stop.value = 2
      stage.value = 2

      return
    }

    arm(n)
  }

  /**
   * Cross-page arming: a stop's target may still be mounting (the FAB follows a
   * navigation, the back arrow the search transition), so presence is awaited
   * frame by frame, bounded; a target that never appears ends the tour quietly.
   */
  async function arm (n: 3 | 4 | 5) {
    for (let tick = 0; tick < 150; tick++) {
      const el = locate(n)

      if (!isNull(el)) {
        const rect = el.getBoundingClientRect()

        ghost.value = {
          position: 'fixed',
          left: `${Math.round(rect.left)}px`,
          top: `${Math.round(rect.top)}px`,
          width: `${Math.round(rect.width)}px`,
          height: `${Math.round(rect.height)}px`,
        }
        stop.value = n
        stage.value = n

        return
      }

      await new Promise(requestAnimationFrame)
    }

    stop.value = 0
  }

  /** A ghost stop's effect: press the real control once the circles have left. */
  function onGhost (n: 3 | 4 | 5) {
    pending = () => {
      const el = locate(n)
      if (isNull(el)) return

      const control = el.matches('button, a[href]') ? el : el.querySelector<HTMLElement>('button, a[href]') ?? el

      control.click()
    }
  }

  function onTour () {
    ask.value = false
    beat.stop()
    pending = null
    next = 0
    stop.value = 1
    stage.value = 1
  }

  /** A stop's own control, tapped mid-tour: its effect waits for the circles to leave. */
  function onDark (value: boolean | undefined) {
    if (stage.value === 1) {
      pending = () => {
        dark.value = !!value
      }

      return
    }

    dark.value = !!value
  }

  function onSearch () {
    if (stage.value === 2) {
      pending = () => morph(true)

      return
    }

    morph(true)
  }

  function onStop (to: 0 | 2 | 3 | 4 | 5) {
    next = to
    stage.value = 0
  }

  /**
   * Dismissal at any stop ends the tour with nothing half-applied: the pending
   * effect is dropped and no later stop arms. Dismissing at the back-arrow stop
   * deliberately leaves search open — the reader closes it like any search.
   */
  function onQuit () {
    pending = null
    next = 0
    stage.value = 0
  }

  // The prompt has fully left: now the page may change under where it stood.
  function onLeft () {
    const act = pending

    pending = null
    act?.()

    if (next !== 0) {
      queued = next
      next = 0

      if (motion.isReduced.value) advance(queued)
      else beat.start()

      return
    }

    stop.value = 0
  }

  /** The latest unread activity, newest first (the store keeps that order). */
  const news = toRef(() => activity.all.value.filter(entry => entry.unread).slice(0, 4))

  function onEntry (id: number) {
    activity.read(id)
    go('/md1/activity')
  }

  /**
   * The active stop's hue, carried by the actions row itself: a wrapper element
   * would cut the toolbar's direct-child ink seams, and only one prompt is ever
   * open, so one override on the shared ancestor scopes both the circle (the
   * portal renders in place, from the -channels triplet — only theme roles emit
   * one, so the hex rides with its triplet) and the disc's glyph ink. Teal and
   * deep orange 600: distinct from the indigo bar, the pink charts and each
   * other, and both darker than pink A200 so the white hint reads.
   */
  const HUES = {
    1: { '--md1-accent': 'var(--md1-teal-500, #009688)', '--md1-accent-channels': '0 150 136' },
    2: { '--md1-accent': 'var(--md1-deep-orange-600, #F4511E)', '--md1-accent-channels': '244 81 30' },
    3: { '--md1-accent': 'var(--md1-purple-500, #9C27B0)', '--md1-accent-channels': '156 39 176' },
    4: { '--md1-accent': 'var(--md1-brown-500, #795548)', '--md1-accent-channels': '121 85 72' },
    5: { '--md1-accent': 'var(--md1-red-800, #C62828)', '--md1-accent-channels': '198 40 40' },
  } as const

  const hue = toRef(() => stop.value === 0 ? undefined : HUES[stop.value])

  /**
   * The overflow button anchors its menu and its tooltip: `anchor-name` takes a
   * list, so both names are emitted — letting either overwrite the other lands
   * that popover at 0,0 with no anchor to resolve against.
   */
  function bind (menu: Md1MenuActivatorSlotProps, tip: Md1TooltipActivatorSlotProps) {
    const names = [menu.attrs.style?.anchorName, tip.attrs.style.anchorName].filter(Boolean)

    return mergeProps(menu.attrs, tip.attrs, { style: { anchorName: names.join(', ') } })
  }
</script>

<template>
  <div
    class="md1-demo-shell"
    :data-nav="mobile || undefined"
    :data-theme="dark ? 'md1-dark' : 'md1-light'"
  >
    <Md1Toolbar app-bar>
      <Md1Toolbar.Nav v-if="mobile" :open @click="open = !open" />

      <Md1Toolbar.Title>{{ title }}</Md1Toolbar.Title>

      <Md1Toolbar.Actions :style="hue">
        <!-- The tour's finale: pressing the promoted action opens search itself. -->
        <Md1FeatureDiscovery color="accent" :model-value="stage === 2" @closed="onLeft" @complete="onStop(3)" @dismiss="onQuit">
          <Md1FeatureDiscovery.Activator>
            <Md1Tooltip>
              <Md1Tooltip.Activator v-slot="{ attrs }">
                <Md1Button v-bind="attrs" aria-label="Search" icon="search" @click="onSearch" />
              </Md1Tooltip.Activator>

              <Md1Tooltip.Content>Search</Md1Tooltip.Content>
            </Md1Tooltip>
          </Md1FeatureDiscovery.Activator>

          <Md1FeatureDiscovery.Title>Search everything</Md1FeatureDiscovery.Title>

          <Md1FeatureDiscovery.Text>
            One search covers your messages, contacts, orders, files and activity.
          </Md1FeatureDiscovery.Text>
        </Md1FeatureDiscovery>

        <Md1Menu>
          <Md1Menu.Activator v-slot="menu">
            <Md1Tooltip>
              <Md1Tooltip.Activator v-slot="tool">
                <Md1Button
                  v-bind="bind(menu, tool)"
                  :aria-label="news.length > 0 ? `Notifications, ${news.length} unread` : 'Notifications'"
                  icon="notifications"
                />
              </Md1Tooltip.Activator>

              <Md1Tooltip.Content>Notifications</Md1Tooltip.Content>
            </Md1Tooltip>
          </Md1Menu.Activator>

          <Md1Menu.Content class="md1-demo-news">
            <Md1Menu.Item
              v-for="entry in news"
              :key="entry.id"
              :info="entry.time"
              @select="onEntry(entry.id)"
            >
              {{ entry.action }}
            </Md1Menu.Item>

            <Md1Menu.Item v-if="news.length === 0" disabled>All caught up</Md1Menu.Item>

            <Md1Menu.Divider />

            <Md1Menu.Item @select="go('/md1/activity')">See all activity</Md1Menu.Item>
          </Md1Menu.Content>
        </Md1Menu>

        <Md1FeatureDiscovery color="accent" :model-value="stage === 1" @closed="onLeft" @complete="onStop(2)" @dismiss="onQuit">
          <Md1FeatureDiscovery.Activator>
            <Md1Tooltip>
              <Md1Tooltip.Activator v-slot="{ attrs }">
                <Md1IconToggle v-bind="attrs" aria-label="Dark theme" icon="invert-colors" :model-value="dark" @update:model-value="onDark" />
              </Md1Tooltip.Activator>

              <Md1Tooltip.Content>{{ dark ? 'Light theme' : 'Dark theme' }}</Md1Tooltip.Content>
            </Md1Tooltip>
          </Md1FeatureDiscovery.Activator>

          <Md1FeatureDiscovery.Title>Set the mood</Md1FeatureDiscovery.Title>

          <Md1FeatureDiscovery.Text>
            Tap to flip the whole dashboard between light and dark.
          </Md1FeatureDiscovery.Text>
        </Md1FeatureDiscovery>

        <Md1Menu>
          <Md1Menu.Activator v-slot="menu">
            <Md1Tooltip>
              <Md1Tooltip.Activator v-slot="tool">
                <Md1Button v-bind="bind(menu, tool)" aria-label="More options" icon="more-vert" />
              </Md1Tooltip.Activator>

              <Md1Tooltip.Content>More options</Md1Tooltip.Content>
            </Md1Tooltip>
          </Md1Menu.Activator>

          <Md1Menu.Content>
            <Md1Menu.Item>About</Md1Menu.Item>

            <Md1Menu.Item>Send feedback</Md1Menu.Item>

            <Md1Menu.Item @select="onTour">Show tips</Md1Menu.Item>

            <Md1Menu.Item @select="go('/md1/sign-in')">Sign out</Md1Menu.Item>
          </Md1Menu.Content>
        </Md1Menu>
      </Md1Toolbar.Actions>

      <Md1Toolbar.Search
        v-model="query"
        :history
        :open="searching"
        :suggestions
        @submit="onFind"
        @update:open="morph"
      />
    </Md1Toolbar>

    <Md1NavigationDrawer v-model="open" :clipped="!mobile" :type="mobile ? 'temporary' : 'permanent'">
      <!-- The account header: cover, 64 dp avatar, name and email, and the
           switcher seat at the end of the account row (navigation-drawer page,
           Header) — here a caret that swaps the list below to account actions. -->
      <Md1NavigationDrawer.Header :avatar="me.avatar" :email="me.email" :image="cover" :name="me.name">
        <Md1Button
          :aria-expanded="accounts"
          aria-label="Accounts"
          class="md1-demo-shell__caret"
          icon="arrow-drop-down"
          @click="accounts = !accounts"
        />
      </Md1NavigationDrawer.Header>

      <Md1NavigationDrawer.Content>
        <!-- The caret swaps the destinations for the account actions, the
             account-chooser arrangement of the period's drawers. -->
        <Md1List v-if="accounts" aria-label="Account">
          <Md1List.Item href="/md1/profile" value="/md1/profile" @click.prevent="onAccount('/md1/profile')">
            Profile
          </Md1List.Item>

          <Md1List.Item @click="added = true">
            Add account
          </Md1List.Item>

          <Md1List.Item href="/md1/sign-in" value="/md1/sign-in" @click.prevent="onAccount('/md1/sign-in')">
            Sign out
          </Md1List.Item>
        </Md1List>

        <template v-else>
          <Md1List :model-value="current">
            <Md1List.Item
              v-for="link in links"
              :key="link.to"
              :href="link.to"
              :value="link.to"
              @click.prevent="go(link.to)"
            >
              <Md1List.Icon :name="link.icon" />

              {{ link.label }}
            </Md1List.Item>

            <Md1List.Item href="/md1/assistant" value="/md1/assistant" @click.prevent="go('/md1/assistant')">
              <Md1List.Icon name="feedback" />

              Assistant
            </Md1List.Item>

            <Md1List.Group v-model="group" icon="apps" title="Workspace">
              <Md1List.Item
                v-for="link in tools"
                :key="link.to"
                :href="link.to"
                :value="link.to"
                @click.prevent="go(link.to)"
              >
                {{ link.label }}
              </Md1List.Item>
            </Md1List.Group>
          </Md1List>

          <!-- An open group already closes itself off with a full-bleed divider
               (lists page); the section divider stands in only while it is shut. -->
          <Md1Divider v-if="!group" />

          <Md1List :model-value="current">
            <Md1List.Item href="/md1/settings" value="/md1/settings" @click.prevent="go('/md1/settings')">
              <Md1List.Icon name="settings" />

              Settings
            </Md1List.Item>

            <Md1List.Item href="/md1/help" value="/md1/help" @click.prevent="go('/md1/help')">
              <Md1List.Icon name="help" />

              Help &amp; feedback
            </Md1List.Item>
          </Md1List>
        </template>
      </Md1NavigationDrawer.Content>
    </Md1NavigationDrawer>

    <main class="md1-demo-shell__main">
      <RouterView />
    </main>

    <!-- The tour's travelling stops: their targets live inside components or
         lists a span may not wrap, so each prompt anchors a measured ghost
         fixed over the real control (arm()). display: contents - no seams out
         here, only the hue needs to reach the in-place portals. -->
    <span style="display: contents" :style="hue">
      <Md1FeatureDiscovery color="accent" :model-value="stage === 3" @closed="onLeft" @complete="onStop(4)" @dismiss="onQuit">
        <Md1FeatureDiscovery.Activator :style="ghost" @click="onGhost(3)" />

        <Md1FeatureDiscovery.Title>Done searching?</Md1FeatureDiscovery.Title>

        <Md1FeatureDiscovery.Text>
          The arrow puts the toolbar back the way it was.
        </Md1FeatureDiscovery.Text>
      </Md1FeatureDiscovery>

      <Md1FeatureDiscovery color="accent" :model-value="stage === 4" @closed="onLeft" @complete="onStop(5)" @dismiss="onQuit">
        <Md1FeatureDiscovery.Activator :style="ghost" @click="onGhost(4)" />

        <Md1FeatureDiscovery.Title>Your mail lives here</Md1FeatureDiscovery.Title>

        <Md1FeatureDiscovery.Text>
          Open the inbox to read, archive and reply.
        </Md1FeatureDiscovery.Text>
      </Md1FeatureDiscovery>

      <Md1FeatureDiscovery color="accent" :model-value="stage === 5" @closed="onLeft" @complete="onStop(0)" @dismiss="onQuit">
        <Md1FeatureDiscovery.Activator :style="ghost" @click="onGhost(5)" />

        <Md1FeatureDiscovery.Title>Start a message</Md1FeatureDiscovery.Title>

        <Md1FeatureDiscovery.Text>
          The compose button creates a new message from anywhere in the inbox.
        </Md1FeatureDiscovery.Text>
      </Md1FeatureDiscovery>
    </span>

    <!-- Inside the shell (no teleport) so the bar reads the stamped theme. -->
    <Md1Snackbar.Portal class="md1-demo-offer" :teleport="false">
      <Md1Snackbar v-model="ask" action="Start" :align="docked ? 'start' : undefined" @action="onTour">Want to take a tour?</Md1Snackbar>

      <Md1Snackbar v-model="added">Account linking is outside this demo</Md1Snackbar>
    </Md1Snackbar.Portal>

    <Md1BottomNavigation
      v-if="mobile"
      aria-label="Primary"
      :model-value="current"
      shifting
    >
      <Md1BottomNavigation.Action
        v-for="link in links"
        :key="link.to"
        :href="link.to"
        :icon="link.icon"
        :label="link.label"
        :value="link.to"
        @click.prevent="go(link.to)"
      />
    </Md1BottomNavigation>
  </div>
</template>

<style>
  .md1-demo-shell {
    box-sizing: border-box;
    display: flex;
    min-height: 100vh;
    min-height: 100dvh;
    /* The app bar is fixed over the screen; the drawer and content start one increment down. */
    padding-top: var(--md1-increment, 56px);
    background: var(--md1-background, #FAFAFA);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
  }

  /* Local stamp, not the theme plugin: the adapter writes color-scheme on
     :root for the app-wide selection, and this shell themes only itself. */
  .md1-demo-shell[data-theme='md1-dark'] {
    color-scheme: dark;
  }

  /* Long activity lines yield to their trailing time instead of clipping at
     the sheet's 280 dp cap. */
  .md1-demo-news .md1-menu__label {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Text protection over the cover (imagery page): the dark scrim's gradient,
     40% black at the account row's edge, centred at 50 dp, gone by 168 dp —
     the same recipe Md1Card.Media ships. The image keeps its own paint; the
     name, email, avatar and caret lift above the scrim. */
  .md1-demo-shell .md1-navigation-drawer__header::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 0;
    background: linear-gradient(to top, color-mix(in srgb, var(--md1-black, #000000) 40%, transparent), 50px, transparent 168px);
    pointer-events: none;
  }

  .md1-demo-shell .md1-navigation-drawer__header > :not(.md1-navigation-drawer__image) {
    position: relative;
    z-index: 1;
  }

  /* The account caret rides the header's account row in the anatomy's white
     ink, over the cover in both themes; the selector outranks the solo icon
     button's primary-text tier (.md1-button[data-solo]:not(...)). */
  .md1-demo-shell__caret.md1-button[data-solo]:not([data-disabled]),
  .md1-demo-shell__caret.md1-button[data-solo]:not([data-disabled]):hover,
  .md1-demo-shell__caret.md1-button[data-solo]:not([data-disabled]):focus-visible {
    color: var(--md1-on-primary, #FFFFFF);
  }

  .md1-demo-shell__caret .md1-icon {
    transition: rotate var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-demo-shell__caret[aria-expanded='true'] .md1-icon {
    rotate: 180deg;
  }

  @media (prefers-reduced-motion: reduce) {
    .md1-demo-shell__caret .md1-icon {
      transition: none;
    }
  }

  .md1-demo-shell__main {
    flex: 1 1 auto;
    min-width: 0;
    padding: var(--md1-keyline-margin, 16px);
  }

  /* The fixed bottom bar covers the viewport's last 56 dp (its height at every
     width, plus the home indicator): the content clears it, and pages offset
     their own fixed elements (FABs) by the seam. */
  .md1-demo-shell[data-nav] {
    --md1-demo-seam: calc(56px + env(safe-area-inset-bottom, 0px));
  }

  .md1-demo-shell[data-nav] .md1-demo-shell__main {
    padding-bottom: calc(var(--md1-demo-seam) + var(--md1-keyline-margin, 16px));
  }

  /* MD1 layers the snackbar behind the bar (6 dp under 8 dp) — that governs
     the overlap, not the resting place. While the bar shows, the snackbar
     rests one bar-height up, still entering from behind it. Through body:
     teleported portals render outside the shell. */
  body:has(.md1-demo-shell[data-nav]) .md1-snackbar-portal {
    bottom: calc(56px + env(safe-area-inset-bottom, 0px));
  }

  /* The tour offer sits at the bottom end from 600 px: the spec's floating
     form offers centre or start, so the end seat is this demo's mirror of the
     start variant's 24 dp insets, on the package's own inset motion. Under
     600 px the full-width handset form above stays. */
  @media (min-width: 600px) {
    .md1-demo-offer .md1-snackbar:not([data-align='start']) {
      align-self: flex-end;
      margin-inline-end: var(--md1-spacing-3, 24px);
      margin-bottom: var(--md1-spacing-3, 24px);
    }

    .md1-demo-offer .md1-snackbar:not([data-align='start'])[data-state='mounted'],
    .md1-demo-offer .md1-snackbar:not([data-align='start'])[data-state='present'] {
      animation-name: md1-snackbar-enter-inset;
    }

    .md1-demo-offer .md1-snackbar:not([data-align='start'])[data-state='leaving'] {
      animation-name: md1-snackbar-leave-inset;
    }
  }

  /* The toolbar-to-search swap cross-fades through a view transition scoped to
     the bar; everything else holds still. The morph() guard already skips the
     transition entirely under reduced motion. */
  .md1-demo-shell .md1-toolbar[data-app-bar] {
    view-transition-name: md1-demo-toolbar;
  }

  ::view-transition-old(md1-demo-toolbar),
  ::view-transition-new(md1-demo-toolbar) {
    animation-duration: var(--md1-duration-standard, 300ms);
    animation-timing-function: var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation: none;
  }
</style>
