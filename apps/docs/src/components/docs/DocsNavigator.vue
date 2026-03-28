<script setup lang="ts">
  // Components
  import { Discovery } from '@/components/discovery'

  // Composables
  import { useNavConfigContext } from '@/composables/useNavConfig'

  // Utilities
  import { shallowRef, toRef, watch } from 'vue'
  import { useRoute } from 'vue-router'

  // Types
  import type { NavItem } from '@/stores/app'
  import type { HxPageNavigatorLink } from '@paper/helix'

  const navConfig = useNavConfigContext()
  const route = useRoute()

  // Hide on skillz pages (they have their own focused UI)
  const isVisible = toRef(() => !route.path.startsWith('/skillz'))

  // Flatten nav items to route paths
  function flattenRoutes (nav: NavItem): string[] {
    const routes: string[] = []
    if ('to' in nav && nav.to) {
      routes.push(nav.to)
    }
    if ('children' in nav && nav.children) {
      routes.push(...nav.children.flatMap(child => flattenRoutes(child)))
    }
    return routes
  }

  function toLink (path: string): HxPageNavigatorLink {
    return {
      label: path.split('/').pop()!.replace(/-/g, ' '),
      to: path,
    }
  }

  // Use refs updated via watch to avoid reactivity timing issues during navigation
  const prev = shallowRef<HxPageNavigatorLink | false>(false)
  const next = shallowRef<HxPageNavigatorLink | false>(false)

  watch(
    [() => route.path, navConfig.configuredNav],
    ([path]) => {
      const pages: string[] = []
      for (const nav of navConfig.configuredNav.value) {
        if (!('children' in nav) && !('to' in nav)) continue
        pages.push(...flattenRoutes(nav as NavItem))
      }

      const normalizedPath = `/${path.split('/').slice(1).join('/')}`
      const index = pages.indexOf(normalizedPath)

      const prevPath = index > 0 ? pages[index - 1] : undefined
      const nextPath = index >= 0 && index < pages.length - 1 ? pages[index + 1] : undefined

      prev.value = prevPath && prevPath !== '/' ? toLink(prevPath) : false
      next.value = nextPath && nextPath !== '/' ? toLink(nextPath) : false
    },
    { immediate: true },
  )
</script>

<template>
  <template v-if="isVisible">
    <hr class="my-4">

    <Discovery.Activator class="rounded-lg" step="page-navigator">
      <HxPageNavigator :next :prev>
        <template #prev-icon>
          <AppIcon icon="left" />
        </template>

        <template #next-icon>
          <AppIcon icon="right" />
        </template>
      </HxPageNavigator>
    </Discovery.Activator>
  </template>
</template>
