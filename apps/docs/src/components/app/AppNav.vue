<script setup lang="ts">
  import { Atom, useBreakpoints } from '@vuetify/v0'
  import { useAppStore } from '@/stores/app'
  import { useRoute } from 'vue-router'
  import { watch } from 'vue'
  import type { AtomProps } from '@vuetify/v0'

  const { as = 'nav' } = defineProps<AtomProps>()

  const app = useAppStore()
  const breakpoints = useBreakpoints()
  const route = useRoute()

  watch(route, () => {
    if (app.drawer && breakpoints.isMobile) {
      app.drawer = false
    }
  })
</script>

<template>
  <client-only>
    <Atom
      :as
      class="bg-4 app-nav flex flex-col fixed top-[72px] w-[220px] overflow-y-auto py-4 transition-transform duration-200 ease-in-out"
      :class="[
        breakpoints.isMobile.value && !app.drawer ? 'translate-x-[-100%]' : 'translate-x-0',
        breakpoints.isMobile.value ? 'top-[72px] bottom-[24px]' : 'top-[24px] bottom-0'
      ]"
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
  </client-only>
</template>

<style lang="sass">
  .app-nav
    background-color: var(--v0-surface)
    border-right: thin solid var(--v0-divider)
</style>
