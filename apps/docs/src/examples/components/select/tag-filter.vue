<script setup lang="ts">
  import { Button } from '@vuetify/v0'
  import TagFilter from './TagFilter.vue'
  import { useTagFilter } from './useTagFilter'

  const { tags, articles, universe, matches, clear } = useTagFilter()
</script>

<template>
  <div class="flex flex-col gap-4 max-w-md mx-auto">
    <TagFilter v-model="tags" :universe />

    <div class="flex items-center justify-between text-sm text-on-surface-variant">
      <span>{{ matches.length }} of {{ articles.length }} articles</span>

      <Button.Root
        v-if="tags.length > 0"
        class="px-2 py-1 rounded-md border border-divider text-xs text-on-surface"
        @click="clear"
      >
        Clear filters
      </Button.Root>
    </div>

    <ul v-if="matches.length > 0" class="flex flex-col gap-2">
      <li
        v-for="article in matches"
        :key="article.title"
        class="flex flex-col gap-1 p-3 rounded-lg border border-divider bg-surface"
      >
        <p class="text-sm font-medium text-on-surface">{{ article.title }}</p>

        <div class="flex flex-wrap gap-1">
          <span
            v-for="tag in article.tags"
            :key="tag"
            class="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-variant text-on-surface-variant text-xs"
          >
            {{ tag }}
          </span>
        </div>
      </li>
    </ul>

    <p v-else class="p-4 rounded-lg border border-divider text-sm text-on-surface-variant text-center">
      No articles match every selected tag. Remove a tag to widen the results.
    </p>
  </div>
</template>
