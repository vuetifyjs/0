<script setup lang="ts">
  const components = [
    { name: 'Atom', to: '/components/primitives/atom', description: 'Base primitive element' },
    { name: 'Avatar', to: '/components/semantic/avatar', description: 'User avatars with fallback' },
    { name: 'ExpansionPanel', to: '/components/disclosure/expansion-panel', description: 'Collapsible content panels' },
    { name: 'Group', to: '/components/providers/group', description: 'Multi-select grouping' },
    { name: 'Pagination', to: '/components/semantic/pagination', description: 'Page navigation' },
    { name: 'Popover', to: '/components/disclosure/popover', description: 'Floating content' },
    { name: 'Selection', to: '/components/providers/selection', description: 'Selection management' },
    { name: 'Step', to: '/components/providers/step', description: 'Stepper/wizard flows' },
    { name: 'Tabs', to: '/components/disclosure/tabs', description: 'Tab-based navigation' },
    { name: 'Dialog', to: '/components/disclosure/dialog', description: 'Modal dialogs' },
    { name: 'Splitter', to: '/components/semantic/splitter', description: 'Resizable panel layouts' },
    { name: 'Checkbox', to: '/components/forms/checkbox', description: 'Accessible checkbox inputs' },
  ]

  const plugins = [
    { name: 'useTheme', to: '/composables/plugins/use-theme', description: 'Dark/light mode and custom themes' },
    { name: 'useBreakpoints', to: '/composables/plugins/use-breakpoints', description: 'Reactive viewport breakpoints' },
    { name: 'useLocale', to: '/composables/plugins/use-locale', description: 'i18n and locale configuration' },
    { name: 'useStorage', to: '/composables/plugins/use-storage', description: 'Persistent reactive storage' },
    { name: 'useDate', to: '/composables/plugins/use-date', description: 'Date parsing and formatting' },
    { name: 'useLogger', to: '/composables/plugins/use-logger', description: 'Structured logging with adapters' },
    { name: 'useFeatures', to: '/composables/plugins/use-features', description: 'Feature flags and toggles' },
    { name: 'usePermissions', to: '/composables/plugins/use-permissions', description: 'Permission checking and access control' },
    { name: 'useNotifications', to: '/composables/plugins/use-notifications', description: 'Toast and notification system' },
    { name: 'useRtl', to: '/composables/plugins/use-rtl', description: 'Right-to-left text direction' },
    { name: 'useRules', to: '/composables/plugins/use-rules', description: 'Reusable validation rules' },
    { name: 'useStack', to: '/composables/plugins/use-stack', description: 'Overlay z-index coordination' },
    { name: 'useHydration', to: '/composables/plugins/use-hydration', description: 'SSR hydration state' },
  ]

  const composables = [
    { name: 'createSelection', to: '/composables/selection/create-selection', category: 'Selection' },
    { name: 'createGroup', to: '/composables/selection/create-group', category: 'Selection' },
    { name: 'createSingle', to: '/composables/selection/create-single', category: 'Selection' },
    { name: 'createStep', to: '/composables/selection/create-step', category: 'Selection' },
    { name: 'createRegistry', to: '/composables/registration/create-registry', category: 'Registration' },
    { name: 'createTokens', to: '/composables/registration/create-tokens', category: 'Registration' },
    { name: 'createPagination', to: '/composables/data/create-pagination', category: 'Data' },
    { name: 'createFilter', to: '/composables/data/create-filter', category: 'Data' },
    { name: 'createForm', to: '/composables/forms/create-form', category: 'Forms' },
    { name: 'createVirtual', to: '/composables/data/create-virtual', category: 'Data' },
    { name: 'createContext', to: '/composables/foundation/create-context', category: 'Foundation' },
  ]
</script>

