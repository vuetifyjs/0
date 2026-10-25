<script setup lang="ts">
  // Framework
  import { isUndefined } from '@vuetify/v0'

  // Constants
  import { EXTERNAL_LINK_SUFFIX } from '@/constants/links'

  // Stores
  import { useBlogStore } from '@/stores/blog'

  // Utilities
  import { onMounted, toRef } from 'vue'

  const { limit } = defineProps<{
    limit?: number
  }>()

  const store = useBlogStore()

  const visible = toRef(() => isUndefined(limit) ? store.posts : store.posts.slice(0, limit))

  onMounted(() => {
    store.fetch()
  })
</script>

<template>
  <div v-if="visible.length > 0" class="border border-divider rounded-lg overflow-hidden bg-surface">
    <a
      v-for="(post, index) in visible"
      :key="post.slug"
      class="flex flex-col gap-1 px-4 py-3.5 hover:bg-surface-tint transition-colors"
      :class="index > 0 ? 'border-t border-divider' : undefined"
      :href="post.url"
      rel="noopener noreferrer"
      target="_blank"
    >
      <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <h3 class="font-semibold leading-snug min-w-0 sm:order-first order-last">
          {{ post.title }}<span aria-hidden="true" class="text-xs opacity-70 ml-1">{{ EXTERNAL_LINK_SUFFIX }}</span>
        </h3>

        <time class="order-first self-start shrink-0 rounded-full border border-divider bg-surface px-2 py-0.5 text-xs font-medium sm:order-last">{{ post.date }}</time>
      </div>

      <p class="text-sm opacity-60 leading-relaxed line-clamp-2">{{ post.excerpt }}</p>

      <div class="flex items-center gap-2 text-xs opacity-50 mt-1">
        <img
          alt=""
          class="w-5 h-5 rounded-full shrink-0"
          height="20"
          :src="post.avatar"
          width="20"
        >

        <span>{{ post.author }}</span>
      </div>
    </a>
  </div>

  <p v-else-if="store.error" class="text-sm opacity-60">
    The Vuetify blog could not be loaded.
    <AppLink to="https://vuetifyjs.com/blog/">https://vuetifyjs.com/blog/</AppLink>
  </p>

  <p v-else class="text-sm opacity-60">
    Loading posts from the Vuetify blog.
  </p>
</template>
