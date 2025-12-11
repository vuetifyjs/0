<script lang="ts" setup>
  import { onMounted } from 'vue'
  import { useAppStore } from '@/stores/app'
  import octokit from '@/plugins/octokit'

  const app = useAppStore()

  onMounted(async () => {
    try {
      const { data = [] } = await octokit.request('GET /repos/{owner}/{repo}/commits', {
        owner: 'vuetifyjs',
        repo: '0',
        per_page: 1,
      })

      if (data.length === 0) return

      app.stats.commit = data[0]
    } catch {
      // Silently fail - commit info is non-critical
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
