<script setup lang="ts">
  // Framework
  import { useBreakpoints } from '@vuetify/v0'

  // Utilities
  import { onMounted, ref } from 'vue'

  interface EcosystemItem {
    name: string
    to: string
    description: string
    type: 'component' | 'composable'
  }

  interface EcosystemDomain {
    name: string
    items: EcosystemItem[]
  }

  const domains: EcosystemDomain[] = [
    {
      name: 'Forms',
      items: [
        { name: 'Checkbox', to: '/components/forms/checkbox', description: 'Accessible checkbox inputs', type: 'component' },
        { name: 'Combobox', to: '/components/forms/combobox', description: 'Autocomplete and filtering', type: 'component' },
        { name: 'Input', to: '/components/forms/input', description: 'Text input fields', type: 'component' },
        { name: 'NumberField', to: '/components/forms/number-field', description: 'Numeric input fields', type: 'component' },
        { name: 'Radio', to: '/components/forms/radio', description: 'Radio button groups', type: 'component' },
        { name: 'Rating', to: '/components/forms/rating', description: 'Star rating input', type: 'component' },
        { name: 'Select', to: '/components/forms/select', description: 'Dropdown selection', type: 'component' },
        { name: 'Slider', to: '/components/forms/slider', description: 'Range value selection', type: 'component' },
        { name: 'Switch', to: '/components/forms/switch', description: 'Toggle on/off state', type: 'component' },
        { name: 'createForm', to: '/composables/forms/create-form', description: 'Form state and submission', type: 'composable' },
        { name: 'createValidation', to: '/composables/forms/create-validation', description: 'Rule-based validation', type: 'composable' },
        { name: 'createCombobox', to: '/composables/forms/create-combobox', description: 'Autocomplete logic', type: 'composable' },
        { name: 'createSlider', to: '/composables/forms/create-slider', description: 'Slider state management', type: 'composable' },
        { name: 'createInput', to: '/composables/forms/create-input', description: 'Input field logic', type: 'composable' },
        { name: 'createNumeric', to: '/composables/forms/create-numeric', description: 'Number formatting', type: 'composable' },
        { name: 'createRating', to: '/composables/forms/create-rating', description: 'Rating state management', type: 'composable' },
      ],
    },
    {
      name: 'Disclosure',
      items: [
        { name: 'Dialog', to: '/components/disclosure/dialog', description: 'Modal dialogs', type: 'component' },
        { name: 'Tabs', to: '/components/disclosure/tabs', description: 'Tab-based navigation', type: 'component' },
        { name: 'Popover', to: '/components/disclosure/popover', description: 'Floating content', type: 'component' },
        { name: 'ExpansionPanel', to: '/components/disclosure/expansion-panel', description: 'Collapsible content panels', type: 'component' },
        { name: 'Treeview', to: '/components/disclosure/treeview', description: 'Hierarchical tree display', type: 'component' },
        { name: 'AlertDialog', to: '/components/disclosure/alert-dialog', description: 'Confirmation dialogs', type: 'component' },
        { name: 'Collapsible', to: '/components/disclosure/collapsible', description: 'Show/hide content', type: 'component' },
        { name: 'usePopover', to: '/composables/system/use-popover', description: 'Popover positioning logic', type: 'composable' },
      ],
    },
    {
      name: 'Selection',
      items: [
        { name: 'Selection', to: '/components/providers/selection', description: 'Multi-select management', type: 'component' },
        { name: 'Group', to: '/components/providers/group', description: 'Multi-select grouping', type: 'component' },
        { name: 'Single', to: '/components/providers/single', description: 'Single-select management', type: 'component' },
        { name: 'Step', to: '/components/providers/step', description: 'Stepper/wizard flows', type: 'component' },
        { name: 'createSelection', to: '/composables/selection/create-selection', description: 'Selection state logic', type: 'composable' },
        { name: 'createGroup', to: '/composables/selection/create-group', description: 'Group selection logic', type: 'composable' },
        { name: 'createSingle', to: '/composables/selection/create-single', description: 'Single selection logic', type: 'composable' },
        { name: 'createStep', to: '/composables/selection/create-step', description: 'Step progression logic', type: 'composable' },
        { name: 'createModel', to: '/composables/selection/create-model', description: 'Value store for selection', type: 'composable' },
        { name: 'createNested', to: '/composables/selection/create-nested', description: 'Tree selection logic', type: 'composable' },
      ],
    },
    {
      name: 'Data',
      items: [
        { name: 'Pagination', to: '/components/semantic/pagination', description: 'Page navigation', type: 'component' },
        { name: 'createDataTable', to: '/composables/data/create-data-table', description: 'Table state management', type: 'composable' },
        { name: 'createPagination', to: '/composables/data/create-pagination', description: 'Pagination logic', type: 'composable' },
        { name: 'createFilter', to: '/composables/data/create-filter', description: 'Data filtering', type: 'composable' },
        { name: 'createVirtual', to: '/composables/data/create-virtual', description: 'Virtual scrolling', type: 'composable' },
      ],
    },
    {
      name: 'Plugins',
      items: [
        { name: 'useTheme', to: '/composables/plugins/use-theme', description: 'Theme management', type: 'composable' },
        { name: 'useBreakpoints', to: '/composables/plugins/use-breakpoints', description: 'Reactive viewport breakpoints', type: 'composable' },
        { name: 'useLocale', to: '/composables/plugins/use-locale', description: 'i18n and locale configuration', type: 'composable' },
        { name: 'useStorage', to: '/composables/plugins/use-storage', description: 'Persistent reactive storage', type: 'composable' },
        { name: 'useDate', to: '/composables/plugins/use-date', description: 'Date parsing and formatting', type: 'composable' },
        { name: 'useLogger', to: '/composables/plugins/use-logger', description: 'Structured logging with adapters', type: 'composable' },
        { name: 'useFeatures', to: '/composables/plugins/use-features', description: 'Feature flags and toggles', type: 'composable' },
        { name: 'usePermissions', to: '/composables/plugins/use-permissions', description: 'Permission checking', type: 'composable' },
        { name: 'useNotifications', to: '/composables/plugins/use-notifications', description: 'Toast and notification system', type: 'composable' },
        { name: 'useRtl', to: '/composables/plugins/use-rtl', description: 'Right-to-left text direction', type: 'composable' },
        { name: 'useRules', to: '/composables/plugins/use-rules', description: 'Reusable validation rules', type: 'composable' },
        { name: 'useStack', to: '/composables/plugins/use-stack', description: 'Overlay z-index coordination', type: 'composable' },
        { name: 'useHydration', to: '/composables/plugins/use-hydration', description: 'SSR hydration state', type: 'composable' },
      ],
    },
    {
      name: 'System',
      items: [
        { name: 'useEventListener', to: '/composables/system/use-event-listener', description: 'Auto-cleaning event listeners', type: 'composable' },
        { name: 'useHotkey', to: '/composables/system/use-hotkey', description: 'Keyboard shortcut bindings', type: 'composable' },
        { name: 'useClickOutside', to: '/composables/system/use-click-outside', description: 'Detect outside clicks', type: 'composable' },
        { name: 'useResizeObserver', to: '/composables/system/use-resize-observer', description: 'Element resize tracking', type: 'composable' },
        { name: 'useIntersectionObserver', to: '/composables/system/use-intersection-observer', description: 'Viewport intersection', type: 'composable' },
        { name: 'useMutationObserver', to: '/composables/system/use-mutation-observer', description: 'DOM mutation tracking', type: 'composable' },
        { name: 'usePresence', to: '/composables/system/use-presence', description: 'Enter/exit animations', type: 'composable' },
        { name: 'useRovingFocus', to: '/composables/system/use-roving-focus', description: 'Arrow key navigation', type: 'composable' },
        { name: 'useVirtualFocus', to: '/composables/system/use-virtual-focus', description: 'Focus without DOM focus', type: 'composable' },
        { name: 'useRaf', to: '/composables/system/use-raf', description: 'requestAnimationFrame loop', type: 'composable' },
        { name: 'useTimer', to: '/composables/system/use-timer', description: 'Reactive countdown timer', type: 'composable' },
        { name: 'useLazy', to: '/composables/system/use-lazy', description: 'Deferred rendering', type: 'composable' },
        { name: 'useMediaQuery', to: '/composables/system/use-media-query', description: 'Reactive media queries', type: 'composable' },
      ],
    },
  ]

  const { isMobile } = useBreakpoints()

  function sample (items: EcosystemItem[], count: number): EcosystemItem[] {
    const shuffled = [...items].toSorted(() => Math.random() - 0.5)
    return shuffled.slice(0, Math.min(count, items.length))
  }

  const sampled = ref<Map<string, EcosystemItem[]>>(new Map())

  onMounted(() => {
    const count = isMobile.value ? 3 : 7
    const map = new Map<string, EcosystemItem[]>()

    for (const domain of domains) {
      map.set(domain.name, sample(domain.items, count))
    }

    sampled.value = map
  })
