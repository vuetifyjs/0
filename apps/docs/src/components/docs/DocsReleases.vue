<script setup lang="ts">
  // Framework
  import { createFilter, IN_BROWSER, Popover, useDate } from '@vuetify/v0'

  // Context
  import DocsSkeleton from './DocsSkeleton.vue'

  // Composables
  import { useClipboard } from '@/composables/useClipboard'
  import { useMarkdown } from '@/composables/useMarkdown'

  // Constants
  import { EMOJIS } from '@/constants/emoji'

  // Stores
  import { type Release, useReleasesStore } from '@/stores/releases'

  // Utilities
  import { computed, onBeforeMount, onScopeDispose, shallowRef, toRef, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  const reactions = EMOJIS

  const route = useRoute()
  const router = useRouter()
  const store = useReleasesStore()
  const date = useDate()
  const linkClipboard = useClipboard()
  const markdownClipboard = useClipboard()

  const model = shallowRef<Release>()
  const search = shallowRef('')
  const isOpen = shallowRef(false)
  let timeout: ReturnType<typeof setTimeout> | undefined

  const tag = toRef(() => route.query.version as string | undefined)

  const markdown = useMarkdown(() => model.value?.body ?? undefined)

  const publishedOn = computed(() => {
    if (!model.value?.published_at) return undefined

    const d = date.adapter.date(model.value.published_at)
    return d ? date.adapter.format(d, 'fullDateWithWeekday') : undefined
  })

  const releases = toRef(() => store.releases)
  const filter = createFilter({ keys: ['tag_name', 'name'] })
  const { items: filteredReleases } = filter.apply(search, releases)

  function genEmoji (count: number) {
    if (count >= 100) return '\uD83D\uDCAB'
    if (count > 50) return '\uD83D\uDD25'
    if (count > 30) return '\uD83C\uDF36\uFE0F'
    return undefined
  }

  function getReactionCount (release: Release, key: string): number {
    const reactions = release.reactions
    if (!reactions || typeof reactions !== 'object') return 0
    const count = (reactions as Record<string, unknown>)[key]
    return typeof count === 'number' ? count : 0
  }

  async function copyReleaseLink () {
    if (!model.value || !IN_BROWSER) return
    await linkClipboard.copy(`${window.location.origin}/releases/?version=${model.value.tag_name}`)
  }

  async function copyReleaseMarkdown () {
    if (!model.value?.body) return
    await markdownClipboard.copy(model.value.body)
  }

  function selectRelease (release: Release) {
    model.value = release
    isOpen.value = false
    search.value = ''
  }

  function onSearch (query: string) {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      store.find(query)
    }, 500)
  }

  onBeforeMount(async () => {
    await store.fetch()

    if (tag.value) {
      model.value = await store.find(tag.value)
    } else if (store.releases.length > 0) {
      model.value = store.releases[0]
    }
  })

  watch(model, val => {
    const version = val?.tag_name ?? tag.value
    if (!version) return
    router.push({ query: { version } })
  })

  watch(search, val => onSearch(val))

  onScopeDispose(() => {
    if (timeout) clearTimeout(timeout)
  })
</script>

