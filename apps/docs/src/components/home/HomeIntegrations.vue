<script setup lang="ts">
// Utilities
  import { RouterLink } from 'vue-router'

  const integrations = [
    {
      name: 'Vite',
      icon: 'vite',
      href: 'https://vite.dev',
    },
    {
      name: 'Nuxt',
      icon: 'nuxt',
      href: 'https://nuxt.com',
    },
    {
      name: 'Tailwind CSS',
      icon: 'tailwind',
      href: 'https://tailwindcss.com',
    },
    {
      name: 'UnoCSS',
      icon: 'unocss',
      href: 'https://unocss.dev',
    },
    {
      name: 'Vuetify Play',
      icon: 'vuetify-play',
      href: 'https://play.vuetifyjs.com',
    },
    {
      name: 'Vuetify Create',
      icon: 'vuetify-create',
      to: '/introduction/getting-started#vuetify-create',
    },
    {
      name: 'Vuetify CLI',
      icon: 'vuetify-cli',
      to: '/introduction/getting-started#vuetify-cli',
    },
    {
      name: 'Vuetify MCP',
      icon: 'vuetify-mcp',
      to: '/guide/vuetify-mcp',
    },
  ]
</script>

<template>
  <section class="home-integrations py-12">
    <p class="text-center text-sm opacity-60 mb-6">Works with</p>

    <div class="flex flex-wrap justify-center gap-4 md:gap-6 max-w-[650px] mx-auto">
      <component
        :is="integration.to ? RouterLink : 'a'"
        v-for="integration in integrations"
        :key="integration.name"
        class="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border bg-surface transition-colors hover:border-primary cursor-pointer"
        :href="integration.href ?? integration.to"
        :rel=" !integration.to ? 'noopener' : undefined"
        :target=" !integration.to ? '_blank' : undefined"
        :to="integration.to"
      >
        <div class="inline-flex text-on-surface">
          <AppIcon :icon="integration.icon" :size="18" />
        </div>
        <span class="text-sm font-medium">{{ integration.name }}</span>
      </component>
    </div>
  </section>
</template>
