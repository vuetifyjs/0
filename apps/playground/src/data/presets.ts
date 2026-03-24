// Types
import type { MainOptions } from '@/data/playground-defaults'

export interface PresetDefinition {
  id: string
  label: string
  icon: string
  description: string
  mainOptions?: MainOptions
  files: Record<string, string>
  imports?: Record<string, string>
}

export interface AddonDefinition {
  id: string
  label: string
  icon: string
  description: string
  mainOptions?: Partial<MainOptions>
  /** Files added on enable and removed on disable */
  files?: Record<string, string>
  /** Files replaced on enable but left alone on disable */
  replaceFiles?: Record<string, string>
  imports?: Record<string, string>
  /** Addon IDs to disable when this addon is enabled */
  excludes?: string[]
}

// ── Preset file templates ────────────────────────────────────────────────

export const DEFAULT_APP = `<script lang="ts" setup>
  import { createSingle } from '@vuetify/v0'

  const single = createSingle({ mandatory: 'force' })

  single.onboard([
    { id: 'home', value: 'Home' },
    { id: 'profile', value: 'Profile' },
    { id: 'settings', value: 'Settings' },
  ])

  const tabs = single.values()
</script>

<template>
  <div class="p-6">
    <div class="flex border-b border-divider mb-6">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors"
        :class="tab.isSelected.value
          ? 'text-primary border-primary'
          : 'text-on-surface-variant border-transparent hover:text-on-surface'"
        @click="tab.toggle()"
      >
        {{ tab.value }}
      </button>
    </div>

    <p class="text-sm text-on-surface-variant">
      Active tab: <strong class="text-on-surface">{{ single.selectedId.value }}</strong>
    </p>
  </div>
</template>
`

// ── Vue Router ────────────────────────────────────────────────────────────

const ROUTER_APP = `<script lang="ts" setup>
  import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-background">
    <header class="border-b border-divider px-6 py-3 flex items-center gap-6">
      <span class="text-sm font-semibold text-on-surface">My App</span>
      <nav class="flex gap-4">
        <RouterLink
          class="text-sm text-on-surface-variant hover:text-on-surface transition-colors"
          active-class="text-primary font-medium"
          to="/"
        >Home</RouterLink>
        <RouterLink
          class="text-sm text-on-surface-variant hover:text-on-surface transition-colors"
          active-class="text-primary font-medium"
          to="/about"
        >About</RouterLink>
      </nav>
    </header>
    <main class="p-6">
      <RouterView />
    </main>
  </div>
</template>
`

const ROUTER_TS = `import { createMemoryHistory, createRouter } from 'vue-router'
import Home from './pages/Home.vue'
import About from './pages/About.vue'

export default createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/about', name: 'about', component: About },
  ],
})
`

const ROUTER_HOME = `<template>
  <div class="flex flex-col gap-2">
    <h1 class="text-2xl font-semibold text-on-surface">Home</h1>
    <p class="text-on-surface-variant">Welcome to your Vue Router playground.</p>
  </div>
</template>
`

const ROUTER_ABOUT = `<template>
  <div class="flex flex-col gap-2">
    <h1 class="text-2xl font-semibold text-on-surface">About</h1>
    <p class="text-on-surface-variant">This is the about page.</p>
  </div>
</template>
`

// ── TanStack Router ──────────────────────────────────────────────────────

const TANSTACK_APP = `<script lang="ts" setup>
  import { RouterProvider } from '@tanstack/vue-router'
  import { router } from './router'
</script>

<template>
  <RouterProvider :router="router" />
</template>
`

const TANSTACK_ROOT = `<script lang="ts" setup>
  import { Link, Outlet } from '@tanstack/vue-router'
</script>

<template>
  <div class="min-h-screen bg-background">
    <header class="border-b border-divider px-6 py-3 flex items-center gap-6">
      <span class="text-sm font-semibold text-on-surface">My App</span>
      <nav class="flex gap-4">
        <Link
          class="text-sm text-on-surface-variant hover:text-on-surface transition-colors"
          :activeProps="{ class: 'text-primary font-medium' }"
          to="/"
          :activeOptions="{ exact: true }"
        >Home</Link>
        <Link
          class="text-sm text-on-surface-variant hover:text-on-surface transition-colors"
          :activeProps="{ class: 'text-primary font-medium' }"
          to="/about"
        >About</Link>
      </nav>
    </header>
    <main class="p-6">
      <Outlet />
    </main>
  </div>
</template>
`

