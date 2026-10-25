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
  <div v-if="visible.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <a
      v-for="post in visible"
      :key="post.slug"
      class="flex flex-col overflow-hidden rounded-xl border bg-surface hover:border-primary transition-all duration-150"
      :href="post.url"
      rel="noopener noreferrer"
      target="_blank"
    >
      <img
        v-if="post.image"
        alt=""
        class="aspect-video w-full object-cover"
        :src="post.image"
      >

      <div class="flex flex-col gap-3 p-5">
        <h3 class="font-semibold leading-snug">
          {{ post.title }}<span aria-hidden="true" class="text-xs opacity-70 ml-0.5">{{ EXTERNAL_LINK_SUFFIX }}</span>
        </h3>

        <div class="flex items-center gap-2 text-sm opacity-60">
          <img
            alt=""
            class="w-6 h-6 rounded-full shrink-0"
            height="24"
            :src="post.avatar"
            width="24"
          >

          <span>{{ post.author }} · {{ post.date }}</span>
        </div>

        <p class="text-sm opacity-60 leading-relaxed">{{ post.excerpt }}</p>
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
