<script lang="ts" setup>
  import { onMounted } from 'vue'
  import { useAppStore } from '@/stores/app'

  const app = useAppStore()

  onMounted(async () => {
    try {
      const octokit = await import('@/plugins/octokit').then(m => m.default)
      const { data = [] } = await octokit.request('GET /repos/{owner}/{repo}/commits', {
        owner: 'vuetifyjs',
        repo: '0',
        per_page: 1,
      })

      if (data.length === 0) return

      app.stats.commit = data[0] as typeof app.stats.commit
    } catch (error) {
      console.warn('Failed to fetch commit info:', error)
    }
  })
</script>

<template>
  <a
    v-if="app.stats.commit"
    class="inline-flex items-center gap-1"
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
