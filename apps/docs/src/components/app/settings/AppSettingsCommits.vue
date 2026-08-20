<script setup lang="ts">
  // Stores
  import { useAppStore } from '@/stores/app'

  // Utilities
  import { onMounted } from 'vue'

  const app = useAppStore()

  const buildSha = import.meta.env.VITE_GITHUB_SHA as string | undefined

  onMounted(() => app.fetchCommit())
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
