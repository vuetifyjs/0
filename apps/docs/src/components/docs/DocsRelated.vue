<script setup lang="ts">
  // Utilities
  import { toRef } from 'vue'

  const props = defineProps<{
    frontmatter?: {
      related?: string[]
    }
  }>()

  const links = toRef(() => {
    if (!props.frontmatter?.related?.length) return []

    return props.frontmatter.related
      .map(path => {
        const segments = path.split('/').filter(Boolean)
        if (segments.length === 0) return null

        const lastSegment = segments.at(-1) ?? ''
        const secondLast = segments.at(-2)

        // Extract category (e.g., "composables/plugins" -> "Plugins")
        const category = secondLast
          ? secondLast
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
          : lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1)

        // Extract name from slug
        const slug = lastSegment
        const acronyms = new Set(['ai', 'api', 'ssr', 'css', 'html', 'dom', 'url', 'uri', 'http', 'https', 'json', 'xml', 'svg', 'pdf'])
        const isComposable = slug.startsWith('use-') || slug.startsWith('create-')

        const name = isComposable
          // Composables: camelCase (e.g., "use-theme" -> "useTheme")
          ? slug.split('-').map((word, i) => i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)).join('')
          // Others: Title Case with spaces (e.g., "getting-started" -> "Getting Started")
          : slug.split('-').map(word => {
            if (acronyms.has(word.toLowerCase())) return word.toUpperCase()
            return word.charAt(0).toUpperCase() + word.slice(1)
          }).join(' ')

        return { to: path, category, name }
      })
      .filter((link): link is { to: string, category: string, name: string } => link !== null)
  })
</script>

<template>
  <section v-if="links.length > 0" class="markdown-body mt-8">
    <DocsHeaderAnchor id="related" tag="h2">Related</DocsHeaderAnchor>

    <p>Explore these related pages for additional context and usage patterns.</p>

    <table>
      <thead>
        <tr>
          <th class="text-left" scope="col">Page</th>
          <th class="text-left" scope="col">Category</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="link in links" :key="link.to">
          <td>
            <AppLink :to="link.to">
              {{ link.name }}
            </AppLink>
          </td>
          <td>{{ link.category }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
