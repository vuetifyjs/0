// apps/builder/src/router/guards.ts

import { getPluginBySlug, PLUGINS } from '@/data/plugins'

// Stores
import { useBuilderStore } from '@/stores/builder'

// Types
import type { NavigationGuardReturn, RouteLocationNormalized } from 'vue-router'

export function builderGuard (to: RouteLocationNormalized): NavigationGuardReturn {
  const store = useBuilderStore()
  const selectedIds = store.selectedPlugins

  if (to.path === '/builder/configure') {
    const first = PLUGINS.find(p => selectedIds.has(p.id))
    if (!first) return '/builder'
    return `/builder/${first.slug}`
  }

  if ((to.path === '/builder/components' || to.path === '/builder/review') && selectedIds.size === 0) {
    return '/builder'
  }

  const pluginMatch = to.path.match(/^\/builder\/([^/]+)$/)
  if (pluginMatch && to.path !== '/builder/configure' && to.path !== '/builder/components' && to.path !== '/builder/review') {
    const slug = pluginMatch[1]
    const meta = getPluginBySlug(slug)
    if (!meta || !selectedIds.has(meta.id)) {
      return '/builder'
    }
  }

  return true
}
