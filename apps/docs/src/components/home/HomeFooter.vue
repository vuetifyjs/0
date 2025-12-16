<script lang="ts" setup>
  import { useTheme } from '@vuetify/v0'

  const theme = useTheme()

  const links = [
    { icon: 'github', href: 'https://github.com/vuetifyjs/0', label: 'GitHub' },
    { icon: 'discord', href: 'https://discord.gg/vK6T89eNP7', label: 'Discord' },
  ]
</script>

<template>
  <footer class="home-footer py-8 border-t">
    <div class="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <div class="text-sm opacity-60">
        &copy; 2016-{{ (new Date()).getFullYear() }} Vuetify, LLC
      </div>

      <div class="flex items-center gap-4">
        <a
          v-for="link in links"
          :key="link.icon"
          :aria-label="link.label"
          class="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-surface-tint transition-colors text-on-surface"
          :href="link.href"
          rel="noopener noreferrer"
          target="_blank"
        >
          <AppIcon :icon="link.icon" :size="20" />
        </a>

        <div class="w-px h-5 bg-divider" />

        <button
          aria-label="Toggle theme"
          class="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-surface-tint transition-colors text-on-surface"
          @click="theme.cycle(['light', 'dark'])"
        >
          <AppIcon :icon="theme.isDark.value ? 'theme-light' : 'theme-dark'" :size="20" />
        </button>
      </div>
    </div>
  </footer>
</template>
