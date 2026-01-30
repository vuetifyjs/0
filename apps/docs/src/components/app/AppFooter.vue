<script setup lang="ts">
  // Framework
  import { useIntersectionObserver, useLogger } from '@vuetify/v0'

  // Composables
  import { useSettings } from '@/composables/useSettings'
  import { useThemeToggle } from '@/composables/useThemeToggle'

  // Utilities
  import { toRef, useTemplateRef } from 'vue'

  // Stores
  import { useAppStore } from '@/stores/app'
  import { useReleasesStore } from '@/stores/releases'

  defineProps<{
    inset?: boolean
  }>()

  const app = useAppStore()
  const releases = useReleasesStore()
  const logger = useLogger()
  const settings = useSettings()
  const toggle = useThemeToggle()

  const footerRef = useTemplateRef<HTMLElement | null>('footer')

  const links = [
    { icon: 'github', href: 'https://github.com/vuetifyjs/0', label: 'GitHub', bg: 'bg-[#24292f]' },
    { icon: 'discord', href: 'https://discord.gg/vK6T89eNP7', label: 'Discord', bg: 'bg-discord' },
  ]

  const latest = toRef(() => releases.releases[0])

  async function fetch () {
    // Fetch latest commit
    try {
      const octokit = await import('@/plugins/octokit').then(m => m.default)
      const { data = [] } = await octokit.request('GET /repos/{owner}/{repo}/commits', {
        owner: 'vuetifyjs',
        repo: '0',
        per_page: 1,
      })

      if (data.length > 0) {
        app.stats.commit = data[0] as typeof app.stats.commit
      }
    } catch (error) {
      logger.warn('Failed to fetch commit info', error)
    }

    // Fetch latest release if not already loaded
    if (releases.releases.length === 0) {
      await releases.fetch()
    }
  }

  useIntersectionObserver(
    footerRef,
    entries => {
      if (!entries[0]?.isIntersecting) return

      fetch()
    },
    { once: true },
  )
</script>

<template>
  <footer
    ref="footer"
    class="app-footer py-4 border-t border-divider/50"
    :class="[inset && 'md:ml-[230px]', settings.showBgGlass.value ? 'bg-glass-surface' : 'bg-surface']"
  >
    <div class="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <div class="flex flex-col md:flex-row items-center gap-4 text-sm opacity-60">
        <AppCopyright />

        <template v-if="app.stats.commit || latest">
          <div class="hidden md:block w-px h-4 bg-divider" />

          <div class="flex items-center gap-4">
            <AppLink
              v-if="latest"
              class="flex items-center gap-1 hover:text-primary hover:underline"
              :title="`Last Released: ${new Date(latest.published_at ?? '').toLocaleString()}`"
              :to="`/releases?version=${latest.tag_name}`"
            >
              <AppIcon icon="tag" :size="14" />
              {{ latest.tag_name }}
            </AppLink>

            <template v-if="latest && app.stats.commit">
              <div class="w-px h-4 bg-divider" />
            </template>

            <a
              v-if="app.stats.commit"
              class="flex items-center gap-1 hover:text-primary hover:underline"
              :href="app.stats.commit.html_url"
              rel="noopener nofollow"
              target="_blank"
              :title="`Last Commit: ${new Date(app.stats.commit.commit.author.date).toLocaleString()}`"
            >
              <AppIcon icon="history" :size="14" />
              {{ app.stats.commit.sha.slice(0, 7) }}
            </a>
          </div>
        </template>
      </div>

      <div class="flex items-center gap-4">
        <a
          v-for="link in links"
          :key="link.icon"
          :aria-label="link.label"
          class="w-9 h-9 rounded-lg flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity text-white"
          :class="link.bg"
          :href="link.href"
          rel="noopener noreferrer"
          target="_blank"
        >
          <AppIcon class="!opacity-100" :icon="link.icon" :size="20" />
        </a>

        <div class="hidden md:block w-px h-5 bg-divider" />

        <button
          :aria-label="toggle.title.value"
          class="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-surface-tint transition-colors text-on-surface"
          :title="toggle.title.value"
          type="button"
          @click="toggle.toggle"
        >
          <AppIcon :icon="toggle.icon.value" :size="20" />
        </button>
      </div>
    </div>
  </footer>
</template>
