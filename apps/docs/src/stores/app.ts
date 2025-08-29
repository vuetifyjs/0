import { defineStore } from 'pinia'
import type { operations } from '@octokit/openapi-types'

type ListCommitsResponse = operations['repos/list-commits']['responses']['200']['content']['application/json']
type Commit = ListCommitsResponse[number]

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
              { name: 'useTokens', to: '/composables/registration/use-tokens' },
            ],
          },
          {
            name: 'Selection',
            children: [
              { name: 'useFilter', to: '/composables/selection/use-filter' },
              { name: 'useGroup', to: '/composables/selection/use-group' },
              { name: 'useSelection', to: '/composables/selection/use-selection' },
              { name: 'useSingle', to: '/composables/selection/use-single' },
              { name: 'useStep', to: '/composables/selection/use-step' },
            ],
          },
          {
            name: 'Forms',
            children: [
              { name: 'useForm', to: '/composables/forms/use-form' },
            ],
          },
          {
            name: 'System',
            children: [
              { name: 'useEventListener', to: '/composables/system/use-event-listener' },
              { name: 'useKeydown', to: '/composables/system/use-keydown' },
              { name: 'useLogger', to: '/composables/system/use-logger' },
            ],
          },
          {
            name: 'Plugins',
            children: [
              { name: 'useBreakpoints', to: '/composables/plugin/use-breakpoints' },
              { name: 'useHydration', to: '/composables/plugin/use-hydration' },
              { name: 'useLocale', to: '/composables/plugin/use-locale' },
              { name: 'useStorage', to: '/composables/plugin/use-storage' },
              { name: 'useTheme', to: '/composables/plugin/use-theme' },
            ],
          },
        ],
      },
      // { divider: true },
      // {
      //   name: 'Components',
      //   to: '/components',
      //   children: [
      //     { name: 'Atom', to: '/components/atom' },
      //     { name: 'Avatar', to: '/components/avatar' },
      //     { name: 'Breakpoints', to: '/components/breakpoints' },
      //     { name: 'Context', to: '/components/context' },
      //     { name: 'Hydration', to: '/components/hydration' },
      //     { name: 'Popover', to: '/components/popover' },
      //     { name: 'Step', to: '/components/step' },
      //     { name: 'Theme', to: '/components/theme' },
      //   ],
      // },
      // { divider: true },
      // {
      //   name: 'Utilities',
      //   children: [
      //     { name: 'toReactive', to: '/utilities/to-reactive' },
      //   ],
      // },
    ],
    stats: {
      commit: null as Commit | null,
      tag: null,
    },
  }),
})
