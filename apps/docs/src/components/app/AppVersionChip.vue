<script setup lang="ts">
  // Framework
  import { IN_BROWSER } from '@vuetify/v0'

  // Stores
  import { useReleasesStore } from '@/stores/releases'

  // Utilities
  import { onMounted, toRef } from 'vue'
  import { useRoute } from 'vue-router'

  const FRESH_WINDOW_MS = 2 * 24 * 60 * 60 * 1000

  const releases = useReleasesStore()
  const route = useRoute()

  const latest = toRef(() => releases.releases[0])

  const fresh = toRef(() => {
    if (!IN_BROWSER) return false
    if (route.path.startsWith('/releases')) return false
    const at = latest.value?.published_at
    if (!at) return false
    return Date.now() - new Date(at).getTime() < FRESH_WINDOW_MS
  })

  const label = toRef(() => {
    const tag = latest.value?.tag_name
    return fresh.value ? `Latest release ${tag} — new` : `Latest release ${tag}`
  })

  const title = toRef(() => {
    if (!latest.value?.published_at) return ''
    return `Last Released: ${new Date(latest.value.published_at).toLocaleString()}`
  })

  onMounted(() => {
    if (releases.releases.length === 0) releases.fetch()
  })
</script>

<template>
  <AppLink
    v-if="latest"
    :aria-label="label"
    class="relative inline-flex items-center gap-1 px-2 py-1 text-sm rounded text-on-surface-variant hover:bg-surface-tint hover:text-on-surface transition-colors"
    :title
    :to="`/releases?version=${latest.tag_name}`"
  >
    <AppIcon icon="tag" :size="14" />
    {{ latest.tag_name }}

    <span
      v-if="fresh"
      aria-hidden="true"
      class="absolute top-0 end-0 w-2 h-2 rounded-[2px] bg-success"
    />
  </AppLink>

  <span
    v-else
    aria-hidden="true"
    class="inline-block h-[28px] w-[110px] rounded-[2px] bg-surface-tint/40"
  />
</template>
