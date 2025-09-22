<script setup lang="ts">
  import { Atom, useBreakpoints, useHydrationContext } from '@vuetify/v0'
  import { useAppStore } from '@/stores/app'
  import { useRoute } from 'vue-router'
  import { computed, onMounted, watch } from 'vue'
  import type { AtomProps } from '@vuetify/v0'

  const { as = 'nav' } = defineProps<AtomProps>()

  const app = useAppStore()
  const breakpoints = useBreakpoints()
  const route = useRoute()
  const { isHydrated } = useHydrationContext()

  const inert = computed(() => isHydrated.value && breakpoints.isMobile && !app.drawer)

  watch(() => [route, isHydrated.value] as const, ([_, h]) => {
    console.log(h)
    if (h && app.drawer && breakpoints.isMobile) {
      app.drawer = false
    }
  })
</script>

<template>
  <Atom
    :as
    class="bg-4 app-nav"
    :class="[
      // `app-nav-${breakpoints.breakpoints.md}`,
      { 'drawer': isHydrated && breakpoints.isMobile && app.drawer },
    ]"
    :inert
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

<style scoped>
  /* beasties:include */
  .app-nav {
    background-color: var(--v0-surface);
    border-right: thin solid var(--v0-divider);
    @apply flex flex-col fixed top-[72px] bottom-[24px] translate-x-[-100%] w-[220px] overflow-y-auto py-4 transition-transform duration-200 ease-in-out;
  }
  html:not(.mobile) .app-nav {
    @apply top-[72px] bottom-0 translate-x-0;
  }
  html.mobile .app-nav.drawer {
    @apply translate-x-0;
  }
  /* beasties:include end */
</style>
<!--
<style lang="sass">
  .app-nav
    background-color: var(&#45;&#45;v0-surface)
    border-right: thin solid var(&#45;&#45;v0-divider)
</style>-->
