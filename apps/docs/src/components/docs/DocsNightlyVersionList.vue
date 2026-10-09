<script setup lang="ts">
  import { GnActionButton } from '@paper/genesis'

  // Composables
  import { useClipboard } from '@/composables/useClipboard'

  // Utilities
  import { shallowRef } from 'vue'

  const props = defineProps<{
    branch: 'master' | 'dev'
    tag: string
    versions: string[]
    formatDate: (version: string) => string
  }>()

  const expanded = shallowRef(false)
  const clipboard = useClipboard()
  const copiedVersion = shallowRef<string | null>(null)

  const COLLAPSED_COUNT = 5

  function visibleVersions () {
    return expanded.value ? props.versions : props.versions.slice(0, COLLAPSED_COUNT)
  }

  async function copyInstall (version: string) {
    await clipboard.copy(`pnpm add @vuetify/v0@${version}`)
    copiedVersion.value = version
    setTimeout(() => {
      if (copiedVersion.value === version) copiedVersion.value = null
    }, 2000)
  }
</script>

<template>
  <div class="px-4 py-3">
    <h3 class="text-sm font-semibold mb-3 flex items-center gap-2">
      <span
        class="px-2 py-0.5 rounded text-xs font-medium"
        :class="branch === 'master' ? 'bg-success/20 text-success' : 'bg-info/20 text-info'"
      >
        {{ branch }}
      </span>

      <span class="opacity-70">{{ tag }}</span>
      <span class="opacity-50 font-normal">({{ versions.length }} builds)</span>
    </h3>

    <div class="space-y-1">
      <div
        v-for="version in visibleVersions()"
        :key="version"
        class="flex items-center gap-3 py-1.5 px-2 -mx-2 rounded hover:bg-surface-tint transition-colors group"
      >
        <span class="text-sm opacity-70 w-24 shrink-0">{{ formatDate(version) }}</span>

        <code class="text-sm flex-1 truncate">{{ version }}</code>

        <GnActionButton
          aria-label="Copy install command"
          class="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity shrink-0"
          :title="copiedVersion === version ? 'Copied!' : 'Copy: pnpm add @vuetify/v0@' + version"
          @click="copyInstall(version)"
        >
          <AppIcon :icon="copiedVersion === version ? 'success' : 'copy'" :size="14" />
        </GnActionButton>
      </div>
    </div>

    <button
      v-if="versions.length > COLLAPSED_COUNT"
      class="mt-2 text-sm text-primary hover:underline underline-offset-2 bg-transparent border-none cursor-pointer font-inherit"
      type="button"
      @click="expanded = !expanded"
    >
      {{ expanded ? 'Show less' : `Show ${versions.length - COLLAPSED_COUNT} more` }}
    </button>
  </div>
</template>
