// Utilities
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Types
import type { NavItem } from '@/stores/app'

import { useAppStore } from '@/stores/app'

export interface BreadcrumbItem {
  text: string
  to?: string
}

function findNavPath (items: NavItem[], targetPath: string): Array<{ name: string, to?: string }> | null {
  for (const item of items) {
    if ('divider' in item) continue

    if ('to' in item && item.to === targetPath) {
      return [{ name: item.name }]
    }

    if ('children' in item && item.children) {
      const childPath = findNavPath(item.children, targetPath)
      if (childPath) {
        const entry: { name: string, to?: string } = { name: item.name }
        if ('to' in item) entry.to = item.to
        return [entry, ...childPath]
      }
    }
  }
  return null
}

export function useBreadcrumbItems () {
  const route = useRoute()
  const router = useRouter()
  const store = useAppStore()

  return computed<BreadcrumbItem[]>(() => {
    const path = route.path.replace(/\/$/, '') || '/'
    const navPath = findNavPath(store.nav, path)

    if (navPath) {
      return [
        { text: 'Home', to: '/' },
        ...navPath.map((entry, i) => {
          const isLast = i === navPath.length - 1
          if (isLast || !entry.to) return { text: entry.name }

          const { matched } = router.resolve(entry.to)
          const hasPage = matched.some(r => !r.path.includes('*'))

          return {
            text: entry.name,
            to: hasPage ? entry.to : undefined,
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
