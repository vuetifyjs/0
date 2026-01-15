<script setup lang="ts">
  // Composables
  import { useNavConfigContext } from '@/composables/useNavConfig'

  // Utilities
  import { shallowRef, watch } from 'vue'
  import { useRoute } from 'vue-router'

  // Types
  import type { NavItem } from '@/stores/app'

  const { configuredNav } = useNavConfigContext()
  const route = useRoute()

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

  // Use refs updated via watch to avoid reactivity timing issues during navigation
  const prev = shallowRef<string | false>(false)
  const next = shallowRef<string | false>(false)

  watch(
    [() => route.path, configuredNav],
    ([path]) => {
      const pages: string[] = []
      for (const nav of configuredNav.value) {
        if (!('children' in nav) && !('to' in nav)) continue
        pages.push(...flattenRoutes(nav as NavItem))
      }

      const normalizedPath = `/${path.split('/').slice(1).join('/')}`
      const index = pages.indexOf(normalizedPath)

      prev.value = index > 0 ? pages[index - 1] : false
      next.value = index >= 0 && index < pages.length - 1 ? pages[index + 1] : false
    },
    { immediate: true },
  )
</script>

<template>
  <hr class="my-4">

  <nav
    aria-label="Document navigation"
    class="flex gap-2"
  >
    <RouterLink
      v-if="prev && prev !== '/'"
      :key="prev"
      class="flex-1 basis-0 cursor-pointer capitalize border border-divider rounded-lg pa-2 hover:border-primary hover:bg-surface-tint transition-colors"
      :to="prev"
    >
      <div class="inline-flex align-center text-xs text-on-surface opacity-60">
        <AppIcon icon="left" />

        Previous page
      </div>

      <div class="font-medium ps-1 text-on-surface">
        {{ prev.split('/').pop()!.replace(/-/g, ' ') }}
      </div>
    </RouterLink>

    <span v-else class="flex-1 basis-0" />

    <RouterLink
      v-if="next && next !== '/'"
      :key="next"
      class="flex-1 basis-0 cursor-pointer capitalize border border-divider rounded-lg pa-2 text-end hover:border-primary hover:bg-surface-tint transition-colors"
      :to="next"
    >
      <div class="inline-flex align-center text-xs text-on-surface opacity-60">
        Next page

        <AppIcon icon="right" />
      </div>

      <div class="font-medium pe-1 text-on-surface">
        {{ next.split('/').pop()!.replace(/-/g, ' ') }}
      </div>
    </RouterLink>

    <span v-else class="flex-1 basis-0" />
  </nav>
</template>
