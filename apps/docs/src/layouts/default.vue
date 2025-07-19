<script lang="ts" setup>
  const navs = [
    { name: 'Home', to: '/' },
    {
      name: 'Composables',
      to: '/composables',
      children: [
        {
          name: 'Foundation',
          children: [
            { name: 'useContext', to: '/composables/use-context' },
            { name: 'useRegistrar', to: '/composables/use-registrar' },
            { name: 'useTokens', to: '/composables/use-tokens' },
          ],
        },
        {
          name: 'Input',
          children: [
            { name: 'useKeydown', to: '/composables/use-keydown' },
          ],
        },
        {
          name: 'Plugins',
          children: [
            { name: 'useBreakpoints', to: '/composables/use-breakpoints' },
            { name: 'useHydration', to: '/composables/use-hydration' },
            { name: 'useLocale', to: '/composables/use-locale' },
            { name: 'useMarkdown', to: '/composables/use-markdown' },
            { name: 'useStorage', to: '/composables/use-storage' },
            { name: 'useTheme', to: '/composables/use-theme' },
          ],
        },
        {
          name: 'Selection',
          children: [
            { name: 'useFilter', to: '/composables/use-filter' },
            { name: 'useGroup', to: '/composables/use-group' },
            { name: 'useSingle', to: '/composables/use-single' },
            { name: 'useStep', to: '/composables/use-step' },
          ],
        },
        {
          name: 'Utilities',
          children: [
            { name: 'toReactive', to: '/composables/to-reactive' },
          ],
        },
      ],
    },
    { name: 'Components', to: '/components' },
  ]
</script>

<template>
  <AppNav>
    <img
      alt="Vuetify 0 Logo"
      src="https://cdn.vuetifyjs.com/docs/images/logos/vzero-logo-dark.png"
    >

    <ul class="flex gap-2 flex-col px-4">
      <AppNavLink
        v-for="(nav, i) in navs"
        :key="i"
        :children="nav.children"
        :to="nav.to"
      >
        {{ nav.name }}
      </AppNavLink>
    </ul>
  </AppNav>

  <div class="m-4">
    <router-view />
  </div>
</template>