</script>

<template>
  <section class="home-ecosystem py-20 md:py-28">
    <div class="flex items-center justify-between mb-4">
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

    <!-- Legend -->
    <div class="flex items-center gap-4 mb-10">
      <span class="flex items-center gap-1.5 text-xs opacity-50">
        <span class="w-1.75 h-1.75 rounded-full bg-primary" />
        Component
      </span>
      <span class="flex items-center gap-1.5 text-xs opacity-50">
        <span class="w-1.75 h-1.75 rounded-sm bg-teal-400" />
        Composable
      </span>
    </div>

    <!-- Domain rows -->
    <div class="flex flex-col gap-12">
      <div v-for="domain in domains" :key="domain.name">
        <h3 class="text-lg md:text-xl font-bold mb-4">{{ domain.name }}</h3>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <router-link
            v-for="item in sampled.get(domain.name)"
            :key="item.name"
            class="ecosystem-card p-3 rounded-xl border bg-surface hover:bg-surface/50 transition-colors group"
            :class="item.type === 'component' ? 'hover:border-primary' : 'hover:border-teal-400'"
            :to="item.to"
          >
            <div class="flex items-center gap-1.5 mb-1">
              <span
                class="w-1.75 h-1.75 flex-shrink-0"
                :class="item.type === 'component' ? 'rounded-full bg-primary' : 'rounded-sm bg-teal-400'"
              />
              <span
                class="font-semibold text-sm transition-colors"
                :class="[
                  item.type === 'composable' ? 'font-mono' : '',
                  item.type === 'component' ? 'group-hover:text-primary' : 'group-hover:text-teal-400',
                ]"
              >
                {{ item.name }}
              </span>
            </div>
            <div class="text-xs opacity-50">
              {{ item.description }}
            </div>
          </router-link>

          <!-- "+N more" card -->
          <router-link
            v-if="domain.items.length - (sampled.get(domain.name)?.length ?? 0) > 0"
            class="ecosystem-card relative overflow-hidden p-3 rounded-xl border bg-surface hover:bg-surface/50 hover:border-primary transition-colors flex items-center gap-2"
            :to="domain.items.some(i => i.type === 'component') ? '/components' : '/composables'"
          >
            <AppDotGrid :coverage="50" :density="16" />

            <span class="relative font-mono text-sm text-primary">...</span>
            <span class="relative text-xs opacity-50">+{{ domain.items.length - (sampled.get(domain.name)?.length ?? 0) }} more</span>
          </router-link>
        </div>
      </div>
    </div>

    <AppLink
      class="md:hidden flex items-center justify-center gap-1 text-primary hover:underline font-medium mt-8"
      to="/components"
    >
      View all components & composables
    </AppLink>
  </section>
</template>
