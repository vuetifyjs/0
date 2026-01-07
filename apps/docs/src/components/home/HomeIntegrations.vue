<script setup lang="ts">
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
      href: 'https://github.com/vuetifyjs/create',
    },
    {
      name: 'Vuetify MCP',
      icon: 'vuetify-mcp',
      href: 'https://github.com/vuetifyjs/mcp',
    },
  ]
</script>

<template>
  <section class="home-integrations py-12">
    <p class="text-center text-sm opacity-60 mb-6">Works with</p>

    <div class="flex flex-wrap justify-center gap-4 md:gap-6 max-w-[500px] mx-auto">
      <a
        v-for="integration in integrations"
        :key="integration.name"
        class="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border bg-surface transition-colors hover:border-primary"
        :href="integration.href"
        rel="noopener"
        target="_blank"
      >
        <div class="inline-flex text-on-surface">
          <AppIcon :icon="integration.icon" :size="18" />
        </div>
        <span class="text-sm font-medium">{{ integration.name }}</span>
      </a>
    </div>
  </section>
</template>
