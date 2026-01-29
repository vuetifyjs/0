<script setup lang="ts">
  // Framework
  import { createStorage, useLogger } from '@vuetify/v0'

  // Utilities
  import { onMounted } from 'vue'

  import { useAppStore } from '@/stores/app'

  interface CacheEntry<T> {
    data: T
    timestamp: number
  }

  const CACHE_TTL = import.meta.env.DEV ? 30 * 1000 : 5 * 60 * 1000 // 30s dev, 5min prod
  const storage = createStorage({ prefix: 'v0-commit:' })

  function isCacheValid<T> (entry: CacheEntry<T> | null): entry is CacheEntry<T> {
    if (!entry) return false
    return Date.now() - entry.timestamp < CACHE_TTL
  }

  const app = useAppStore()
  const logger = useLogger()

  onMounted(async () => {
    if (app.stats.commit) return // Already fetched this session

    // Check cache first
    const cached = storage.get<CacheEntry<typeof app.stats.commit> | null>('latest', null)
    if (isCacheValid(cached.value)) {
      app.stats.commit = cached.value.data
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

      // Cache the result
      storage.set<CacheEntry<typeof app.stats.commit>>('latest', {
        data: app.stats.commit,
        timestamp: Date.now(),
      })
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
