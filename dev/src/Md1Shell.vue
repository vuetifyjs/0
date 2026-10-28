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
  import { isString, useBreakpoints, useStorage, useTimer } from '@vuetify/v0'

  // Context
  import { search } from './Md1Data'

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
  ]

  /** Initials avatar as an inline SVG data URI: the demo ships no raster images. */
  const avatar = 'data:image/svg+xml,'
    + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="#FF8A65"/><text x="32" y="41" fill="#FFFFFF" font-family="Roboto, sans-serif" font-size="26" font-weight="500" text-anchor="middle">AR</text></svg>')
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1Shell' })

  const route = useRoute()
  const router = useRouter()
  const storage = useStorage()

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

  function go (to: string) {
    router.push(to)
    open.value = false
  }

  // Toolbar search

  const searching = shallowRef(false)
  const query = shallowRef('')
  const found = search(query)

  /** Completions straight from the live cross-page search: they always exist. */
  const suggestions = toRef(() => found.value.flatMap(hits => hits.hits.map(hit => hit.title)).slice(0, 6))

  const history = storage.get<string[]>('md1-demo:searches', [])

  function onFind (value: string) {
    if (!value.trim()) return

    history.value = [value, ...history.value.filter(past => past !== value)].slice(0, 5)
    searching.value = false
    router.push({ path: '/md1/search', query: { q: value } })
  }

  // Already on the results page, typing filters it live; Enter still commits to history.
  watch(query, value => {
    if (searching.value && route.path === '/md1/search') {
      router.replace({ path: '/md1/search', query: value.trim() ? { q: value } : {} })
    }
  })

  // The tour: a snackbar offer, then two chained one-step prompts (the
  // feature-discovery page runs a one-step v0 Tour per prompt, so a short
  // tour is prompts in sequence). 0 = idle, 1 = the theme stop, 2 = search.

  const stage = shallowRef<0 | 1 | 2>(0)

  const seen = storage.get('md1-demo:tip-search', false)
  const ask = shallowRef(false)

  // The offer waits for the shell to settle; the tour itself only ever starts
  // from the snackbar's action or the overflow's Show tips.
  const delay = useTimer(() => {
    ask.value = true
  }, { duration: 1200 })

  onMounted(() => {
    if (!seen.value) delay.start()
  })

  // However the bar leaves — Start, its timeout, a dismissal — it never nags again.
  watch(ask, value => {
    if (!value) seen.value = true
  })

  function onTour () {
    ask.value = false
    stage.value = 1
  }

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

      <Md1Toolbar.Actions>
        <!-- The tour's finale: pressing the promoted action opens search itself. -->
        <Md1FeatureDiscovery :model-value="stage === 2" @complete="stage = 0" @dismiss="stage = 0">
          <Md1FeatureDiscovery.Activator>
            <Md1Tooltip>
              <Md1Tooltip.Activator v-slot="{ attrs }">
                <Md1Button v-bind="attrs" aria-label="Search" icon="search" @click="searching = true" />
              </Md1Tooltip.Activator>

              <Md1Tooltip.Content>Search</Md1Tooltip.Content>
            </Md1Tooltip>
          </Md1FeatureDiscovery.Activator>

          <Md1FeatureDiscovery.Title>Search everything</Md1FeatureDiscovery.Title>

          <Md1FeatureDiscovery.Text>
            One search covers your messages, contacts, orders, files and activity.
          </Md1FeatureDiscovery.Text>
        </Md1FeatureDiscovery>

        <Md1FeatureDiscovery :model-value="stage === 1" @complete="stage = 2" @dismiss="stage = 0">
          <Md1FeatureDiscovery.Activator>
            <Md1Tooltip>
              <Md1Tooltip.Activator v-slot="{ attrs }">
                <Md1IconToggle v-bind="attrs" v-model="dark" aria-label="Dark theme" icon="invert-colors" />
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
        v-model:open="searching"
        :history
        :suggestions
        @submit="onFind"
      />
    </Md1Toolbar>

    <Md1NavigationDrawer v-model="open" :clipped="!mobile" :type="mobile ? 'temporary' : 'permanent'">
      <Md1NavigationDrawer.Header :avatar email="ana.ribeiro@example.com" name="Ana Ribeiro" />

      <Md1NavigationDrawer.Content>
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

        <Md1Divider />

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
      </Md1NavigationDrawer.Content>
    </Md1NavigationDrawer>

    <main class="md1-demo-shell__main">
      <RouterView />
    </main>

    <!-- Inside the shell (no teleport) so the bar reads the stamped theme. -->
    <Md1Snackbar.Portal :teleport="false">
      <Md1Snackbar v-model="ask" action="Start" @action="onTour">Want to take a tour?</Md1Snackbar>
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
</style>
