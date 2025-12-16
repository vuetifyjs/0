<script lang="ts" setup>
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
      icon: 'mcp',
    },
  ]
</script>

<template>
  <section class="home-integrations py-12">
    <p class="text-center text-sm opacity-60 mb-6">Works with</p>

    <div class="flex flex-wrap justify-center gap-6">
      <div
        v-for="integration in integrations"
        :key="integration.name"
        class="flex items-center gap-2 px-4 py-2 rounded-lg border bg-surface/30 flex-1 md:flex-none"
      >
        <div class="inline-flex text-on-surface">
          <AppIcon :icon="integration.icon" :size="18" />
        </div>
        <span class="text-sm font-medium">{{ integration.name }}</span>
      </div>
    </div>
  </section>
</template>
