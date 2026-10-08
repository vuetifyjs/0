<script setup lang="ts">
  // Framework
  import { IN_BROWSER } from '@vuetify/v0'

  // Utilities
  import { computed, onMounted, shallowRef } from 'vue'

  interface Packument {
    'dist-tags': Record<string, string>
    'versions': Record<string, unknown>
  }

  const MASTER_PATTERN = /-master\.\d{4}-\d{2}-\d{2}$/
  const DEV_PATTERN = /-dev\.\d{4}-\d{2}-\d{2}$/
  const MAX_VERSIONS = 14

  const packument = shallowRef<Packument | null>(null)
  const error = shallowRef<string | null>(null)
  const isLoading = shallowRef(false)

  const masterVersions = computed(() => {
    if (!packument.value) return []
    return Object.keys(packument.value.versions)
      .filter(v => MASTER_PATTERN.test(v))
      .toSorted((a, b) => extractDate(b).localeCompare(extractDate(a)))
      .slice(0, MAX_VERSIONS)
  })

  const devVersions = computed(() => {
    if (!packument.value) return []
    return Object.keys(packument.value.versions)
      .filter(v => DEV_PATTERN.test(v))
      .toSorted((a, b) => extractDate(b).localeCompare(extractDate(a)))
      .slice(0, MAX_VERSIONS)
  })

  const currentNightly = computed(() => packument.value?.['dist-tags']?.nightly)
  const currentNightlyDev = computed(() => packument.value?.['dist-tags']?.['nightly-dev'])

  const hasVersions = computed(() => masterVersions.value.length > 0 || devVersions.value.length > 0)

  function extractDate (version: string): string {
    const match = /(\d{4}-\d{2}-\d{2})$/.exec(version)
    return match?.[1] ?? ''
  }

  function formatDate (version: string): string {
    const dateStr = extractDate(version)
    if (!dateStr) return ''
    const [year, month, day] = dateStr.split('-')
    const date = new Date(Number(year), Number(month) - 1, Number(day))
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  async function fetchPackument () {
    if (!IN_BROWSER) return

    isLoading.value = true
    error.value = null

    try {
      const res = await fetch('https://registry.npmjs.org/@vuetify/v0')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      packument.value = await res.json()
    } catch {
      error.value = 'Failed to load nightly versions from npm.'
    } finally {
      isLoading.value = false
    }
  }

  onMounted(fetchPackument)
</script>

<template>
  <div class="border border-divider rounded-lg my-6 overflow-hidden bg-surface">
    <!-- Loading -->
    <div v-if="isLoading" class="px-4 py-6 text-center">
      <div class="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin opacity-50 mx-auto mb-2" />
      <span class="opacity-50">Loading nightly versions...</span>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="px-4 py-6 text-center">
      <AppIcon class="opacity-50 mx-auto mb-2" icon="alert" :size="24" />
      <p class="opacity-70">{{ error }}</p>
    </div>

    <!-- Empty state -->
    <div v-else-if="!hasVersions" class="px-4 py-6 text-center">
      <AppIcon class="opacity-50 mx-auto mb-2" icon="package" :size="24" />
      <p class="opacity-70">No nightly builds published yet.</p>
    </div>

    <!-- Content -->
    <template v-else>
      <!-- Current dist-tags -->
      <div
        v-if="currentNightly || currentNightlyDev"
        class="px-4 py-3 bg-surface-tint border-b border-divider"
      >
        <h3 class="text-sm font-semibold opacity-70 mb-2">Current dist-tags</h3>

        <div class="flex flex-wrap gap-3 text-sm">
          <div v-if="currentNightly" class="flex items-center gap-2">
            <code class="px-2 py-0.5 bg-surface rounded text-primary font-medium">nightly</code>
            <span class="opacity-50">→</span>
            <code class="opacity-70">{{ currentNightly }}</code>
          </div>

          <div v-if="currentNightlyDev" class="flex items-center gap-2">
            <code class="px-2 py-0.5 bg-surface rounded text-primary font-medium">nightly-dev</code>
            <span class="opacity-50">→</span>
            <code class="opacity-70">{{ currentNightlyDev }}</code>
          </div>
        </div>
      </div>

      <!-- Master versions -->
      <DocsNightlyVersionList
        v-if="masterVersions.length > 0"
        branch="master"
        :format-date
        tag="nightly"
        :versions="masterVersions"
      />

      <!-- Dev versions -->
      <DocsNightlyVersionList
        v-if="devVersions.length > 0"
        branch="dev"
        :class="{ 'border-t border-divider': masterVersions.length > 0 }"
        :format-date
        tag="nightly-dev"
        :versions="devVersions"
      />
    </template>
  </div>
</template>
