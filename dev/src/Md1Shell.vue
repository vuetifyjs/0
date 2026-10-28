<script lang="ts">
  import {
    Md1Button,
    Md1Divider,
    Md1IconToggle,
    Md1List,
    Md1Menu,
    Md1NavigationDrawer,
    Md1Toolbar,
    md1Breakpoints,
  } from '@paper/md1'

  // Framework
  import { useBreakpoints } from '@vuetify/v0'

  // Utilities
  import { shallowRef, toRef, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  // Types
  import type { Md1IconName } from '@paper/md1'

  /**
   * Module state, not a setup ref: every md1 page mounts its own shell, so a
   * ref declared in setup would reset to light on navigation. Deliberately not
   * persisted — the demo always boots light.
   */
  export const dark = shallowRef(false)

  type Link = {
    label: string
    to: string
    icon: Md1IconName
  }

  const links: Link[] = [
    { label: 'Overview', to: '/md1', icon: 'home' },
    { label: 'Inbox', to: '/md1/inbox', icon: 'inbox' },
    { label: 'Orders', to: '/md1/orders', icon: 'reorder' },
    { label: 'Files', to: '/md1/files', icon: 'folder' },
  ]

  /** Initials avatar as an inline SVG data URI: the demo ships no raster images. */
  const avatar = 'data:image/svg+xml,'
    + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="#FF8A65"/><text x="32" y="41" fill="#FFFFFF" font-family="Roboto, sans-serif" font-size="26" font-weight="500" text-anchor="middle">AR</text></svg>')
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1Shell' })

  defineSlots<{
    /** The page's content, scrolling under the fixed app bar. */
    default?: () => any
  }>()

  const { title } = defineProps<{
    /** The page name, rendered as the app bar title. */
    title: string
  }>()

  const route = useRoute()
  const router = useRouter()
  const { width } = useBreakpoints()

  /** Below the 960 dp breakpoint the drawer is temporary; above it, permanent and clipped. */
  const mobile = toRef(() => width.value < md1Breakpoints[960])
  const open = shallowRef(false)

  // A drawer that changes type starts closed, so a handset never opens on a scrim.
  watch(mobile, () => {
    open.value = false
  })

  const current = toRef(() => route.path.length > 1 ? route.path.replace(/\/+$/, '') : route.path)

  function go (to: string) {
    router.push(to)
    open.value = false
  }
</script>

<template>
  <div class="md1-demo-shell" :data-theme="dark ? 'md1-dark' : 'md1-light'">
    <Md1Toolbar app-bar>
      <Md1Toolbar.Nav v-if="mobile" :open @click="open = !open" />

      <Md1Toolbar.Title>{{ title }}</Md1Toolbar.Title>

      <Md1Toolbar.Actions>
        <Md1IconToggle v-model="dark" aria-label="Dark theme" icon="invert-colors" />

        <Md1Menu>
          <Md1Menu.Activator v-slot="{ attrs }">
            <Md1Button v-bind="attrs" aria-label="More options" icon="more-vert" />
          </Md1Menu.Activator>

          <Md1Menu.Content>
            <Md1Menu.Item>About</Md1Menu.Item>

            <Md1Menu.Item>Send feedback</Md1Menu.Item>
          </Md1Menu.Content>
        </Md1Menu>
      </Md1Toolbar.Actions>
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
        </Md1List>

        <Md1Divider />

        <Md1List :model-value="current">
          <Md1List.Item href="/md1/settings" value="/md1/settings" @click.prevent="go('/md1/settings')">
            <Md1List.Icon name="settings" />

            Settings
          </Md1List.Item>

          <Md1List.Item>
            <Md1List.Icon name="help" />

            Help &amp; feedback
          </Md1List.Item>
        </Md1List>
      </Md1NavigationDrawer.Content>
    </Md1NavigationDrawer>

    <main class="md1-demo-shell__main">
      <slot />
    </main>
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
</style>
