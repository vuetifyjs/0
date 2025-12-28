<script lang="ts" setup>
  import { toRef } from 'vue'

  function scrollToAnchor (id: string) {
    const el = document.querySelector(`#${id}`)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  const props = defineProps<{
    frontmatter?: {
      related?: string[]
    }
  }>()

  const links = toRef(() => {
    if (!props.frontmatter?.related?.length) return []

    return props.frontmatter.related.map(path => {
      const segments = path.split('/').filter(Boolean)

      // Extract category (e.g., "composables/plugins" -> "Plugins")
      const category = segments.length > 1
        ? segments.at(-2)!
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
        : segments[0].charAt(0).toUpperCase() + segments[0].slice(1)

      // Extract name (e.g., "use-theme" -> "Use Theme")
      const name = segments.at(-1)!
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      return { to: path, category, name }
    })
  })
</script>

<template>
  <section v-if="links.length > 0" class="markdown-body mt-8">
    <h2 id="related">
      <a
        class="header-anchor"
        href="#related"
        @click.prevent="scrollToAnchor('related')"
      >Related</a>
    </h2>

    <p>Explore these related pages for additional context and usage patterns.</p>

    <table>
      <thead>
        <tr>
          <th class="text-left">Page</th>
          <th class="text-left">Category</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="link in links" :key="link.to">
          <td>
            <router-link class="v0-link" :to="link.to">
              {{ link.name }}
            </router-link>
          </td>
          <td>{{ link.category }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
