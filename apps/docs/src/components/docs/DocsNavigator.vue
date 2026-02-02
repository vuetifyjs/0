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

  // Use refs updated via watch to avoid reactivity timing issues during navigation
  const prev = shallowRef<string | false>(false)
  const next = shallowRef<string | false>(false)

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

      prev.value = index > 0 ? pages[index - 1] ?? false : false
      next.value = index >= 0 && index < pages.length - 1 ? pages[index + 1] ?? false : false
    },
    { immediate: true },
  )
</script>

<template>
  <template v-if="isVisible">
    <hr class="my-4">

    <Discovery.Activator class="rounded-lg" step="page-navigator">
      <nav
        aria-label="Document navigation"
        class="flex gap-2"
      >
        <RouterLink
          v-if="prev && prev !== '/'"
          :key="prev"
          class="flex-1 basis-0 list-item-bordered capitalize pa-2"
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
          class="flex-1 basis-0 list-item-bordered capitalize pa-2 text-end"
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
    </Discovery.Activator>
  </template>
</template>
