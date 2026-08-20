// Stores
import { useAppStore } from '@/stores/app'

// Utilities
import { findNav } from '@/utilities/nav'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export interface BreadcrumbItem {
  text: string
  to?: string
}

export function useBreadcrumbItems () {
  const route = useRoute()
  const router = useRouter()
  const store = useAppStore()

  return computed<BreadcrumbItem[]>(() => {
    const path = route.path.replace(/\/$/, '') || '/'
    const navPath = findNav(store.nav, path)

    if (navPath) {
      return [
        { text: 'Home', to: '/' },
        ...navPath.map((entry, i) => {
          const isLast = i === navPath.length - 1
          const to = 'to' in entry ? entry.to : undefined
          if (isLast || !to) return { text: entry.name }

          const { matched } = router.resolve(to)
          const hasPage = matched.some(r => !r.path.includes('*'))

          return {
            text: entry.name,
            to: hasPage ? to : undefined,
          }
        }),
      ]
    }

    // Fallback: derive from path segments
    const segments = route.path.split('/').filter(Boolean)
    return [
      { text: 'Home', to: '/' },
      ...segments.map((segment, i) => {
        const to = '/' + segments.slice(0, i + 1).join('/')
        const text = segment
          .replace(/-/g, ' ')
          .replace(/\b\w/g, c => c.toUpperCase())
        const isLast = i === segments.length - 1
        const { matched } = router.resolve(to)
        const hasPage = matched.some(r => !r.path.includes('*'))

        return { text, to: isLast || !hasPage ? undefined : to }
      }),
    ]
  })
}
