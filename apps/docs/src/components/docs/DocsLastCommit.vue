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

  onMounted(async () => {
    if (app.stats.commit) return // Already fetched this session

    // Check cache first
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
  <a
    v-if="app.stats.commit"
    class="icon-text"
    :href="app.stats.commit.html_url"
    rel="noopener nofollow"
    target="_blank"
    :title="`Latest commit: ${app.stats.commit.sha}`"
  >
    <strong>Latest commit:</strong>
    {{ app.stats.commit.sha.slice(0, 7) }}
    <AppIcon icon="open-in-new" size="1em" />
  </a>
</template>
