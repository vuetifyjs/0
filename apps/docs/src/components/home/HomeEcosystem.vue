<script setup lang="ts">
  const components = [
    { name: 'Atom', to: '/components/primitives/atom', description: 'Base primitive element' },
    { name: 'Avatar', to: '/components/semantic/avatar', description: 'User avatars with fallback' },
    { name: 'ExpansionPanel', to: '/components/disclosure/expansion-panel', description: 'Collapsible content panels' },
    { name: 'Group', to: '/components/providers/group', description: 'Multi-select grouping' },
    { name: 'Pagination', to: '/components/semantic/pagination', description: 'Page navigation' },
    { name: 'Popover', to: '/components/disclosure/popover', description: 'Floating content' },
    { name: 'Selection', to: '/components/providers/selection', description: 'Selection state management' },
    { name: 'Step', to: '/components/providers/step', description: 'Stepper/wizard flows' },
  ]

  const composables = [
    { name: 'createSelection', to: '/composables/selection/create-selection', category: 'Selection' },
    { name: 'createGroup', to: '/composables/selection/create-group', category: 'Selection' },
    { name: 'createSingle', to: '/composables/selection/create-single', category: 'Selection' },
    { name: 'createStep', to: '/composables/selection/create-step', category: 'Selection' },
    { name: 'useTheme', to: '/composables/plugins/use-theme', category: 'Plugins' },
    { name: 'useBreakpoints', to: '/composables/plugins/use-breakpoints', category: 'Plugins' },
    { name: 'useLocale', to: '/composables/plugins/use-locale', category: 'Plugins' },
    { name: 'useStorage', to: '/composables/plugins/use-storage', category: 'Plugins' },
    { name: 'createRegistry', to: '/composables/registration/create-registry', category: 'Registration' },
    { name: 'createTokens', to: '/composables/registration/create-tokens', category: 'Registration' },
    { name: 'usePagination', to: '/composables/utilities/use-pagination', category: 'Utilities' },
    { name: 'useFilter', to: '/composables/utilities/use-filter', category: 'Utilities' },
    { name: 'createForm', to: '/composables/forms/create-form', category: 'Forms' },
    { name: 'useVirtual', to: '/composables/utilities/use-virtual', category: 'Utilities' },
    { name: 'createContext', to: '/composables/foundation/create-context', category: 'Foundation' },
  ]
</script>

<template>
  <section class="home-ecosystem py-16 md:py-20">
    <!-- Components -->
    <div class="mb-16">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-2xl md:text-3xl font-bold mb-2">Components</h2>
          <p class="opacity-60">Headless primitives ready for your styles</p>
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
          v-for="component in components"
          :key="component.name"
          class="component-card p-4 rounded-xl border bg-surface hover:bg-surface/50 hover:border-primary/50 transition-all group"
          :to="component.to"
        >
          <div class="font-semibold mb-1 group-hover:text-primary transition-colors">
            {{ component.name }}
          </div>
          <div class="text-sm opacity-60">
            {{ component.description }}
          </div>
        </router-link>
      </div>

      <AppLink
        class="md:hidden flex items-center justify-center gap-1 text-primary hover:underline font-medium mt-6"
        to="/components"
      >
        View all components
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
          v-for="composable in composables"
          :key="composable.name"
          class="composable-chip px-4 py-2 rounded-lg border bg-surface hover:bg-surface/50 hover:border-primary/50 transition-colors"
          :to="composable.to"
        >
          <span class="font-mono text-sm">{{ composable.name }}</span>
          <span class="text-xs opacity-60 ml-2 hidden sm:inline">{{ composable.category }}</span>
        </router-link>

        <router-link
          class="composable-chip px-4 py-2 rounded-lg border bg-surface hover:bg-surface/50 hover:border-primary/50 transition-colors"
          to="/composables"
        >
          <span class="font-mono text-sm text-primary">...</span>
          <span class="text-xs opacity-60 ml-2">20+ more</span>
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
