<script setup lang="ts">
  // Framework
  import { createStorage, useLogger } from '@vuetify/v0'

  import { CACHE_TTL } from '@/constants/cache'

  // Stores
  import { useAppStore } from '@/stores/app'

  // Utilities
  import { onMounted } from 'vue'

  const storage = createStorage({ prefix: 'v0-commit:', ttl: CACHE_TTL })

  const app = useAppStore()
  const logger = useLogger()

  const buildSha = import.meta.env.VITE_GITHUB_SHA as string | undefined

  onMounted(async () => {
    if (app.stats.commit) return

    const cached = storage.get<typeof app.stats.commit | null>('latest', null)
    if (cached.value) {
      app.stats.commit = cached.value
      return
    }

    try {
      const octokit = await import('@/plugins/octokit').then(m => m.default)
      const { data = [] } = await octokit.request('GET /repos/{owner}/{repo}/commits', {
        owner: 'vuetifyjs',
        repo: '0',
        per_page: 1,
      })

      if (data.length === 0) return

      app.stats.commit = data[0] as typeof app.stats.commit
      storage.set('latest', app.stats.commit)
    } catch (error) {
      logger.warn('Failed to fetch commit info', error)
    }
  })
</script>

<template>
  <section v-if="app.stats.commit || buildSha">
    <AppSettingsHeader icon="history" title="Build" />

    <div class="space-y-1">
      <a
        v-if="app.stats.commit"
        class="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-surface-variant hover:text-primary transition-colors"
        :href="app.stats.commit.html_url"
        rel="noopener nofollow"
        target="_blank"
      >
        <span class="flex items-center gap-2">
          <AppIcon icon="history" size="16" />
          <span class="text-sm">Latest commit</span>
        </span>

        <span class="font-mono text-xs text-on-surface-variant">{{ app.stats.commit.sha.slice(0, 7) }}</span>
      </a>

      <a
        v-if="buildSha"
        class="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-surface-variant hover:text-primary transition-colors"
        :href="`https://github.com/vuetifyjs/0/commit/${buildSha}`"
        rel="noopener nofollow"
        target="_blank"
      >
        <span class="flex items-center gap-2">
          <AppIcon icon="package" size="16" />
          <span class="text-sm">Documentation build</span>
        </span>

        <span class="font-mono text-xs text-on-surface-variant">{{ buildSha.slice(0, 7) }}</span>
      </a>
    </div>
  </section>
</template>
