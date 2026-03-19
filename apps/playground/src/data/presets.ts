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

// ── Preset file templates ────────────────────────────────────────────────

const DEFAULT_APP = `<script lang="ts" setup>
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

const ROUTER_APP = `<script lang="ts" setup>
  import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="p-6">
    <nav class="flex gap-4 mb-6 border-b border-divider pb-4">
      <RouterLink
        class="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors"
        active-class="text-primary"
        to="/"
      >Home</RouterLink>
      <RouterLink
        class="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors"
        active-class="text-primary"
        to="/about"
      >About</RouterLink>
    </nav>
    <RouterView />
  </div>
</template>
`

const ROUTER_ROUTER_TS = `import { createMemoryHistory, createRouter } from 'vue-router'
import Home from './Home.vue'
import About from './About.vue'

export default createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/about', name: 'about', component: About },
  ],
})
`

const ROUTER_HOME = `<template>
  <div>
    <h1 class="text-xl font-semibold text-on-surface">Home</h1>
    <p class="mt-2 text-sm text-on-surface-variant">Welcome to your Vue Router playground.</p>
  </div>
</template>
`

const ROUTER_ABOUT = `<template>
  <div>
    <h1 class="text-xl font-semibold text-on-surface">About</h1>
    <p class="mt-2 text-sm text-on-surface-variant">This is the about page.</p>
  </div>
</template>
`

const PINIA_APP = `<script lang="ts" setup>
  import { useCounterStore } from './counter'

  const counter = useCounterStore()
</script>

<template>
  <div class="p-6 flex flex-col gap-4">
    <h1 class="text-xl font-semibold text-on-surface">Counter</h1>
    <div class="text-5xl font-mono text-primary">{{ counter.count }}</div>
    <div class="flex gap-3">
      <button
        class="px-4 py-2 rounded bg-primary text-on-primary text-sm font-medium"
        @click="counter.decrement"
      >−</button>
      <button
        class="px-4 py-2 rounded bg-primary text-on-primary text-sm font-medium"
        @click="counter.increment"
      >+</button>
      <button
        class="px-4 py-2 rounded border border-divider text-on-surface text-sm font-medium"
        @click="counter.reset"
      >Reset</button>
    </div>
    <p class="text-sm text-on-surface-variant">Double: {{ counter.doubleCount }}</p>
  </div>
</template>
`

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

const VUETIFY_APP = `<template>
  <v-app>
    <v-main class="pa-6">
      <v-card max-width="400">
        <v-card-title>Hello Vuetify</v-card-title>
        <v-card-text>You're using Vuetify 4 inside the @vuetify/v0 playground.</v-card-text>
        <v-card-actions>
          <v-btn color="primary" variant="flat">Click me</v-btn>
        </v-card-actions>
      </v-card>
    </v-main>
  </v-app>
</template>
`

// ── Preset registry ──────────────────────────────────────────────────────

export const PRESETS: PresetDefinition[] = [
  {
    id: 'default',
    label: 'Default',
    icon: 'editor',
    description: 'Headless composables with @vuetify/v0',
    files: { 'src/App.vue': DEFAULT_APP },
  },
  {
    id: 'router',
    label: 'Vue Router',
    icon: 'folder',
    description: 'Multi-page app with vue-router',
    mainOptions: { router: true },
    files: {
      'src/App.vue': ROUTER_APP,
      'src/router.ts': ROUTER_ROUTER_TS,
      'src/Home.vue': ROUTER_HOME,
      'src/About.vue': ROUTER_ABOUT,
    },
    imports: {
      'vue-router': 'https://cdn.jsdelivr.net/npm/vue-router@latest/dist/vue-router.esm-browser.js',
    },
  },
  {
    id: 'pinia',
    label: 'Pinia',
    icon: 'cog',
    description: 'State management with pinia',
    mainOptions: { pinia: true },
    files: {
      'src/App.vue': PINIA_APP,
      'src/counter.ts': PINIA_COUNTER,
    },
    imports: {
      pinia: 'https://cdn.jsdelivr.net/npm/pinia@latest/dist/pinia.esm-browser.js',
    },
  },
  {
    id: 'vuetify',
    label: 'Vuetify',
    icon: 'lang-vue',
    description: 'Material Design components with Vuetify 4',
    mainOptions: { vuetify: true },
    files: { 'src/App.vue': VUETIFY_APP },
    imports: {
      vuetify: 'https://cdn.jsdelivr.net/npm/vuetify@latest/dist/vuetify.esm.js',
    },
  },
]
