<script setup lang="ts">
  // Vuetify0
  import { Atom, useBreakpoints } from '@vuetify/v0'

  // Composables
  import { useRoute } from 'vue-router'

  // Utilities
  import { watch } from 'vue'

  // Stores
  import { useAppStore } from '@/stores/app'

  // Types
  import type { AtomProps } from '@vuetify/v0'

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
    class="bg-surface app-nav flex flex-col fixed w-[230px] overflow-y-auto py-4 top-[72px] bottom-[24px] translate-x-[-100%] md:bottom-0 md:translate-x-0 transition-transform duration-200 ease-in-out border-r border-solid border-divider"
    :class="app.drawer && '!translate-x-0'"
  >
    <ul class="flex gap-2 flex-col">
      <template v-for="(nav, i) in app.nav" :key="i">
        <div v-if="nav.divider" class="px-4">
          <AppDivider />
        </div>

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
