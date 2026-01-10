<script setup lang="ts">
  import { Marked } from 'marked'
  import { markedEmoji } from 'marked-emoji'

  // Framework
  // Vuetify0
  import { Popover, useDate, useFilter } from '@vuetify/v0'

  // Composables
  import { useClipboard } from '@/composables/useClipboard'

  // Utilities
  import { computed, onBeforeMount, onScopeDispose, shallowRef, toRef, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { type Release, useReleasesStore } from '@/stores/releases'

  const emojis: Record<string, string> = {
    '+1': '👍',
    '-1': '👎',
    'rocket': '🚀',
    'tada': '🎉',
    'sparkles': '✨',
    'bug': '🐛',
    'memo': '📝',
    'fire': '🔥',
    'warning': '⚠️',
    'boom': '💥',
    'wrench': '🔧',
    'hammer': '🔨',
    'gear': '⚙️',
    'package': '📦',
    'lock': '🔒',
    'key': '🔑',
    'zap': '⚡',
    'bulb': '💡',
    'star': '⭐',
    'heart': '❤️',
    'hooray': '🎉',
    'laugh': '😂',
    'eyes': '👀',
    'check': '✅',
    'x': '❌',
    'arrow_up': '⬆️',
    'arrow_down': '⬇️',
    'microscope': '🔬',
  }

  const reactions = emojis

  const route = useRoute()
  const router = useRouter()
  const store = useReleasesStore()
  const { adapter } = useDate()
  const { copied, copy } = useClipboard()

  const model = shallowRef<Release>()
  const search = shallowRef('')
  const isOpen = shallowRef(false)
  let timeout: ReturnType<typeof setTimeout> | undefined

  const marked = new Marked({
    breaks: true,
    gfm: true,
    renderer: {
      link ({ href, text }) {
        const isExternal = href?.startsWith('http')
        if (isExternal) {
          return `<a href="${href}" target="_blank" rel="noopener">${text}<span class="text-xs opacity-60 ml-0.5">↗</span></a>`
        }
        return `<a href="${href}">${text}</a>`
      },
    },
  })

  marked.use(markedEmoji({ emojis, renderer: token => token.emoji }))

  const tag = computed(() => route.query.version as string | undefined)

  const publishedOn = computed(() => {
    if (!model.value?.published_at) return undefined

    const date = adapter.date(model.value.published_at)
    return date ? adapter.format(date, 'fullDateWithWeekday') : undefined
  })

  const renderedBody = computed(() => {
    if (!model.value?.body) return ''
    return marked.parse(model.value.body) as string
  })

  const releases = toRef(() => store.releases)
  const { items: filteredReleases } = useFilter(search, releases, {
    keys: ['tag_name', 'name'],
  })

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

  async function copyLink () {
    if (!model.value) return
    await copy(`${window.location.origin}/releases/?version=${model.value.tag_name}`)
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
        class="w-full px-4 py-3 bg-surface-tint border-none font-inherit text-left cursor-pointer flex items-center gap-3 hover:bg-surface transition-colors"
      >
        <AppIcon class="opacity-50" icon="search" :size="20" />

        <div v-if="model" class="flex items-center gap-2 flex-1">
          <span class="font-semibold">{{ model.tag_name }}</span>

          <template v-if="model.reactions?.total_count">
            <span class="opacity-50">&mdash;</span>
            <template v-for="(emoji, key) in reactions" :key="key">
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

        <AppIcon
          class="ml-auto opacity-50"
          :icon="open ? 'chevron-up' : 'chevron-down'"
          :size="20"
        />

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
        <input
          v-model="search"
          class="w-full px-4 py-2 bg-transparent border-none border-b border-divider font-inherit text-inherit outline-none"
          placeholder="Search releases..."
          type="text"
        >

        <div v-if="filteredReleases.length === 0" class="px-4 py-3 text-center opacity-50">
          No releases found
        </div>

        <button
          v-for="release in filteredReleases"
          :key="release.id"
          class="w-full px-4 py-2 bg-transparent border-none font-inherit text-left cursor-pointer flex items-center gap-2 hover:bg-surface-tint transition-colors"
          :class="{ 'bg-surface-tint': model?.id === release.id }"
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
          class="w-full px-4 py-2 bg-transparent border-none border-t border-divider font-inherit text-center cursor-pointer hover:bg-surface-tint transition-colors text-primary font-medium"
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
            class="p-1.5 rounded hover:bg-surface-tint inline-flex opacity-50 hover:opacity-80"
            :title="copied ? 'Copied!' : 'Copy link'"
            type="button"
            @click="copyLink"
          >
            <AppIcon :icon="copied ? 'success' : 'share'" :size="18" />
          </button>

          <a
            class="p-1.5 rounded hover:bg-surface-tint inline-flex opacity-50 hover:opacity-80"
            href="https://community.vuetifyjs.com/"
            rel="noopener"
            target="_blank"
            title="Discuss on Discord"
          >
            <AppIcon icon="discord" :size="18" />
          </a>

          <a
            class="p-1.5 rounded hover:bg-surface-tint inline-flex opacity-50 hover:opacity-80"
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
        v-if="renderedBody"
        class="px-4 py-4 prose prose-sm max-w-none [&_img]:max-w-full [&_a]:text-primary [&_a]:no-underline [&_a:hover]:underline [&_a]:underline-offset-2 [&_pre]:bg-pre [&_pre]:p-4 [&_pre]:rounded [&_pre]:overflow-x-auto [&_code]:bg-surface-tint [&_code]:px-1 [&_code]:rounded [&_pre_code]:bg-transparent [&_pre_code]:p-0"
        v-html="renderedBody"
      />

      <!-- Assets -->
      <div v-if="model.zipball_url && model.tarball_url" class="border-t border-divider p-3">
        <h3 class="text-lg font-semibold mb-3">Assets</h3>

        <div class="border border-divider rounded-lg overflow-hidden">
          <a
            class="flex items-center gap-3 px-3 py-2 hover:bg-surface-tint transition-colors"
            :href="model.zipball_url"
            rel="noopener"
            target="_blank"
          >
            <AppIcon class="opacity-70" icon="folder-zip" :size="20" />
            <span>Source code (zip)</span>
            <AppIcon class="ml-auto opacity-50" icon="download" :size="18" />
          </a>

          <div class="border-t border-divider" />

          <a
            class="flex items-center gap-3 px-3 py-2 hover:bg-surface-tint transition-colors"
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
    <div v-else-if="store.isLoading" class="p-4 space-y-4">
      <div class="h-6 bg-surface-tint rounded animate-pulse w-1/3" />
      <div class="h-4 bg-surface-tint rounded animate-pulse w-full" />
      <div class="h-4 bg-surface-tint rounded animate-pulse w-full" />
      <div class="h-4 bg-surface-tint rounded animate-pulse w-2/3" />
    </div>
  </div>
</template>