const TANSTACK_ROUTER_TS = `import { createMemoryHistory, createRootRoute, createRoute, createRouter } from '@tanstack/vue-router'
import Root from './Root.vue'
import Home from './pages/Home.vue'
import About from './pages/About.vue'

const rootRoute = createRootRoute({ component: Root })

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
})

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: About,
})

const routeTree = rootRoute.addChildren([homeRoute, aboutRoute])

// @ts-expect-error - strictNullChecks not enabled in REPL tsconfig
export const router = createRouter({
  routeTree,
  history: createMemoryHistory(),
})
`

// ── Pinia ─────────────────────────────────────────────────────────────────

const PINIA_COUNTER = `import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)

  function increment () { count.value++ }
  function decrement () { count.value-- }
  function reset () { count.value = 0 }

  return { count, doubleCount, increment, decrement, reset }
})
`

// ── Vuetify ───────────────────────────────────────────────────────────────

const VUETIFY_APP = `<script lang="ts" setup>
  import { ref } from 'vue'

  const tab = ref('home')
  const count = ref(0)
</script>

<template>
  <v-app>
    <v-app-bar flat border="b">
      <v-app-bar-title>My App</v-app-bar-title>
      <template #append>
        <v-btn icon="mdi-github" variant="text" href="https://vuetifyjs.com" target="_blank" />
      </template>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title>Welcome to Vuetify 4</v-card-title>
              <v-card-text>
                Material Design components — use
                <code>@vuetify/v0</code> for headless primitives or
                <code>vuetify</code> for styled components.
              </v-card-text>
              <v-card-actions>
                <v-btn color="primary" variant="flat" @click="count++">
                  Clicked {{ count }} times
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card>
              <v-tabs v-model="tab">
                <v-tab value="home">Home</v-tab>
                <v-tab value="about">About</v-tab>
              </v-tabs>
              <v-card-text>
                <v-tabs-window v-model="tab">
                  <v-tabs-window-item value="home">
                    <p>This is the home tab.</p>
                  </v-tabs-window-item>
                  <v-tabs-window-item value="about">
                    <p>This is the about tab.</p>
                  </v-tabs-window-item>
                </v-tabs-window>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
`

// ── Preset registry ──────────────────────────────────────────────────────

export const PRESETS: PresetDefinition[] = [
  {
    id: 'default',
    label: 'Vuetify0',
    icon: 'vuetify-0',
    description: 'Headless composables with @vuetify/v0',
    files: { 'src/App.vue': DEFAULT_APP },
  },
  {
    id: 'vuetify',
    label: 'Vuetify',
    icon: 'vuetify',
    description: 'Material Design components with Vuetify 4',
    mainOptions: { vuetify: true, v0: false },
    files: { 'src/App.vue': VUETIFY_APP },
    imports: {
      vuetify: 'https://cdn.jsdelivr.net/npm/vuetify@latest/dist/vuetify-labs.esm.js',
    },
  },
]

// ── Addon registry ────────────────────────────────────────────────────────

export const ADDONS: AddonDefinition[] = [
  {
    id: 'router',
    label: 'Vue Router',
    icon: 'vue-router',
    description: 'Adds routing infrastructure and example pages',
    excludes: ['tanstack-router'],
    mainOptions: { router: true },
    files: {
      'src/router.ts': ROUTER_TS,
      'src/pages/Home.vue': ROUTER_HOME,
      'src/pages/About.vue': ROUTER_ABOUT,
    },
    replaceFiles: {
      'src/App.vue': ROUTER_APP,
    },
    imports: {
      'vue-router': 'https://cdn.jsdelivr.net/npm/vue-router@latest/dist/vue-router.esm-browser.js',
    },
  },
  {
    id: 'pinia',
    label: 'Pinia',
    icon: 'pinia',
    description: 'Adds a state store and example counter',
    mainOptions: { pinia: true },
    files: {
      'src/stores/counter.ts': PINIA_COUNTER,
    },
    imports: {
      pinia: 'https://cdn.jsdelivr.net/npm/pinia@latest/dist/pinia.esm-browser.js',
    },
  },
  {
    id: 'tanstack-router',
    label: 'TanStack Router',
    icon: 'tanstack',
    description: 'Adds type-safe routing with TanStack Router',
    excludes: ['router'],
    files: {
      'src/router.ts': TANSTACK_ROUTER_TS,
      'src/Root.vue': TANSTACK_ROOT,
      'src/pages/Home.vue': ROUTER_HOME,
      'src/pages/About.vue': ROUTER_ABOUT,
    },
    replaceFiles: {
      'src/App.vue': TANSTACK_APP,
    },
    imports: {
      '@tanstack/vue-router': 'https://esm.sh/@tanstack/vue-router?external=vue',
    },
  },
]
