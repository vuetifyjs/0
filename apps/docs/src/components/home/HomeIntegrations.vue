<script setup lang="ts">
  const integrations = [
    {
      name: 'Tailwind CSS',
      icon: 'tailwind',
    },
    {
      name: 'UnoCSS',
      icon: 'unocss',
    },
    {
      name: 'Vuetify Play',
      icon: 'vuetify-play',
    },
    {
      name: 'Vuetify MCP',
      icon: 'vuetify-mcp',
    },
  ]
</script>

<template>
  <section class="home-integrations py-12">
    <p class="text-center text-sm opacity-60 mb-6">Works with</p>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-2xl mx-auto">
      <div
        v-for="integration in integrations"
        :key="integration.name"
        class="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border bg-surface"
      >
        <div class="inline-flex text-on-surface">
          <AppIcon :icon="integration.icon" :size="18" />
        </div>
        <span class="text-sm font-medium">{{ integration.name }}</span>
      </div>
    </div>
  </section>
</template>
