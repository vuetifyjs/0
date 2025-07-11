<script lang="ts" setup>
  const navs = [
    { name: 'Home', to: '/' },
    {
      name: 'Composables',
      to: '/composables',
      children: [
        { name: 'useBreakpoints', to: '/composables/use-breakpoints' },
        { name: 'useContext', to: '/composables/use-context' },
        { name: 'useFilter', to: '/composables/use-filter' },
        { name: 'useGroup', to: '/composables/use-group' },
        { name: 'useHydration', to: '/composables/use-hydration' },
        { name: 'useKeyboard', to: '/composables/use-keyboard' },
        { name: 'useMarkdown', to: '/composables/use-markdown' },
        { name: 'useRegistrar', to: '/composables/use-registrar' },
        { name: 'useStep', to: '/composables/use-step' },
      ],
    },
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
