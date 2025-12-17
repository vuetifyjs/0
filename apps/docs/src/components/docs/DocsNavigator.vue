<script lang="ts" setup>
  import { computed } from 'vue'
  import { useAppStore } from '@/stores/app'
  import { useRoute } from 'vue-router'

  const app = useAppStore()
  const route = useRoute()

  const routes = computed(() => {
    const pages = ['/']

    for (const nav of app.nav) {
      if (!nav.children && !nav.to) continue

      pages.push(...genRoutes(nav))
    }

    return pages
  })
  const path = computed(() => `/${route.path.split('/').slice(1).join('/')}`)
  const index = computed(() => routes.value.indexOf(path.value))
  const prev = computed(() => index.value > -1 ? routes.value[index.value - 1] : false)
  const next = computed(() => index.value === -1 ? false : routes.value[index.value + 1])

  function genRoutes (nav: any) {
    if (nav.children) {
      return nav.children.flatMap((child: any) => genRoutes(child))
    }

    return nav.to ? [nav.to] : []
  }
</script>

<template>
  <hr class="my-4">

  <nav
    aria-label="Document navigation"
    class="flex gap-2"
  >
    <RouterLink
      v-if="prev && prev !== '/'"
      class="flex-1 basis-0 cursor-pointer capitalize border border-divider rounded-lg pa-2 hover:bg-surface-tint"
      :to="prev"
      @click="($event.currentTarget as HTMLElement).blur()"
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
      class="flex-1 basis-0 cursor-pointer capitalize border border-divider rounded-lg pa-2 text-end hover:bg-surface-tint"
      :to="next"
      @click="($event.currentTarget as HTMLElement).blur()"
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
