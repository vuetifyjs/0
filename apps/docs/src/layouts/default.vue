<script lang="ts" setup>
  const navs = [
    { name: 'Home', to: '/' },
    { name: 'Composables', to: '/composables' },
  ]
</script>

<template>
  <AppNav class="flex flex-col h-[100vh]">
    <img
      alt="Vuetify 0 Logo"
      class="mb-8"
      src="https://cdn.vuetifyjs.com/docs/images/logos/v0-logo-dark.png"
    >

    <div class="flex gap-4 flex-col">
      <AppNavLink
        v-for="(nav, i) in navs"
        :key="i"
        :to="nav.to"
      >
        {{ nav.name }}
      </AppNavLink>
    </div>
  </AppNav>

  <div class="m-4">
    <router-view />
  </div>
</template>