<template>
  <div class="border border-divider rounded-lg my-6 overflow-hidden bg-surface">
    <!-- Release Selector -->
    <Popover.Root v-model="isOpen">
      <Popover.Activator
        v-slot="{ isOpen: open }"
        class="w-full px-4 py-3 bg-surface-tint border-none font-inherit text-left cursor-pointer flex items-center gap-3 hover:bg-surface focus-visible:bg-surface transition-colors"
      >
        <AppIcon class="opacity-50" icon="search" :size="20" />

        <div v-if="model" class="flex items-center gap-2 flex-1">
          <span class="font-semibold">{{ model.tag_name }}</span>

          <template v-if="model.reactions?.total_count">
            <span class="opacity-50">&mdash;</span>

            <template v-for="(emoji, key) in reactions" :key>
              <span
                v-if="getReactionCount(model, key)"
                class="inline-flex items-center gap-0.5 text-sm"
              >
                {{ emoji }}
                <span class="text-xs opacity-70">{{ getReactionCount(model, key) }}</span>
              </span>
            </template>
          </template>
        </div>

        <span v-else class="opacity-50">Select a release...</span>

        <AppChevron class="ml-auto opacity-50" :open :size="20" vertical />

        <div
          v-if="store.isLoading"
          class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin opacity-50"
        />
      </Popover.Activator>

      <!-- Dropdown -->
      <Popover.Content
        class="bg-surface border-t border-divider rounded-b-lg max-h-80 overflow-auto shadow-lg w-[anchor-size(width)]"
        position-area="bottom"
      >
        <DocsSearchInput
          v-model="search"
          class="p-2"
          placeholder="Search releases..."
        />

        <div v-if="filteredReleases.length === 0" class="px-4 py-3 text-center opacity-50">
          No releases found
        </div>

        <button
          v-for="release in filteredReleases"
          :key="release.id"
          class="w-full px-4 py-2 bg-transparent border-none font-inherit text-left cursor-pointer flex items-center gap-2 hover:bg-surface-tint focus-visible:bg-surface-tint transition-colors"
          :style="model?.id === release.id ? { backgroundColor: 'color-mix(in srgb, var(--v0-primary) 10%, transparent)' } : undefined"
          type="button"
          @click="selectRelease(release)"
        >
          <span>{{ release.tag_name }}</span>

          <span v-if="release.name && release.name !== release.tag_name" class="opacity-50 text-sm truncate">
            {{ release.name }}
          </span>

          <span v-if="release.reactions?.total_count" class="ml-auto">
            {{ genEmoji(release.reactions.total_count) }}
          </span>
        </button>

        <div
          v-if="store.error"
          class="px-4 py-2 text-center text-error text-sm border-t border-divider"
          role="alert"
        >
          {{ store.error }}
        </div>

        <button
          class="w-full px-4 py-2 bg-transparent border-none border-t border-divider font-inherit text-center cursor-pointer hover:bg-surface-tint focus-visible:bg-surface-tint transition-colors text-primary font-medium"
          type="button"
          @click="store.fetch()"
        >
          {{ store.isLoading ? 'Loading...' : 'Load more' }}
        </button>
      </Popover.Content>
    </Popover.Root>

    <!-- Release Content -->
    <div v-if="model?.author" class="border-t border-divider">
      <!-- Header -->
      <div class="flex items-center justify-between px-4 py-3 border-b border-divider">
        <div class="flex items-center gap-2 text-sm">
          <AppIcon class="opacity-50" icon="calendar" :size="16" />
          <span>{{ publishedOn }}</span>
        </div>

        <div class="flex items-center gap-2">
          <button
            aria-label="Copy markdown"
            class="p-1.5 rounded hover:bg-surface-tint focus-visible:bg-surface-tint inline-flex opacity-50 hover:opacity-80 focus-visible:opacity-80 focus-visible:outline-none"
            :title="markdownClipboard.copied.value ? 'Copied!' : 'Copy markdown'"
            type="button"
            @click="copyReleaseMarkdown"
          >
            <AppIcon :icon="markdownClipboard.copied.value ? 'success' : 'copy'" :size="18" />
          </button>

          <button
            aria-label="Copy link"
            class="p-1.5 rounded hover:bg-surface-tint focus-visible:bg-surface-tint inline-flex opacity-50 hover:opacity-80 focus-visible:opacity-80 focus-visible:outline-none"
            :title="linkClipboard.copied.value ? 'Copied!' : 'Copy link'"
            type="button"
            @click="copyReleaseLink"
          >
            <AppIcon :icon="linkClipboard.copied.value ? 'success' : 'share'" :size="18" />
          </button>

          <a
            class="p-1.5 rounded hover:bg-surface-tint focus-visible:bg-surface-tint inline-flex opacity-50 hover:opacity-80 focus-visible:opacity-80 focus-visible:outline-none"
            href="https://discord.gg/vuetify"
            rel="noopener"
            target="_blank"
            title="Discuss on Discord"
          >
            <AppIcon icon="discord" :size="18" />
          </a>

          <a
            class="p-1.5 rounded hover:bg-surface-tint focus-visible:bg-surface-tint inline-flex opacity-50 hover:opacity-80 focus-visible:opacity-80 focus-visible:outline-none"
            :href="model.html_url"
            rel="noopener"
            target="_blank"
            title="View on GitHub"
          >
            <AppIcon icon="github" :size="18" />
          </a>
        </div>
      </div>

      <!-- Body -->
      <div
        v-if="markdown.html.value"
        class="docs-releases px-4 max-w-none [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-6 [&_h1]:mb-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-5 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2 [&_h4]:text-base [&_h4]:font-medium [&_h4]:mt-3 [&_h4]:mb-2 [&_p]:my-3 [&_ul]:my-3 [&_ul]:pl-5 [&_ul]:list-disc [&_ol]:my-3 [&_ol]:pl-5 [&_ol]:list-decimal [&_li]:my-1 [&_img]:max-w-full [&_a]:text-primary [&_a]:no-underline [&_a:hover]:underline [&_a]:underline-offset-2"
        v-html="markdown.html.value"
      />

      <!-- Assets -->
      <div v-if="model.zipball_url && model.tarball_url" class="border-t border-divider p-3">
        <h3 class="text-lg font-semibold mb-3">Assets</h3>

        <div class="border border-divider rounded-lg overflow-hidden divide-y divide-divider">
          <a
            class="list-item"
            :href="model.zipball_url"
            rel="noopener"
            target="_blank"
          >
            <AppIcon class="opacity-70" icon="folder-zip" :size="20" />
            <span>Source code (zip)</span>
            <AppIcon class="ml-auto opacity-50" icon="download" :size="18" />
          </a>

          <a
            class="list-item"
            :href="model.tarball_url"
            rel="noopener"
            target="_blank"
          >
            <AppIcon class="opacity-70" icon="folder-zip" :size="20" />
            <span>Source code (tar.gz)</span>
            <AppIcon class="ml-auto opacity-50" icon="download" :size="18" />
          </a>
        </div>
      </div>
    </div>

    <!-- Loading skeleton -->
    <div v-else-if="store.isLoading" class="p-4">
      <DocsSkeleton
        gap="gap-4"
        :lines="4"
        :widths="['w-1/3', 'w-full', 'w-full', 'w-2/3']"
      />
    </div>
  </div>
</template>
