<script setup lang="ts">
  import { Atom, useBreakpoints } from '@vuetify/v0'

  import { useAppContext } from '@/composables/useApp'

  import type { AtomProps } from '@vuetify/v0'

  const { as = 'nav' } = defineProps<AtomProps>()

  const navs = [
    {
      name: 'Introduction',
      children: [
        { name: 'Welcome', to: '/introduction/welcome' },
        { name: 'Frequently Asked', to: '/introduction/frequently-asked' },
        { name: 'Contributing', to: '/introduction/contributing' },
      ],
    },
    { divider: true },
    {
      name: 'Guide',
      children: [
        { name: 'Installation', to: '/guide/installation' },
        { name: 'Structure', to: '/guide/structure' },
        { name: 'Framework core', to: '/guide/framework-core' },
        { name: 'Composables', to: '/guide/composables' },
        { name: 'Components', to: '/guide/components' },
        { name: 'Utilities', to: '/guide/utilities' },
        { name: 'Plugins', to: '/guide/plugins' },
        { name: 'Theming', to: '/guide/theming' },
        { name: 'Accessibility', to: '/guide/accessibility' },
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
            { name: 'useTokens', to: '/composables/registration/use-tokens' },
          ],
        },
        {
          name: 'Selection',
          children: [
            { name: 'useFilter', to: '/composables/selection/use-filter' },
            { name: 'useGroup', to: '/composables/selection/use-group' },
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
    { divider: true },
    {
      name: 'Components',
      to: '/components',
      children: [
        { name: 'Atom', to: '/components/atom' },
        { name: 'Avatar', to: '/components/avatar' },
        { name: 'Breakpoints', to: '/components/breakpoints' },
        { name: 'Context', to: '/components/context' },
        { name: 'Hydration', to: '/components/hydration' },
        { name: 'Popover', to: '/components/popover' },
        { name: 'Step', to: '/components/step' },
        { name: 'Theme', to: '/components/theme' },
      ],
    },
    { divider: true },
    {
      name: 'Utilities',
      children: [
        { name: 'toReactive', to: '/utilities/to-reactive' },
      ],
    },
  ]

  const breakpoints = useBreakpoints()
  const app = useAppContext()
</script>

<template>
  <Atom
    :as
    class="bg-4 app-nav flex flex-col fixed w-[220px] overflow-y-auto pb-4 transition-transform duration-200 ease-in-out"
    :class="[
      breakpoints.isMobile && !app.nav.value ? 'translate-x-[-100%]' : 'translate-x-0',
      breakpoints.isMobile ? 'top-[72px] bottom-[24px]' : 'top-[24px] bottom-0'
    ]"
  >
    <img
      alt="Vuetify0 Logo"
      src="https://cdn.vuetifyjs.com/docs/images/logos/vzero-logo-light.png"
    >

    <ul class="flex gap-2 flex-col">
      <template v-for="(nav, i) in navs" :key="i">
        <div v-if="nav.divider" class="px-4">
          <AppDivider />
        </div>

        <AppNavLink
          v-else
          :children="nav.children"
          class="px-4"
          :to="nav.to || ''"
        >
          {{ nav.name }}
        </AppNavLink>
      </template>
    </ul>
  </Atom>
</template>

<style lang="sass">
  .app-nav
    background-color: var(--v0-surface)
    border-right: thin solid var(--v0-divider)
</style>
