import { computed, ref } from 'vue'

export interface Article {
  title: string
  tags: string[]
}

export function useTagFilter () {
  const tags = ref<string[]>([])

  const articles: Article[] = [
    { title: 'Composable selection state in v0', tags: ['vue', 'state'] },
    { title: 'Native popovers and CSS anchor positioning', tags: ['css', 'browser'] },
    { title: 'Type-safe provide and inject', tags: ['vue', 'typescript'] },
    { title: 'Virtual focus for accessible listboxes', tags: ['a11y', 'vue'] },
    { title: 'Tree-shaking the utility barrel', tags: ['typescript', 'build'] },
    { title: 'Styling headless components with data attributes', tags: ['css', 'a11y'] },
  ]

  // Tag universe derived from the article corpus, de-duplicated and sorted
  const universe = computed(() => {
    const all = new Set<string>()
    for (const article of articles) {
      for (const tag of article.tags) all.add(tag)
    }
    return Array.from(all).toSorted()
  })

  // An article matches when it carries every active tag (AND semantics)
  const matches = computed(() => {
    if (tags.value.length === 0) return articles
    return articles.filter(article =>
      tags.value.every(tag => article.tags.includes(tag)),
    )
  })

  function clear () {
    tags.value = []
  }

  return { tags, articles, universe, matches, clear }
}