<template>
  <section class="home-ecosystem py-20 md:py-28">
    <!-- Components -->
    <div class="mb-16">
      <div class="flex items-center justify-between mb-8">
        <div>
          <p class="section-overline mb-2">Explore</p>
          <h2 class="text-2xl md:text-4xl font-bold tracking-tight mb-2">Components and composables for every use case.</h2>
          <p class="opacity-60">Growing every release.</p>
        </div>

        <AppLink
          class="hidden md:flex items-center gap-1 text-primary hover:underline font-medium"
          to="/components"
        >
          View all
        </AppLink>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <router-link
          v-for="(component, i) in components"
          :key="component.name"
          class="component-card relative overflow-hidden p-4 rounded-xl border bg-surface hover:bg-surface/50 hover:border-primary transition-all group"
          :style="{ '--reveal-index': i }"
          :to="component.to"
        >
          <AppDotGrid v-if="i === 0" :coverage="50" :density="16" />
          <AppDotGrid v-else-if="i === components.length - 1" :coverage="50" :density="16" origin="top right" />

          <div class="relative font-semibold mb-1 group-hover:text-primary transition-colors">
            {{ component.name }}
          </div>
          <div class="relative text-sm opacity-60">
            {{ component.description }}
          </div>
        </router-link>

        <router-link
          class="component-card p-4 rounded-xl border bg-surface hover:bg-surface/50 hover:border-primary transition-all flex items-center gap-2"
          to="/components"
        >
          <span class="font-mono text-sm text-primary">...</span>
          <span class="text-xs opacity-60">and more</span>
        </router-link>
      </div>

      <AppLink
        class="md:hidden flex items-center justify-center gap-1 text-primary hover:underline font-medium mt-6"
        to="/components"
      >
        View all components
      </AppLink>
    </div>

    <!-- Plugins -->
    <div class="mb-16">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-2xl md:text-3xl font-bold mb-2">Plugins</h2>
          <p class="opacity-60">App-wide services installed once, used anywhere</p>
        </div>

        <AppLink
          class="hidden md:flex items-center gap-1 text-primary hover:underline font-medium"
          to="/composables"
        >
          View all
        </AppLink>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <router-link
          v-for="(plugin, i) in plugins"
          :key="plugin.name"
          class="relative overflow-hidden p-4 rounded-xl border bg-surface hover:bg-surface/50 hover:border-primary transition-all group"
          :style="{ '--reveal-index': i }"
          :to="plugin.to"
        >
          <AppDotGrid v-if="i === 0" :coverage="50" :density="16" />
          <AppDotGrid v-else-if="i === plugins.length - 2" :coverage="50" :density="16" origin="top right" />

          <div class="relative font-mono font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
            {{ plugin.name }}
          </div>
          <div class="relative text-sm opacity-60">
            {{ plugin.description }}
          </div>
        </router-link>
      </div>

      <AppLink
        class="md:hidden flex items-center justify-center gap-1 text-primary hover:underline font-medium mt-6"
        to="/composables"
      >
        View all plugins
      </AppLink>
    </div>

    <!-- Composables -->
    <div>
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-2xl md:text-3xl font-bold mb-2">Composables</h2>
          <p class="opacity-60">Reactive utilities for any use case</p>
        </div>

        <AppLink
          class="hidden md:flex items-center gap-1 text-primary hover:underline font-medium"
          to="/composables"
        >
          View all
        </AppLink>
      </div>

      <div class="grid grid-cols-2 md:flex md:flex-wrap gap-3">
        <router-link
          v-for="(composable, i) in composables"
          :key="composable.name"
          class="composable-chip relative overflow-hidden px-4 py-2 rounded-lg border bg-surface hover:bg-surface/50 hover:border-primary transition-colors"
          :style="{ '--reveal-index': i }"
          :to="composable.to"
        >
          <AppDotGrid v-if="i === 0" :coverage="50" :density="16" />
          <AppDotGrid v-else-if="i === composables.length - 1" :coverage="50" :density="16" origin="top right" />

          <span class="relative font-mono text-sm">{{ composable.name }}</span>
          <span class="relative text-xs opacity-60 ml-2 hidden sm:inline">{{ composable.category }}</span>
        </router-link>

        <router-link
          class="composable-chip px-4 py-2 rounded-lg border bg-surface hover:bg-surface/50 hover:border-primary transition-colors"
          to="/composables"
        >
          <span class="font-mono text-sm text-primary">...</span>
          <span class="text-xs opacity-60 ml-2">and more</span>
        </router-link>
      </div>

      <AppLink
        class="md:hidden flex items-center justify-center gap-1 text-primary hover:underline font-medium mt-6"
        to="/composables"
      >
        View all composables
      </AppLink>
    </div>
  </section>
</template>
