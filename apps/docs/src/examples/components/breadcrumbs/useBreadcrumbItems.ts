import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { BreadcrumbItem } from './AppBreadcrumbs.vue'

export function useBreadcrumbItems () {
  const route = useRoute()
  const router = useRouter()

  return computed<BreadcrumbItem[]>(() => {
    const segments = route.path.split('/').filter(Boolean)

    return [
      { text: 'Home', href: '/' },
      ...segments.map((segment, i) => {
        const href = '/' + segments.slice(0, i + 1).join('/')
        const text = segment
          .replace(/-/g, ' ')
          .replace(/\b\w/g, c => c.toUpperCase())
        const isLast = i === segments.length - 1
        const { matched } = router.resolve(href)
        const hasPage = matched.some(r => !r.path.includes('*'))

        return { text, href: isLast || !hasPage ? undefined : href }
      }),
    ]
  })
}
