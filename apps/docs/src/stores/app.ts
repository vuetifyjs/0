import { defineStore } from 'pinia'

// Minimal type for commit data we actually use
interface Commit {
  sha: string
  html_url: string
}

// Navigation item types
export interface NavItemLink {
  name: string
  to: string
  children?: NavItem[]
}

export interface NavItemCategory {
  name: string
  children: NavItem[]
}

export interface NavItemDivider {
  divider: true
}

export type NavItem = NavItemLink | NavItemCategory | NavItemDivider

function flattenRoutes (nav: NavItem): string[] {
  const routes: string[] = []

  if ('to' in nav && nav.to) {
    routes.push(nav.to)
  }

  if ('children' in nav && nav.children) {
    routes.push(...nav.children.flatMap(child => flattenRoutes(child)))
  }

  return routes
}

export const useAppStore = defineStore('app', {
  state: () => ({
    drawer: false,
    nav: [
      {
        name: 'Introduction',
        to: '/',
        children: [
          { name: 'Getting Started', to: '/introduction/getting-started' },
          { name: 'Frequently Asked', to: '/introduction/frequently-asked' },
          { name: 'Contributing', to: '/introduction/contributing' },
        ],
      },
      { divider: true },
      { name: 'Storybook', to: '/storybook' },
      {
        name: 'Guide',
        to: '/guide',
        // children: [
        //   { name: 'Features', to: '/guide/features' },
        //   { name: 'Structure', to: '/guide/structure' },
        //   { name: 'Framework core', to: '/guide/framework-core' },
        //   { name: 'Composables', to: '/guide/composables' },
        //   { name: 'Components', to: '/guide/components' },
        //   { name: 'Utilities', to: '/guide/utilities' },
        //   { name: 'Plugins', to: '/guide/plugins' },
        //   { name: 'Theming', to: '/guide/theming' },
        //   { name: 'Accessibility', to: '/guide/accessibility' },
        // ],
      },
      { divider: true },
      {
        name: 'Components',
        to: '/components',
        children: [
          {
            name: 'Primitives',
            children: [
              { name: 'Atom', to: '/components/primitives/atom' },
            ],
          },
          {
            name: 'Providers',
            children: [
              { name: 'Selection', to: '/components/providers/selection' },
              { name: 'Single', to: '/components/providers/single' },
              { name: 'Group', to: '/components/providers/group' },
              { name: 'Step', to: '/components/providers/step' },
            ],
          },
          {
            name: 'Semantic',
            children: [
              { name: 'Avatar', to: '/components/semantic/avatar' },
              { name: 'Pagination', to: '/components/semantic/pagination' },
            ],
          },
          {
            name: 'Disclosure',
            children: [
              { name: 'ExpansionPanel', to: '/components/disclosure/expansion-panel' },
              { name: 'Popover', to: '/components/disclosure/popover' },
            ],
          },
        ],
      },
      { divider: true },
      {
        name: 'Composables',
        to: '/composables',
        children: [
          {
            name: 'Foundation',
            children: [
              { name: 'createContext', to: '/composables/foundation/create-context' },
              { name: 'createTrinity', to: '/composables/foundation/create-trinity' },
              { name: 'createPlugin', to: '/composables/foundation/create-plugin' },
            ],
          },
          {
            name: 'Registration',
            children: [
              { name: 'useRegistry', to: '/composables/registration/use-registry' },
              { name: 'useProxyRegistry', to: '/composables/registration/use-proxy-registry' },
              { name: 'useQueue', to: '/composables/registration/use-queue' },
              { name: 'useTimeline', to: '/composables/registration/use-timeline' },
              { name: 'useTokens', to: '/composables/registration/use-tokens' },
            ],
          },
          {
            name: 'Selection',
            children: [
              { name: 'useSelection', to: '/composables/selection/use-selection' },
              { name: 'useGroup', to: '/composables/selection/use-group' },
              { name: 'useSingle', to: '/composables/selection/use-single' },
              { name: 'useStep', to: '/composables/selection/use-step' },
            ],
          },
          {
            name: 'Forms',
            children: [
              { name: 'useForm', to: '/composables/forms/use-form' },
              { name: 'useProxyModel', to: '/composables/forms/use-proxy-model' },
            ],
          },
          {
            name: 'System',
            children: [
              { name: 'useEventListener', to: '/composables/system/use-event-listener' },
              { name: 'useIntersectionObserver', to: '/composables/system/use-intersection-observer' },
              { name: 'useKeydown', to: '/composables/system/use-keydown' },
              { name: 'useMutationObserver', to: '/composables/system/use-mutation-observer' },
              { name: 'useResizeObserver', to: '/composables/system/use-resize-observer' },
              { name: 'useToggleScope', to: '/composables/system/use-toggle-scope' },
            ],
          },
          {
            name: 'Plugins',
            children: [
              { name: 'useBreakpoints', to: '/composables/plugins/use-breakpoints' },
              { name: 'useFeatures', to: '/composables/plugins/use-features' },
              { name: 'useHydration', to: '/composables/plugins/use-hydration' },
              { name: 'useLocale', to: '/composables/plugins/use-locale' },
              { name: 'useLogger', to: '/composables/plugins/use-logger' },
              { name: 'usePermissions', to: '/composables/plugins/use-permissions' },
              { name: 'useStorage', to: '/composables/plugins/use-storage' },
              { name: 'useTheme', to: '/composables/plugins/use-theme' },
            ],
          },
          {
            name: 'Utilities',
            children: [
              { name: 'useFilter', to: '/composables/utilities/use-filter' },
              { name: 'useOverflow', to: '/composables/utilities/use-overflow' },
              { name: 'usePagination', to: '/composables/utilities/use-pagination' },
              { name: 'useVirtual', to: '/composables/utilities/use-virtual' },
            ],
          },
          {
            name: 'Transformers',
            children: [
              { name: 'toArray', to: '/composables/transformers/to-array' },
              { name: 'toReactive', to: '/composables/transformers/to-reactive' },
            ],
          },
        ],
      },
    ],
    stats: {
      commit: null as Commit | null,
      tag: null,
    },
  }),
  getters: {
    routes: (state): string[] => {
      const pages: string[] = []

      for (const nav of state.nav) {
        if (!('children' in nav) && !('to' in nav)) continue

        pages.push(...flattenRoutes(nav as NavItem))
      }

      return pages
    },
  },
})
