<script lang="ts" setup>
  import { toRef } from 'vue'

  const props = defineProps<{
    frontmatter?: {
      related?: string[]
    }
  }>()

  const links = toRef(() => {
    if (!props.frontmatter?.related?.length) return []

    return props.frontmatter.related.map(path => {
      // Extract readable name from path
      const segments = path.split('/').filter(Boolean)
      const name = segments.at(-1)!
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      return { to: path, name }
    })
  })
</script>

<template>
  <section v-if="links.length > 0" id="related" class="mt-8 pt-4 border-t border-divider">
    <h2 class="text-lg font-semibold mb-4">Related</h2>

    <ul class="flex flex-col gap-2">
      <li v-for="link in links" :key="link.to">
        <router-link
          class="text-primary hover:underline"
          :to="link.to"
        >
          {{ link.name }}
        </router-link>
      </li>
    </ul>
  </section>
</template>
