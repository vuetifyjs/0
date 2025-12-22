<script setup lang="ts">
  // Types
  import type { AtomProps } from '@vuetify/v0'

  // Vuetify0
  import { Atom, useBreakpoints } from '@vuetify/v0'

  // Utilities
  import { watch } from 'vue'

  // Composables
  import { useRoute } from 'vue-router'

  // Stores
  import { useAppStore } from '@/stores/app'

  const { as = 'nav' } = defineProps<AtomProps>()

  const app = useAppStore()
  const breakpoints = useBreakpoints()
  const route = useRoute()

  watch(route, () => {
    if (app.drawer && breakpoints.isMobile.value) {
      app.drawer = false
    }
  })
</script>

<template>
  <Atom
    :as
    class="flex flex-col fixed w-[230px] overflow-y-auto py-4 top-[72px] bottom-[24px] translate-x-[-100%] md:bottom-0 md:translate-x-0 transition-transform duration-200 ease-in-out border-r border-solid border-divider z-1 glass-surface"
    :class="app.drawer && '!translate-x-0'"
  >
    <ul class="flex gap-2 flex-col">
      <template v-for="(nav, i) in app.nav" :key="i">
        <li v-if="nav.divider" class="px-4">
          <AppDivider />
        </li>

        <AppNavLink
          v-else
          :children="nav.children"
          class="px-4"
          :to="nav.to || ''"
        >
          {{ nav.name }}
        </AppNavLink>
      </template>
    </ul>
  </Atom>
</template>
